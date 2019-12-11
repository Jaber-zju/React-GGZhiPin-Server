//测试使用mongoose操作mongoDB数据库

/*
使用mongoose 操作mongodb 的测试文件
1. 连接数据库
1.1. 引入mongoose
1.2. 连接指定数据库(URL 只有数据库是变化的)
1.3. 获取连接对象
1.4. 绑定连接完成的监听(用来提示连接成功)

2. 得到对应特定集合的Model
2.1. 字义Schema(描述文档结构)
2.2. 定义Model(与集合对应, 可以操作集合)

3. 通过Model 或其实例对集合数据进行CRUD 操作
3.1. 通过Model 实例的save()添加数据
3.2. 通过Model 的find()/findOne()查询多个或一个数据
3.3. 通过Model 的findByIdAndUpdate()更新某个数据
3.4. 通过Model 的remove()删除匹配的数据
*/
const md5 = require('blueimp-md5')

//1. 连接数据库
const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/test', {useNewUrlParser: true});
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.on('connected', function () {
  console.log('数据库连接成功!')
})
db.once('open', function() {
  console.log('we are connected!')
  // we're connected!
});

// 2. 得到对应特定集合的Model
// 2.1. 字义Schema(描述文档结构)
const userSchema = new mongoose.Schema({
  username: {
    type:String,
    required:true
  },
  password:{
    type: String,
    required: true
  },
  type:{
    type:String,
    required:true
  },
  header:{
    type:String
  }
});
// 2.2. 定义Model(与集合对应, 可以操作集合),集合的名称就是users
var UserModel = mongoose.model('User', userSchema); //Usermodel是函数对象




// 3. 通过Model 或其实例对集合数据进行CRUD 操作
// 3.1. 通过Model实例的save()添加数据
// var userModel = new UserModel({username: 'Bob',password: md5(md5('2548')),type:'laoban'})
// userModel.save((err, user) => {
//   console.log('save()', err, user)
// })

// 3.2. 通过Model 的find()/findOne()查询多个或一个数据
// UserModel.find({username:'Tom'},(err,data) => {
//   console.log('find()',err,data)
// })
// UserModel.findOne({username:'Bob'},(err,data) => { // 如果有匹配返回的是一个user, 如果没有一个匹配的返回null
//   console.log('findOne()',err,data)
// })

// 3.3. 通过Model 的findByIdAndUpdate()更新某个数据
// UserModel.findByIdAndUpdate({_id:'5de8ad05a489403ec4275c64'},{username:'Jack'},(err,data) => {
//   console.log('findByIdAndUpdate()',err,data)
// })

// 3.4. 通过Model 的remove()删除匹配的数据
// UserModel.findByIdAndDelete({_id:'5de8ad05a489403ec4275c64'},(err,data) => {
//   console.log('findByIdAndUpdate()',err,data)
// })

UserModel.findByIdAndRemove({_id:'5de8ac51db0cd44a0829e4ad'},(err,data) => {
  console.log('findByIdAndRemove',err,data)
})









