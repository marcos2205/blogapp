const router = require('express').Router()
const mongoose = require("mongoose")
require('../models/Categoria')
const Categoria = mongoose.model("Categorias")

router.get('/', (req, res) => {
    res.render("admin/index")
})
router.get('/posts', (req, res) => {
    res.send("Pagina de Posts")
})
router.get('/categorias', (req, res) => {
    Categoria.find().sort({ date: 'desc' }).then((categorias) => {
        res.render('admin/categorias', { categorias: categorias.map(categoria => categoria.toJSON()) })
    }).catch((err) => {
        req.flash("error_msg", "erro ao listar categorias")
        res.redirect("/admin")
    })
})
router.get('/categorias/add', (req, res) => {
    res.render("admin/addcategoria")
})
router.post("/categorias/nova", (req, res) => {

    var erros = []
    if (!req.body.nome || typeof req.body.nome == undefined || req.body.nome == null) {
        erros.push({ texto: "Nome Inválido" })
    }
    if (!req.body.slug || typeof req.body.slyg == undefined || req.body.slug == null) {
        erros.push({ texto: "Slug Inválido" })
    }
    if (req.body.nome.length < 2) {
        erros.push({ texto: "Nome da Categoria é muito pequeno" })
    }
    if (erros.length > 0) {
        res.render("admin/addcategoria", { erros: erros })
    } else {
        const novaCategoria = {
            nome: req.body.nome,
            slug: req.body.slug
        }

        new Categoria(novaCategoria).save().then(() => {
            //console.log("nova categoria salva com sucesso")
            req.flash("success_msg", "Categoria criada com sucesso")
            res.redirect("/admin/categorias")
        }).catch((err) => {
            //console.log("erro ao salvar categoria: " + err)
            req.flash("error_msg", "problema ao salvar")
            res.redirect("/admin")
        })
    }
})

module.exports = router