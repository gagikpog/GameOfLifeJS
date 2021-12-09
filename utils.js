/**
 * @description рисует точку
 * @param { CanvasRenderingContext2D } ctx контекст
 * @param { number } x позиция x
 * @param { number } y позиция y
 * @param { string } col цвет
 * @param { number } w ширина
 * @param { number | undefined } [h] высота
 */
export function drawPixel(ctx, x, y, col, w, h) {
    const height = h === void 0 ? w : h;
    ctx.fillStyle = col;
    ctx.fillRect(x * w, y * height, w, height);
}

/**
 * @description считает сколько соседних клеток активные
 * @param { Map<string, number> } map поле
 * @param { number } y позиция x
 * @param { number } x позиция y
 * @returns { number } возвращает количество активных соседних клеток
 */
export function CountNeighbors(map, y, x) {

    const get = (a, b) => map.get(getHash(a, b)) || 0;

    return  get(y - 1, x - 1) + get(y - 1, x + 0) + get(y - 1, x + 1) +
            get(y + 0, x - 1) +                     get(y + 0, x + 1) +
            get(y + 1, x - 1) + get(y + 1, x + 0) + get(y + 1, x + 1);
}

/**
 * @description создает матрицу
 * @param { number } w ширина матрицы
 * @param { number } h высота матрицы
 * @returns { Object.<string, number> }
 */
export function createMap(w, h) {
    return {};
}

/**
 * @description заполняет матрицу случайным образом
 * @param { Map<string, number> } map поле
 */
export function randomFilling(map, w, h) {

    let rand = function (min, max) {
        return Math.random() * (max - min) + min;
    }

    for (let i = 0; i < h; i++) {
        for (let j = 0; j < w; j++) {
            map.set(getHash(i, j), Math.floor(rand(0, 10)) === 1 ? 1 : 0);
        }
    }
}

/**
 *
 * @param { number } a
 * @param { number } b
 * @returns { string }
 */
export function getHash(a, b) {
    return a << 16 | b;
    return a + ',-,' +  b;
}