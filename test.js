// const mongoose = require('mongoose');
// mongoose.connect('mongodb://localhost:27017/test', {useNewUrlParser: true,useUnifiedTopology: true});
//
// mongoose.Promise = global.Promise
//
// //设计数据库，创建模型
// const Cat = mongoose.model('Cat', { name: String });
//
// //实例化对象
// const kitty = new Cat({ name: 'Zildjian' });
//
// //保存数据库
// kitty.save().then(() => console.log('meow喵喵喵'));

const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/test', {useNewUrlParser: true});

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log('we are connected!')
  // we're connected!
});
//
// var kittySchema = new mongoose.Schema({
//   name: {
//     type:String,
//     required:true
//   },
//   age:Number
// });
//
// // NOTE: methods must be added to the schema before compiling it with mongoose.model()
// kittySchema.methods.speak = function () {
//   var greeting = this.name ? "Meow name is " + this.name : "I don't have a name";
//   var agespeaking = this.age ? "Meow age is " + this.age : "I don't have a age";
//   console.log(greeting);
//   console.log(agespeaking);
// }
//
// var Kitten = mongoose.model('Kitten', kittySchema);
//
// var silence = new Kitten({ name: 'Silence',age: 18 });
// // console.log(silence.name); // 'Silence'
// // console.log(silence.age); // '18'
// // silence.speak()
//
// var fluffy = new Kitten({ name: 'fluffy',age: 21 });
// //fluffy.speak(); // "Meow name is fluffy"
//
// fluffy.save(function (err, fluffy) {
//   if (err) return console.error(err);
//   //fluffy.speak();
// });
//
// silence.save(function (err, silence) {
//   if (err) return console.error(err);
//   //silence.speak();
// });
//
//
// // Kitten.findOne({age:18}, function (err, kittens) {
// //   if (err) return console.error(err);
// //   console.log(kittens);
// // })
//
// //Kitten.find({ name: /^fluff/ }, callback);
//
// // Kitten.deleteOne({ name: 'silence' }, function (err,kittens) {
// //   if (err) return console.error(err);
// //   // deleted at most one tank document
// //   console.log('删除成功')
// // });
//
// // Kitten.deleteMany({ age: { $gte: 21 } }, function (err,kittens) {
// //   if (err) return console.error(err);
// //   // deleted at most one tank document
// //   console.log('删除成功')
// // });
// // Kitten.deleteMany({ age: { $gte: 18 } }, function (err,kittens) {
// //   if (err) return console.error(err);
// //   // deleted at most one tank document
// //   console.log('删除成功')
// // });
//
// Kitten.update({age: { $gt: 18 }}, {age:100}, function (err,kittens) {
//   if (err) return console.log(err)
//   console.log('更新成功')
//   console.log(kittens);
// });
//
// // Kitten.find(function (err, kittens) {
// //   if (err) return console.error(err);
// //   console.log(kittens);
// // })