import * as PIXI from 'pixi.js';
import SlotGame from 'SlotGame';

export default class Reel extends PIXI.Container {
    static readonly REEL_WIDTH = 160;
    static readonly SYMBOL_SIZE = 150;
    static slotTextures: PIXI.Texture[] = [];

    #symbols: PIXI.Sprite[] = [];
    #position = 0;
    #previosPosition = 0;
    constructor() {
        super();
        // シンボルを並べる
        const symbolNum = 4;
        for (let i = 0; i < symbolNum; i++) {
            const symbol = this.buildSymbol();
            symbol.y = i * Reel.SYMBOL_SIZE;
            this.#symbols.push(symbol);
            this.addChild(symbol);
        }
    }

    private buildSymbol(): PIXI.Sprite {
        const symbol = new PIXI.Sprite(this.getRandomTexture());
        // テクスチャのスケールをシンボルに合わせる
        symbol.scale.x = symbol.scale.y = Math.min(
            Reel.SYMBOL_SIZE / symbol.width,
            Reel.SYMBOL_SIZE / symbol.height
        );
        symbol.x = Math.round((Reel.SYMBOL_SIZE - symbol.width) / 2);
        return symbol;
    }

    private getRandomTexture(): PIXI.Texture {
        if (Reel.slotTextures.length === 0) {
            for (const resource of SlotGame.resources) {
                Reel.slotTextures.push(PIXI.Texture.from(resource));
            }
        }
        return Reel.slotTextures[
            Math.floor(Math.random() * Reel.slotTextures.length)
        ];
    }
}

/*
// Reelの組み立て（reelx5の配列を返す）
function buildReels(reelContainer, slotTextures) {
    const reels = [];
    const containerNum = 5; // コンテナを5個作る
    const symbolNum = 4; // 一つのコンテナにつきシンボル4つ
    // リールのコンテナを作成
    for (let i = 0; i < containerNum; i++) {
        const reel = new PIXI.Container();
        reel.x = i * REEL_WIDTH;
        reelContainer.addChild(reel);

        const reelObj = {
            container: reel,
            symbols: [],
            position: 0,
            previousPosition: 0,
            blur: new PIXI.filters.BlurFilter(),
        };
        reelObj.blur.blurX = 0;
        reelObj.blur.blurY = 0;
        reel.filters = [reelObj.blur];

        // シンボルを作成
        for (let j = 0; j < symbolNum; j++) {
            const symbol = buildSymbol(slotTextures);
            symbol.x = Math.round((SYMBOL_SIZE - symbol.width) / 2);
            symbol.y = j * SYMBOL_SIZE;
            reelObj.symbols.push(symbol);
            reel.addChild(symbol);
        }
        reels.push(reel);
    }
    app.stage.addChild(reelContainer);
    return reels;
}

function buildSymbol(slotTextures) {
    const symbol = new PIXI.Sprite(
        slotTextures[Math.floor(Math.random() * slotTextures.length)]
    );
    // テクスチャのサイズをSYMBOL_SIZEに合わせる（スケールする）
    symbol.scale.x = symbol.scale.y = Math.min(
        SYMBOL_SIZE / symbol.width,
        SYMBOL_SIZE / symbol.height
    );

    return symbol;
}

*/
