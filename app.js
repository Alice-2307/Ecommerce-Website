const path = require('path');
const env = require("dotenv");
env.config();

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const errorController = require('./controllers/error');
const User = require('./models/user');

const app = express();

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use((req,res,next) => {
    User.findById("652cf183171e42b55b5b36f1")
    .then(user => {
        req.user = user;
        next();
    })
    .catch(err => console.log(err))
})

app.use('/admin', adminRoutes);
app.use(shopRoutes);

app.use(errorController.get404);

mongoose.connect(`mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.lmia5ej.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`)
.then(result =>{
    console.log("connected")    
    User.findOne().then(user => {
        if(!user){
            const user = new User({
                name: "abc",
                email: 'abc@gmail.com',
                cart:{
                    items: []
                }
            })
            user.save() 
        }
    })
    app.listen(3000);
}).catch(err => console.log(err))


