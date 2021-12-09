import { drawPixel } from './utils.js';
import { Game } from './game.js';
export class View {

    /** @type { HTMLCanvasElement | null } _canvas */
    _canvas = null;

    /**
     * @param { Game | null } game
     */
    constructor(game) {
        this._editMode = true;
        this._penSize = 1;
        this._game = game;
        this._cursorPressed = false;
        this.keyDownFunc = this.keyDownFunc.bind(this);
        this._cursorPos = { X: 10, Y: 10 };
        this._canvasMargin = { X: 0, Y: 0 };
        this._canvas = document.querySelector('canvas#canvas');
        this._ctx = this._canvas && this._canvas.getContext('2d', { alpha: false });
        this._pause = true;

        document.addEventListener('keydown', this.keyDownFunc, false);
        this._tagGeneration = document.getElementById("generation");
        window.onresize = this.resize();
        this.resize();
    }

    destroy() {
        document.removeEventListener('keydown', this.keyDownFunc, false);
        this._game = null;
        this._tagGeneration = null;
        this._canvas = null;
        this._ctx = null;
        window.onresize = null;
    }

    /**
     * @description меняет размер кисти
     */
    penSizeChange(input) {
        this._penSize = Number(input.value) || 1;
    }

    /**
     * @description меняет ластик на карандаш и обратно
     */
    changeMode() {
        /** @type { HTMLImageElement | null } tImg */
        let tImg = document.querySelector('img#mode');
        if (tImg) {
            tImg.src = this._editMode ? 'img/eraser.png' : 'img/pencil.png';
            this._editMode = !this._editMode;
        }
    }

    /**
     * @description нажатие на клавиатуре
     * @param { KeyboardEvent } event
     */
    keyDownFunc(event) {
        const key = event.key.toLocaleLowerCase();
        if (key === 'p') {
            if (!this._editMode) {
                this.changeMode();
            }
        }
        if (key === 'e') {
            if (this._editMode) {
                this.changeMode();
            }
        }
    }

    /**
     * @description движение мыши в нажатом состоянии
     * @param { MouseEvent } event
     */
    mMove(event) {
        if (event) {
            const size = this._game?.size || 5;
            this._cursorPos.X = Math.floor((event.clientX - this._canvasMargin.X) / size);
            this._cursorPos.Y = Math.floor((event.clientY - this._canvasMargin.Y) / size);
        }
    }

    /**
     * @description выводит текущее состояние матрицы на экран
     */
    renderMap() {
        if (this._ctx && this._game && this._canvas) {

            // ссылка на активную матрицу
            let _map1 = this._game.getActiveMap();
            let i = 0;
            let j = 0;
            const {h, w, size} = this._game;

            // очистка
            this._ctx.fillStyle = '#202020';
            this._ctx.beginPath();
            drawPixel(this._ctx, 0, 0, this._canvas.width, this._canvas.height);
            this._ctx.fill();
            this._ctx.closePath();

            // отрисовка поля
            this._ctx.fillStyle = '#fff';

            this._ctx.beginPath();
            for (i = 0; i < h; i++) {
                for (j = 0; j < w; j++) {
                    if (_map1[i][j]) {

                        drawPixel(this._ctx, j, i, size);
                    }
                }
            }
            this._ctx.fill();
            this._ctx.closePath();


            // рисуем курсор рисования
            this._ctx.fillStyle = '#555';
            this._ctx.beginPath();

            for (i = Math.floor(-(this._penSize - 1) / 2); i < 1 + Math.floor((this._penSize) / 2); i++) {
                for (j = Math.floor(-(this._penSize - 1) / 2); j < 1 + Math.floor((this._penSize) / 2); j++) {
                    if (i + 1 + this._cursorPos.Y < 1 || i + 1 + this._cursorPos.Y > h || j + 1 + this._cursorPos.X < 1 || j + 1 + this._cursorPos.X > w)
                        continue;
                    if (!_map1[i + this._cursorPos.Y][j + this._cursorPos.X]) {
                        drawPixel(this._ctx, j + this._cursorPos.X, i + this._cursorPos.Y, size);
                    }
                }
            }
            this._ctx.fill();
            this._ctx.closePath();

        }
    }

    clearMap() {
        this._game?.reset();
        this.renderMap();
    }

    /**
     * @description обработчик события нажатия на canvas
     */
    onClickMap() {
        if (this._game) {
            let y = this._cursorPos.Y;
            let x = this._cursorPos.X;

            let _map1 = this._game.getActiveMap();
            for (let i = Math.floor(-(this._penSize - 1) / 2); i < 1 + Math.floor((this._penSize) / 2); i++) {
                for (let j = Math.floor(-(this._penSize - 1) / 2); j < 1 + Math.floor((this._penSize) / 2); j++) {
                    _map1[i + y][j + x] = this._editMode;
                }
            }
            this.renderMap();
        }
    }

    /**
     * @description обработчик события - движение мыши на  canvas
     * @param { MouseEvent } event
     */
    onMouseMoveMap(event) {
        this.mMove(event);
        if (this._cursorPressed) {
            this.onClickMap();
        }
    }

    /**
     * @description нажатие мыши на canvas
     * @param { MouseEvent } event
     */
    mouseDown(event) {
        this._cursorPressed = true;
        this.onMouseMoveMap(event);
    }

    /**
     * отжатие мыши на canvas
     */
    mouseUp() {
        this._cursorPressed = false;
    }

    /**
     * @description обработчика события кнопки “Пауза”
     * @property { HTMLButtonElement } aTag
     */
    btmPause(aTag) {
        aTag.innerText = this._pause ? "Play" : "Pause"
        this._pause = !this._pause
    }

    randomFilling() {
        this._game?.newGame();
    };

    /**
     * @description при изменении размера экрана обновляет значение 
     * отступов для определения позиции курсора на canvas
     */
    resize() {
        if (this._canvas && this._game) {
            if (window.innerWidth < 850) {
                this._canvas.width = window.innerWidth;
                this._game.size = Math.floor(this._canvas.width / this._game.w);
                this._canvas.height = this._game.size * this._game.h;
            } else {
                this._canvas.width = this._game.size * this._game.w;
                this._canvas.height = this._game.size * this._game.h;
            }
            this._canvasMargin.Y = this._canvas.offsetTop;
            this._canvasMargin.X = this._canvas.offsetLeft;
        }
    };

}
