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
export async function getTasks() {
    const [rows] = await pool.query("SELECT * FROM users")
    return rows
}

/* get a single task from table */
export async function getTask(id) {
    const [rows] = await pool.query(`
        SELECT *
        FROM users
        WHERE id = ?
        `, [id])
    return rows[0]
}

/* create a task in the tasks table */
export async function createTask(task_title){
    const [result] = await pool.query(`
        INSERT INTO users (task_title)
        VALUES (?)
        `, [task_title])
    return getTask(result.insertId)
}

/* delete a task from tasks table */
export async function deleteTask(id){
    const [rows] = await pool.query(`
        DELETE FROM users
        WHERE id = ?
    `, [id])
    return rows[0]
}

/* update a task in the tasks table */
export async function updateTask(id, task_title){
    const [result] = await pool.query(`
        UPDATE users
        SET task_title = ?
        WHERE id = ?
    `, [task_title, id])
    return getTask(id)
}