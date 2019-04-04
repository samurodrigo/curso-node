const express = require("express")
const handlebars = require("express-handlebars")
const bodyParser = require("body-parser")
const path = require("path")
const mongoose = require("mongoose")
const session = require("express-session")
const flash = require("connect-flash")

const app = express()
const admin = require("./routes/admin")
require("./models/Postagem")
const Postagem = mongoose.model("postagens")
require("./models/Categoria")
const Categoria = mongoose.model("categorias")
const usuarios = require("./routes/usuario")
const passport = require("passport")
require("./config/auth")(passport)


// Configurações

    //Sessão
        app.use(session({
            secret: "cursonodejs",
            resave: true,
            saveUninitialized: true
        }))

        app.use(passport.initialize())
        app.use(passport.session())
        app.use(flash())

    // Middleware
        app.use((req, res, next) => {
            res.locals.success_msg = req.flash("success_msg")
            res.locals.error_msg = req.flash("error_msg")
            res.locals.error = req.flash("error")
            res.locals.user = req.user || null;
            next()
        })
    //Body Parser
        app.use(bodyParser.urlencoded({extended: true}))
        app.use(bodyParser.json())
    // Handlebars
        app.engine('handlebars', handlebars(
            {
                defaultLayout: "main"
            }
        ))
        app.set("view engine", "handlebars")
    // Mongoose
        mongoose.Promise = global.Promise
        mongoose.connect(encodeURI(process.env.DB_CONNECTION_STRING), {
            useNewUrlParser: true
        })
        .then(() => {
            console.log("Conectado ao mongodb...")
        })
        .catch((error) => {
            console.log("Não foi possível conectar ao mongodb. " + error)
        })
    // Arquivos estaticos
        app.use(express.static(path.join(__dirname, "public")))


// Rota
    app.get("/", (req, res) => {
        Postagem.find().populate("categoria").then((postagens) => {
            res.render("home/index", {postagens: postagens})
        })
        .catch((error) => {
            req.flash("error_msg", "Não foi possível obter as postagens")
            res.render("home/index")
        })        
    });
    app.get("/postagens/view/:slug", (req, res) => {
        Postagem.findOne({slug: req.params.slug}).then((postagem)=> {
            res.render("postagens/view", {postagem: postagem})
        })
        .catch((error) => {
            console.log(error)
            req.flash("error_msg", "Não foi possível obter a postagem")
            res.render("home/index")
        })
    })

    app.get("/categorias", (req, res)=>{
        Categoria.find().then((categorias)=>{
            res.render("categorias/index", {categorias: categorias})
        })
        .catch((error)=>{
            req.flash("error_msg", "Não foi possível listar as categorias")
            res.redirect("/")
        })
    })
    app.get("/categorias/:slug", (req, res)=>{
        Categoria.findOne({slug: req.params.slug}).then((categoria)=>{
            if(categoria){
                Postagem.find({categoria: categoria._id}).then((postagens)=>{
                    res.render("categorias/postagens", {postagens: postagens, categoria: categoria})
                })
                .catch((error) =>{
                    console.log(error)
                    req.flash("error_msg", "Não foi possível obter as postagens da categoria informada.")
                    res.redirect("/")
                })
            }else{
                req.flash("error_msg", "Esta categoria não existe")
                res.redirect("/")
            }
        })
        .catch((error)=>{
            console.log(error)
            req.flash("error_msg", "Não foi possível obter a categoria")
            res.redirect("/")
        })
    })
    app.use("/admin", admin)
    app.use("/usuarios", usuarios )
// Outros

const PORT = process.env.PORT || 8081
app.listen(PORT, () => {
    console.log("Servidor rodando na porta 8081...")
})