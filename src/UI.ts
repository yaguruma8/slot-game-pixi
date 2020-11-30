import * as PIXI from 'pixi.js';
import SlotGame from 'SlotGame';
import Reel from 'Reel';

type ContainerSize = {
    x: number;
    y: number;
    width: number;
    height: number;
};

type smallContainerSize = Pick<ContainerSize, 'x' | 'y'>;

export default class UI extends PIXI.Container {
    #reelContainer: PIXI.Container;
    constructor() {
        super();
        const margin = (SlotGame.height - Reel.SYMBOL_SIZE * 3) / 2;
        // Reelコンテナ
        this.#reelContainer = this.createReelContainer({
            x: Math.round((SlotGame.width - Reel.WIDTH * 5) / 2),
            y: margin,
        });
        // 上下の帯
        const coverTop = this.createTextContainer('PIXI SLOTS!', {
            x: 0,
            y: 0,
            width: SlotGame.width,
            height: margin,
        });
        const coverBottom = this.createTextContainer('Spin the Wheels!', {
            x: 0,
            y: SlotGame.height - margin,
            width: SlotGame.width,
            height: margin,
        });
        // UIコンテナにpush
        this.addChild(this.#reelContainer);
        this.addChild(coverTop);
        this.addChild(coverBottom);

        // 下のテキストをボタンにする
        const button = coverBottom.getChildByName('text');
        button.interactive = true;
        button.buttonMode = true;
        button.addListener('pointerdown', () => {
            this.startPlay();
        });
    }

    private createReelContainer(size: smallContainerSize): PIXI.Container {
        const container = new PIXI.Container();
        container.x = size.x;
        container.y = size.y;
        for (let i = 0; i < 5; i++) {
            const reel = new Reel();
            reel.x = i * Reel.WIDTH;
            container.addChild(reel);
        }
        return container;
    }

    private createTextContainer(
        text: string,
        size: ContainerSize
    ): PIXI.Container {
        const container = new PIXI.Container();
        container.x = size.x;
        container.y = size.y;
        const backgroundGraphic = new PIXI.Graphics();
        backgroundGraphic.beginFill(0x000000, 1);
        backgroundGraphic.drawRect(0, 0, size.width, size.height);
        backgroundGraphic.endFill();
        container.addChild(backgroundGraphic);
        // テキスト
        const style = new PIXI.TextStyle({
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
        });
        const textContainer = new PIXI.Text(text, style);
        textContainer.x = Math.round((size.width - textContainer.width) / 2);
        textContainer.y = Math.round((size.height - textContainer.height) / 2);
        textContainer.name = 'text';
        container.addChild(textContainer);
        return container;
    }

    private startPlay(): void {
        console.log('button push!');
    }
    update(): void {
        console.log('UI class: update method');
        const reels = this.#reelContainer.children as Reel[];
        for (const reel of reels) {
            if (!reel.update) continue;
            reel.update();
        }
    }
}
