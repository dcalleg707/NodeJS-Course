const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');
const dotenv = require('dotenv')
const mongoose = require('mongoose');

const errorController = require('./controllers/error');
const User = require('./models/user');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const user = require('./models/user');

dotenv.config()
const app = express();

app.set('view engine', 'ejs');
app.set('views', 'views');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use((req, res, next) => {
    User.findById('64923de4a98d0582389247c9')
        .then(user => {
            req.user = user;
            next();
        })
        .catch(err => console.log(err))
})

app.use('/admin', adminRoutes);
app.use(shopRoutes);
app.use(errorController.get404);

mongoose.connect(process.env.MONGODB_URL)
    .then(() => {
        console.log('server starting in http://localhost:3000');
        User.findOne().then(user => {
            if (!user) {
                const user = new User({
                    name: 'john',
                    email: 'john@gmail.com',
                    cart: []
                })
                user.save()
            }
        })
        app.listen(3000);
    })
    .catch(err => console.log(err))