import { Game } from './game.js';
import { View } from './view.js';

const m = 2;
const cfg = {
    w: 460 * m,
    h: 215 * m,
    size: 4 / m
};
let start = null;
let fps = 0;
let renderCount = 0;

const view = new View(new Game(cfg));
view._game?.newGame();
window.view = view;
step(Date.now());

/**
 * @description таймер
 */
function timer() {
    if (view._pause && view._game) {
        view._game.nextGeneration();
        view._tagGeneration.innerText = `Generation: ${view._game.iteration}; fps: ${fps}`;
    }
    view.renderMap();
}

function step(timestamp) {
    const progress = timestamp - start;
    renderCount++;
    if (progress >= 1000) {
        fps = renderCount;
        start = timestamp;
        renderCount = 0;
    }


    timer();
    setTimeout(() => step(Date.now()), 1);
}
