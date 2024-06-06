export class Platform {
    constructor(ctx, canvasWidth, canvasHeight, platform) {
        /**@type {CanvasRenderingContext2D} */
        this.ctx = ctx;
        this.canvasWidth = canvasWidth;
        this.canvasHeight = canvasHeight;

        this.frame = platform.frame;
        this.rectangles = platform.rectangles;
        console.log(this.rectangles)

        this.physicsType = "platform";
    }

    update() {

    }

    draw() {
        this.ctx.drawImage(this.frame, 0, 0, this.canvasWidth, this.canvasHeight);
        //绘制矩形，以便观察
        for (let i = 0; i < this.rectangles.length; i++) {
            const rectangle = this.rectangles[i];
            this.ctx.strokeRect(rectangle.x, rectangle.y, rectangle.width, rectangle.height);
        }
    }
}