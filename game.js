import { CountNeighbors, createMap, randomFilling } from './utils.js';

export class Game {

    /** @type { number } */
    w = 0;

    /** @type { number } */
    h = 0;

    /** @type { number } */
    size = 0;

    /** @type { number } */
    iteration = 0;

    /** @type { boolean } */
    _endGame = false;

    /**
     * @type { boolean }
     * @private
     */
    _activeMap1 = false;

    /**
     * @type { number[][] }
     * @private
     */
    _map1 = [];

    /**
     * @type { number[][] }
     * @private
     */
    _map2 = [];

    constructor(cfg) {
        this.w = cfg.w || 150;
        this.h = cfg.h || 70;
        this.size = cfg.size || 10;
        this.iteration = 0;
        this._endGame = false;
        this._activeMap1 = true;
        this._map1 = createMap(this.w, this.h);
        this._map2 = createMap(this.w, this.h);
    }

    newGame() {
        this.iteration = 0;
        this._activeMap1 = true;
        this._endGame = false;
        randomFilling(this.getActiveMap());
    }

    getActiveMap() {
        return this._activeMap1 ? this._map1 : this._map2;
    }

    getInactiveMap() {
        return this._activeMap1 ? this._map2 : this._map1;
    }

    /**
     * @description рассчитывает состояние следующего поколения
     */
    nextGeneration() {
        let _map1 = this.getActiveMap();
        let _map2 = this.getInactiveMap();
        let count = 0;
        let i = 0;
        let j = 0;
        let n = 0;
        for (i = 0; i < this.h; i++) {
            for (j = 0; j < this.w; j++) {
                n = CountNeighbors(_map1, i, j);
                _map2[i][j] = n === 3 || (n === 2 && _map1[i][j]) ? 1 : 0;
                if (_map2[i][j]) {
                    count += i * this.h + j * j;
                }
            }
        }
        this._activeMap1 = !this._activeMap1;

        if (this._activeMap1) {
            this._endGame = this._oldSum === count;
            this._oldSum = count;
        }

        if (!this._endGame) {
            this.iteration++;
        }
    }

    reset() {
        this.iteration = 0;
        this._endGame = false;
        let _map1 = this.getActiveMap();
        for (let i = 0; i < this.h; i++) {
            for (let j = 0; j < this.w; j++) {
                _map1[i][j] = 0;
            }
        }
    }

    endGame() {
        this._endGame = true;
    }

}
