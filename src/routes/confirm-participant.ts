import type { FastifyInstance } from "fastify";
import type { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";
import { prisma } from "../lib/prisma";
import { FRONT_BASE_URL } from "../lib/constants";
import { ClientError } from "../errors/client-error";

export const confirmParticipant = async (app: FastifyInstance) => {
  app.withTypeProvider<ZodTypeProvider>().get(
    "/participants/:participantId/confirm",
    {
      schema: {
        params: z.object({
          participantId: z.string().uuid(),
        }),
        querystring: z.object({
          redirect: z.optional(z.coerce.boolean()),
        }),
      },
    },
    async (request, reply) => {
      const { participantId } = request.params;
      const { redirect } = request.query;

      const participant = await prisma.participant.findUnique({
        where: {
          id: participantId,
        },
      });

      if (!participant) throw new ClientError("Participant not found");

      if (participant.is_confirmed) {
        return redirect
          ? reply.redirect(`${FRONT_BASE_URL}/trips/${participant.trip_id}`)
          : { message: "confirmed" };
      }

      await prisma.participant.update({
        where: {
          id: participant.id,
        },
        data: {
          is_confirmed: true,
        },
      });

      return redirect
        ? reply.redirect(`${FRONT_BASE_URL}/trips/${participant.trip_id}`)
        : { message: "confirmed" };
    }
  );
};
