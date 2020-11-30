// import * as PIXI from 'pixi.js';
import SlotGame from 'SlotGame';

// const app = new PIXI.Application({
//     width: 300,
//     height: 200,
//     resolution: window.devicePixelRatio || 1,
//     backgroundColor: 0x1099bb,
// });
// document.body.appendChild(app.view);

// function textContainer(
//     text: string,
//     x: number,
//     y: number,
//     width: number,
//     height: number
// ): PIXI.Container {
//     const container = new PIXI.Container();
//     container.x = x;
//     container.y = y;

//     const rect = new PIXI.Graphics();
//     rect.beginFill(0x333333, 1);
//     rect.drawRect(0, 0, width, height);
//     rect.endFill();
//     container.addChild(rect);

//     const strStyle = new PIXI.TextStyle({
//         fontWeight: 'bold',
//         fontFamily: 'serif',
//         fill: 0xffffff,
//         fontSize: 20,
//     });
//     const str = new PIXI.Text(text, strStyle);
//     str.x = Math.round((width - str.width) / 2);
//     str.y = Math.round((height - str.height) / 2);
//     container.addChild(str);

//     return container;
// }

// const top = textContainer('Hello!', 0, 0, app.screen.width, 30);
// app.stage.addChild(top);

// const bottom = textContainer(
//     'Good-Bye!',
//     0,
//     app.screen.height - 30,
//     app.screen.width,
//     30
// );
// app.stage.addChild(bottom);

const game = new SlotGame();
game.run();
