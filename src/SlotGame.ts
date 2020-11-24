import * as PIXI from 'pixi.js';
import UI from 'UI';

import './assets/duck.png';
import './assets/kirin.png';
import './assets/tanuki.png';
import './assets/usagi.png';

export default class SlotGame {
    // 読み取り専用
    static readonly width: number = 800;
    static readonly height: number = 400;
    static readonly resources: { name: string; url: string }[] = [
        { name: 'duck', url: './assets/duck.png' },
        { name: 'kirin', url: './assets/kirin.png' },
        { name: 'tanuki', url: './assets/tanuki.png' },
        { name: 'usagi', url: './assets/usagi.png' },
    ];

    #backgroundColor = 0x1099bb;
    #resolution: number = window.devicePixelRatio || 1;

    // eslint-disable-next-line @typescript-eslint/no-empty-function
    #onReady: () => void = () => {};

    #app!: PIXI.Application;
    #ui!: UI;

    constructor() {
        // ※document.body読み込み前ならエラーを投げる
        if (!document.body) {
            throw new Error('window is not ready.');
        }
        // (1) PIXI.Applicationインスタンスを作成
        this.#app = new PIXI.Application({
            width: SlotGame.width,
            height: SlotGame.height,
            backgroundColor: this.#backgroundColor,
            resolution: this.#resolution,
        });
        // (2) htmlにCanvas要素を追加
        this.#app.view.style.width = `${SlotGame.width}px`;
        this.#app.view.style.height = `${SlotGame.height}px`;
        document.body.appendChild(this.#app.view);
        this.init();
    }

    private init(): void {
        // (3) リソースの読み込み
        for (const resource of SlotGame.resources) {
            this.#app.loader.add(resource.name, resource.url);
        }
        this.#app.loader.load(() => {
            // (4) 読み込みが完了したらUI構築
            this.#ui = new UI();
            // (5) ui構築終了後、run
            this.#onReady();
        });
    }
    run(): void {
        // ※ UI構築が終わってなければinitの方でrunを再度走らせる
        if (!this.#ui) {
            this.#onReady = () => this.run();
            return;
        }
        // (6) 構築済みのUIをstageにpush
        this.#app.stage.addChild(this.#ui);
        // (7) app start
        this.#app.ticker.add(() => {
            this.#ui.update();
        });
    }
}

/*
PIXI.Application
DOMにapp追加
リソースをadd
リソースをaddし終わったらUI構築
初期化完了通知
*/
