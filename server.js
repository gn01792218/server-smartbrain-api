require('dotenv').config()
const bcrypt = require("bcryptjs");
const cors = require('cors')
const express = require("express");
const knex = require('knex');

const app = express();
const handleRegister = require('./controllers/register').handleRegister
const handleSigin = require('./controllers/sigin').handleSigin
const handleProfile = require('./controllers/profile').handleProfile
const handleImage = require('./controllers/image').handleImage
const handleClarifaiCall = require('./controllers/image').handleClarifaiCall

app.use(cors())
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.listen(process.env.PORT, () => {
  console.log(`server is listing ${process.env.PORT}`);
});

const db = knex({
  client: 'pg',
  connection: {
    connectionString:process.env.DATABASE_URL,
    ssl:true,
  }
})
/*
    一、規劃需要的API
    1. 首頁==>res==>Home page
    2./signin==>POST==>sucess/fail  (使用POST是因為不要在網址輸入query，使用POST夾在body裡面才安全，因為登入時會有密碼)
    3./register==>POST==>userObject
    4./profile/:userId==>GET==>userObject
    5./image==>PUT==>userObject
*/
app.post("/sigin",handleSigin(db,bcrypt))
app.post("/register",handleRegister(db,bcrypt))
app.get("/profile/:id",handleProfile(db))
app.put("/image",handleImage(db))
app.post("/imageurl",handleClarifaiCall())
