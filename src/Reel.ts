import * as PIXI from 'pixi.js';
import SlotGame from 'SlotGame';

export default class Reel extends PIXI.Container {
    static readonly WIDTH = 160;
    static readonly SYMBOL_SIZE = 150;

    private get randomTexture(): PIXI.Texture {
        if (!Reel.slotTextures.length) {
            for (const resource of SlotGame.resources) {
                Reel.slotTextures.push(PIXI.Texture.from(resource.name));
            }
        }
        return Reel.slotTextures[
            Math.floor(Math.random() * Reel.slotTextures.length)
        ];
    }
    private static slotTextures: PIXI.Texture[] = [];

    blur: PIXI.filters.BlurFilter = new PIXI.filters.BlurFilter();
    pos = 0;
    prevPos = 0;

    constructor() {
        super();
        // リールが動くときのフィルターの設定
        this.blur.blurX = 0;
        this.blur.blurY = 0;
        this.filters = [this.blur];
        // スプライト生成
        for (let i = 0; i < 4; i++) {
            const symbol = new PIXI.Sprite();
            symbol.name = `symbol${i}`;
            // symbol.y = Reel.SYMBOL_SIZE * i;
            this.updateSymbol(symbol);
            this.addChild(symbol);
        }
    }

    update(): void {
        this.blur.blurY = (this.pos - this.prevPos) * 8;
        this.prevPos = this.pos;

        for (let i = 0; i < this.children.length; i++) {
            const symbol = this.children[i] as PIXI.Sprite;
            if (!symbol.texture) {
                continue;
            }

            const prevY = symbol.y;
            symbol.y =
                ((this.pos + i) % this.children.length) * Reel.SYMBOL_SIZE -
                Reel.SYMBOL_SIZE;

            if (prevY <= Reel.SYMBOL_SIZE) {
                continue;
            }

            if (symbol.y >= 0) {
                continue;
            }

            this.updateSymbol(symbol);
        }
    }

    private updateSymbol(symbol: PIXI.Sprite): void {
        symbol.texture = this.randomTexture;
        symbol.scale.x = symbol.scale.y = Math.min(
            Reel.SYMBOL_SIZE / symbol.width,
            Reel.SYMBOL_SIZE / symbol.height
        );

        symbol.x = Math.round((Reel.SYMBOL_SIZE - symbol.width) / 2);
    }
}
