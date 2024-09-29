import mysql2 from "mysql2";

const conexao = mysql2.createPool({
    host: "localhost",
    user: "root",
    password: "",
    database: "biblioteca"
}).promise()

export default conexao