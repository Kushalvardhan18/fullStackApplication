import express from "express"
import dotenv from "dotenv"
import cors from "cors"
import db from "./utils/db.js"

dotenv.config()
// console.log(process.env.PORT);

const app = express()

app.use(
    cors({
        origin: process.env.BASE_URL,
        credentials: true,
        methods: ['GET', 'POST', 'DELETE', 'OPTIONS'],
        allowedHeaders: ['Content-Type', 'Authorization']
    })
)

app.use(express.json()) // to accept Json data
app.use(express.urlencoded({extended:true}))  // to accept the url encodes


const port = process.env.PORT || 4000

app.get('/', (req, res) => {
    res.send('Hello World!')
})

app.get('/kushal', (req, res) => {
    res.send("Kushal vardhan is the best")
})

app.get("/aman", (req, res) => {
    res.send("Aman Vardhan")
})

// Connect to db
db()

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})