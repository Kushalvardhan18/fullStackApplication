import express from "express"

const app = express()

const port = 3000

app.get('/', (req, res) => {
    res.send('Hello World!')
})

app.get('/kushal', (req, res) => {
    res.send("Kushal vardhan is the best")
})

app.get("/aman", (req, res) => {
    res.send("Aman Vardhan")
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})