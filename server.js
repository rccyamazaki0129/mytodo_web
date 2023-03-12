import express from 'express'
import {getTasks, getTask, createTask, deleteTask, updateTask} from './database.js'

const app = express()
const port = 8080

app.use(express.static("public"))

/* query database */
app.get('/tasks', async (req, res) => {
  const tasks = await getTasks()
  res.send(tasks)
})

app.get('/tasks/:id', async (req, res) => {
  const id = req.params.id
  const task = await getTask(id)
  res.send(task)
})

app.post('/tasks', async (req, res) =>{
  const {task_title} = req.body
  const new_task = await createTask(task_title)
  res.status(201).send(new_task)
})

app.get('/tasks/delete/:id', async (req, res) => {
  const id = req.params.id
  const result = await deleteTask(id)
  res.send(result)
})

app.post('/tasks/update/:id', async (req, res) => {
  const id = req.params.id
  const {task_title} = req.body
  const updated_task = await updateTask(id, task_title)
  res.status(201).send(updated_task)
})

app.listen(port, () => {
  console.log(`MyToDo server is listening on port ${port}`)
})