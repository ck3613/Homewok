/**
 * @Author:郄晓晖
 * @Date:2019.8.7
 * @lesson：this详解，闭包，作用域 && 面向对象（原型，继承）
 * @Homework：将《魔塔》游戏继续实现，要求使用一定抽象（可将英雄与魔王进行抽象，要求使用到继承与类设计），实现最终老师实现的那版效果，
 英雄可以进行攻击，魔王可以复制多份（不要完全照着老师的实现抄，能实现多少）
 * */

// 执行自执行函数
(function () {
  // 准备资源
  function prepare() {
    // 获取画布
    let context_box = document.getElementById("canvas");
    let context = context_box.getContext("2d");

    // 加载图像
    function getImg(img, src) {
      return new Promise((resolve, reject) => {
        // 图片正确加载，返回resolve状态
        img.onload = resolve;
        // 图片未正确加载，返回reject状况
        img.error = reject;
        img.src = src
      })
    }

    // 准备图片
    let heroImg = new Image();
    let allSplite = new Image();
    let allResource = Promise.all([
      getImg(heroImg, './hero.png'),
      getImg(allSplite, './all.jpg')
    ]);
    // 返回方法
    return {
      getResource: (callBack) => {
        allResource.then(() => {
          // 注入方法
          callBack && callBack(heroImg, allSplite, context, context_box)
        })
      }
    }
  }
  // 画图
  function drawPic(heroImg, allSplite, context, context_box) {
    // 画图的方法
    let draw = function () {
      this.context.drawImage(
          this.img,
          this.imgPos.x,
          this.imgPos.y,
          this.imgPos.width,
          this.imgPos.height,
          this.rect.x,
          this.rect.y,
          this.rect.width,
          this.rect.height
      )
    };
    // 写入生命值
    let writeData = function () {
      this.context.font = '10px bold 黑体';
      this.context.fillStyle = 'red';
      this.context.fillText("HP：" + this.body.health, this.rect.x, this.rect.y + this.imgPos.height + this.writeRect.height, this.writeRect.width);
    };
    let isTouch = function (heroPosition, heroImg, monsterPosition, monsterImg) {
      let maxHeroX = heroPosition.x + heroImg.width;
      let maxHeroY = heroPosition.y + heroImg.height + 10;
      if (monsterPosition.x < maxHeroX && (monsterPosition.x + monsterImg.width) > heroPosition.x && (monsterPosition.y + 10) < (maxHeroY + 10) && (monsterPosition.y + 10 + monsterImg.height) > (heroPosition.y + 10)) {
        return true
      } else {
        return false
      }
    };
    let attacked = function (Body) {
      if (Body.attack < this.body.defense) {
        this.body.health -= 1;
        return
      }
      this.body.health -= (Body.attack - this.body.defense);
    };
    let watcher = function () {
      if (this.body.health > 0) {
        return true
      } else {
        return false
      }
    };
    // 删除画图的方法
    let clear = function () {
      this.context.clearRect(this.rect.x, this.rect.y, this.rect.width, this.rect.height + this.writeRect.height);
    };
    // 英雄的父类。
    let hero = function hero() {
      this.img = heroImg;
      this.context = context;
      this.imgPos = {
        x: 0,
        y: 0,
        width: 32,
        height: 32
      };
      this.rect = {
        x: 0,
        y: 0,
        width: 32,
        height: 32
      };
      this.writeRect = {
        x: this.rect.x,
        y: this.rect.y,
        width: this.rect.width,
        height: 10
      };
      this.body = {
        attack: 50,
        defense: 50,
        health: 5000
      }
    };
    // 在hero的原型链中增加draw 方法
    hero.prototype = {
      draw,
      writeData,
      attacked,
      clear,
      isTouch,
      watcher
    };
    function monster() {
      this.img = allSplite;
      this.context = context;
      this.imgPos = {
        x: 858,
        y: 528,
        width: 32,
        height: 32
      };
      this.rect = {
        x: 100,
        y: 100,
        width: 32,
        height: 32
      };
      this.writeRect = {
        x: this.rect.x,
        y: this.rect.y,
        width: this.rect.width,
        height: 10
      };
      this.body = {
        attack: 10,
        defense: 10,
        health: 300
      }
    }
    // 在monster的原型链中增加draw方法
    monster.prototype = {
      draw,
      writeData,
      attacked,
      clear,
      watcher
    };
    // 创建英雄实例
    let drawHero = new hero();
    // 创建一个魔王实例
    let black = new monster();
    // 创建一个继承魔王 图片，方法，的红魔王的实例
    function redMonster() {
      monster.call(this);
      this.imgPos = {
        x: 858,
        y: 497,
        width: 32,
        height: 32
      };
      this.rect = {
        x: 150,
        y: 150,
        width: 32,
        height: 32
      };
      this.writeRect = {
        width: this.rect.width,
        height: 10
      }
    }
    redMonster.prototype = Object.create(monster.prototype);
    // 初始化
    drawHero.draw();
    drawHero.writeData();
    black.draw();
    black.writeData();
    onkeyup = function (e) {
      // 首先判断英雄是否还有雪
      if (drawHero.watcher()) {
        if (e.key === 'ArrowUp') {
          if (drawHero.rect.y <= 0) {
            console.log('已经到达地图边缘');
            return
          } else {
            drawHero.clear();
            drawHero.rect.y -= drawHero.imgPos.height;
            // 判断2：如果怪物血量大于 0
            if (black.watcher()) {
              // 判断3：判断怪物是否有和英雄接触，如果有接触，就进攻
              if (drawHero.isTouch(drawHero.rect, drawHero.imgPos, black.rect, black.imgPos)) {
                drawHero.attacked(black.body);
                black.attacked(drawHero.body);
                // 判断4：进攻后怪物是否还有血量
                if (black.body.health > 0) {
                  console.log('开始战斗');
                  black.clear();
                  drawHero.rect.y += drawHero.imgPos.height;
                  black.draw();
                  black.writeData();
                  drawHero.draw();
                  drawHero.writeData();
                  return
                }
                // 判断4：否则，怪物消失
                else {
                  black.clear();
                }
              }
            }
            // 判断2：否则，清空怪物
            else {
              black.clear();
            }
            drawHero.draw();
            drawHero.writeData();
          }

        }
        if (e.key === 'ArrowDown') {
          if (drawHero.rect.y > (context_box.height - (drawHero.imgPos.height * 2) - 10)) {
            console.log('已经到达地图边缘');
            return
          } else {
            drawHero.clear();
            drawHero.rect.y += drawHero.imgPos.height;
            // 判断2：如果怪物血量大于 0
            if (black.watcher()) {
              // 判断3：判断怪物是否有和英雄接触，如果有接触，就进攻
              if (drawHero.isTouch(drawHero.rect, drawHero.imgPos, black.rect, black.imgPos)) {
                drawHero.attacked(black.body);
                black.attacked(drawHero.body);
                // 判断4：进攻后怪物是否还有血量
                if (black.body.health > 0) {
                  console.log('开始战斗');
                  black.clear();
                  drawHero.rect.y -= drawHero.imgPos.height;
                  black.draw();
                  black.writeData();
                  drawHero.draw();
                  drawHero.writeData();
                  return
                }
                // 判断4：否则，怪物消失
                else {
                  black.clear();
                }
              }
            }
            // 判断2：否则，清空怪物
            else {
              black.clear();
            }
            drawHero.draw();
            drawHero.writeData();
          }
        }
        if (e.key === 'ArrowLeft') {
          if (drawHero.rect.x <= 0) {
            console.log('已经到达地图边缘');
            return
          } else {
            drawHero.clear();
            drawHero.rect.x -= drawHero.imgPos.width;
            // 判断2：如果怪物血量大于 0
            if (black.watcher()) {
              if (drawHero.isTouch(drawHero.rect, drawHero.imgPos, black.rect, black.imgPos)) {
                drawHero.attacked(black.body);
                black.attacked(drawHero.body);
                // 判断4：进攻后怪物是否还有血量
                if (black.body.health > 0) {
                  console.log('开始战斗');
                  black.clear();
                  drawHero.rect.x += drawHero.imgPos.width;

                  black.draw();
                  black.writeData();
                  drawHero.draw();
                  drawHero.writeData();
                  return
                }
                // 判断4：否则，怪物消失
                else {
                  black.clear();
                }
              }
            }
            // 判断2：否则，清空怪物
            else {
              black.clear();
            }
            drawHero.draw();
            drawHero.writeData();
          }
        }
        if (e.key === 'ArrowRight') {
          if (drawHero.rect.x > (context_box.width - drawHero.imgPos.width * 2)) {
            console.log('已经到达地图边缘');
            return
          } else {
            drawHero.clear();
            drawHero.rect.x += drawHero.imgPos.width;
            // 判断2：如果怪物血量大于 0
            if (black.watcher()) {
              if (drawHero.isTouch(drawHero.rect, drawHero.imgPos, black.rect, black.imgPos)) {
                drawHero.attacked(black.body);
                black.attacked(drawHero.body);
                // 判断4：进攻后怪物是否还有血量
                if (black.body.health > 0) {
                  console.log('开始战斗');
                  black.clear();
                  drawHero.rect.x -= drawHero.imgPos.width;
                  black.draw();
                  black.writeData();
                  drawHero.draw();
                  drawHero.writeData();
                  return
                }
                // 判断4：否则，怪物消失
                else {
                  black.clear();
                }
              }
            }
            // 判断2：否则，清空怪物
            else {
              black.clear();
            }
            drawHero.draw();
            drawHero.writeData();
          }
        }
      } else {
        alert('Game Over，请刷新，重新开始游戏');
      }
    }
  }
  prepare().getResource((heroImg, allSplite, context, context_box) => {
    drawPic(heroImg, allSplite, context, context_box)
  })
})();