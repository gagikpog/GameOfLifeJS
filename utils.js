/**
 * @description рисует точку
 * @param { CanvasRenderingContext2D } ctx контекст
 * @param { number } x позиция x
 * @param { number } y позиция y
 * @param { string } col цвет
 */
export function drawPixel(ctx, x, y, col, size) {
    ctx.fillStyle = col;
    ctx.fillRect(x * size, y * size, size, size);
}

/**
 * @description считает сколько соседних клеток активные
 * @param { boolean[][] } map поле
 * @param { number } y позиция x
 * @param { number } x позиция y
 * @returns { number } возвращает количество активных клеток
 */
export function CountNeighbors(map, y, x) {
    const h = map.length;
    const w = map[0].length;
    let res = 0;
    for (let i = - 1; i <= 1; i++) {
        for (let j = - 1; j <= 1; j++) {
            if (map[(y + i + h) % h][(x + j + w) % w])
                res++;
        }
    }
    if (map[y][x])
        res--;
    return res;
}

/**
 * @description создает матрицу
 * @param { number } w ширина матрицы
 * @param { number } h высота матрицы
 * @returns { boolean[][] }
 */
export function createMap(w, h) {
    return new Array(h).fill(null).map(() => new Array(w).fill(false));
}

/**
 * @description заполняет матрицу случайным образом
 * @param { boolean[][] } map поле
 */
export function randomFilling(map) {
    const h = map.length;
    const w = map[0].length;
    let rand = function (min, max) {
        return Math.random() * (max - min) + min;
    }
    for (let i = 0; i < h; i++) {
        for (let j = 0; j < w; j++) {
            map[i][j] = !Math.floor(rand(0, 2));
        }
    }
}
