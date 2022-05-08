const Clarifai =  require('clarifai')
const app = new Clarifai.App({
    apiKey:process.env.CLARIFAI_API_KEY,
})
const handleClarifaiCall = ()=>(req,res)=>{
    const {input} = req.body
    app.models.predict(
        Clarifai.FACE_DETECT_MODEL,
        input
    ).then(data=>{
        //成功解析圖片的話會回傳人臉的框框資料給前端
        const boxinfo = data.outputs[0].data.regions[0].region_info.bounding_box
        res.json(boxinfo)
    })
    .catch(err=>{
        res.status(400).res.json(err)
    })
}

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
    handleClarifaiCall,
}