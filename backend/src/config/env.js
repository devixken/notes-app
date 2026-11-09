import { z } from "zod";

const envSchema = z.object({
  PORT: z.coerce.number().int().positive().default(3000),
  MONGO_URI: z.string().min(1),
  JWT_SECRET: z.string().min(32),
});

const result = envSchema.safeParse(process.env);

if (!result.success) {
  for (const issue of result.error.issues) {
    console.error(`${issue.path.join(".")}: ${issue.message}`);
  }
  process.exit(1);
}

export const config = {
  port: result.data.PORT,
  mongoUri: result.data.MONGO_URI,
  jwtSecret: result.data.JWT_SECRET,
};
