import type { FastifyInstance } from "fastify";
import type { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";
import { prisma } from "../lib/prisma";

export const createLink = async (app: FastifyInstance) => {
  app.withTypeProvider<ZodTypeProvider>().post(
    "/trips/:tripId/links",
    {
      schema: {
        params: z.object({
          tripId: z.string().uuid(),
        }),
        body: z.object({
          title: z.string().min(4),
          url: z.string().url(),
        }),
      },
    },
    async (request, _reply) => {
      const { tripId } = request.params;
      const { url, title } = request.body;

      const trip = await prisma.trip.findUnique({
        where: {
          id: tripId,
        },
      });

      if (!trip) throw new ClientError("Trip not found");

      const link = await prisma.link.create({
        data: {
          title,
          url,
          trip_id: trip.id,
        },
      });

      return { link_id: link.id };
    }
  );
};
