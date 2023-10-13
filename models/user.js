
const mongoDb = require('mongodb') 
const getDb = require("../util/database").getDb;

class User {
  constructor(name,email,cart,id){
    this.name = name;
    this.email = email;
    this.cart = cart;
    this._id = id;
  }
  save(){
    const db = getDb();
      return db.collection('users').insertOne(this)
    .then(result => {
      console.log(result);
    })
    .catch(err => console.log(err))
  }
  addToCart(product){
    const cartProduct = this.cart.items.findIndex(cp => {
        return cp.productId.toString() === product._id.toString();
    })
    let newQuantity = 1;
    const updatedCartItems = [...this.cart.items];
    if(cartProduct>=0){
        newQuantity = this.cart.items[cartProduct].quantity+1;
        updatedCartItems[cartProduct].quantity = newQuantity
    }
    else{
        updatedCartItems.push({productId: new mongoDb.ObjectId(product._id), quantity: newQuantity})
    }
    
    const updatedCart = {items: updatedCartItems }
    const db = getDb()
    return db.collection('users').updateOne({_id: new mongoDb.ObjectId(this._id)},{$set: {cart: updatedCart}})


  }
  static findUserById(userId){
    const db = getDb();
    return db.collection('users')
    .find({_id: new mongoDb.ObjectId(userId)})
    .next()
    .then(user => {
      console.log(user);
      return user

    })
    .catch(err => console.log(err))
  }
  
}

module.exports = User;