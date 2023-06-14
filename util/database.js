const Sequelize = require('sequelize');

const sequelize = new Sequelize('node-complete', 'root', 'qweop123', {
    dialect: 'mysql',
    host: 'localhost'
});

module.exports = sequelize;