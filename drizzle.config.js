import { defineConfig } from "drizzle-kit";

export default defineConfig({
    schema: "src/db/schemas.js",
    out: "src/migrations",
    dialect: "postgresql" 
});