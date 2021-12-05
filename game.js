import { CountNeighbors, drawPixel, createMap, randomFilling } from './utils.js';

export class Game {
    constructor(cfg) {
        this.w = cfg.w || 150;
        this.h = cfg.h || 70;
        this.size = cfg.size || 10;
        this.iteration = 0;
        this.endGame = false;
        this.activeMap1 = true;
        this._map1 = createMap(this.w, this.h);
        this._map2 = createMap(this.w, this.h);
    }

    newGame() {
        this.iteration = 0;
        this.activeMap1 = true;
        randomFilling(this.getActiveMap());
    }

    getActiveMap() {
        return this.activeMap1 ? this._map1 : this._map2;
    }

    getInactiveMap() {
        return this.activeMap1 ? this._map2 : this._map1;
    }

    /**
     * @description рассчитывает состояние следующего поколения
     * @returns {number} контрольная сумма
     */
    nextGeneration() {
        let _map1 = this.getActiveMap();
        let _map2 = this.getInactiveMap();
        let count = 0;
        for (let i = 0; i < this.h; i++) {
            for (let j = 0; j < this.w; j++) {
                let n = CountNeighbors(_map1, i, j);
                _map2[i][j] = (n == 3) || ((n == 2) && (_map1[i][j]));
                if (_map2[i][j]) {
                    count += i * this.h + j * j;
                }
            }
        }
        this.activeMap1 = !this.activeMap1;
        if (!this.endGame) {
            this.iteration++;
        }
        return count;
    }

}
