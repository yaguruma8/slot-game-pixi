// PIXI.js公式Example DEMOS-ADVANCED slot
// OOP前の元ファイル
// 参考用

import * as PIXI from 'pixi.js';

import './assets/duck.png';
import './assets/kirin.png';
import './assets/tanuki.png';
import './assets/usagi.png';

const app = new PIXI.Application({ backgroundColor: 0x1099bb });
document.body.appendChild(app.view);
app.loader
    .add('duck', './assets/duck.png')
    .add('kirin', './assets/kirin.png')
    .add('tanuki', './assets/tanuki.png')
    .add('usagi', './assets/usagi.png')
    .load(onAssetsLoaded);

const REEL_WIDTH = 160;
const SYMBOL_SIZE = 150;

let running = false;

// テキストのスタイル
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

// Reels done handler.
function reelsComplete() {
    running = false;
}

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

// Function to start playing.
function startPlay(reels) {
    if (running) return;
    running = true;

    for (let i = 0; i < reels.length; i++) {
        const r = reels[i];
        const extra = Math.floor(Math.random() * 3);
        const target = r.position + 10 + i * 5 + extra;
        const time = 2500 + i * 600 + extra * 600;
        tweenTo(
            r,
            'position',
            target,
            time,
            backout(0.5),
            null,
            i === reels.length - 1 ? reelsComplete : null
        );
    }
}

// イメージを読み終えてから実行する
function onAssetsLoaded() {
    // イメージからシンボルのテクスチャを作成
    const slotTextures = [
        PIXI.Texture.from('duck'),
        PIXI.Texture.from('kirin'),
        PIXI.Texture.from('tanuki'),
        PIXI.Texture.from('usagi'),
    ];

    // リールコンテナを作成
    const reelContainer = new PIXI.Container();
    const reels = buildReels(reelContainer, slotTextures);

    // ステージを作成
    // top...タイトル (x, y) = (0, 0)
    //   (width, height) = (app.screen.width, margin)
    // body... スロット本体 (x, y) = ( (app.screen.width - this.width) / 2, margin)
    //   (width, height) = (REEL_WIDTH * 5, SYMBOL_WIDTH * 3)  // 中央揃え
    // bottom...スロット実行ボタン (x, y) = (0, app.screen.height - margin)
    //   (width, height) = (app.screen.width, margin)
    //
    // margin...topとbottomの高さ (app.screen.height - reelContainer.height) / 2

    const margin = (app.screen.height - SYMBOL_SIZE * 3) / 2;
    const ui = {
        top: {
            x: 0,
            y: 0,
            width: app.screen.width,
            height: margin,
        },
        body: {
            x: Math.round((app.screen.width - REEL_WIDTH * 5) / 2),
            y: margin,
            width: REEL_WIDTH * 5,
            height: SYMBOL_SIZE * 3,
        },
        bottom: {
            x: 0,
            y: app.screen.height - margin,
            width: app.screen.width,
            height: margin,
        },
    };
    // body = reelContainer
    reelContainer.x = ui.body.x;
    reelContainer.y = ui.body.y;

    // top
    const top = new PIXI.Graphics();
    top.beginFill(0, 1);
    top.drawRect(ui.top.x, ui.top.y, ui.top.width, ui.top.height);
    const headerText = new PIXI.Text('PIXI MONSTER SLOTS!', style);
    headerText.x = Math.round((ui.top.width - headerText.width) / 2);
    headerText.y = Math.round((ui.top.height - headerText.height) / 2);
    top.addChild(headerText);
    app.stage.addChild(top);

    // bottom
    const bottom = new PIXI.Graphics();
    bottom.beginFill(0, 1);
    bottom.drawRect(
        ui.bottom.x,
        ui.bottom.y,
        ui.bottom.width,
        ui.bottom.height
    );
    const playText = new PIXI.Text('Spin the wheels!', style);
    playText.x = Math.round((ui.bottom.width - playText.width) / 2);
    playText.y =
        ui.bottom.y + Math.round((ui.bottom.height - playText.height) / 2);
    bottom.addChild(playText);
    app.stage.addChild(bottom);
    // Set the interactivity.
    bottom.interactive = true;
    bottom.buttonMode = true;
    bottom.addListener('pointerdown', () => {
        startPlay(reels);
    });

    // Listen for animate update.
    app.ticker.add(() => {
        // Update the slots.
        for (let i = 0; i < reels.length; i++) {
            const r = reels[i];
            // Update blur filter y amount based on speed.
            // This would be better if calculated with time in mind also. Now blur depends on frame rate.
            r.blur.blurY = (r.position - r.previousPosition) * 8;
            r.previousPosition = r.position;

            // Update symbol positions on reel.
            for (let j = 0; j < r.symbols.length; j++) {
                const s = r.symbols[j];
                const prevy = s.y;
                s.y =
                    ((r.position + j) % r.symbols.length) * SYMBOL_SIZE -
                    SYMBOL_SIZE;
                if (s.y < 0 && prevy > SYMBOL_SIZE) {
                    // Detect going over and swap a texture.
                    // This should in proper product be determined from some logical reel.
                    s.texture =
                        slotTextures[
                            Math.floor(Math.random() * slotTextures.length)
                        ];
                    s.scale.x = s.scale.y = Math.min(
                        SYMBOL_SIZE / s.texture.width,
                        SYMBOL_SIZE / s.texture.height
                    );
                    s.x = Math.round((SYMBOL_SIZE - s.width) / 2);
                }
            }
        }
    });
}

// Very simple tweening utility function. This should be replaced with a proper tweening library in a real product.
const tweening = [];
function tweenTo(object, property, target, time, easing, onchange, oncomplete) {
    const tween = {
        object,
        property,
        propertyBeginValue: object[property],
        target,
        easing,
        time,
        change: onchange,
        complete: oncomplete,
        start: Date.now(),
    };

    tweening.push(tween);
    return tween;
}
// Listen for animate update.
app.ticker.add(() => {
    const now = Date.now();
    const remove = [];
    for (let i = 0; i < tweening.length; i++) {
        const t = tweening[i];
        const phase = Math.min(1, (now - t.start) / t.time);

        t.object[t.property] = lerp(
            t.propertyBeginValue,
            t.target,
            t.easing(phase)
        );
        if (t.change) t.change(t);
        if (phase === 1) {
            t.object[t.property] = t.target;
            if (t.complete) t.complete(t);
            remove.push(t);
        }
    }
    for (let i = 0; i < remove.length; i++) {
        tweening.splice(tweening.indexOf(remove[i]), 1);
    }
});

// Basic lerp funtion.
function lerp(a1, a2, t) {
    return a1 * (1 - t) + a2 * t;
}

// Backout function from tweenjs.
// https://github.com/CreateJS/TweenJS/blob/master/src/tweenjs/Ease.js
function backout(amount) {
    return (t) => --t * t * ((amount + 1) * t + amount) + 1;
}
