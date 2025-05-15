const { SSMClient, GetParameterCommand } = require("@aws-sdk/client-ssm");

const AWS_REGION = "us-east-1";
const STAGE = process.env.STAGE || "prod";

const DATABASE_URL_SSM_PARAM = `/serverless-nodejs-api/${STAGE}/database-url`

async function getDatabaseUrl() {
    try {
        const client = new SSMClient({ region: AWS_REGION });
    
        const paramStoreData = {
            Name: DATABASE_URL_SSM_PARAM,
        }

        const command = new GetParameterCommand(paramStoreData);
        const result = await client.send(command);
        return result.Parameter.Value
    } catch (e) {
        return process.env.DATABASE_URL
    }
}

module.exports = { getDatabaseUrl };