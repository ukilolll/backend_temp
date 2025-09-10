import {Pool} from "pg"
import dotenv from "dotenv"
dotenv.config()

const DBSERVER=process.env.DBSERVER
const DBUSER=process.env.DBUSER
const DBPWD=process.env.DBPWD
const DBHOST=process.env.DBHOST
const DBPORT=process.env.DBPORT
const DB=process.env.DB

const db = new Pool({
    connectionString:`${DBSERVER}://${DBUSER}:${encodeURIComponent(DBPWD)}@${DBHOST}:${DBPORT}/${DB}`
})

// Check database connection
async function test() {
  try {
    const client = await db.connect();
    console.log("✅ Database connected successfully");
    client.release();
  } catch (err) {
    console.error("❌ Database connection failed:", err.message);
  }
};

test()

export default db