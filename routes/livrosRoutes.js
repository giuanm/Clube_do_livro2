const express = require('express')
const router =express.Router()
const LivroController = require('../controllers/LivroController')

// helpers
const checkAuth = require('../helpers/auth').checkAuth

router.get('/add', checkAuth, LivroController.createLivro)
router.post('/add', checkAuth, LivroController.createLivroSave)
router.get('/edit/:id', checkAuth, LivroController.updateLivro)
router.post('/edit', checkAuth, LivroController.updateLivroSave)
router.get('/dashboard', checkAuth, LivroController.dashboard)
router.post('/remove', checkAuth, LivroController.removeLivro)
router.get('/', LivroController.showLivros)

module.exports = router