// node src/cli/putSecrets.js <stage> <dbUrl>
const secrets = require("../lib/secrets");
require("dotenv").config();

const args = process.argv.slice(2);

if (args.length !== 2) {
  console.log('Usage node src/cli/putSecrets.js <stage> <dbUrl>')
  process.exit(1);
}

if (require.main === module) {
  secrets
    .putDatabaseUrl(args[0], args[1])
    .then(val => {
      console.log(val);
      console.log('Secret set');
      process.exit(0);
    })
    .catch((err) => {
      console.error(err);
      console.error('`Secret not set`');
      process.exit(1);
    });
}
