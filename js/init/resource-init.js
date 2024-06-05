export class ResourceInit {
    constructor(sence, tiles, player, ui, scale = 1) {
        this.sence = sence;
        this.tiles = tiles;
        this.player = player;
        this.ui = ui;
        this.scale = scale;
    }

    initBackground() {
        const backgroundInit = new BackgroundInit(this.sence, this.tiles, this.player, this.ui, this.scale);
        return backgroundInit.create();
    }

    initPlatform() {
        const platformInit = new PlatformInit(this.sence, this.tiles, this.player, this.ui, this.scale);

        return {
            frame: platformInit.create(),
            rectangles: platformInit.rectangles()
        };
    }

    initGrass() {
        const grassInit = new GrassInit(this.sence, this.tiles, this.player, this.ui, this.scale);
        return grassInit.create();
    }

    initGoods() {
        const goodsInit = new GoodsInit(this.sence, this.tiles, this.player, this.ui, this.scale);
        return goodsInit.create();
    }

    initPlayer() {
        const playerInit = new PlayerInit(this.sence, this.player, this.scale);
        return playerInit.create();
    }



}




class Init {
    constructor(sence, tiles, player, ui, scale = 1) {
        this.sence = sence;

        this.tilesImage = tiles.image;
        this.tilesJson = tiles.json;

        this.playerImage = player.image;
        this.playerJson = player.json;

        this.uiImage = ui.image;
        this.uiJson = ui.json;

        this.scale = scale;
    }

    create() {
        const initCanvas = document.createElement('canvas');
        initCanvas.width = this.sence.width * this.sence.tilewidth;
        initCanvas.height = this.sence.height * this.sence.tileheight;
        const layers = this.sence.layers;

        const ctx = initCanvas.getContext('2d');

        ctx.imageSmoothingEnabled = false;

        for (let i = this.layerStartIndex; i <= this.layerEndIndex; i++) {
            const data = layers[i].data;
            this.draw(ctx, data)
        }

        if (this.scale === 1) {
            return initCanvas;
        }

        const scaleCanvas = document.createElement('canvas');
        scaleCanvas.width = initCanvas.width * this.scale;
        scaleCanvas.height = initCanvas.height * this.scale;
        const scaleCtx = scaleCanvas.getContext('2d');
        scaleCtx.imageSmoothingEnabled = false;
        scaleCtx.drawImage(initCanvas, 0, 0, initCanvas.width, initCanvas.height, 0, 0, scaleCanvas.width, scaleCanvas.height);

        return scaleCanvas;

    }


    draw(ctx, data) {

        for (let i = 0; i < this.sence.width; i++) {
            for (let j = 0; j < this.sence.height; j++) {
                const tileIndex = i + j * this.sence.width; // 修正索引计算
                const tileId = data[tileIndex];
                if (tileId <= 0) {
                    continue;
                }
                const info = this.getInfo(tileId);

                if (!info) {
                    continue;
                }


                const { columns, image, tilewidth, tileheight, newTileId } = info;


                const tile = this.getTile(newTileId, columns, tilewidth, tileheight);

                ctx.drawImage(
                    image,
                    tile.x,
                    tile.y,
                    tile.width,
                    tile.height,
                    i * tilewidth,
                    j * tileheight,
                    tilewidth,
                    tileheight
                );

            }
        }

    }

    getInfo(tileId) {
        if (tileId > 0 && tileId < 1477) {
            return {
                columns: this.tilesJson.columns,
                image: this.tilesImage,
                tilewidth: this.tilesJson.tilewidth,
                tileheight: this.tilesJson.tileheight,
                newTileId: tileId - 1,
            }
        }

        if (tileId >= 1477 && tileId < 1749) {
            return {
                columns: this.uiJson.columns,
                image: this.uiImage,
                tilewidth: this.uiJson.tilewidth,
                tileheight: this.uiJson.tileheight,
                newTileId: tileId - 1477,
            };
        }

        if (tileId >= 1749 && tileId < 1970) {
            return {
                columns: this.playerJson.columns,
                image: this.playerImage,
                tilewidth: this.playerJson.tilewidth,
                tileheight: this.playerJson.tileheight,
                newTileId: tileId - 1749,
            }
        }

        return null;
    }

    getTile(tileId, columns, tilewidth, tileheight) {
        const x = ((tileId) % columns) * tilewidth; // 修正索引从0开始
        const y = Math.floor((tileId) / columns) * tileheight; // 修正索引从0开始
        return { x, y, width: tilewidth, height: tileheight };
    }
}


class BackgroundInit extends Init {
    constructor(sence, tiles, player, ui, scale) {
        super(sence, tiles, player, ui, scale);
        this.layerStartIndex = 0;
        this.layerEndIndex = 2;
    }

}

