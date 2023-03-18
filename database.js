import mysql from 'mysql2'
import dotenv from 'dotenv'
dotenv.config()

/* create a connection to mysql database */
const pool = mysql.createPool({
    host: process.env.MYSQL_HOST,
    port: process.env.MYSQL_PORT,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE
}).promise()

/* get selected database's table */
export async function getUsers() {
    const [rows] = await pool.query("SELECT * FROM users")
    return rows
}

/* get a single task from table */
export async function getUser(username) {
    const [rows] = await pool.query(`
        SELECT *
        FROM users
        WHERE username = ?
        `, [username])
    return rows[0]
}

/* create a task in the tasks table */
export async function createUser(username, password, email){
    const [result] = await pool.query(`
        INSERT INTO users (username, password, email)
        VALUES (?, ?, ?)
        `, [username, password, email])
    return getUser(result.insertId)
}

/* delete a task from tasks table */
export async function deleteUser(username){
    const [rows] = await pool.query(`
        DELETE FROM users
        WHERE username = ?
    `, [username])
    return rows[0]
}

/* update a task in the tasks table */
export async function updateUser(username, password){
    const [result] = await pool.query(`
        UPDATE users
        SET password = ?
        WHERE username = ?
    `, [password, username])
    return getUser(username)
}

/* find matching username from database */
export async function findUsername(username){
    const [result] = await pool.query(`
        SELECT *
        FROM users
        WHERE username = ?
    `, [username])
    return result
}

/* find matching email from database */
export async function findEmail(email){
    const [result] = await pool.query(`
        SELECT *
        FROM users
        WHERE email = ?
    `, [email])
    console.log(result)
    return result
}