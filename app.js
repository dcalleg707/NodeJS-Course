const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');
const dotenv = require('dotenv')

const errorController = require('./controllers/error');
const mongoConnect = require('./util/database').mongoConnect;
const User = require('./models/user');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');

dotenv.config()
const app = express();

app.set('view engine', 'ejs');
app.set('views', 'views');

app.use(bodyParser.urlencoded({extended: false}));
app.use(express.static(path.join(__dirname, 'public')));

app.use((req, res, next) => {
    User.findById('648b7324f3b531b537a37753')
        .then(user => {
            req.user = new User(user.name, user.email, user.cart, user._id);
            next();
        })
        .catch(err => console.log(err))
})

app.use('/admin', adminRoutes);
app.use(shopRoutes);
app.use(errorController.get404);

mongoConnect(() => {
    console.log('server starting in http://localhost:3000')
    app.listen(3000);
})