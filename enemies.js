/** enemies.js **/

function Enemy(cx, cy, width, height) {
  var props ={};
  props.x = cx - width / 2;
  props.y = cy - height / 2;
  Enemy.superClass.constructor.call(this, props);
}

Q.inherit(Enemy, Q.DisplayObject);

Enemy.prototype.update = function (timeInfo) {
    return true;
}