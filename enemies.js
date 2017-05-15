/** enemies.js **/

/**
 * Spawn new environment sprites off screen
 */
function spawnEnvironmentSprites() {
  if (score > 40 && rand(0, 20) === 0 && platformHeight < 3) {
    if (Math.random() > 0.5) {
      environment.push(new Sprite(
        canvas.width + platformWidth % player.speed,
        platformBase - platformHeight * platformSpacer - platformWidth,
        'plant'
      ));
    }
    else if (platformLength > 2) {
      environment.push(new Sprite(
        canvas.width + platformWidth % player.speed,
        platformBase - platformHeight * platformSpacer - platformWidth,
        'bush1'
      ));
      environment.push(new Sprite(
        canvas.width + platformWidth % player.speed + platformWidth,
        platformBase - platformHeight * platformSpacer - platformWidth,
        'bush2'
      ));
    }
  }
}

/**
 * Spawn new enemy sprites off screen
 */
function spawnEnemySprites() {
  if (score > 100 && Math.random() > 0.96 && enemies.length < 3 && platformLength > 5 &&
      (enemies.length ? canvas.width - enemies[enemies.length-1].x >= platformWidth * 3 ||
       canvas.width - enemies[enemies.length-1].x < platformWidth : true)) {
    enemies.push(new Sprite(
      canvas.width + platformWidth % player.speed,
      platformBase - platformHeight * platformSpacer - platformWidth,
      Math.random() > 0.5 ? 'spikes' : 'slime'
    ));
  }
}