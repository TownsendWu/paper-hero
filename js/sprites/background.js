export class Background {
    constructor(ctx, canvasWidth, canvasHeight, background, grass) {
        /**@type {CanvasRenderingContext2D} */
        this.ctx = ctx;
        this.canvasWidth = canvasWidth;
        this.canvasHeight = canvasHeight;

        this.background = background;
        this.grass = grass;

        this.backgroundCanvas = this.#createBackgroundCanvas();
    }

    update() {

    }

    draw() {
        this.ctx.drawImage(this.backgroundCanvas, 0, 0, this.canvasWidth, this.canvasHeight);
    }

    #createBackgroundCanvas() {
        const backgroundCanvas = document.createElement("canvas");
        backgroundCanvas.width = this.canvasWidth;
        backgroundCanvas.height = this.canvasHeight;
        const backgroundCtx = backgroundCanvas.getContext("2d");
        backgroundCtx.drawImage(this.background, 0, 0, this.canvasWidth, this.canvasHeight);
        backgroundCtx.drawImage(this.grass, 0, 0, this.canvasWidth, this.canvasHeight);

        return backgroundCanvas;
    }
}