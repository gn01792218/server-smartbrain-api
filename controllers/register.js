const handleRegister = (db,bcrypt) => (req, res) => {
    const { name, email, password } = req.body;
    if (!name || !email || !password) return res.status(400).json('incorrect form submission')
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(password, salt)
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
    // bcrypt.hash(password, 10, function (err, hash) {
    //     db.transaction(trx => {
    //         trx.insert({
    //             hashpassword: hash,
    //             email: email,
    //         })
    //             .into('login')
    //             .returning('email')
    //             .then(dbEmail => {
    //                 console.log(dbEmail[0])
    //                 trx('users')
    //                     .insert({
    //                         email: dbEmail[0].email,
    //                         name: name,
    //                         joined: new Date()
    //                     })
    //                     .returning('*')
    //                     .then(user => {
    //                         console.log(user[0])
    //                         res.json(user[0])
    //                     })
    //             })
    //             .then(trx.commit)
    //             .catch(trx.rollback)
    //     })
    // });
}

module.exports = {
    handleRegister,
}