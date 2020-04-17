const router = require('express').Router()

router.get('/', (req, res) => {
    res.render("admin/index")
})
router.get('/posts', (req, res) => {
    res.send("Pagina de Posts")
})
router.get('/categorias', (req, res) => {
    res.render("admin/categorias")
})
router.get('/categorias/add', (req, res) => {
    res.render("admin/addcategoria")
})

module.exports = router