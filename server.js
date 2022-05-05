const bcrypt = require("bcrypt");
const cors = require('cors')
const express = require("express");
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
let dbUsers=0
const db = {
  users: [
    // {
    //   id: "123",
    //   name: "John",
    //   email: "fgffg@hotmail.com",
    //   password: "dfdfdf",
    //   entries: 0,
    //   joined: new Date(),
    // },
  ],
};

app.get("/", (req, res) => {
  console.log('有人要求/',db.users)
  res.json(db.users);
});
app.post("/sigin", (req, res) => {
  //假如使用者POST的資料和DB中的email及password相符，就回應sucess
  const { email, password } = req.body;
  let checkHashPassword = false;
  const user = db.users.find(user=>{
    console.log(user)
    return user.email === email
  })
  console.log(user)
  if(!user) return 
  bcrypt.compare(password, db.users[0].password, function (err, result) {
    if (result) {
        checkHashPassword = true;
        console.log('通過!',checkHashPassword)
        const userData = {
          id:user.id,
          name:user.name,
          email:user.email,
          entries:user.entries,
          joined:user.joined
        }
        res.json(userData);
    }else {
      res.status(400).json("login fail");
    }
  });
  
});
app.post("/register", (req, res) => {
  const { name, email, password } = req.body;
  let hashPassword = "";
  dbUsers++
  const userData = {
    id: dbUsers,
    name: name,
    email: email,
    entries: 0,
    joined: new Date(),
  };
  bcrypt.hash(password, 10, function (err, hash) {
    hashPassword = hash;
    userData.password = hashPassword
    db.users.push(userData);
    console.log(userData)
    res.json(userData);
  });
});
app.get("/profile/:id", (req, res) => {
  const { id } = req.params;
  let found = false;
  db.users.forEach((user) => {
    if (user.id === id) {
      found = true;
      return res.json(user);
    }
  });
  if (!found) {
    res.status(400).json("not found");
  }
});
app.put("/image", (req, res) => {
  const { id } = req.body;
  console.log(id)
  let found = false;
  db.users.forEach((user) => {
    if (user.id === id) {
      found = true;
      user.entries++;
      return res.json(user.entries);
    }
  });
  if (!found) {
    res.status(400).json("not found");
  }
});
