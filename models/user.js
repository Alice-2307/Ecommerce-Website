
const mongoDb = require('mongodb') 
const getDb = require("../util/database").getDb;

class User {
  constructor(name,email){
    this.name = name;
    this.email = email;
  }
  save(){
    const db = getDb();
      return db.collection('users').insertOne(this)
    .then(result => {
      console.log(result);
    })
    .catch(err => console.log(err))
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