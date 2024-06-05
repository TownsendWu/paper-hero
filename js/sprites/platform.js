export class Platform {
    constructor(ctx, canvasWidth, canvasHeight, platform) {
        /**@type {CanvasRenderingContext2D} */
        this.ctx = ctx;
        this.canvasWidth = canvasWidth;
        this.canvasHeight = canvasHeight;

        this.frame = platform.frame;
        this.rectangles = platform.rectangles;

        this.physicsType = "platform";
    }

    update() {

    }

    draw() {
        this.ctx.drawImage(this.frame, 0, 0, this.canvasWidth, this.canvasHeight);
    }
}