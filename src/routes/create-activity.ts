import type { FastifyInstance } from "fastify";
import type { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";
import { prisma } from "../lib/prisma";
import dayjs from "dayjs";

export const createActivity = async (app: FastifyInstance) => {
  app.withTypeProvider<ZodTypeProvider>().post(
    "/trips/:tripId/activities",
    {
      schema: {
        params: z.object({
          tripId: z.string().uuid(),
        }),
        body: z.object({
          title: z.string().min(4),
          occurs_at: z.coerce.date(),
        }),
      },
    },
    async (request, _reply) => {
      const { tripId } = request.params;
      const { occurs_at, title } = request.body;

      const trip = await prisma.trip.findUnique({
        where: {
          id: tripId,
        },
      });

      if (!trip) throw new ClientError("Trip not found");

      if (dayjs(occurs_at).isBefore(trip.starts_at))
        throw new ClientError("Invalid activity date");

      if (dayjs(occurs_at).isAfter(trip.ends_at))
        throw new ClientError("Invalid activity date");

      const activity = await prisma.activity.create({
        data: {
          title,
          occurs_at,
          trip_id: trip.id,
        },
      });

      return { activity_id: activity.id };
    }
  );
};
