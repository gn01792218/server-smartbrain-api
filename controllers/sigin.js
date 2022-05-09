const handleSigin = (db,bcrypt) => (req,res) => {
    //假如使用者POST的資料和DB中的email及password相符，就回應sucess
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json('incorrect form submission')
  db.select('*').from('login').where('email','=',email)
    .then(loginData => {
      console.log(loginData[0])
      if (loginData.length) {
        let comparePassword = bcrypt.compareSync(password,loginData[0].hashpassword)
        if(comparePassword){
          db.select('*').from('users').where('email','=',email)
              .then(user => {
                res.json(user[0])
              })
              .catch(err=>{
                res.status(400).json(err)
              })
        }
        // bcrypt.compare(password, loginData[0].hashpassword, function (err, result) {
        //   if (result) {
        //     console.log(result)
        //    db.select('*').from('users').where('email','=',email)
        //       .then(user => {
        //         res.json(user[0])
        //       })
        //       .catch(err=>{
        //         res.status(400).json(err)
        //       })
        //   }
        // })
      }else{
        res.status(400).json('login fail')
      }
    })
    .catch(err=>{
      res.jstatus(400).json(err)
    })
}
module.exports = {
    handleSigin,
}