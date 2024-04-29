const Livro = require('../models/Livro')
const User = require('../models/User')

const { Op } = require('sequelize')

module.exports = class LivroController{
    static async showLivros(req, res){
        let search = ''

        if(req.query.search){
            search = req.query.search
        }

        let order = 'DESC'

        if(req.query.order === 'old'){
            order = 'ASC'
        } else {
            order = 'DESC'
        }

        const livrosData = await Livro.findAll({
            include: User,
            where: {
                title: {[Op.like]: `%${search}%`},
            },
            order: [['createdAt', order]],
        })

        const livros = livrosData.map((result) => result.get({plain: true}))
        let livrosQty = livros.length

        if(livrosQty === 0) {
            livrosQty = false
        }
        res.render('livros/home', {livros, search, livrosQty})
    }

    static async dashboard(req, res){
        const userId = req.session.userid

        const user = await User.findOne({
            where:{
                id: userId,
            },
            include: Livro,
            plain: true,
        })

        const livros = user.Livros.map((result) => result.dataValues)
        
        let emptyLivros = false

        if(livros.length === 0){
            emptyLivros = true
        }

        res.render('livros/dashboard', {livros, emptyLivros})
    }

    static createLivro(req, res){
        res.render('livros/create')
    }

    static async createLivroSave(req, res){
        const livro = {
            UserId: req.session.userid,
            title: req.body.title,
            writer:req.body.writer,
            comments:req.body.comments,
        }

        try{
            await Livro.create(livro)

            req.flash('message', 'Comment created!')
    
            req.session.save(() => {
                res.redirect('/livros/dashboard')
            })
        } catch(err) {
            req.flash('message', `${err.message}`)
            req.session.save(() => {
                res.redirect('/livros/add')
            })
            console.log('An error occurred:' + err)
        }
    }

    static async removeLivro(req, res){

        const id = req.body.id
        const UserId = req.session.userid

        try{
            await Livro.destroy({ where: {id: id, UserId: UserId}})

            req.flash('message', 'Comment successfully removed!')

            req.session.save(() => {
                res.redirect('/livros/dashboard')
            })
        } catch(err) {
            console.log('An error occurred:' + err)
        }
    }

    static async updateLivro(req, res){
        const id = req.params.id

        const livro = await Livro.findOne({ where: { id: id}, raw: true})
        const qtd = livro.comments.length

        res.render('livros/edit', {livro, qtd})
    }

    static async updateLivroSave(req, res){
        const id =  req.body.id
        const livro = {
            title: req.body.title,
            writer: req.body.writer,
            comments: req.body.comments,
        }
        try{
            await Livro.update(livro, {where: {id: id}})
            req.flash('message', 'Comment updated!')

            req.session.save(() => {
                res.redirect('/livros/dashboard')
            })
        } catch(err) {
            req.flash('message', `${err.message}`)
            req.session.save(() => {
                res.redirect('/livros/dashboard')
            })
            console.log('An error occurred:' + err)
        }
    }
}