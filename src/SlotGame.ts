import * as PIXI from 'pixi.js';
import UI from 'UI';

import './assets/duck.png';
import './assets/kirin.png';
import './assets/tanuki.png';
import './assets/usagi.png';

export default class SlotGame {
    static readonly STAGE_WIDTH = 800;
    static readonly STAGE_HEIGHT = 640;
    static readonly resources = [
        { name: 'duck', url: './assets/duck.png' },
        { name: 'kirin', url: './assets/kirin.png' },
        { name: 'tanuki', url: './assets/tanuki.png' },
        { name: 'usagi', url: './assets/usagi.png' },
    ];
    #app: PIXI.Application;
    #ui!: UI;
    constructor() {
        this.#app = new PIXI.Application({
            backgroundColor: 0x1099bb,
            width: SlotGame.STAGE_WIDTH,
            height: SlotGame.STAGE_HEIGHT,
            resolution: window.devicePixelRatio || 1,
        });
        // Retinaディスプレイ対応
        this.#app.view.style.width = `${SlotGame.STAGE_WIDTH}px`;
        this.#app.view.style.height = `${SlotGame.STAGE_HEIGHT}px`;
        document.body.appendChild(this.#app.view);
        // リソース(image)の読み込み
        for (const resource of SlotGame.resources) {
            this.#app.loader.add(resource.name, resource.url);
        }
        // リソース読み込みが完了したらui構築
        this.#app.loader.load(() => {
            this.#ui = new UI();
            this.start();
        });
    }
    start(): void {
        if (!this.#ui) return;
        // ui構築完了後にステージに追加してメインループstart
        this.#app.stage.addChild(this.#ui);
        this.#app.ticker.add(() => {
            this.#ui.update();
        });
    }
}
