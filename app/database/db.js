import { Client } from "pg"
export const dbconnect = new Client({
    host: "localhost",
    port: 5432,
    user: "postgres",
    password: "702876",
    database: "blogproject"
})