const express = require("express")
const router = express.Router()
const mongoose = require("mongoose")
const handlebars = require("express-handlebars")
require("../models/Categoria")
require("../models/Postagem")
const Categoria = mongoose.model("categorias")
const Postagem = mongoose.model("postagens")
const {ehAdmin} = require("../helpers/ehAdmin")

router.get("/", ehAdmin, (req, res) => {
    res.render("admin/index")
})

router.get("/posts", ehAdmin, (req, res) => {
    res.send("Pagina de posts")
})

router.get("/categorias", ehAdmin, (req, res) => {
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
router.get("/categorias/add", ehAdmin, (req, res) => {
    res.render("admin/addcategoria")
})
router.post("/categorias/nova", ehAdmin, (req, res) => {
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

router.get("/categorias/edit/:id", ehAdmin, (req, res) => {
    Categoria.findOne({_id: req.params.id}).then((categoria) => {
        res.render("admin/editcategoria", {categoria: categoria})
    })
    .catch((error) => {
        console.log(error);
        req.flash("error_msg", "Categoria não encontrada...")
        res.redirect("/admin/categorias");
    });
})

router.post("/categorias/edit", ehAdmin, (req, res) => {
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

router.post("/categorias/delete", ehAdmin, (req, res) => {
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

router.get("/postagens", ehAdmin, (req, res) => {
    Postagem.find().populate("categoria").sort({data: "desc"}).then((postagens) => {
        res.render("admin/postagens", {postagens: postagens})
    })
    .catch((error) => {
        console.log(error);
        req.flash("error_msg", "Não foi possível obter as postagens.")
    })

    
})

router.get("/postagens/add", ehAdmin, (req, res) => {
    Categoria.find().sort({name: "asc"}).then((categorias => {
        res.render("admin/addpostagem", {categorias: categorias})
    }))
    .catch((error) => {
        console.log(error)
        req.flash("error_msg", "Não foi possível listar as categorias")
        res.redirect("/admin/postagens")
    })    
})

router.post("/postagens/nova", ehAdmin, (req, res) => {
    var erros = [];
    if(!req.body.titulo){
        erros.push({texto: "Título não informado"})
    }

    if(!req.body.slug)
        erros.push({texto: "Slug não informado"})
    
    if(!req.body.descricao)
        erros.push({texto: "Descrição não informada"})

    if(!req.body.conteudo)
        erros.push({texto: "Conteudo não informado"})

    if(!req.body.categoria)
        erros.push({texto: "Categoria não selecionada"})

    if(erros.length){
        Categoria.find().sort({name: "asc"}).then((categorias => {
            res.render("admin/addpostagem", {categorias: categorias, erros: erros})
        }))
    }else{
        new Postagem({
            titulo: req.body.titulo,
            slug: req.body.slug,
            descricao: req.body.descricao,
            conteudo: req.body.conteudo,
            categoria: req.body.categoria,
        })
        .save()
        .then(() => {
            req.flash("success_msg", "Nova postagem criada com sucesso!")
            res.redirect("/admin/postagens")
        })
        .catch((error) => {
            console.log(error)
            req.flash("error_msg", "Não foi possível salvar os dados da postagem.")
            res.redirect("/admin/postagens/add");
        })
    }
})

router.post("/postagens/delete", ehAdmin, (req, res) => {
    Postagem.findByIdAndDelete(req.body.id)
    .then(() => {
        req.flash("success_msg", "Postagem excluida com sucesso!")
        res.redirect("/admin/postagens")
    })
    .catch((error) => {
        console.log(error);
        req.flash("error_msg", "Não foi possível excluir a postagem.")
        res.redirect("/admin/postagens")
    })
})

router.get("/postagens/edit/:id", ehAdmin, (req, res) => {
    Postagem.findOne({_id: req.params.id})
    .populate("categoria")
    .then((postagem) => {
        Categoria.find().sort({name: "asc"})
        .then((categorias) => {
            res.render("admin/editpostagem", 
                {
                    postagem: postagem, 
                    categorias: categorias, 
                    helpers: {
                        select: function(selectName, selectedValue, arr){
                            var str = '<select name="' + selectName + '" id="' + selectName + '" class="form-control">'
                            arr.forEach((option) => {
                                str += '<option value="' + option._id + '" ' + option._id == selectedValue ? 'selected' : '' + '>' + option.name + '</option>'
                            })
                            str += '</select>'
    
                            return new handlebars.SafeString (str);
                        }
                    }
                }
            )
        })
        .catch((error)=> {
            console.log(error);
            req.flash("error_msg", "Não foi possível obter as categorias.")
            res.redirect("/admin/postagens");
        })
    })
    .catch((error) => {
        console.log(error)
        req.flash("error_msg", "Postagem não encontrada.")
        res.redirect("/admin/postagens")
    })
})
module.exports = router