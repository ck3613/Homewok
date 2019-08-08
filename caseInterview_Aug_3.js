/**
 * @Author:郄晓晖
 * @Date:1019.8.8
 * @lesson：this详解，闭包，作用域 && 面向对象（原型，继承）
 * @Homework：面试题分析
 * */

// function show() {
//   console.log('this:', this);
// }
//
// var obj = {show: show};
// obj.show();

//show是obj点出来的，所以this指向obj

// function show() {
//   console.log('this:', this);
// }
// var obj = {
//   show: function () {
//     show();
//   }
// };
// obj.show();
// this指向window;这个show是直接执行的函数

// var obj = {
//   show: function () {
//     console.log('this:', this);
//   }
// };
// (0, obj.show)();

// this指向window;同第二个题解法

// var obj = {
//   sub: {
//     show: function () {
//       console.log('this:', this);
//     }
//   }
// };
// obj.sub.show();
// this指向sub，因为是被sub点出来的

// var obj = {
//   show: function () {
//     console.log('this:', this);
//   }
// };
// var newobj = new obj.show();

// this指向newobj obj.show() 是隐式指向，但是优先级没有new高，new 的this 指向是new出来的新对象

// var obj = {}
// var obj = {
//   show: function () {
//     console.log('this:', this);
//   }
// };
// var newobj = new (obj.show.bind(obj))();

// this指向newobj 因为，优先级，new>bind>.的方法

// var obj = {
//   show: function () {
//     console.log('this:', this);
//   }
// };
// var newobj = new (obj.show.bind(obj))();

// 原理同上一题

// var obj = {
//   show: function () {
//     console.log('this:', this);
//   }
// };
// var elem = document.getElementById('book-search-results');
// elem.addEventListener('click', obj.show);  // window,因为是直接执行函数
// elem.addEventListener('click', obj.show.bind(obj)); // obj 绑定了 obj对象
// elem.addEventListener('click', function () { // 直接点出来的所以指向obj
//   obj.show();
// });

// var person = 1;
//
// function showPerson() {
//   var person = 2;
//   console.log(person);
// }
//
// showPerson();

// 等于2，showPerson中有定义同名变量

// var person = 1;
//
// function showPerson() {
//   console.log(person);
//   var person = 2;
// }
//
// showPerson();

// 函数在创建时候会初始化变量，但未赋值，所以在赋值前打印，会输出undefined

// var person = 1;
//
// function showPerson() {
//   console.log(person);
//   var person = 2;
//
//   function person() {
//
//   }
// }
//
// showPerson();

// 输出一个空的函数，变量提升时候会定义变量类型。

// var person = 1;
//
// function showPerson() {
//   console.log(person);
//
//   function person() {
//   }
//
//   var person = 2;
// }
//
// showPerson();
// 输出一个空的函数，变量提升时候会定义变量类型。

// for (var i = 0; i < 10; i++) {
//   console.log(i);
// }
// 输出 0,1,2,3,4,5,6,7,8,9
// for (var i = 0; i < 10; i++) {
//   setTimeout(function () {
//     console.log(i);
//   }, 0);
// }
// 输出10个10 var 变量相当于在全局已经定义了变量，定时器中会直接调用全局中的i变量，但是i变量已经被污染

// for (var i = 0; i < 10; i++) {
//   (function (i) {
//     setTimeout(function () {
//       console.log(i);
//     }, 0)
//   })(i);
// }
// 输出0~9，每次循环，都会把当前的i值传递到函数中，进行调用。相当于传输了10次的参数

// for (let i = 0; i < 10; i++) {
//   console.log(i);
// }

// let定义的变量是块级作用域，只能在小括号中使用，然后循环体中的i会直接去window中查看是否有变量。

// function Person() {
//   this.name = 1;
//   return {};
// }
//
// var person = new Person();
// console.log('name:', person.name);

// 声明的函数，返回的是一个对象，所以new出来的person是一个空的对象，所以对象中的.name属性没有内容

// function Person() {
//   this.name = 1;
// }
//
// Person.prototype = {
//   show: function () {
//     console.log('name is:', this.name);
//   }
// };
// var person = new Person();
// person.show();

// name:1 因为构造函数Person中定义了一个属性，name,并且，在原型链中挂载了show方法。所以new出来的person继承了Person中的属性以及方法。

// function Person() {
//   this.name = 1;
// }
//
// Person.prototype = {
//   name: 2, show: function () {
//     console.log('name is:', this.name);
//   }
// };
// var person = new Person();
// Person.prototype.show = function () {
//   console.log('new show');
// };
// person.show();

// 方式在原型链上的方法被重写后调用，所以显示new show


// function Person() {
//   this.name = 1;
// }
//
// Person.prototype = {
//   name: 2, show: function () {
//     console.log('name is:', this.name);
//   }
// };
// var person = new Person();
// var person2 = new Person();
// person.show = function () {
//   console.log('new show');
// };
// person2.show();
// person.show();

// 方法 person重写了自己的show方法，所以输出new show,person2 继承了Person中的name属性，输出1

// function Person() {
//   this.name = 1;
// }
//
// Person.prototype = {
//   name: 2, show: function () {
//     console.log('name is:', this.name);
//   }
// };
// Person.prototype.show();
// (new Person()).show();

// 输出2,1  show方法是从prototype上.出来的，所以this指向的是prototype，所以，第一个输出2. 第二个继承的是Person 上的name属性，所以输出1
