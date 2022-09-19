//req - u sebi zadrzi dodatne informacije
//req.query - objekt koji sadrži sve parametre
//res - ispis u browser ide preko res , .send ispisuje string


import express from 'express'

const app = express()
const port = 3000

app.get('/', (req, res) => {

    console.log(req.query)

    res.send('Suma je: ${suma} ') 
    console.log('Hello world') 
}) 

app.listen(port, () => console.log('Slušam na portu ${port} ' )) 




