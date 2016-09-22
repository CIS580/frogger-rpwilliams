"use strict;"
/*
  Frogger v1
  Author: Ryan Williams
  Last updated: 9.22.2016
*/


/* Classes */
const Game = require('./game.js');
const Player = require('./player.js');
const Minicar = require('./minicar.js');

/* Global variables */
var canvas = document.getElementById('screen');
var game = new Game(canvas, update, render);
var player = new Player({x: 0, y: 240});
var carX = Math.floor((Math.random() * 150) + 240);
var carY = Math.floor((Math.random() * 350) + 0);
var numberOfCars = 1;
var bigX = 0;
var bigY = 0;
var smallY = 0;
var smallX = 0;
var distance = 0;

var minicars = [];
for(var i=0; i < numberOfCars; i++) {
  minicars.push(new Minicar({
    x: carX,
    y: carY
  }));
}
minicars.sort(function(s1, s2) {return s1.y - s2.y;});




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
  minicars.forEach(function(minicar) { minicar.update(elapsedTime);});

  document.getElementById('score').innerHTML = "Score: " + player.score;
  document.getElementById('level').innerHTML = "Level: " + player.level;
  document.getElementById('lives').innerHTML = "Lives: " + player.lives;

  /*
    If a player gets to the end, bring the player to a new level
  */
  if(player.newLevel)
  {
    // Reinitialize player
    player.x = 0;
    player.y = 240;
    player.level++;
    
    // Reinitialize cars
    numberOfCars++;
    carX = Math.floor((Math.random() * 150) + 240);
    carY = Math.floor((Math.random() * 350) + 0);
    minicars = [];
    for(var i=0; i < numberOfCars; i++) {
      minicars.push(new Minicar({
        x: carX,
        y: carY
      }));
      minicars[i].speed += .5;  // Increase the speed of the minicar
  }

    player.newLevel = false;
  }

  /* Check if the player is dead */
  if(player.dead)
  {
      player.x = 0;
      player.y = 240;
      player.lives--;
      player.dead = false;
  }


  for(var index in minicars)
  {
    if(minicars[index].x >= player.x)
    {
      bigX = minicars[index].x;
      smallX = player.x;
    }
    else if(minicars[index].x < player.x)
    {
      smallX = minicars[index].x;
      bigX = player.x;
    }
    if(minicars[index].y >= player.y)
    {
      bigY = minicars[index].y;
      smallY = player.y;
    }
    else if(minicars[index].x < player.x)
    {
      smallY = minicars[index].y;
      bigY = player.y;
    }

    
    /* Calculate the distance between the apple and the player at any given time */
    distance = Math.abs(Math.sqrt(((bigX - smallX)*(bigX - smallX))
     + ((bigY - smallY)*(bigY - smallY))));
    
    
    if(distance <= 5)
    {
      player.dead = true;
    }
    else
    {
      player.dead = false;
    }
  }
}

/**
  * @function render
  * Renders the current0 game state into a back buffer.
  * @param {DOMHighResTimeStamp} elapsedTime indicates
  * the number of milliseconds passed since the last frame.
  * @param {CanvasRenderingContext2D} ctx the context to render to
  */
function render(elapsedTime, ctx) {
  var img = new Image();
  img.src = "assets/froggerBackground.png";
  ctx.drawImage(img, 0, 0);
  
  minicars.forEach(function(minicar){minicar.render(elapsedTime, ctx);});
  
  player.render(elapsedTime, ctx);

  if(player.lives == 0)
  {
    document.getElementById('play').innerHTML = "GAME OVER";
    img = new Image();
    /* Image used under the creative commons license by Virginia Gewin */
    img.src = "https://upload.wikimedia.org/wikipedia/commons/0/01/Chytridiomycosis.jpg";
    ctx.drawImage(img, 0, 0, 760, 480);
  }
}
