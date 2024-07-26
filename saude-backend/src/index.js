const express = require('express')
const mongoose = require('mongoose');


// MONGOOSE:
mongoose.connect('mongodb+srv://italoramalho:xv8si1uzhLpmCicd@cluster0.yuvh6rr.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0');

const Dog = mongoose.model('Dog', {
    name: String
});
// EXPRESS:
const app = express();
const port = 3000;

app.post("/", async (req, res) =>{
    const doguinho = new Dog({name: 'Fred'});
    try {
        await doguinho.save();
        console.log('rawr');
        res.send(doguinho);
    } catch (error) {
        console.error('Erro ao salvar o doguinho:', error);
        res.status(500).send('Erro ao salvar o doguinho');
    }
})

app.listen(port, () => {
    console.log('Example app listening on port ${port}')
})