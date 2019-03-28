var express = require('express');
const handlebars = require('express-handlebars');
const Sequelize = require('sequelize')

var app = express()

// Config
// template engine
app.engine('handlebars', handlebars({defaultLayout: "main"}))
app.set('view engine', 'handlebars')

// banco de dados
const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: './database/db.sqlite'
  })

app.get("/cad", function(req, res){
    res.render("formulario")
});

app.post("/add", function(req, res){
    res.send("Formulário recebido");
});


app.listen(8090, function(){
    console.log("Servidor Iniciado.")
});
