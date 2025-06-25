const { desc, eq } = require("drizzle-orm");
const clients = require("./clients");
const schemas = require("./schemas");

async function newLead({ email }) { 
    const db = await clients.getDrizzleDbClient();
    const result = await db.insert(schemas.LeadTable).values({ email })
        .returning();
    
    return result.length === 1 ? result[0] : result;
}

async function listLeads() {
    const db = await clients.getDrizzleDbClient();
    const result = await db.select().from(schemas.LeadTable).orderBy(desc(schemas.LeadTable.createdAt)).limit(10);
    return result;
}

async function getLead(id) {
    const db = await clients.getDrizzleDbClient();
    const result = await db.select().from(schemas.LeadTable).where(eq(schemas.LeadTable.id, id));
    
    return result.length === 1 ? result[0] : null;
}

module.exports = {
    newLead,
    listLeads,
    getLead
};