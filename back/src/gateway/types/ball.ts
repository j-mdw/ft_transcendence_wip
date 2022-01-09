import { Player } from './player';
import { GameStyle } from './game';
import { Paddle } from './paddle';

export class Ball {
  x: number;
  y: number;
  xSpeed: number;
  ySpeed: number;
  radius: number;

  constructor() {
    this.x = 640;
    this.y = 480;
    this.init();
    this.radius = 15;
  }

  init() {
    const angle: number = this.getRandomInt(5, 75);
    this.xSpeed = (Math.random() + Math.cos((angle * Math.PI) / 180)) * 2;
    this.ySpeed = (Math.random() + Math.sin((angle * Math.PI) / 180)) * 2;
    this.xSpeed = this.getRandomInt(0, 1) ? this.xSpeed : -this.xSpeed;
    this.ySpeed = this.getRandomInt(0, 1) ? this.ySpeed : -this.ySpeed;
  }

  reinitializeBallPosition() {
    this.init();
    this.x = 640;
    this.y = 480;
  }

  update(player1: Player, player2: Player) {
    this.paddleImpact(player1.paddle);
    this.paddleImpact(player2.paddle);
    this.edges(player1, player2);
    this.x += this.xSpeed;
    this.y += this.ySpeed;
  }

  // Eventually, remove players and gamedata
  private edges(player1: Player, player2: Player) {
    if (this.y + this.radius > 960 || this.y - this.radius < 0)
      this.ySpeed *= -1;
    if (this.x >= 1280 && this.x < 1280 + this.xSpeed) {
      this.reinitializeBallPosition();
      player1.score++;
    }
    if (this.x <= 0 && this.x > this.xSpeed) {
      this.reinitializeBallPosition();
      player2.score++;
    }
  }

  private paddleImpact(paddle: Paddle) {
    const left = this.x - this.radius,
      right = this.x + this.radius,
      top = this.y - this.radius,
      bottom = this.y + this.radius;

    const pleft = paddle.x - paddle.w / 2,
      pright = paddle.x + paddle.w / 2,
      ptop = paddle.y - paddle.h / 2,
      pbottom = paddle.y + paddle.h / 2;

    if (this.x < 640) {
      if (
        left <= pright &&
        left > pright + this.xSpeed &&
        top < pbottom &&
        bottom > ptop
      ) {
        this.xSpeed *= -1;
        this.xSpeed++;
      }
    }
    if (this.x > 640) {
      if (
        right >= pleft &&
        right < pleft + this.xSpeed &&
        top < pbottom &&
        bottom > ptop
      ) {
        this.xSpeed *= -1;
        this.xSpeed--;
      }
    }
  }

  // 	/**
  // * Gets random int
  // * @param min
  // * @param max
  // * @returns random int - min & max inclusive
  // */
  getRandomInt(min: number, max: number): number {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }
}
