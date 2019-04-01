const express = require("express")
const router = express.Router()
const mongoose = require("mongoose")
require("../models/Categoria")
const Categoria = mongoose.model("categorias")


router.get("/", (req, res) => {
    res.render("admin/index")
})

router.get("/posts", (req, res) => {
    res.send("Pagina de posts")
})

router.get("/categorias", (req, res) => {
    Categoria.find()
    .sort({date: "desc"})
    .then((categorias) => {
        res.render("admin/categorias", {categorias: categorias})
    })
    .catch((error) => {
        req.flash("error_msg", "Houve um erro ao listar as categorias");
        res.redirect("admin")
    })
    
})
router.get("/categorias/add", (req, res) => {
    res.render("admin/addcategoria")
})
router.post("/categorias/nova", (req, res) => {
    var erros = []
    if(!req.body.name){
        erros.push({texto: "Nome Inválido"})
    }

    if(!req.body.slug){
        erros.push({texto: "Slug Inválido"})
    }

    if(req.body.name.length < 2){
        erros.push({texto: "Nome da categoria muito pequeno"})
    }
    if(erros.length > 0){
        res.render("/admin/addcategoria", {erros: erros})
    } else {
        const novaCategoria = {
            name: req.body.name,
            slug: req.body.slug
        }

        new Categoria(novaCategoria)
            .save()
            .then(() => {
                req.flash("success_msg", "Categoria criada com sucesso!")
                res.redirect("/admin/categorias")
            })
            .catch((error) => {
                req.flash("error_msg", "Erro ao criar uma nova categoria. Tente novamente.")
                console.log("Erro ao cadastrar categoria. " + error)
            })
    }
})

router.get("/categorias/edit/:id",(req, res) => {
    Categoria.findOne({_id: req.params.id}).then((categoria) => {
        res.render("admin/editcategoria", {categoria: categoria})
    })
    .catch((error) => {
        console.log(error);
        req.flash("error_msg", "Categoria não encontrada...")
        res.redirect("/admin/categorias");
    });
})

router.post("/categorias/edit", (req, res) => {
    var erros = []
    if(!req.body.name){
        erros.push({texto: "Nome Inválido"})
    }

    if(!req.body.slug){
        erros.push({texto: "Slug Inválido"})
    }

    if(req.body.name.length < 2){
        erros.push({texto: "Nome da categoria muito pequeno"})
    }
    if(erros.length > 0){
        res.render("/admin/categorias/edit/" + req.body.id, {erros: erros})
    } else {
        Categoria.findOne({_id: req.body.id}).then(categoria => {
            categoria.name = req.body.name;
            categoria.slug = req.body.slug;
            categoria.save().then(() => {
                req.flash("success_msg", "Categoria editada com sucesso!");
                res.redirect("/admin/categorias")
            })
            .catch(error => {
                req.flash("error_msg", "Não foi possível salvar a categoria.")
                res.redirect("/admin/categorias")
            })
        })
        .catch(error => {
            req.flash("error_msg", "Erro ao editar a categoria")
            req.redirect("/admin/categorias")
        })
    }
})

router.post("/categorias/delete", (req, res) => {
    Categoria
        .deleteOne({_id: req.body.id})
        .then(()=>{
            req.flash("success_msg", "Categoria excluida com sucesso!")
            res.redirect("/admin/categorias")
        })
        .catch((error) => {
            req.flash("error_msg", "Não foi possível excluir a categoria.")
            res.redirect("/admin/categorias")
        })
})
module.exports = router