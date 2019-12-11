/*
启动socket.io 服务的函数
*/
module.exports = function (server) {
// 引入操作chats 集合数据的Model
  const ChatModel = require('../db/models').ChatModel
// 得到操作服务器端sokectIO 的io 对象
  const io = require('socket.io')(server)
// 绑定监听回调: 客户端连接上服务器
  io.on('connection', function(socket) { // socket 代表连接
    console.log('有客户端连接上了服务器')
// 绑定sendMsg 监听, 接收客户端发送的消息
    socket.on('sendMsg', function({from, to, content}) {
      console.log('服务器接收到数据', {from, to, content})
// 将接收到的消息保存到数据库
      const chat_id = [from, to].sort().join('_')
      const create_time = Date.now()
      const chatModel = new ChatModel({chat_id, from, to, create_time, content})
      chatModel.save(function (err, chatMsg) {
// 保存完成后, 向所有连接的客户端发送消息
        io.emit('receiveMsg', chatMsg) // 全局发送, 所有连接的客户端都可以收到
        console.log('向所有连接的客户端发送消息', chatMsg)
      })
    })
  })
}