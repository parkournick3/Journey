import type { FastifyInstance } from "fastify";
import type { ZodTypeProvider } from "fastify-type-provider-zod";

export const healthcheck = async (app: FastifyInstance) => {
  app
    .withTypeProvider<ZodTypeProvider>()
    .get("/healthcheck", async (_request, _reply) => {
      return { status: true };
    });
};
