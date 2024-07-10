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
import { createActivity } from "./routes/create-activity";
import { createLink } from "./routes/create-link";
import { getActivities } from "./routes/get-activities";
import { getLinks } from "./routes/get-links";
import { getParticipants } from "./routes/get-participants";
import { createInvite } from "./routes/create-invite";
import { updateTrip } from "./routes/update-trip";
import { getTrip } from "./routes/get-trip";
import { getParticipant } from "./routes/get-participant";

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
app.register(createActivity);
app.register(getActivities);
app.register(createLink);
app.register(getLinks);
app.register(getParticipants);
app.register(createInvite);
app.register(updateTrip);
app.register(getTrip);
app.register(getParticipant);

app.listen({ port: PORT }).then(() => {
  logger.info(`Server running on port ${PORT}!`);
});
