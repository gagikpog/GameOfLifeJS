var map1 =[],map2 =[];
var W = 150,H = 70;
var pause = true;
var activemap1 = true;
var iter = 0;
var cursorPressed = false;
var editMode = true;
var penSize = 1;
var cursorPos = {X:10,Y:10}

document.addEventListener("keydown", keyDownFunc, false);
createmap1(map1);
createmap1(map2);
initWindow();
randomFilling();
renderMap();
timer();


function createCustomElement(elementClass, elementID,tagName){
 	var aTag = document.createElement(tagName);
	aTag.id = elementID;
	aTag.className = elementClass;
	aTag.onclick = onClickMap;
	aTag.onmousemove = onMouseMoveMap;
	return aTag ;
}

function createmap1(_map1){
	for (var i = 0; i < H; i++){
	   _map1[i] = [];
	    for (var j = 0; j < W; j++){
	        _map1[i][j] = false;
		}
	}
}

function initWindow(){
	var parentDoc = document.getElementById('tbl');
	for (var i = 0 ; i < H; i++)
	{
		var customElementRow = createCustomElement("row", "row"+(i+1),"tr");
		parentDoc.appendChild(customElementRow);
		var parent = document.getElementById("row"+(i+1));
		for (var j = 0 ; j < W; j++)
		{
			var customElement = createCustomElement("col", "col"+(i+1)+"_"+(j+1),"td");
			parent.appendChild(customElement);
		}
	}
}

function renderMap(){
	var _map1 = activemap1? map1:map2;
	for(var i = 0;i<H;i++){
		for(var j = 0;j<W;j++){
			document.getElementById("col"+(i+1)+"_"+(j+1)).style.backgroundColor = _map1[i][j] ? "white" : "#202020";
		}
	}
	for	(var i = parseInt(-(penSize-1)/2); i < 1 + parseInt((penSize)/2); i++){
		for(var j = parseInt(-(penSize-1)/2); j < 1 + parseInt((penSize)/2); j++){
			if(i+1+cursorPos.Y<1||i+1+cursorPos.Y>H||j+1+cursorPos.X<1||j+1+cursorPos.X>W)
				continue;
			var col  = document.getElementById("col"+(i+1+cursorPos.Y)+"_"+(j+1+cursorPos.X));
			var str = "#" + col.style.backgroundColor;
			col.style.backgroundColor = str == "#rgb(32, 32, 32)" ? "#606060": "#b0b0b0";
		}
	}	
}

function randomFilling(){
	iter = 0;
	var _map1 = activemap1? map1:map2;
	var rand = function (min, max) {
 		return Math.random() * (max - min) + min;
	}
	for(var i = 0;i<H;i++){
		for(var j = 0;j<W;j++){
			_map1[i][j] = !Math.floor(rand(0,2));
		}
	}
}

function CountNeighbors(y,x){
	var _map1 = activemap1? map1:map2;
	var res = 0;
	for (var i = - 1; i <= 1; i++)
	{
		for (var j = - 1; j <= 1; j++)
		{
			if (_map1[(y + i + H) % H][(x + j + W) % W])
				res++;
		}
	}
	if (_map1[y][x])
		res--;
	return res;
}

function nextGeneration()
{
	var _map1 = activemap1 ? map1 : map2;
	var _map2 = activemap1 ? map2 : map1;
	for(var i = 0;i<H;i++){
		for(var j = 0;j<W;j++){
			var n =  CountNeighbors(i,j);
			_map2[i][j] = (n == 3) || ((n == 2) && (_map1[i][j]));
		}
	}

	activemap1 = !activemap1;
	iter++;	
}

function timer() {
	if(pause){
		nextGeneration();
		var aTag = document.getElementById("floor");
		aTag.innerText = "Generation: "+iter;
	}
	renderMap();
	setTimeout(timer, 5);
}

function btmPause()
{
	var aTag = document.getElementById("pause");
	aTag.value = pause ? "Play":"Pause"
	pause = !pause
	//timer();
}

function onClickMap(objThis)
{
	var name = objThis.currentTarget.id;
	if (~name.indexOf("row")) {
		return;
	}

	var y = name.substr(3,name.indexOf("_")-3)-1;
	var x = name.substr(name.indexOf("_")+1)-1;

	var _map1 = activemap1 ? map1 : map2;
//	_map1[y][x] = editMode;
	cursorPos.X = x;
	cursorPos.Y = y;
	for	(var i = parseInt(-(penSize-1)/2); i < 1 + parseInt((penSize)/2); i++){
		for(var j = parseInt(-(penSize-1)/2); j < 1 + parseInt((penSize)/2); j++){
			_map1[i+y][j+x] = editMode;
		}
	}	
	renderMap();
}

function onMouseMoveMap(objThis)
{
	if (cursorPressed) {
		onClickMap(objThis);
	}
	mMove(objThis);
}

function clearMap()
{
	iter = 0;
	var _map1 = activemap1 ? map1 : map2;
	for(var i = 0;i<H;i++){
		for(var j = 0;j<W;j++){
			_map1[i][j] = false;
		}
	}
	renderMap();
}


function mouseDown(objThis)
{
	cursorPressed = true;
}

function mouseUp(objThis)
{
	cursorPressed = false;
}

function changeMode()
{
	var tImg = document.getElementById("mode");
	tImg.src = editMode ? "img/eraser.png":"img/pencil.png";
	editMode = !editMode;
}

function keyDownFunc(e)
{
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

function penSizeChange()
{
	penSize = document.getElementById("pencilSize").value;
}

function mMove(objThis){
	var name = objThis.currentTarget.id;
	if (~name.indexOf("row")) {
		return;
	}

	var y = name.substr(3,name.indexOf("_")-3)-1;
	var x = name.substr(name.indexOf("_")+1)-1;
	cursorPos.X = x;
	cursorPos.Y = y;
}