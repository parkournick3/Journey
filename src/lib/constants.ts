import dotenv from "dotenv";

dotenv.config({ path: "../../.env.example" });

dotenv.config({ path: "../../.env", override: true });

export const PORT = Number(process.env.PORT) || 3000;
export const BASE_URL = `${process.env.BASE_URL || "http://localhost"}:${PORT}`;
