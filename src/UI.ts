import * as PIXI from 'pixi.js';
import SlotGame from 'SlotGame';
import Reel from 'Reel';
import Tween from 'Tween';

type position = {
    x: number;
    y: number;
    width: number;
    height: number;
};

export default class UI extends PIXI.Container {
    #uiPos = this.setUIPosParameter();
    #textStyle = new PIXI.TextStyle(this.setTextStyleOption());
    #reelContainer: PIXI.Container;

    running = false;
    constructor() {
        super();
        this.#reelContainer = this.buildReelContainer(this.#uiPos.body);

        const coverTop = this.createCoverGraphics(
            'PIXI SLOT!',
            this.#uiPos.top
        );
        const coverBottom = this.createCoverGraphics(
            'Push Start',
            this.#uiPos.bottom
        );
        coverBottom.interactive = true;
        coverBottom.buttonMode = true;
        coverBottom.addListener('pointerdown', () => {
            console.log('coverBottom button down.');
            this.startPlay();
        });

        this.addChild(this.#reelContainer);
        this.addChild(coverTop);
        this.addChild(coverBottom);
    }
    startPlay(): void {
        if (this.running) return;

        this.running = true;
        const reels = this.#reelContainer.children;
        for (let i = 0; i < reels.length; i++) {
            const reel = this.#reelContainer.children[i] as Reel;
            const extra = Math.floor(Math.random() * 5);
            const target = reel.pos + 10 + i * 5 + extra;
            const time = 2500 + i * 600 + extra * 600;
            const tween = new Tween({
                object: reel,
                property: 'pos',
                target: target,
                time: time,
                easing: Tween.backout(0.5),
                change: null,
                complete: i === reels.length - 1 ? this.reelsComplete() : null,
            });
            Tween.tweening.push(tween);
        }
    }

    update(): void {
        for (const reel of this.#reelContainer.children as Reel[]) {
            reel.update();
        }
        Tween.update();
    }

    reelsComplete(): () => void {
        return () => {
            this.running = false;
            // todo: スロットが回り終えた時のsymbolの位置関係を調べる
            // 中央の
            // スロットがそろってるかどうかのチェックを実装したい
            console.log('reelsComplete');
            for (const reel of this.#reelContainer.children as Reel[]) {
                // posが小数点数になる時があるので四捨五入で整数に調整
                const p = Math.round(reel.pos);
                // p=0->2 p=1->1 p=2->0 p=3->3
                const symbol = reel.children[(6 - (p % 4)) % 4] as PIXI.Sprite;
                console.log(symbol.texture.textureCacheIds[0]);
            }
        };
    }

    private createCoverGraphics(str: string, pos: position): PIXI.Graphics {
        const cover = new PIXI.Graphics();
        cover.beginFill(0, 1);
        cover.drawRect(pos.x, pos.y, pos.width, pos.height);
        cover.endFill();
        const strContainer = new PIXI.Text(str, this.#textStyle);
        strContainer.x = Math.round((pos.width - strContainer.width) / 2);
        strContainer.y =
            pos.y + Math.round((pos.height - strContainer.height) / 2);
        cover.addChild(strContainer);
        return cover;
    }

    private buildReelContainer(pos: position): PIXI.Container {
        const reelContainer = new PIXI.Container();
        reelContainer.x = pos.x;
        reelContainer.y = pos.y;
        const reelNum = 5;
        for (let i = 0; i < reelNum; i++) {
            const reel = new Reel();
            reel.x = i * Reel.REEL_WIDTH;
            reel.name = `reel${i}`;
            reelContainer.addChild(reel);
        }

        return reelContainer;
    }

    private setUIPosParameter() {
        const margin = (SlotGame.STAGE_HEIGHT - Reel.SYMBOL_SIZE * 3) / 2;
        return {
            top: {
                x: 0,
                y: 0,
                width: SlotGame.STAGE_WIDTH,
                height: margin,
            },
            body: {
                x: Math.round((SlotGame.STAGE_WIDTH - Reel.REEL_WIDTH * 5) / 2),
                y: margin,
                width: Reel.REEL_WIDTH * 5,
                height: Reel.SYMBOL_SIZE * 3,
            },
            bottom: {
                x: 0,
                y: SlotGame.STAGE_HEIGHT - margin,
                width: SlotGame.STAGE_WIDTH,
                height: margin,
            },
        };
    }

    private setTextStyleOption() {
        return {
            fontFamily: 'Arial',
            fontSize: 36,
            fontStyle: 'italic',
            fontWeight: 'bold',
            fill: ['#ffffff', '#00ff99'], // gradient
            stroke: '#4a1850',
            strokeThickness: 5,
            dropShadow: true,
            dropShadowColor: '#000000',
            dropShadowBlur: 4,
            dropShadowAngle: Math.PI / 6,
            dropShadowDistance: 6,
            wordWrap: true,
            wordWrapWidth: 440,
        };
    }
}
