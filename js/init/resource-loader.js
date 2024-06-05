const ASSETS_IMAGE_PATH = "../../assets/image";
const ASSETS_TILED_PATH = "../../assets/tiled";
const MAP_JSON_PATH = `${ASSETS_TILED_PATH}/sence2.json`
const PLAYER_IMAGE_PATH = `${ASSETS_IMAGE_PATH}/Player.png`;
const PLAYER_JSON_PATH = `${ASSETS_TILED_PATH}/Player.json`;
const UI_IMAGE_PATH = `${ASSETS_IMAGE_PATH}/UI.png`;
const UI_JSON_PATH = `${ASSETS_TILED_PATH}/UI.json`;
const TILES_IMAGE_PATH = `${ASSETS_IMAGE_PATH}/Tiles.png`;
const TILES_JSON_PATH = `${ASSETS_TILED_PATH}/Tiles.json`;

export class ResourceLoader {
  async init() {
    return {
      sence: await this.loadSence(),
      tiles: await this.loadTiles(),
      player: await this.loadPlayer(),
      ui: await this.loadUI(),
    };
  }
  async loadSence() {
    return await this.#loadJSON(MAP_JSON_PATH);
  }

  async loadTiles() {
    const tilesImage = await this.#loadImage(TILES_IMAGE_PATH);
    const tilesJson = await this.#loadJSON(TILES_JSON_PATH);
    return {
      image: tilesImage,
      json: tilesJson,
    };
  }

  async loadPlayer() {
    const playerImage = await this.#loadImage(PLAYER_IMAGE_PATH);
    const playerJson = await this.#loadJSON(PLAYER_JSON_PATH);
    return {
      image: playerImage,
      json: playerJson,
    };
  }

  async loadUI() {
    const ui = await this.#loadImage(UI_IMAGE_PATH);
    const uiJson = await this.#loadJSON(UI_JSON_PATH);
    return {
      image: ui,
      json: uiJson,
    };
  }


  // 加载JSON地图文件
  async #loadJSON(url) {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed to load JSON: ${response.statusText}`);
    }
    return await response.json();
  }
  // 加载图像
  async #loadImage(url) {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = () => reject(new Error(`Failed to load image: ${url}`));
      img.src = url;
    });
  }


}