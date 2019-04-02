const express = require("express")
const handlebars = require("express-handlebars")
const bodyParser = require("body-parser")
const path = require("path")
const mongoose = require("mongoose")
const session = require("express-session")
const flash = require("connect-flash")

const app = express()
const admin = require("./routes/admin")
// Configurações

    //Sessão
        app.use(session({
            secret: "cursonodejs",
            resave: true,
            saveUninitialized: true
        }))
        app.use(flash())

    // Middleware
        app.use((req, res, next) => {
            res.locals.success_msg = req.flash("success_msg")
            res.locals.error_msg = req.flash("error_msg")
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
        console.log(process.env.DB_PASS)
        mongoose.connect("mongodb+srv://mongo_teste:<" + process.env.DB_PASS + ">@cluster0-mkobi.mongodb.net/test?retryWrites=true", {
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
    app.use("/admin", admin)
// Outros

const PORT = 8081
app.listen(PORT, () => {
    console.log("Servidor rodando na porta 8081...")
})