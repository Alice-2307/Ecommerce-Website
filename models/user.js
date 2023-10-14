
const mongoDb = require('mongodb') 
const getDb = require("../util/database").getDb;

class User {
  constructor(name,email,cart,id){
    this.name = name;
    this.email = email;
    this.cart = cart || {items: []};
    this._id = id;
  }
  save(){
    const db = getDb();
      return db.collection('users').insertOne(this)
    .then(result => {
    //   console.log(result);
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
  getCart(){
    const db = getDb();
    const productIds = this.cart.items.map(i => {
        return i.productId;
    })
    return db.collection('products').find({_id: {$in: productIds}}).toArray()
    .then(products => {
        return products.map(p => {
            return {...p, quantity: this.cart.items.find(i => {
                return i.productId.toString() === p._id.toString()
            }).quantity
        }
        })
    })
  }
  deleteCartProducts(prodId){
    const db = getDb();
    const cartProduct = this.cart.items.filter(i => {
        return i.productId.toString() !== prodId.toString()
    })
    const updatedCart = {items: cartProduct }
    return db.collection('users').updateOne({_id: new mongoDb.ObjectId(this._id)},{$set: {cart: { items: updatedCart }}})
  }

  addOrders() {
    const db = getDb();
    return this.getCart().then(products => {
        const order = {
            items: products,
            user: {
                _id: new mongoDb.ObjectId(this._id)
            }
        }
       return db.collection('orders').insertOne(order)
    }).then(result => {
        this.cart = {items: []}
        return db.collection('users').updateOne({_id: new mongoDb.ObjectId(this._id)},{$set: {cart: { items: [] }}})
    })

  }
  
  getOrders(){
    const db = getDb();
    return db.collection('orders').find({'user._id': new mongoDb.ObjectId(this._id)}).toArray()
    .then(orders => {
        console.log(orders)
        return orders
    }).catch(err => console.log(err));
  }

  static findUserById(userId){
    const db = getDb();
    return db.collection('users')
    .find({_id: new mongoDb.ObjectId(userId)})
    .next()
    .then(user => {
    //   console.log(user);
      return user

    })
    .catch(err => console.log(err))
  }
  
}

module.exports = User;