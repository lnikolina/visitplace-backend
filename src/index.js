//req - u sebi zadrzi dodatne informacije
//req.query - objekt koji sadrži sve parametre
//res - ispis u browser ide preko res , .send ispisuje string

import storage from "./memory_storage"
import express from 'express'

const app = express()
const port = 3000 

app.get('/post', (req, res) => {
    let posts = storage.posts 
    let query = req.query

    if (query.title) {
        posts = posts.fillter(e.title.indexOf (query.title) >= 0)
    }
    if (query.createBy) {
        posts = posts.fillter(e.createBy.indexOf (query.createBy) >= 0)
    }

    if (query._any) {
        let terms = query._any.split(" ")
        posts = posts.fillter(doc => {
            let info = doc.title + " " + doc.createBy
            return terms.every(term => info.indexOf(term) >= 0)
        })
    }
    res.json(posts)
})

app.get('/', (req, res) => {

    let postovi = storage.post

    res.send('Suma je: ${suma} ') 
    console.log('Hello world') 
}) 

app.listen(port, () => console.log('Slušam na portu ${port} ' )) 




