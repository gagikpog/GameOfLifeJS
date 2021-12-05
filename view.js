export class View {
    constructor(game) {
        this._editMode = true;
        this._penSize = 1;
        this._game = game;
        this.keyDownFunc = this.keyDownFunc.bind(this);
        document.addEventListener("keydown", this.keyDownFunc, false);
    }

    destroy() {
        document.removeEventListener("keydown", this.keyDownFunc, false);
        this._game = null;
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
        let tImg = document.getElementById("mode");
        tImg.src = this._editMode ? "img/eraser.png" : "img/pencil.png";
        this._editMode = !this._editMode;
    }

    /**
     * @description нажатие на клавиатуре
     * @param {Event} e
     */
    keyDownFunc(e) {
        /*key p*/
        if (e.keyCode == 80) {
            if (!this._editMode) {
                this.changeMode();
            }
        }
        /*key e*/
        if (e.keyCode == 69) {
            if (this._editMode) {
                this.changeMode();
            }
        }
    }
}
