const express = require('express')
const exphbs = require('express-handlebars')
const session = require('express-session')
const fileStore = require('session-file-store')(session)
const flash = require('express-flash')
const bodyParser = require('body-parser')

const app = express()

const conn = require('./db/conn')

// Body Parser
app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())

//Models
const Livro =  require('./models/Livro')
const User =  require('./models/User')

//Rotas
const livrosRoutes = require('./routes/livrosRoutes')
const authRoutes = require('./routes/authRoutes')

// Import Controller
const LivroController = require('./controllers/LivroController')

//template engine
app.engine('handlebars', exphbs.engine())
app.set('view engine', 'handlebars')

//receber resposta do body
app.use(
    express.urlencoded({
        extended: true
    })
)

app.use(express.json())

// session middleware
app.use(
    session({
        name: 'session',
        secret: 'nosso_segredo',
        resave: false,
        saveUninitialized: false,
        store: new fileStore({
            logFn: function(){},
            path: require('path').join(require('os').tmpdir(), 'sessions'),
        }),
        cookie: {
            secure: false,
            maxAge: 3600000,
            expires: new Date(Date.now() + 3600000),
            httponly: true
        }
    }),

)

//flash message
app.use(flash())

//public path
app.use(express.static('public'))

//set session to res
app.use((req, res, next) => {
    if (req.session.userid){
        res.locals.session = req.session
    }

    next()
})

//Routes
app.use('/livros', livrosRoutes)
app.use('/', authRoutes)

app.get('/', LivroController.showLivros)

conn
    // .sync({force: true})
    .sync()
    .then(() => {
        app.listen(5000)
    })
    .catch((err) => console.log(err))