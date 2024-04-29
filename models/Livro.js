const {DataTypes} = require('sequelize')

const db = require('../db/conn')

const User = require('./User')

const Livro = db.define('Livro', {
    title: {
        type: DataTypes.STRING,
        allowNull: false,
        require: true,
        validate:{
            notEmpty:{
                msg: "This field Title can't be empty"
            },
            len: {
                args: [4, 25],
                msg: "TITLE must be between 4 and 25 characters!"
            }
        }
    },
    writer: {
        type: DataTypes.STRING,
        allowNull: false,
        require: true,
        validate:{
            notEmpty:{
                msg: "This field Writer can't be empty"
            },
            len: {
                args: [4, 25],
                msg: "WRITER must be between 4 and 25 characters!"
            }
        }
    },
    comments: {
        type: DataTypes.TEXT,
        allowNull: false,
        require: true,
        validate:{
            notEmpty:{
                msg: "This field Comments can't be empty"
            },
            len: {
                args: [5, 256],
                msg: "COMMENTS must be between 5 and 256 characters!"
            }
        }
    },
})

//tipo de relação entre as duas tabelas
Livro.belongsTo(User)
User.hasMany(Livro)

module.exports = Livro