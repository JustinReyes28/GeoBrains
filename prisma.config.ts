import { defineConfig } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  datasource: {
    url: process.env.DATABASE_URL || process.env.POSTGRES_PRISMA_URL || process.env.NEON_DATABASE_URL || process.env.NEON_POSTGRES_PRISMA_URL,
  },
});
