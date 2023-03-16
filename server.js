import express from 'express'
import session from 'express-session'
import {getTasks, getTask, createTask, deleteTask, updateTask} from './database.js'

const app = express()
const port = 8080

/* these 2 middleware enable to extract data from post-req */
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(session({
  secret: 'secret',
  resave: true,
  saveUninitialized: true
}))

app.use(express.static("public"))

/* login procedure */
app.post('/auth', async (req, res) => {
  const username = req.body.username
  const password = req.body.password
  
  if (username && password){
    res.redirect('/mytodo.html');
  }
})

/* query database */
app.get('/users', async (req, res) => {
  const tasks = await getTasks()
  res.send(tasks)
})

app.get('/users/:id', async (req, res) => {
  const id = req.params.id
  const task = await getTask(id)
  res.send(task)
})

app.post('/users', async (req, res) =>{
  const {task_title} = req.body
  const new_task = await createTask(task_title)
  res.status(201).send(new_task)
})

app.get('/users/delete/:id', async (req, res) => {
  const id = req.params.id
  const result = await deleteTask(id)
  res.send(result)
})

app.post('/users/update/:id', async (req, res) => {
  const id = req.params.id
  const {task_title} = req.body
  const updated_task = await updateTask(id, task_title)
  res.status(201).send(updated_task)
})

app.listen(port, () => {
  console.log(`MyToDo server is listening on port ${port}`)
})