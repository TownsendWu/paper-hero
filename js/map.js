export class Map {
    constructor(ctx, canvasWidth, canvasHeight, map, tilesetImg) {
        /**
         * @type {CanvasRenderingContext2D}
         */
        this.ctx = ctx;
        this.canvasWidth = canvasWidth;
        this.canvasHeight = canvasHeight;

        this.map = map;
        this.tilesetImg = tilesetImg;
    }

    
}