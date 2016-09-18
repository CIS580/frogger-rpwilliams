"use strict";

const MS_PER_FRAME = 1000/8;
const JUMP_DISTANCE = 50;

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

  // Frog movement based on key commands
 
    var self = this;
    window.onkeydown = function(event)
    {
      event.preventDefault();
      switch (event.keyCode)
      {
        // RIGHT
        case 39:
        case 68:
          if(self.state == "idle") {
            console.log("hop right");
            self.state = "hop-1";
            //self.x += JUMP_DISTANCE;
          }
          break;
        // LEFT
        case 37:
        case 65:
          if(self.state == "idle") {
            console.log("hop left");
            self.x -= JUMP_DISTANCE;
            //self.state = "hop-1";
          }
          break;
        // UP
        case 38:
        case 87:
          if(self.state == "idle") {
            console.log("hop up");
            self.y -= JUMP_DISTANCE;
            self.state = "hop-1";
          }
          break;
        // DOWN
        case 40:
        case 83:
          if(self.state == "idle") {
            console.log("hop down");
            self.y += JUMP_DISTANCE;
            self.state = "hop-1";
          }
          break;
      }
    }
  
}


/**
 * @function updates the player object
 * {DOMHighResTimeStamp} time the elapsed time since the last frame
 */
Player.prototype.update = function(time) {
  switch(this.state) {
    case "idle":
      this.timer += time;
      if(this.timer > MS_PER_FRAME) {
        this.timer = 0;
        this.frame += 1;
        if(this.frame > 3) this.frame = 0;
      }
      break;
    case "hop-1":
      this.timer += time;
      if(this.timer > MS_PER_FRAME) {

        this.timer = 0;
        this.frame += 1;
        if(this.frame > 3) this.frame = 0;
      }
      //this.move(time);
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
        this.frame * 64, 0*64, this.width, this.height,
        // destination rectangle
        this.x, this.y, this.width, this.height
      );
      break;
    case "hop-1":
        // image
        this.spritesheet,
        // source rectangle
        this.frame * 64, 1*64, this.width, this.height,
        // destination rectangle
        this.x, this.y, this.width, this.height
      break;
   
      //this.x += JUMP_DISTANCE;
      //this.state = "idle";
      break;
    // TODO: Implement your player's redering according to state
  }
}
