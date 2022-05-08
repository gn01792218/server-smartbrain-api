const handleImage = (db) => (req, res) => {
    const { id } = req.body;
    db('users').where({ id })
        .increment('entries', 1)
        .returning('entries')
        .then(entries => {
            entries.length?
            res.json(entries[0]) :
            res.json('no this user')
        })
        .catch(err => res.status(400).json('increment fail'))
}
module.exports = {
    handleImage,
}