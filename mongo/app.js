const mongoose = require("mongoose")

// configurações do mongoose
mongoose.Promise = global.Promise;
mongoose.connect("mongodb://localhost/aprendendo",{
    useNewUrlParser: true
})
.then(()=>{
    console.log("Mongodb conectado.")
})
.catch((error) =>{
    console.log("Houve um erro ao se conectar ao mongodb" + error);
})

//Model - Usuários

//Definindo o Model
const UserSchema = mongoose.Schema({
    nome: {
        type: String, //String | Number | Date | Object
        require: true
    },
    sobrenome: {
        type: String,
        require: true
    },
    email: {
        type: String,
        require: true
    },
    idade: {
        type: Number,
        require: true
    },
    pais:{
        type: String
    }
})
//Definindo a Collection
mongoose.model("usuarios", UserSchema)

//Inserir usuario na collection

var Laura = mongoose.model("usuarios");

new Laura({
    nome: "Valeska",
    sobrenome: "Ferreira",
    email: "valeska@ferreira.com.br",
    idade: 36,
    pais: "Brasil"
})
.save()
.then(() => {
    console.log("Usuário criado com sucesso!")
})
.catch((error) => {
    console.log("Houve um erro ao registrar o usuário." + error)
})


