import express from 'express'
import session from 'express-session'
import { fileURLToPath } from 'url';
import path from 'path';
import bcrypt from 'bcrypt'
import {
  getUsers, getUser, createUser, 
  deleteUser, updateUser,
  findUsername, findEmail
} from './database.js'

const app = express()
const port = 8080
const __dirname = path.dirname(fileURLToPath(import.meta.url));

/* these 2 middleware enable to extract data from post-req */
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(session({
  secret: 'secret',
  resave: true,
  saveUninitialized: true
}))

/* provide login page */
app.get('/', function(req, res) {
  res.sendFile(__dirname + '/public/login.html')
})

/* access guard for mytodo.html */
app.get('/mytodo.html', function(req, res) {
  /* check if user logged in */
  if (req.session.loggedin){
    /* user already logged in */
    res.sendFile(__dirname + '/public/mytodo.html')
  }
  else{
    /* user did not log in */
    res.redirect('/')
  }
})

/* login procedure */
app.post('/auth', async (req, res) => {
  const username = req.body.username
  const password = req.body.password
  
  if (username && password){
    /* issue a query to database */
    const result = await findUsername(username)
    if (result.length == 0) {
      /* username not exist */ 
      console.log('username does not exist')
      res.status(401).redirect('/login.html')
      return
    }

    /* username exists */
    const user_info = result[0]
    if (user_info.username == username){
      /* password validation */
      const pass_match = await bcrypt.compare(password, user_info.password)
      if (pass_match){
        /* login succeeded */
        req.session.loggedin = true
        req.session.username = username
        console.log('username: ' + username + ' login succeeded')
        res.redirect('/mytodo.html')
      }
      else {
        /* password not matched */
        console.log('login failed')
        res.status(401).redirect('/login.html')
      }
    }
    else {
      /* username not matched */ 
      console.log('login failed')
      res.status(401).redirect('/login.html')
    }
  }
})

/* create an account (register) */
app.post('/register', async (req, res) => {
  const email = req.body.emailaddress
  const username = req.body.username
  const password = req.body.password
  const password_confirm = req.body.password_confirm

  /* hashing password */
  const salt = await bcrypt.genSalt(10)
  const hashed_p1 = await bcrypt.hash(password, salt)
  const hashed_p2 = await bcrypt.hash(password_confirm, salt)

  /* compare hashed passwords */
  const is_matching = (hashed_p1 === hashed_p2)
  if (!is_matching){
    /* two passwords are not identical */
    res.status(401).redirect('/register.html')
  }

  /* check email and usernameare not in database */
  let find_result = await findEmail(email)
  if (find_result.length != 0){
    res.status(401).redirect('/register.html')
    return
  }
  find_result = await findUsername(username)
  if (find_result.length != 0){
    res.status(401).redirect('/register.html')
    return
  }

  /* insert a new user info into database */
  const new_user = await createUser(username, hashed_p1, email)
  req.session.loggedin = true
  req.session.username = username
  console.log('username: ' + username + ' login succeeded')
  res.redirect('/mytodo.html')
})

app.use(express.static("public"))

app.listen(port, () => {
  console.log(`Server is listening on port ${port}`)
})