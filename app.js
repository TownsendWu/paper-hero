import { Game } from './game.js';
import { ResourceLoader } from './js/init/resource-loader.js';
import { ResourceInit } from './js/init/resource-init.js';

class App {
    constructor() {
        //控制帧数
        this.fps = 60;
        this.interval = 1000 / this.fps;
        this.lastTime = 0;

        //标注类型以便提示
        /** @type {HTMLCanvasElement} */
        this.gameCanvas = document.getElementById('game');
        /** @type {CanvasRenderingContext2D} */
        this.ctx = this.gameCanvas.getContext('2d');
        //缩放倍数
        this.scale = 3;
        //资源加载器
        this.resourceLoader = new ResourceLoader();

        this.game = null;
    }

    async init() {
        const { sence, tiles, player, ui } = await this.resourceLoader.init();

        const resourceInit = new ResourceInit(sence, tiles, player, ui, this.scale);

        const background = resourceInit.initBackground();
        const platform = resourceInit.initPlatform();
        const grass = resourceInit.initGrass();
        const goods = resourceInit.initGoods();
        const hero = resourceInit.initPlayer();

        return {
            background,
            platform,
            grass,
            goods,
            hero
        };
    }

    async start() {
        const { background, platform, grass, goods, hero } = await this.init();
        this.game = new Game(background, platform, grass, goods, hero);
        this.loop()
    }



    /**
 * 游戏主循环
 */
    loop(timeStamp) {
        const deltaTime = timeStamp - this.lastTime;
        if (deltaTime > this.interval) {
            this.lastTime = timeStamp - (deltaTime % this.interval);
            this.game.run();
        }
        this.#render();
    }



    #render() {
        window.requestAnimationFrame(this.loop.bind(this));
    }
}

const app = new App();
app.start()
    .then(() => {
        console.log('游戏启动成功');
    }).catch((err) => {
        console.error('游戏启动失败', err);
    });