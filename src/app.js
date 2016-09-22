"use strict;"

/* Classes */
const Game = require('./game.js');
const Player = require('./player.js');

/* Global variables */
var canvas = document.getElementById('screen');
var game = new Game(canvas, update, render);
var player = new Player({x: 0, y: 240});



/**
 * @function masterLoop
 * Advances the game in sync with the refresh rate of the screen
 * @param {DOMHighResTimeStamp} timestamp the current time
 */
var masterLoop = function(timestamp) {
  game.loop(timestamp);
  window.requestAnimationFrame(masterLoop);
}
masterLoop(performance.now());


/**
 * @function update
 * Updates the game state, moving
 * game objects and handling interactions
 * between them.
 * @param {DOMHighResTimeStamp} elapsedTime indicates
 * the number of milliseconds passed since the last frame.
 */
function update(elapsedTime) {
  player.update(elapsedTime);
  document.getElementById('score').innerHTML = "Score: " + player.score;
  document.getElementById('level').innerHTML = "Level: " + player.level;
  document.getElementById('lives').innerHTML = "Lives: " + player.lives;

  /*
    If a player gets to the end, bring the player to a new level
  */
  if(player.newLevel)
  {
    player.x = 0;
    player.y = 240;
    player.level++;

    player.newLevel = false;
  }

  /* Check if the player is dead */
  if(player.dead)
  {
    if(player.lives == 0)
    {
      return;
    }
    else
    {
      player.x = 0;
      player.y = 240;
      player.lives--;
    }
  }
  // TODO: Update the game objects
}

/**
  * @function render
  * Renders the current0 game state into a back buffer.
  * @param {DOMHighResTimeStamp} elapsedTime indicates
  * the number of milliseconds passed since the last frame.
  * @param {CanvasRenderingContext2D} ctx the context to render to
  */
function render(elapsedTime, ctx) {
  //ctx.fillStyle = "lightblue";
  //ctx.fillRect(0, 0, canvas.width, canvas.height);
  var img = document.getElementById("image");
  ctx.drawImage(img, 0, 0);
  //ctx.fillStyle = ctx.createPattern()
  player.render(elapsedTime, ctx);
}
