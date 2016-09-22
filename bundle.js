(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict;"

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
var numberOfCars = 4;

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
      console.log("Adding new cars");
      minicars[i].speed += .5;  // Increase the speed of the minicar
  }

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
  var img = new Image();
  img.src = "assets/froggerBackground.png";
  ctx.drawImage(img, 0, 0);
  
  minicars.forEach(function(minicar){minicar.render(elapsedTime, ctx);});
  
  player.render(elapsedTime, ctx);
}

},{"./game.js":2,"./minicar.js":3,"./player.js":4}],2:[function(require,module,exports){
"use strict";

/**
 * @module exports the Game class
 */
module.exports = exports = Game;


/**
 * @constructor Game
 * Creates a new game object
 * @param {canvasDOMElement} screen canvas object to draw into
 * @param {function} updateFunction function to update the game
 * @param {function} renderFunction function to render the game
 */
function Game(screen, updateFunction, renderFunction) {
  this.update = updateFunction;
  this.render = renderFunction;

  // Set up buffers
  this.frontBuffer = screen;
  this.frontCtx = screen.getContext('2d');
  this.backBuffer = document.createElement('canvas');
  this.backBuffer.width = screen.width;
  this.backBuffer.height = screen.height;
  this.backCtx = this.backBuffer.getContext('2d');

  

  // Start the game loop
  this.oldTime = performance.now();
  this.paused = false;
}

/**
 * @function pause
 * Pause or unpause the game
 * @param {bool} pause true to pause, false to start
 */
Game.prototype.pause = function(flag) {
  this.paused = (flag == true);
}

/**
 * @function loop
 * The main game loop.
 * @param{time} the current time as a DOMHighResTimeStamp
 */
Game.prototype.loop = function(newTime) {
  var game = this;
  var elapsedTime = newTime - this.oldTime;
  this.oldTime = newTime;

  if(!this.paused) this.update(elapsedTime);
  this.render(elapsedTime, this.frontCtx);

  // Flip the back buffer
  this.frontCtx.drawImage(this.backBuffer, 0, 0);
}

},{}],3:[function(require,module,exports){
"use strict";

/**
 * @module exports the Snake class
 */
module.exports = exports = Minicar;
var speed;

/**
 * @constructor Snake
 * Creates a new snake object
 * @param {Postition} position object specifying an x and y
 */
function Minicar(position) {
  this.state = (Math.random() > 0.5) ? "up" : "down";
  this.frame = 0;
  this.timer = 0;
  this.x = position.x;
  this.y = position.y;
  this.width  = 256;
  this.height = 64 * 6;
  
  // My code
  this.spritesheet  = new Image();
  this.spritesheet.src = encodeURI('assets/cars_mini.png');
  this.upBound = position.y - 100;
  this.downBound = position.y + 100;
  this.speed = .5;
}

/** Declare spritesheet at the class level */



/**
 * @function updates the player object
 * {DOMHighResTimeStamp} time the elapsed time since the last frame
 */
Minicar.prototype.update = function(elapsedTime) {
  this.timer += elapsedTime;
  if(this.timer > 1000/6) {
    this.frame = (this.frame + 1) % 1;
    this.timer = 0;
  }
  switch(this.state) {
    case "up":
      this.y -= this.speed;
      if(this.y < this.upBound) this.state = "up";
      break;
    case "down":
      this.y += this.speed;
      if(this.y > this.downBound) this.state = "down";
      break;
  }
}

/**
 * @function renders the player into the provided context
 * {DOMHighResTimeStamp} time the elapsed time since the last frame
 * {CanvasRenderingContext2D} ctx the context to render into
 */
Minicar.prototype.render = function(time, ctx) {
  if(this.state == "up") {
    ctx.drawImage(
      // image
      this.spritesheet,
      // source rectangle
      this.frame * this.width, 0, this.width, this.height,
      // destination rectangle
      this.x, this.y, this.width/2, this.height/2
    );
  } else {
    ctx.drawImage(
      // image
      this.spritesheet,
      // source rectangle
      this.frame * this.width, 0, this.width, this.height,
      // destination rectangle
      this.x, this.y, this.width/2, this.height/2
    );
  }
}

},{}],4:[function(require,module,exports){
"use strict";

const MS_PER_FRAME = 1000/8;
const JUMP_DISTANCE = 5;
const SUCCESS = 650;
var score;  
var level;
var lives;
var newLevel; // true or false if end has been reached
var dead;

/**
 * @module exports the Player class
 */
module.exports = exports = Player;

/**
 * @constructor Player
 * Creates a new player object
 * @param {Postition} position object specifying an x and y
 */
function Player(position) {
  this.state = "idle";
  this.x = position.x;
  this.y = position.y;
  this.width  = 64;
  this.height = 64;
  this.spritesheet  = new Image();
  this.spritesheet.src = encodeURI('assets/PlayerSprite2.png');
  this.timer = 0;
  this.frame = 0;
  this.distance = 0;
  
  this.score = 0;
  this.level = 1;
  this.lives = 3;
  
  this.newLevel = false;
  this.dead = false;

  var self = this;


  // Frog movement based on key commands
  var input = 
  {
    up: false,
    down: false,
    left: false,
    right: false
  }

  window.onkeydown = function(event)
  {
    event.preventDefault();
    switch (event.keyCode)
    {
      // RIGHT
      case 39:
      case 68:
        input.right = true;
        self.state = "hop";
        break;    
    }
  }

  window.onkeyup = function(event)
  {
    switch (event.keyCode)
    {
      // RIGHT
      case 39:
      case 68:
        input.right = false;
        break;
    }
  }

  self.move = function(time)
  { 
    if(input.right)
    {
      self.x += JUMP_DISTANCE;
    } 
  }

}


/**
 * @function updates the player object
 * {DOMHighResTimeStamp} time the elapsed time since the last frame
 */
Player.prototype.update = function(time) {
  if(this.x == SUCCESS)
  {
    this.score++;
    this.newLevel = true;
  }

  switch(this.state) {
    case "idle":
      this.timer += time;
      if(this.timer > MS_PER_FRAME) {
        this.timer = 0;
        this.frame += 1;
        if(this.frame > 3) this.frame = 0;
      }
      break;
    case "hop":
      this.timer += time;
      if(this.timer > 1000/4) {

        this.timer = 0;
        this.frame += 1;
        if(this.frame > 3)
        {
          this.frame = 0;
          this.state = "idle";
        } 

      }
      this.move(time);
      break;


    // TODO: Implement your player's update by state
  }
}

/**
 * @function renders the player into the provided context
 * {DOMHighResTimeStamp} time the elapsed time since the last frame
 * {CanvasRenderingContext2D} ctx the context to render into
 */
Player.prototype.render = function(time, ctx) {
  switch(this.state) {
    case "idle":
      ctx.drawImage(
        // image
        this.spritesheet,
        // source rectangle
        this.frame * 64, 64, this.width, this.height,
        // destination rectangle
        this.x, this.y, this.width, this.height
      );
      break;
    case "hop":
      ctx.drawImage(
        // image
        this.spritesheet,
        // source rectangle
        this.frame * 64, 0, this.width, this.height,
        // destination rectangle
        this.x, this.y, this.width, this.height
        );
      break;
   
      //this.x += JUMP_DISTANCE;
      //this.state = "idle";
    // TODO: Implement your player's redering according to state
  }
}

},{}]},{},[1]);
