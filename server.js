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

// db.select('*').from('users').then(data=>{
//   console.log(data)
// })
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

//二、模擬一下Database假資料
let dbUsers = 0
// const db = {
//   users: [
//     // {
//     //   id: "123",
//     //   name: "John",
//     //   email: "fgffg@hotmail.com",
//     //   password: "dfdfdf",
//     //   entries: 0,
//     //   joined: new Date(),
//     // },
//   ],
// };

app.get("/", (req, res) => {
  console.log('有人要求/', db.users)
  // res.json(db.users);
});
app.post("/sigin", (req, res) => {
  //假如使用者POST的資料和DB中的email及password相符，就回應sucess
  const { email, password } = req.body;
  console.log(email)
  db.select('*').from('login').where('email','=',email)
    .then(loginData => {
      console.log(loginData[0])
      if (loginData.length) {
        bcrypt.compare(password, loginData[0].hashpassword, function (err, result) {
          if (result) {
            console.log(result)
           db.select('*').from('users').where('email','=',email)
              .then(user => {
                res.json(user[0])
              })
              .catch(err=>{
                res.status(400).json(err)
              })
          }
        })
      }else{
        res.status(400).json('login fail')
      }
    })
    .catch(err=>{
      res.jstatus(400).json(err)
    })
  // const user = db.users.find(user => {
  //   return user.email === email
  // })
  // if (!user) return
  // bcrypt.compare(password, db.users[0].password, function (err, result) {
  //   if (result) {
  //     const userData = {
  //       id: user.id,
  //       name: user.name,
  //       email: user.email,
  //       entries: user.entries,
  //       joined: user.joined
  //     }
  //     res.json(userData);
  //   } else {
  //     res.status(400).json("login fail");
  //   }
  // });

});
app.post("/register", (req, res) => {
  const { name, email, password } = req.body;
  bcrypt.hash(password, 10, function (err, hash) {
    db.transaction(trx => {
      trx.insert({
        hashpassword: hash,
        email: email,
      })
        .into('login')
        .returning('email')
        .then(dbEmail => {
          console.log(dbEmail[0])
          trx('users')
            .insert({
              email: dbEmail[0].email,
              name: name,
              joined: new Date()
            })
            .returning('*')
            .then(user => {
              console.log(user[0])
              res.json(user[0])
            })
        })
        .then(trx.commit)
        .catch(trx.rollback)
    })
  });
});
app.get("/profile/:id", (req, res) => {
  const { id } = req.params;
  // let found = false;
  db.select('*').from('users').where({ id })
    .then(user => { //找不到會回傳空陣列
      if (user.length) {
        res.json(user[0])
      } else {
        res.status(400).json('Not found')
      }
    })
    .catch(err => res.status(400).json(err))
  // db.users.forEach((user) => {
  //   if (user.id === id) {
  //     found = true;
  //     return res.json(user);
  //   }
  // });
  // if (!found) {
  //   res.status(400).json("not found");
  // }
});
app.put("/image", (req, res) => {
  const { id } = req.body;
  db('users').where({ id })
    .increment('entries', 1)
    .returning('entries')
    .then(entries => {
      res.json(entries[0]);
    })
    .catch(err => res.status(400).json('err'))
  // console.log(id)
  // let found = false;
  // db.users.forEach((user) => {
  //   if (user.id === id) {
  //     found = true;
  //     user.entries++;
  //     return res.json(user.entries);
  //   }
  // });
  // if (!found) {
  //   res.status(400).json("not found");
  // }
});
