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
require("./models/Postagens")
const hbs = handlebars.create({
    defaultLayout: 'main',
    helpers: {
        if_eq: function (a, b, opts) {
            if (a.toString() == b.toString()) {
                return opts.fn(this)
            } else {
                return opts.inverse(this)
            }
        }
    }
})
const Postagem = mongoose.model("Postagens")
require("./models/Categoria")
const Categoria = mongoose.model("Categorias")
const usuarios = require("./routes/usuario")
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
app.engine('handlebars', hbs.engine)
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
app.get("/", (req, res) => {
    Postagem.find().populate("categoria").lean().sort({ data: "desc" }).then((Postagens) => {
        res.render("index", { Postagens: Postagens })
    }).catch((err) => {
        req.flash("error_msg", "houve um erro interno")
        res.redirect("/404")
    })
})
app.get("/postagem/:slug", (req, res) => {
    Postagem.findOne({ slug: req.params.slug }).lean().then((postagem) => {
        if (postagem) {
            res.render("postagem/index", { postagem: postagem })
        } else {
            req.flash("error_msg", "esta postagem nao existe")
            res.redirect("/")
        }
    }).catch((err) => {
        req.flash("error_msg", "houve um erro interno")
        res.redirect("/")
    })
})
app.get("/categorias", (req, res) => {
    Categoria.find().lean().then((categoria) => {
        res.render("categorias/index", { categoria: categoria })
    }).catch((err) => {
        req.flash("error_msg", "houve um erro interno ao listar as categorias")
        res.redirect("/")
    })
})
app.get("/categorias/:slug", (req, res) => {
    Categoria.findOne({ slug: req.params.slug }).lean().then((categoria) => {
        if (categoria) {
            Postagem.find({ categoria: categoria._id }).lean().then((postagens) => {
                res.render("categorias/postagens", { postagens: postagens, categoria: categoria })
            }).catch((err) => {
                req.flash("error_msg", "houve um erro ao listar os posts.")
                res.redirect("/")
            })
        } else {
            req.flash("error_msg", "nenhum post para essa categoria")
            res.redirect("/")
        }
    }).catch((err) => {
        req.flash("error_msg", "houve um erro interno ao carregar a pagina de categorias")
        res.redirect("/")
    })
})

app.get("/404", (req, res) => {
    res.send("erro 404")
})

app.get('/posts', (req, res) => {
    res.send("Lista de Posts")
})

app.use('/admin', admin)

app.use("/usuarios", usuarios)

//Outros
const PORT = 8081
app.listen(PORT, () => {
    console.log("Servidor Rodando")
})