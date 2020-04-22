const router = require('express').Router()
const mongoose = require("mongoose")
require('../models/Categoria')
const Categoria = mongoose.model("Categorias")
require('../models/Postagens')
const Postagem = mongoose.model("Postagens")

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

router.get("/categorias/edit/:id", (req, res) => {
    Categoria.findOne({ _id: req.params.id }).lean().then((categoria) => {
        res.render('admin/editcategorias', { categoria: categoria })
    }).catch((err) => {
        req.flash("error_msg", "esta categoria não existe")
        res.redirect("/admin/categorias")
    })
})
router.post("/categorias/edit", (req, res) => {
    Categoria.findById({ _id: req.body.id }).then((categoria) => {
        categoria.nome = req.body.nome
        categoria.slug = req.body.slug

        categoria.save().then(() => {
            req.flash('success_msg', 'Categoria editada com sucesso!')
            res.redirect('/admin/categorias')
        }).catch((err) => {
            req.flash("error_msg", "houve um erro interno ao salvar a edição da categoria")
            res.redirect("/admin/categorias")
        })
    }).catch((err) => {
        req.flash("error_msg", "Houve um erro ao editar a categoria")
        res.redirect("/admin/categorias")
    })

})

router.post("/categorias/deletar", (req, res) => {
    Categoria.remove({ _id: req.body.id }).then(() => {
        req.flash("success_msg", "categoria deletada com sucesso!")
        res.redirect("/admin/categorias")
    }).catch((err) => {
        req.flash("error_msg", "HOuver um erro ao deletar categoria")
        res.redirect("/admin/categorias")
    })
})

router.get("/postagens", (req, res) => {
    Postagem.find().populate("categoria").lean().sort({ data: "desc" }).then((postagens) => {
        res.render("admin/postagens", { postagens: postagens })
    }).catch((err) => {
        req.flash("error_msg", "houve um erro ao listar as postagens")
        res.redirect("/admin")
    })
})
router.get("/postagens/add", (req, res) => {
    Categoria.find().sort({ nome: 'asc' }).lean().then((categorias) => {
        res.render("admin/addpostagem", { categorias: categorias })
    }).catch((err) => {
        req.flash("error_msg", "houve um erro ao carregar formulario")
        res.redirect("/admin")
    })
})
router.post("/postagens/nova", (req, res) => {
    var erros = []
    if (req.body.categoria == "0") {
        erros.push({ texto: "categoria invalida, registre uma categoria" })
    }
    if (erros.length > 0) {
        res.render("admin/addpostagem", { erros: erros })
    } else {
        const novaPostagem = {
            titulo: req.body.titulo,
            slug: req.body.slug,
            descricao: req.body.descricao,
            conteudo: req.body.conteudo,
            categoria: req.body.categoria
        }
        new Postagem(novaPostagem).save().then(() => {
            req.flash("success_msg", "Postagem criado com sucesso")
            res.redirect("/admin/postagens")
        }).catch((err) => {
            req.flash("error_msg", "houve um erro durante o salvamento da postagem")
            res.redirect("/admin/postagens")
        })

    }
})
router.get("/postagens/edit/:id", (req, res) => {
    Postagem.findOne({ _id: req.params.id }).lean().then((postagem) => {
        Categoria.find().lean().then((categorias) => {
            res.render("admin/editpostagens", { categorias: categorias, postagem: postagem })
        }).catch((err) => {
            req.flash("error_msg", "houve um erro ao listar as categorias")
            res.redirect("/admin/postagens")
        })
    }).catch((err) => {
        req.flash("error_msg", "houve um erro ao carregar o formulario de edição")
        res.redirect("/admin/postagens")
    })
})
router.post("/postagem/edit", (req, res) => {
    Postagem.findOne({ _id: req.body.id }).then((postagem) => {

        postagem.titulo = req.body.titulo
        postagem.slug = req.body.slug
        postagem.descricao = req.body.descricao
        postagem.conteudo = req.body.conteudo
        postagem.categoria = req.body.categoria

        Postagem.save().then(() => {
            req.flash("success_msg", "postagem editada com sucesso")
            res.redirect("/admin/postagens")
        }).catch((err) =>{
            req.flash("error_msg", "houve um erro ao salvar a edicao")
            res.redirect("/admin/postagens")
        })


}).catch((err) => {
    req.flash("error_msg", "houve um erro ao salvar e edicao")
    res.redirect("/admin/postangens")
})
})


module.exports = router