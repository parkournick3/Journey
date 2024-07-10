import type { FastifyInstance } from "fastify";
import type { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";
import { prisma } from "../lib/prisma";
import dayjs from "dayjs";

export const getActivities = async (app: FastifyInstance) => {
  app.withTypeProvider<ZodTypeProvider>().get(
    "/trips/:tripId/activities",
    {
      schema: {
        params: z.object({
          tripId: z.string().uuid(),
        }),
      },
    },
    async (request, _reply) => {
      const { tripId } = request.params;

      const trip = await prisma.trip.findUnique({
        where: {
          id: tripId,
        },
        include: {
          activities: {
            orderBy: {
              occurs_at: "asc",
            },
          },
        },
      });

      if (!trip) throw new ClientError("Trip not found");

      const diffInDaysBeetweenTripStartAndEnd = dayjs(trip.ends_at).diff(
        trip.starts_at,
        "days"
      );

      const activities = Array.from({
        length: diffInDaysBeetweenTripStartAndEnd + 1,
      }).map((_, index) => {
        const date = dayjs().add(index, "day");

        return {
          data: date.toDate(),
          activities: trip.activities.filter((activity) =>
            dayjs(activity.occurs_at).isSame(date, "day")
          ),
        };
      });

      return { activities };
    }
  );
};
