var express = require('express');
var router = express.Router();
const md5 =require('blueimp-md5')

const {UserModel,ChatModel} = require('../db/models')

const filter = {password:0,__v:0}

/* GET home page. */

// router.get('/', function(req, res, next) {
//   res.render('index', { title: 'Express' });
// });

// 提供一个用户注册的接口
// a) path 为: /register
// b) 请求方式为: POST
// c) 接收username 和password 参数
// d) admin 是已注册用户
// e) 注册成功返回: {code: 0, data: {_id: 'abc', username: ‘xxx’, password:’123’}
// f) 注册失败返回: {code: 1, msg: '此用户已存在'}

//1、注册的路由
router.post('/register', function (req, res) {
  //读取参数数据
  let {username, password,type} = req.body
  //数据处理
  UserModel.findOne({username},(err,user) => {
    if (user){
      res.send({code: 1, msg: '此用户已存在'}) // code 是数据是否是正常数据的标识
    } else {
      password = md5(md5(password))
      new UserModel({username,password,type}).save((err,user) => {
        // 生成一个cookie(userid: user._id), 并交给浏览器保存
        res.cookie('userid', user._id, {maxAge: 1000*60*60*24*7}) // 持久化cookie, 浏览器会保存在本地文件
        res.send({code: 0, data: {_id:user._id,username,type}})
      })
    }
  })
})

//2、登录的路由
router.post('/login', function(req, res) {
  //读取参数数据
  let {username, password,type} = req.body
  //数据处理
  UserModel.findOne({username,password:md5(md5(password))},filter,(err,user) => {
    if (user){
      // 生成一个cookie(userid: user._id), 并交给浏览器保存,在发送请求的时候自动携带过来
      res.cookie('userid', user._id, {maxAge: 1000*60*60*24*7}) // 持久化cookie, 浏览器会保存在本地文件
      res.send({code: 0, data: user})
    } else {
      res.send({code: 1, msg: '用户名或密码错误'})
    }
  })
})


//3、更新用户信息的路由
router.post('/update', function(req, res) {
  //读取参数数据
  const userid = req.cookies.userid  //userid不能用{}括起来，否则会报错，无法得到userID
  //如果用户id不存在，则返回一个错误提示信息
  if (!userid){
    return res.send({code: 1, msg: '请先登录'})
  }

  //如果存在，则根据id来更新数据库中的相应id的user信息
  const user = req.body //没有id
  //数据处理
  UserModel.findByIdAndUpdate({_id:userid},user,(err,oldUser) => {
    if (!oldUser){
      res.clearCookie('userid')
      res.send({code: 1, msg: '请先登录'})
    } else {
      const {_id,username,type} = oldUser
      const data = Object.assign({_id,username,type},user)
      res.send({code:0,data})
    }
  })
})

//4、获取用户信息的路由
router.get('/user',(req,res) => {
  //读取参数数据
  const userid = req.cookies.userid  //userid不能用{}括起来，否则会报错，无法得到userID
  //如果用户id不存在，则返回一个错误提示信息
  if (!userid){
    return res.send({code: 1, msg: '请先登录'})
  }

  //如果存在，则根据userid来查询数据库中的相应userid的user信息
  UserModel.findOne({_id:userid},filter,(err,user) => {
    res.send({code:0,data:user})
  })
})

//5、根据用户类型获取用户列表的路由
router.get('/userlist',(req,res) => {
  //读取参数数据
  const type = req.query.type

  //如果存在，则根据type来查询数据库中所有这类type的user信息
  UserModel.find({type},filter,(err,user) => {
    res.send({code:0,data:user})
  })
})


//6、获取当前用户的聊天消息列表
router.get('/msglist',(req,res) => {
  // 获取cookie 中的userid
  const userid = req.cookies.userid

// 查询得到所有user 文档数组
  UserModel.find(function (err, userDocs) {
// 用对象存储所有user 信息: key 为user 的_id, val 为name 和header 组成的user 对象
    const users = {} // 对象容器
    userDocs.forEach(doc => {
      users[doc._id] = {username: doc.username, header: doc.header}
    })
    /*
    查询userid 相关的所有聊天信息
    参数1: 查询条件
    参数2: 过滤条件
    参数3: 回调函数
    */
    ChatModel.find({'$or': [{from: userid}, {to: userid}]}, filter, (err, chatMsgs) => {
    // 返回包含所有用户和当前用户相关的所有聊天消息的数据
      res.send({code: 0, data: {users, chatMsgs}})
    })
  })
})


// 7、修改指定消息为已读
router.post('/readmsg', (req, res) => {
// 得到请求中的from 和to
  const from = req.body.from
  const to = req.cookies.userid
  /*
更新数据库中的chat 数据
参数1: 查询条件
参数2: 更新为指定的数据对象
参数3: 是否1 次更新多条, 默认只更新一条
参数4: 更新完成的回调函数
*/
  ChatModel.update({from, to, read: false}, {read: true}, {multi: true}, (err, doc) => {
    console.log('/readmsg', doc)
    res.send({code: 0, data: doc.nModified}) // 更新的数量
  })

})

module.exports = router;
