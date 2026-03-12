import mongoose from "mongoose";
async function dropUnexpectedUniqueRoleIndexes() {
    const collection = mongoose.connection.collection("applications");
    let indexes = [];
    try {
        indexes = (await collection.indexes());
    }
    catch (error) {
        // Ignore "namespace not found" when the collection does not exist yet.
        if (error.code === 26) {
            return;
        }
        throw error;
    }
    const roleKeyNames = new Set(["roleId", "secondRoleId", "thirdRoleId"]);
    const indexNamesToDrop = indexes
        .filter((index) => {
        if (!index.unique || !index.name || index.name === "_id_") {
            return false;
        }
        const key = index.key ?? {};
        const keyNames = Object.keys(key);
        const touchesRoleField = keyNames.some((keyName) => roleKeyNames.has(keyName));
        // Keep user-scoped uniqueness (applicantEmail + roleId) intact.
        const isApplicantScoped = keyNames.includes("applicantEmail");
        return touchesRoleField && !isApplicantScoped;
    })
        .map((index) => index.name);
    for (const indexName of indexNamesToDrop) {
        await collection.dropIndex(indexName);
        // eslint-disable-next-line no-console
        console.log(`[db] Dropped unexpected unique index on applications: ${indexName}`);
    }
}
export async function connectDB(uri) {
    mongoose.set("strictQuery", true);
    await mongoose.connect(uri);
    await dropUnexpectedUniqueRoleIndexes();
    // eslint-disable-next-line no-console
    console.log("[db] MongoDB connected ✅");
}
