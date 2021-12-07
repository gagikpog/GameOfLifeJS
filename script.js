import { Game } from './game.js';
import { View } from './view.js';

const cfg = {
    w: 900,
    h: 430,
    size: 2
};
let summ = 1;

const view = new View(new Game(cfg));
view._game?.newGame();
window.view = view;
timer();

/**
 * @description таймер
 */
function timer() {
    if (view._pause && view._game) {
        let s = view._game.nextGeneration();
        if (view._game._activeMap1) {
            if (summ === s) {
                view._game.endGame();
            }
            summ = s;
        }

        view._tagGeneration.innerText = "Generation: " + view._game.iteration;
    }
    view.renderMap();
    setTimeout(timer, 5);
}
