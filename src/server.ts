import fastify from "fastify";
import cors from "@fastify/cors";
import { logger } from "./lib/logger";
import { createTrip } from "./routes/create-trip";
import {
  serializerCompiler,
  validatorCompiler,
} from "fastify-type-provider-zod";
import { PORT } from "./lib/constants";

const app = fastify();

app.register(cors, {
  origin: "*", // TODO: Change cors
});

app.setValidatorCompiler(validatorCompiler);
app.setSerializerCompiler(serializerCompiler);

app.register(createTrip);

app.listen({ port: PORT }).then(() => {
  logger.info(`Server running on port ${PORT}!`);
});
