var map,mapt;
var W = 250,H = 120;
var pause = true;
var iter = 0;

createMap(W,H);
initWindow(W,H);
randomFilling();
renderMap();
timer();


function createCustomElement(elementClass, elementID,tagName){
  var aTag = document.createElement(tagName);
  aTag.id = elementID;
  aTag.className = elementClass;
  return aTag ;
}

function createMap(w,h){
	createMapt(w,h);
	map = [];
	for (var i = 0; i < h; i++){
	   map[i] = [];
	    for (var j = 0; j < w; j++){
	        map[i][j] = 0;
		}
	}
}

function createMapt(w,h){
	mapt = [];
	for (var i = 0; i < h; i++){
	   mapt[i] = [];
	    for (var j = 0; j < w; j++){
	        mapt[i][j] = 0;
		}
	}
}

function initWindow(w,h){
	var parentDoc = document.getElementById('tbl');
	for (var i = 0 ; i < h; i++)
	{
		var customElementRow = createCustomElement("row", "row"+(i+1),"tr");
		parentDoc.appendChild(customElementRow);
		var parent = document.getElementById("row"+(i+1));
		for (var j = 0 ; j < w; j++)
		{
			var customElement = createCustomElement("col", "col"+(i+1)+"_"+(j+1),"td");
			parent.appendChild(customElement);
		}
	}
}

function renderMap(){
	for(var i = 0;i<H;i++){
		for(var j = 0;j<W;j++){
			if(map[i][j])
				document.getElementById("col"+(i+1)+"_"+(j+1)).style.backgroundColor = "white";
			else document.getElementById("col"+(i+1)+"_"+(j+1)).style.backgroundColor = "#202020";
		}
	}
}

function randomFilling(){
	iter = 0;
	var rand = function (min, max) {
 		return Math.random() * (max - min) + min;
	}
	for(var i = 0;i<H;i++){
		for(var j = 0;j<W;j++){
			map[i][j] = Math.floor(rand(0,2));
		}
	}
}


function CountNeighbors(y,x){
	var res = 0;
	for (var i = - 1; i <= 1; i++)
	{
		for (var j = - 1; j <= 1; j++)
		{
			var y1 = (y + i + H) % H;
			var x1 = (x + j + W) % W;
			if (map[y1][x1])
				res++;
		}
	}
	if (map[y][x])
		res--;
	return res;
}

function nextGeneration()
{
	for(var i = 0;i<H;i++){
		for(var j = 0;j<W;j++){
			var n =  CountNeighbors(i,j);
			mapt[i][j] = (n == 3) || ((n == 2) && (map[i][j]));
		}
	}

	for(var i = 0;i<H;i++){
		for(var j = 0;j<W;j++){
			map[i][j] = mapt[i][j];
		}
	}
	iter++;	
	renderMap();
}

function timer() {
	if(pause){
	nextGeneration();
	setTimeout(timer, 5);
	var aTag = document.getElementById("floor");
	aTag.innerText = "Generation: "+iter;

	}
}


function btmPause()
{
	var aTag = document.getElementById("pause");
	aTag.value = pause ? "Play":"Pause"
	pause = !pause
	timer();

}