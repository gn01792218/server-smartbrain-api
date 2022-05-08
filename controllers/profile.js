const handleProfile =(db)=> (req, res) => {
    const { id } = req.params;
    db.select('*').from('users').where({ id })
        .then(user => { //找不到會回傳空陣列
            if (user.length) {
                res.json(user[0])
            } else {
                res.status(400).json('Not found')
            }
        })
        .catch(err => res.status(400).json(err))
}
module.exports = {
    handleProfile
}