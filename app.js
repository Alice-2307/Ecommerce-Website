const path = require('path');
const env = require("dotenv");
env.config();

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const errorController = require('./controllers/error');
// const User = require('./models/user');

const app = express();

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

// app.use((req,res,next) => {
//     User.findUserById("6529178d00cc50ea58f6f5fa")
//     .then(user => {
//         req.user = new User(user.name,user.email,user.cart,user._id);
//         next();
//     })
//     .catch(err => console.log(err))
// })

app.use('/admin', adminRoutes);
app.use(shopRoutes);

app.use(errorController.get404);

mongoose.connect(`mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.lmia5ej.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`)
.then(result =>{
    console.log("connected")     
    app.listen(3000);
}).catch(err => console.log(err))


