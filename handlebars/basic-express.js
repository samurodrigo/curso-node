var express = require('express');
const handlebars = require('express-handlebars');
const bodyParser = require('body-parser')
const Post = require('./models/Post')
var app = express()

// Config
// template engine
app.engine('handlebars', handlebars({defaultLayout: "main"}))
app.set('view engine', 'handlebars')

//body parser
app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())

app.get("/", function(req, res){
    Post.findAll().then((posts) => {
        res.render("home", {posts: posts})
    })    
})

app.get("/cad", function(req, res){
    res.render("formulario")
})

app.post("/add", function(req, res){
    Post.create({
        titulo: req.body.titulo,
        conteudo: req.body.conteudo
    }).then(() => {
        res.redirect('/');
    }).catch((error) => {
        res.send("Ocorreu um erro: " + error)
    })
})

app.get('/deletar/:id', (req, res) => {
    Post.destroy({
        where: {
            "id": req.params.id
        }
    }).then(() =>{
        res.send("Postagem deletada com sucesso!")
    }).catch(()=>{
        res.send("Esta postagem não existe!")
    })
})


app.listen(8090, function(){
    console.log("Servidor Iniciado.")
});
