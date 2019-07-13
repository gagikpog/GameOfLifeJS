let map1 = [], map2 = [];
const W = 150, H = 70;
let SIZE = 10;
let pause = true;
let endGame = false;
let summ = 1;
let activemap1 = true;
let iter = 0;
let cursorPressed = false;
let editMode = true;
let penSize = 1;
let cursorPos = { X: 10, Y: 10 }
let canvas = document.getElementById("tbl");
let ctx = canvas.getContext("2d");
let canvasMargin = { X: 0, Y: 0 };

let tagFloor = document.getElementById("generation");
document.addEventListener("keydown", keyDownFunc, false);
createmap1(map1);
createmap1(map2);
randomFilling();
renderMap();
timer();
window.onresize = resize;
resize();

/**
 * @description при изменении размера экрана обновляет значение 
 * отступов для определения позиции курсора на canvas
 * @param {Event} event 
 */
function resize(event) {
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
 * @description создает матрицу
 * @param {[]} _map1
 */
function createmap1(_map1) {
	for (let i = 0; i < H; i++) {
		_map1[i] = [];
		for (let j = 0; j < W; j++) {
			_map1[i][j] = false;
		}
	}
}
/**
 * @description рисует точку
 * @param {Integer} x позиция x
 * @param {Integer} y позиция y
 * @param {String} col цвет
 */
function drawPixel(x, y, col) {
	ctx.fillStyle = col;
	ctx.fillRect(x * SIZE, y * SIZE, SIZE, SIZE);
}
/**
 * @description выводит текущее состояние матрицы на экран
 */
function renderMap() {
	//ссылка на активную матрицу
	let _map1 = activemap1 ? map1 : map2;
	let i = 0, j = 0;
	//отрисовка поля 
	for (i = 0; i < H; i++) {
		for (j = 0; j < W; j++) {
			drawPixel(j, i, _map1[i][j] ? "white" : "#202020");
		}
	}
	//рисуем курсор рисования 
	for (i = parseInt(-(penSize - 1) / 2); i < 1 + parseInt((penSize) / 2); i++) {
		for (j = parseInt(-(penSize - 1) / 2); j < 1 + parseInt((penSize) / 2); j++) {
			if (i + 1 + cursorPos.Y < 1 || i + 1 + cursorPos.Y > H || j + 1 + cursorPos.X < 1 || j + 1 + cursorPos.X > W)
				continue;
			drawPixel(j + cursorPos.X, i + cursorPos.Y, _map1[i + cursorPos.Y][j + cursorPos.X] ? '#fff' : '#555');
		}
	}
}
/**
 * @description заполняет матрицу случайным образом
 */
function randomFilling() {
	iter = 0;
	let _map1 = activemap1 ? map1 : map2;
	let rand = function (min, max) {
		return Math.random() * (max - min) + min;
	}
	for (let i = 0; i < H; i++) {
		for (let j = 0; j < W; j++) {
			_map1[i][j] = !Math.floor(rand(0, 2));
		}
	}
}
/**
 * @description считает сколько соседних клеток активные
 * @param {Integer} y 
 * @param {Integer} x 
 * @returns {Integer} возвращает количество активных клеток
 */
function CountNeighbors(y, x) {
	let _map1 = activemap1 ? map1 : map2;
	let res = 0;
	for (let i = - 1; i <= 1; i++) {
		for (let j = - 1; j <= 1; j++) {
			if (_map1[(y + i + H) % H][(x + j + W) % W])
				res++;
		}
	}
	if (_map1[y][x])
		res--;
	return res;
}
/**
 * @description рассчитывает состояние следующего поколения
 * @returns {Integer} контрольная сумма
 */
function nextGeneration() {
	let _map1 = activemap1 ? map1 : map2;
	let _map2 = activemap1 ? map2 : map1;
	let count = 0;
	for (let i = 0; i < H; i++) {
		for (let j = 0; j < W; j++) {
			let n = CountNeighbors(i, j);
			_map2[i][j] = (n == 3) || ((n == 2) && (_map1[i][j]));
			if (_map2[i][j]) {
				count += i * H + j * j;
			}
		}
	}
	activemap1 = !activemap1;
	if (!endGame) {
		iter++;
	}
	return count;
}
/**
 * @description таемер
 */
function timer() {
	if (pause) {
		let s = nextGeneration();
		if (activemap1) {
			endGame = summ === s;			
			summ = s;
		}
		
		tagFloor.innerText = "Generation: " + iter;
	}
	renderMap();
	setTimeout(timer, 5);
}
/**
 * @description обработчика события кнопки “Пауза”
 */
function btmPause() {
	let aTag = document.getElementById("pause");
	aTag.value = pause ? "Play" : "Pause"
	pause = !pause
}
/**
 * @description обработчик события нажатия на canvas
 * @param {Event} objThis 
 */
function onClickMap(objThis) {
	let y = cursorPos.Y;
	let x = cursorPos.X;

	let _map1 = activemap1 ? map1 : map2;
	for (let i = parseInt(-(penSize - 1) / 2); i < 1 + parseInt((penSize) / 2); i++) {
		for (let j = parseInt(-(penSize - 1) / 2); j < 1 + parseInt((penSize) / 2); j++) {
			_map1[i + y][j + x] = editMode;
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
	iter = 0;
	let _map1 = activemap1 ? map1 : map2;
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
 * @description меняет ластик на карандаш и обратно
 */
function changeMode() {
	let tImg = document.getElementById("mode");
	tImg.src = editMode ? "img/eraser.png" : "img/pencil.png";
	editMode = !editMode;
}
/**
 * @description нажатие на клавиатуре
 * @param {Event} e
 */
function keyDownFunc(e) {
	/*key p*/
	if (e.keyCode == 80) {
		if (!editMode) {
			changeMode();
		}
	}
	/*key e*/
	if (e.keyCode == 69) {
		if (editMode) {
			changeMode();
		}
	}
}
/**
 * @description меняет размер кисти
 */
function penSizeChange() {
	penSize = document.getElementById("pencilSize").value;
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
