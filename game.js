import { Background } from "./js/sprites/background.js";
import { Hero } from "./js/sprites/hero.js";
import { Platform } from "./js/sprites/platform.js";
import { PhysicsComponent } from "./js/components/physics.js";

export class Game {

  constructor(background, platform, grass, goods, hero) {
    //标注类型以便提示
    /** @type {HTMLCanvasElement} */
    this.gameCanvas = document.getElementById("game");
    /** @type {CanvasRenderingContext2D} */
    this.ctx = this.gameCanvas.getContext("2d");


    this.background = new Background(this.ctx, this.gameCanvas.width, this.gameCanvas.height, background, grass);
    this.platform = new Platform(this.ctx, this.gameCanvas.width, this.gameCanvas.height, platform);
    this.hero = new Hero(this.ctx, this.gameCanvas.width, this.gameCanvas.height, hero);

    this.physics = new PhysicsComponent(this.gameCanvas.width, this.gameCanvas.height);

    this.#initPhysicsObject();

    this.#registerEvent();
  }

  run() {
    this.#update();
    this.#draw();
  }

  #update() {
    this.physics.update()
  }

  #draw() {
    this.ctx.clearRect(0, 0, this.gameCanvas.width, this.gameCanvas.height);

    this.#drawBackground();
    this.#drawPlatform();
    this.#drawHero();
  }

  #drawBackground() {
    this.background.update();
    this.background.draw();
  }

  #drawPlatform() {
    this.platform.update();
    this.platform.draw();
  }

  #drawHero() {
    this.hero.update();
    this.hero.draw();
  }

  #initPhysicsObject() {
    this.physics.addEntity(this.hero);
    this.physics.addEntity(this.platform);
  }

  #registerEvent() {
    document.addEventListener("keydown", (e) => {
      switch (e.code) {
        case "KeyA":
          this.hero.move("left");
          break;
        case "KeyD":
          this.hero.move("right");
          break;
        case "KeyW":
          this.hero.jump();
          break;
      }
    });

    document.addEventListener("keyup", (e) => {
      switch (e.code) {
        case "KeyA":
        case "KeyD":
          this.hero.move("stop");
          break;
      }
    });
  }

}