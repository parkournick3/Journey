import type { FastifyInstance } from "fastify";
import type { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";
import { prisma } from "../lib/prisma";
import { BASE_URL, FRONT_BASE_URL } from "../lib/constants";
import dayjs from "dayjs";
import { getMailClient } from "../lib/mail";
import { logger } from "../lib/logger";
import nodemailer from "nodemailer";
import { ClientError } from "../errors/client-error";

export const confirmTrip = async (app: FastifyInstance) => {
  app.withTypeProvider<ZodTypeProvider>().get(
    "/trips/:tripId/confirm",
    {
      schema: {
        params: z.object({
          tripId: z.string().uuid(),
        }),
        querystring: z.object({
          redirect: z.optional(z.coerce.boolean()),
        }),
      },
    },
    async (request, reply) => {
      const { tripId } = request.params;
      const { redirect } = request.query;

      const trip = await prisma.trip.findUnique({
        where: {
          id: tripId,
        },
        include: {
          participants: {
            where: {
              is_owner: false,
            },
          },
        },
      });

      if (!trip) throw new ClientError("Trip not found");

      if (trip.is_confirmed) {
        return redirect
          ? reply.redirect(`${FRONT_BASE_URL}/trips/${trip.id}`)
          : {
              participant_ids: trip.participants.map(
                (participant) => participant.id
              ),
            };
      }

      await prisma.trip.update({
        where: {
          id: trip.id,
        },
        data: {
          is_confirmed: true,
        },
      });

      const formattedStartDate = dayjs(trip.starts_at).format("LL");
      const formattedEndDate = dayjs(trip.ends_at).format("LL");

      const mail = await getMailClient();

      await Promise.all(
        trip.participants.map(async (participant) => {
          const confirmationLink = `${BASE_URL}/participants/${participant.id}/confirm`;

          const message = await mail.sendMail({
            from: {
              name: "Equipe plann.er",
              address: "oi@plann.er",
            },
            to: participant.email,
            subject: `Confirme sua viagem para ${trip.destination} em ${formattedStartDate}`,
            html: `
            <div style="font-family: sans-serif; font-size: 16px; line-height: 1.6;">
              <p>Você foi convidada(o) para participar de uma viagem para <strong>${trip.destination}</strong> nas datas de <strong>${formattedStartDate}</strong> até <strong>${formattedEndDate}</strong></p>
              <p></p>
              <p>Para confirmar sua presença na viagem, clique no link abaixo:</p>
              <p></p>
              <p><a href="${confirmationLink}">Confirmar viagem</a></p>
              <p></p>
              <!-- <p>Caso esteja usando um dispositivo móvel, você também pode confirmar a criação da viagem pelos aplicativos:</p>
              Aplicativo para Android
              Aplicativo para iPhone -->
              <p>Caso você não saiba do que se trata este e-mail, apenas o ignore.</p>
            </div>
          `.trim(),
          });

          logger.info(`email sent to: "${participant.email}"`, {
            test_url: nodemailer.getTestMessageUrl(message),
          });
        })
      );

      return redirect
        ? reply.redirect(`${FRONT_BASE_URL}/trips/${trip.id}`)
        : {
            participant_ids: trip.participants.map(
              (participant) => participant.id
            ),
          };
    }
  );
};
