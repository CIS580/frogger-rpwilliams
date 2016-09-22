"use strict";

/**
 * @module exports the Snake class
 */
module.exports = exports = Minicar;
var speed;
var upBound;
var downBound;

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
  
  this.spritesheet  = new Image();
  this.spritesheet.src = encodeURI('assets/cars_mini.png');
  this.upBound = this.y - 300;
  this.downBound = this.y + 300;
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
      if(this.y < this.upBound) this.state = "down";
      break;
    case "down":
      this.y += this.speed;
      if(this.y > this.downBound) this.state = "up";
      break;
  }
}

/**
 * @function renders the player into the provided context
 * {DOMHighResTimeStamp} time the elapsed time since the last frame
 * {CanvasRenderingContext2D} ctx the context to render into
 */
Minicar.prototype.render = function(time, ctx) {

    ctx.drawImage(
      // image
      this.spritesheet,
      // source rectangle
      this.frame * this.width, 0, this.width, this.height,
      // destination rectangle
      this.x, this.y, this.width/2, this.height/2
    );
  
}