class PlatformInit extends Init {
    constructor(sence, tiles, player, ui, scale) {
        super(sence, tiles, player, ui, scale);
        this.layerStartIndex = 3;
        this.layerEndIndex = 3;
        this.boundaryIndex = 8;
    }
    rectangles() {
        const rectangles = [];

        const polygonInfo = this.sence.layers[this.boundaryIndex];
        if (!polygonInfo || polygonInfo.type !== "objectgroup") {
            return [];
        }
        const objects = polygonInfo.objects;
        for (const object of objects) {
            const { x, y, width, height } = object;
            rectangles.push({
                x: x * this.scale,
                y: y * this.scale,
                width: width * this.scale,
                height: height * this.scale,
            });

        }

        return rectangles;
    }

}

class GoodsInit extends Init {
    constructor(sence, tiles, player, ui, scale) {
        super(sence, tiles, player, ui, scale);

        this.uiImage = ui.image;
        this.uiJson = ui.json;

        this.layerStartIndex = 4;
        this.layerEndIndex = 4;


    }

}

class GrassInit extends Init {
    constructor(sence, tiles, player, ui, scale) {
        super(sence, tiles, player, ui, scale);

        this.layerStartIndex = 5;
        this.layerEndIndex = 5;
    }
}

class PlayerInit {
    constructor(sence, player, scale = 1) {
        this.sence = sence;

        this.playerImage = player.image;
        this.playerJson = player.json;

        this.layerIndex = 7;

        this.scale = scale;

        this.rightRunAnimation = [];
        this.leftRunAnimation = [];
        this.rightIdleAnimation = [];
        this.leftIdleAnimation = [];
        this.rightJumpAnimation = [];
        this.leftJumpAnimation = [];
        this.rightHitAnimation = [];
        this.leftHitAnimation = [];
    }

    create() {
        const tiles = this.playerJson.tiles
        if (!tiles) {
            return null
        }
        //如果有动画，就用动画的贴图
        const position = this.getPosition()
        for (const item of tiles) {
            const { id, animation } = item;
            if (!animation) {
                continue
            }
            const anmations = this.processAnimation(animation);
            this.initAnimation(id, anmations);
        }

        return {
            animations: {
                rightRunAnimation: this.rightRunAnimation,
                leftRunAnimation: this.leftRunAnimation,
                rightIdleAnimation: this.rightIdleAnimation,
                leftIdleAnimation: this.leftIdleAnimation,
                rightJumpAnimation: this.rightJumpAnimation,
                leftJumpAnimation: this.leftJumpAnimation,
                rightHitAnimation: this.rightHitAnimation,
                leftHitAnimation: this.leftHitAnimation,
            },
            position: position,
        }

    }


    initAnimation(id, anmations) {
        switch (id) {
            case 52:
                this.rightRunAnimation = anmations;
                break;
            case 65:
                this.leftRunAnimation = anmations;
                break;
            case 91:
                this.rightIdleAnimation = anmations;
                break;
            case 104:
                this.leftIdleAnimation = anmations;
                break;
            case 130:
                this.rightJumpAnimation = anmations;
                break;
            case 143:
                this.leftJumpAnimation = anmations;
                break;
            case 169:
                this.rightHitAnimation = anmations;
                break;
            case 182:
                this.leftHitAnimation = anmations;
                break;
        }
    }

    processAnimation(anmation) {
        const anmations = [];
        for (const item of anmation) {
            const { tileid, duration } = item;
            if (tileid < 0) {
                continue;
            }

            const tile = this.getTile(tileid, this.playerJson.columns, this.playerJson.tilewidth, this.playerJson.tileheight);

            const playerCanvas = document.createElement("canvas");
            playerCanvas.width = this.playerJson.tilewidth * this.scale;
            playerCanvas.height = this.playerJson.tileheight * this.scale;
            const ctx = playerCanvas.getContext("2d");
            ctx.imageSmoothingEnabled = false;
            ctx.drawImage(this.playerImage, tile.x, tile.y, tile.width, tile.width, 0, 0, playerCanvas.width, playerCanvas.height);

            anmations.push(
                {
                    frame: playerCanvas,
                    duration
                }
            );
        }
        return anmations;
    }

    getPosition() {
        const layers = this.sence.layers;
        const data = layers[this.layerIndex].data;
        if (!data) {
            return null
        }
        for (let i = 0; i < this.sence.width; i++) {
            for (let j = 0; j < this.sence.height; j++) {
                const tileIndex = i + j * this.sence.width;
                const tileId = data[tileIndex];
                if (tileId <= 0) {
                    continue;
                }
                return {
                    x: i * this.sence.tilewidth * this.scale,
                    y: j * this.sence.tileheight * this.scale,
                    width: this.sence.tilewidth * this.scale,
                    height: this.sence.tileheight * this.scale,
                }

            }
        }

    }

    getNewTiledId(tileId) {
        if (tileId >= 1749 && tileId < 1970) {
            return tileId - 1749;
        }

        return -1;
    }

    getTile(tileId, columns, tilewidth, tileheight) {
        const x = ((tileId) % columns) * tilewidth; // 修正索引从0开始
        const y = Math.floor((tileId) / columns) * tileheight; // 修正索引从0开始
        return { x, y, width: tilewidth, height: tileheight };
    }
}
