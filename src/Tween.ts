type TweenObject = {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    object: any;
    property: string;
    target: number;
    time: number;
    easing: (t: number) => number;
    change: ((t: Tween) => void) | null;
    complete: ((t: Tween) => void) | null;
};

export default class Tween {
    static tweening: Tween[] = [];

    obj: TweenObject;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    propertyBeginValue: any;
    start: number = Date.now();

    constructor(tween: TweenObject) {
        this.obj = tween;
        this.propertyBeginValue = this.obj.object[this.obj.property];
    }

    static update(): void {
        const now = Date.now();
        const remove = [];
        for (let i = 0; i < Tween.tweening.length; i++) {
            const tween: Tween = Tween.tweening[i];
            const phase = Math.min(1, (now - tween.start) / tween.obj.time);
            tween.obj.object[tween.obj.property] = Tween.lerp(
                tween.propertyBeginValue,
                tween.obj.target,
                tween.obj.easing(phase)
            );
            if (tween.obj.change) {
                tween.obj.change(tween);
            }
            if (phase === 1) {
                tween.obj.object[tween.obj.property] = tween.obj.target;
                if (tween.obj.complete) {
                    tween.obj.complete(tween);
                }
                remove.push(tween);
            }
        }
        for (let i = 0; i < remove.length; i++) {
            Tween.tweening.splice(Tween.tweening.indexOf(remove[i]), 1);
        }
    }

    static lerp(a1: number, a2: number, t: number): number {
        return a1 * (1 - t) + a2 * t;
    }

    static backout(amount: number): (t: number) => number {
        return (t: number) => --t * t * ((amount + 1) * t + amount) + 1;
    }
}

/*

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
app.ticker.add((delta) => {
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

*/
