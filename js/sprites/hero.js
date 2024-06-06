export class Hero {
    constructor(ctx, canvasWidth, canvasHeight, hero, ui) {
        /**@type {CanvasRenderingContext2D} */
        this.ctx = ctx;
        this.canvasWidth = canvasWidth;
        this.canvasHeight = canvasHeight;
        this.ui = ui;
        this.animations = hero.animations;
        this.position = hero.position;

        this.physicsType = "object";
        this.width = 24;
        this.height = 24;
        //速度
        this.velocityX = 0;
        this.velocityY = 0;
        this.speed = 2;
        this.jumpForce = 4;

        this.jumpCount = 0;
        this.maxJumpCount = 2;


        this.currentAnimation = this.animations["rightIdleAnimation"];
        this.currentFrame = 0;
        this.currentDuration = 0;
        this.currentDirection = "right";

        this.lastTime = performance.now();
    }

    update() {
        this.position.x += this.velocityX;
    }

    draw() {
        this.#animate();
    }

    #animate() {
        const now = performance.now();
        const deltaTime = now - this.lastTime;
        const { frame, duration } = this.currentAnimation[this.currentFrame];
        // 更新当前帧的持续时间
        this.ctx.drawImage(frame, this.position.x, this.position.y);

        this.currentDuration += deltaTime;

        // 如果当前帧的持续时间已经超过了帧的 duration，那么切换到下一个帧
        if (this.currentDuration >= duration) {
            this.currentFrame = (this.currentFrame + 1) % this.currentAnimation.length;
            this.currentDuration = 0;
        }
        this.lastTime = now;
    }

    move(direction) {
        switch (direction) {
            case "left":
                this.velocityX = -this.speed;
                this.currentAnimation = this.animations["leftRunAnimation"];
                this.currentDirection = "left";
                break;
            case "right":
                this.velocityX = this.speed;
                this.currentAnimation = this.animations["rightRunAnimation"];
                this.currentDirection = "right";
                break;
            default:
                this.velocityX = 0;
                if (this.currentDirection === "left") {
                    this.currentAnimation = this.animations["leftIdleAnimation"];
                } else {
                    this.currentAnimation = this.animations["rightIdleAnimation"];
                }

                this.currentFrame = 0;
        }
    }

    jump() {
        this.velocityY = -this.jumpForce;
    }
}