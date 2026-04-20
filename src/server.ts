import { app } from "./app";
import { env } from "./infrastructure/config/env";
import { prisma } from "./infrastructure/db/prisma";

async function bootstrap() {
  await prisma.$connect();

  app.listen(env.PORT, () => {
    console.log(`Server running on http://localhost:${env.PORT}`);
  });
}

bootstrap().catch(async (error) => {
  console.error("Failed to start server", error);
  await prisma.$disconnect();
  process.exit(1);
});