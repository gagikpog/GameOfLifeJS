import { drawPixel } from './utils.js';
import { Game } from './game.js';
import { View } from './view.js';

const W = 150, H = 70;
let SIZE = 10;
const cfg = {
    w: W,
    h: H,
    size: SIZE
};
let pause = true;
let summ = 1;

let cursorPressed = false;
let cursorPos = { X: 10, Y: 10 }
let canvas = document.getElementById("canvas");
let ctx = canvas.getContext("2d");
let canvasMargin = { X: 0, Y: 0 };

let tagGeneration = document.getElementById("generation");

const game = new Game(cfg);
const view = new View(game);
window.view = view;
game.newGame();
timer();
window.onresize = resize;
resize();

window.onMouseMoveMap = onMouseMoveMap;

window.mouseDown = mouseDown;
window.btmPause = btmPause;
window.randomFilling = () => {
    game.newGame();
};

window.clearMap = clearMap;
window.mouseUp = mouseUp;

/**
 * @description при изменении размера экрана обновляет значение 
 * отступов для определения позиции курсора на canvas
 */
function resize() {
    if (window.innerWidth < 850) {
        canvas.width = window.innerWidth;
        SIZE = parseInt(canvas.width / W);
        canvas.height = SIZE * H;
    } else {
        canvas.width = SIZE * W;
        canvas.height = SIZE * H;
    }
    canvasMargin.Y = canvas.offsetTop;
    canvasMargin.X = canvas.offsetLeft;
};

/**
 * @description выводит текущее состояние матрицы на экран
 */
function renderMap() {
    //ссылка на активную матрицу
    let _map1 = game.getActiveMap();
    let i = 0, j = 0;
    //отрисовка поля
    for (i = 0; i < H; i++) {
        for (j = 0; j < W; j++) {
            drawPixel(ctx, j, i, _map1[i][j] ? "white" : "#202020", SIZE);
        }
    }
    //рисуем курсор рисования 
    for (i = parseInt(-(view._penSize - 1) / 2); i < 1 + parseInt((view._penSize) / 2); i++) {
        for (j = parseInt(-(view._penSize - 1) / 2); j < 1 + parseInt((view._penSize) / 2); j++) {
            if (i + 1 + cursorPos.Y < 1 || i + 1 + cursorPos.Y > H || j + 1 + cursorPos.X < 1 || j + 1 + cursorPos.X > W)
                continue;
            drawPixel(ctx, j + cursorPos.X, i + cursorPos.Y, _map1[i + cursorPos.Y][j + cursorPos.X] ? '#fff' : '#555', SIZE);
        }
    }
}

/**
 * @description таймер
 */
function timer() {
    if (pause) {
        let s = game.nextGeneration();
        if (game.activeMap1) {
            game.endGame = summ === s;
            summ = s;
        }

        tagGeneration.innerText = "Generation: " + game.iteration;
    }
    renderMap();
    setTimeout(timer, 5);
}

/**
 * @description обработчика события кнопки “Пауза”
 */
function btmPause(aTag) {
    aTag.innerText = pause ? "Play" : "Pause"
    pause = !pause
}

/**
 * @description обработчик события нажатия на canvas
 * @param {Event} objThis 
 */
function onClickMap(objThis) {
    let y = cursorPos.Y;
    let x = cursorPos.X;

    let _map1 = game.getActiveMap();
    for (let i = parseInt(-(view._penSize - 1) / 2); i < 1 + parseInt((view._penSize) / 2); i++) {
        for (let j = parseInt(-(view._penSize - 1) / 2); j < 1 + parseInt((view._penSize) / 2); j++) {
            _map1[i + y][j + x] = view._editMode;
        }
    }
    renderMap();
}

/**
 * @description обработчик события - движение мыши на  canvas
 * @param {Event} objThis
 */
function onMouseMoveMap(objThis) {
    mMove(objThis);
    if (cursorPressed) {
        onClickMap(objThis);
    }
}

/**
 * @description очищает матрицу
 */
function clearMap() {
    game.iteration = 0;
    let _map1 = game.getActiveMap();
    for (let i = 0; i < H; i++) {
        for (let j = 0; j < W; j++) {
            _map1[i][j] = false;
        }
    }
    renderMap();
}

/**
 * @description нажатие мыши на canvas
 * @param {Event} objThis 
 */
function mouseDown(objThis) {
    cursorPressed = true;
    onMouseMoveMap(objThis);
}

/**
 * //отжатие мыши на canvas 
 * @param {Event} objThis 
 */
function mouseUp(objThis) {
    cursorPressed = false;
}

/**
 * @description движение мыши в нажатом состоянии
 * @param {Event} objThis 
 */
function mMove(objThis) {
    if (objThis) {
        cursorPos.X = parseInt((objThis.clientX - canvasMargin.X) / SIZE);
        cursorPos.Y = parseInt((objThis.clientY - canvasMargin.Y) / SIZE);
    }
}
