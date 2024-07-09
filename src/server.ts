import fastify from "fastify";
import cors from "@fastify/cors";
import { logger } from "./lib/logger";
import { createTrip } from "./routes/create-trip";
import {
  serializerCompiler,
  validatorCompiler,
} from "fastify-type-provider-zod";
import { PORT } from "./lib/constants";
import dayjs from "dayjs";
import "dayjs/locale/pt-br";
import localizedFormat from "dayjs/plugin/localizedFormat";
import { confirmTrip } from "./routes/confirm-trip";
import { confirmParticipant } from "./routes/confirm-participant";

dayjs.locale("pt-br");
dayjs.extend(localizedFormat);

const app = fastify();

app.register(cors, {
  origin: "*", // TODO: Change cors
});

app.setValidatorCompiler(validatorCompiler);
app.setSerializerCompiler(serializerCompiler);

app.register(createTrip);
app.register(confirmTrip);
app.register(confirmParticipant);

app.listen({ port: PORT }).then(() => {
  logger.info(`Server running on port ${PORT}!`);
});
