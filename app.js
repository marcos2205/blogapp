//Carregando módulos
const express = require('express')
const handlebars = require('express-handlebars')
const bodyParser = require("body-parser")
const app = express()
const admin = require("./routes/admin")
const path = require('path') //manipuar pastas
const mongoose = require('mongoose')
const session = require("express-session")
const flash = require("connect-flash")
//Configurações
//sessão
app.use(session({
    secret: "cursodenode",
    resave: true,
    saveUninitialized: true
}))
//flash
app.use(flash())
//middleware
app.use((req, res, next) => {
    res.locals.success_msg = req.flash("success_msg")
    res.locals.error_msg = req.flash("error_msg")
    next()
})
//Body Parser
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
//Handlebars
app.engine('handlebars', handlebars({ defaultLayout: 'main' }))
app.set('view engine', 'handlebars')
//Mongoose
mongoose.Promise = global.Promise
mongoose.connect('mongodb://localhost/blogap').then(() => {
    console.log("Conectado ao Mongo")
}).catch((err) => {
    console.log("erro ao se conectar: = " + err)
})
//Public
app.use(express.static(path.join(__dirname, "public")))

app.use((req, res, next) => {
    console.log("middleware")
    next()
})

//Rotas
app.get('/', (req, res) => {
    res.send("Pagina Principal")
})
app.get('/posts', (req, res) => {
    res.send("Lista de Posts")
})

app.use('/admin', admin)

//Outros
const PORT = 8081
app.listen(PORT, () => {
    console.log("Servidor Rodando")
})