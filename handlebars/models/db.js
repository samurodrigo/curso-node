const Sequelize = require('sequelize')
// banco de dados
const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: './database/db.sqlite'
  })

module.exports = {
    Sequelize: Sequelize,
    sequelize: sequelize
}