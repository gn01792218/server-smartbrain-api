require('dotenv').config()
const bcrypt = require("bcrypt");
const cors = require('cors')
const express = require("express");
const knex = require('knex');
const db = knex({
  client: 'pg',
  connection: {
    host: '127.0.0.1',
    user: 'postgres',
    password: process.env.DB_PWD,
    database: 'smartbrainDB'
  }
})
const handleRegister = require('./controllers/register').handleRegister
const handleSigin = require('./controllers/sigin').handleSigin
const handleProfile = require('./controllers/profile').handleProfile
const handleImage = require('./controllers/image').handleImage
const app = express();
app.use(cors())
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.listen(3500, () => {
  console.log("server is listing 3500");
});
/*
    一、規劃需要的API
    1. 首頁==>res==>Home page
    2./signin==>POST==>sucess/fail  (使用POST是因為不要在網址輸入query，使用POST夾在body裡面才安全，因為登入時會有密碼)
    3./register==>POST==>userObject
    4./profile/:userId==>GET==>userObject
    5./image==>PUT==>userObject
*/

app.get("/", (req, res) => {
  // res.json(db.users);
});
app.post("/sigin",handleSigin(db,bcrypt))
app.post("/register",handleRegister(db,bcrypt))
app.get("/profile/:id",handleProfile(db))
app.put("/image",handleImage(db))
// app.put("/image", (req, res) => {
//   console.log(req.body)
//   const { id } = req.body;
//   db('users').where({ id })
//     .increment('entries', 1)
//     .returning('entries')
//     .then(entries => {
//       res.json(entries[0]);
//     })
//     .catch(err => res.status(400).json('err'))
// });
