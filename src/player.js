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
    console.log(self.x);

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
