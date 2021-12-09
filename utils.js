/**
 * @description рисует точку
 * @param { CanvasRenderingContext2D } ctx контекст
 * @param { number } x позиция x
 * @param { number } y позиция y
 * @param { number } w ширина
 * @param { number | undefined } [h] высота
 */
export function drawPixel(ctx, x, y, w, h) {
    const height = h === void 0 ? w : h;
    ctx.rect(x * w, y * height, w, height);
}

/**
 * @description считает сколько соседних клеток активные
 * @param { number[][] } map поле
 * @param { number } y позиция x
 * @param { number } x позиция y
 * @returns { number } возвращает количество активных соседних клеток
 */
export function CountNeighbors(map, y, x) {
    const h = map.length;
    const w = map[0].length;
    if (x === w - 1 || x === 0 || y === h - 1 || y === 0) {
        const yh = y + h;
        const xw = x + w;

        return  map[(yh - 1) % h][(xw - 1) % w] + map[(yh - 1) % h][(xw + 0) % w] + map[(yh - 1) % h][(xw + 1) % w] +
                map[(yh + 0) % h][(xw - 1) % w] +                                   map[(yh + 0) % h][(xw + 1) % w] +
                map[(yh + 1) % h][(xw - 1) % w] + map[(yh + 1) % h][(xw + 0) % w] + map[(yh + 1) % h][(xw + 1) % w];
    } else {
        return  map[y - 1][x - 1] + map[y - 1][x + 0] + map[y - 1][x + 1] +
                map[y + 0][x - 1] +                     map[y + 0][x + 1] +
                map[y + 1][x - 1] + map[y + 1][x + 0] + map[y + 1][x + 1];
    }

}

/**
 * @description создает матрицу
 * @param { number } w ширина матрицы
 * @param { number } h высота матрицы
 * @returns { number[][] }
 */
export function createMap(w, h) {
    return new Array(h).fill(null).map(() => new Array(w).fill(0));
}

/**
 * @description заполняет матрицу случайным образом
 * @param { number[][] } map поле
 */
export function randomFilling(map) {
    const h = map.length;
    const w = map[0].length;
    let rand = function (min, max) {
        return Math.random() * (max - min) + min;
    }
    for (let i = 0; i < h; i++) {
        for (let j = 0; j < w; j++) {
            map[i][j] = Math.floor(rand(0, 10)) === 1 ? 1 : 0;
        }
    }
}
