const secrets = require("../lib/secrets");
const { Pool, neonConfig } = require("@neondatabase/serverless");
const ws = require("ws");
const { drizzle } = require("drizzle-orm/neon-serverless");
const schema = require('../db/schemas')
const { migrate } = require('drizzle-orm/postgres-js/migrator')
require("dotenv").config();

async function performMigration() {
  const dbUrl = await secrets.getDatabaseUrl();

  neonConfig.webSocketConstructor = ws;

  const pool = new Pool({ connectionString: dbUrl });
  pool.on("error", (err) => console.error(err));

  const client = await pool.connect();

  try {
    await client.query("BEGIN");
    const db = drizzle(client, { schema });
    await migrate(db, { migrationsFolder: "src/migrations" });
    await client.query("COMMIT");
  } catch (err) {
    await client.query("ROLLBACK");
    throw err;
  } finally {
    client.release();
  }

  await pool.end();
}

if (require.main === module) {
  performMigration()
    .then(() => {
      console.log("Migration completed successfully.");
      process.exit(0);
    })
    .catch((error) => {
      console.error("Error during migration:", error);
      process.exit(1);
    });
}
