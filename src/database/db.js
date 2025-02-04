import knex from "knex";
import knexFile from "./knexfile.cjs";

console.log(`DB Connection: ${process.env.ENVIRONMENT}`);
const environment =
  process.env.ENVIRONMENT == "production" ? "production" : "development";

export default knex(knexFile[environment]);
