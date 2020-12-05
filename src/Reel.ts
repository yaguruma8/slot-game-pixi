import * as PIXI from 'pixi.js';
import SlotGame from 'SlotGame';

export default class Reel extends PIXI.Container {
    static readonly REEL_WIDTH = 160;
    static readonly SYMBOL_SIZE = 150;
    static slotTextures: PIXI.Texture[] = [];

    pos = 0;
    prevPos = 0;
    constructor() {
        super();
        // シンボルを並べる
        const symbolNum = 4;
        for (let i = 0; i < symbolNum; i++) {
            const symbol = this.buildSymbol();
            symbol.y = i * Reel.SYMBOL_SIZE;
            this.addChild(symbol);
        }
    }

    update(): void {
        this.prevPos = this.pos;
        for (let i = 0; i < this.children.length; i++) {
            const symbol = this.children[i] as Reel;
            const prevY = symbol.y;
            symbol.y =
                ((this.pos + i) % this.children.length) * Reel.SYMBOL_SIZE -
                Reel.SYMBOL_SIZE;
            if (symbol.y < 0 && prevY > Reel.SYMBOL_SIZE) {
                const newSymbol = this.buildSymbol();
                newSymbol.y = symbol.y;
                this.children.splice(i, 1, newSymbol);
            }
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
