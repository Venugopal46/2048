var appController = (function(){
	var score = 0, flag = false, grids = 4, app = {};
	function setStyles (c) {
	    this.cls = document.getElementsByClassName(c)[0];
	    this.css = function (property, value) {
	        this.cls.style[property] = value;
	        return this;
	    };
	    if ( this instanceof setStyles )
	        return this.setStyles;
	    else
	        return new setStyles(c);
	};
	function builGrid() {
		var gridContainer = setStyles('grid-container').css('height',10*(6*grids-1)).css('width',10*(6*grids-1));
		for(var i=0; i<grids; i++){
			var x = document.createElement( 'div' );
			x.className = 'grid-row';
			for(var j=0; j<grids; j++){
				var y = document.createElement( 'div' )
				y.className = 'grid-cell';
				x.appendChild(y);
			}
			gridContainer.cls.appendChild(x);
		}
		var tilesContailer = setStyles('tiles-container').css('height',10*(6*grids+1)).css('width',10*(6*grids+1)).css('top',-10*(6*grids+1));
	}
	function setBestScore(score) {
		localStorage.setItem('best_score', score);
	}
	function getBestScore() {
		return (localStorage.getItem("best_score") === null) ? 0 : localStorage.getItem('best_score');
	}
	function setScore (s) {
		score += s;
		document.getElementById('score').innerHTML = score;
		if(score > getBestScore()){
			setBestScore(score);
			document.getElementById('best-score').innerHTML = getBestScore();
		}
		if(s === 128 && !flag){
			flag = true;
			alert('You Won!');
		}
	}
	function keyInputsManager ( arr ) {
		var map = { 37: 'left', 38: 'up', 39: 'right', 40: 'down' };
		document.addEventListener("keydown", function (event) {
	    	var mapped = map[event.which], temp = [];
			if (mapped !== undefined) {
				for(var k=0; k<grids; k++){
					temp[k] = [];
				}
				if(mapped === 'up'){
					for(var i=0; i<grids; i++){
						for(var j=0; j<grids; j++){
							if(typeof arr[i+'_'+j] !== 'undefined')
								temp[j].push(arr[i+'_'+j]);
						}
					}
					//console.log(temp)
					arr = {};
					for(var l=0; l<grids; l++){
						var temp_length = temp[l].length, len = 0;
						if(temp_length == 1){
							arr['0_'+l] = temp[l][0];
						}
						else if(temp_length > 1){
							for(var m=0; m<temp_length; m++){
								if(temp[l][m] == temp[l][m+1]){
									arr[len+'_'+l] = 2*temp[l][m];
									setScore(2*temp[l][m]);
									m++;
								}else{
									arr[len+'_'+l] = temp[l][m];
								}
								len++;
							}
						}
					}
				}
				else if(mapped === 'down'){
					for(var i=grids-1; i>=0; i--){
						for(var j=grids-1; j>=0; j--){
							if(typeof arr[i+'_'+j] !== 'undefined')
								temp[j].push(arr[i+'_'+j]);
						}
					}
					//console.log(temp)
					arr = {};
					for(var l=0; l<grids; l++){
						var temp_length = temp[l].length, len = 0;
						if(temp_length == 1){
							arr[(grids-1)+'_'+l] = temp[l][0];
						}
						else if(temp_length > 1){
							for(var m=0; m<temp_length; m++){
								if(temp[l][m] == temp[l][m+1]){
									arr[(grids-1-len)+'_'+l] = 2*temp[l][m];
									setScore(2*temp[l][m]);
									m++;
								}else{
									arr[(grids-1-len)+'_'+l] = temp[l][m];
								}
								len++;
							}
						}
					}
				}
				else if(mapped === 'left'){
					for(var i=0; i<grids; i++){
						for(var j=0; j<grids; j++){
							if(typeof arr[i+'_'+j] !== 'undefined')
								temp[i].push(arr[i+'_'+j]);
						}
					}
					//console.log(temp)
					arr = {};
					for(var l=0; l<grids; l++){
						var temp_length = temp[l].length, len = 0;
						if(temp_length == 1){
							arr[l+'_'+0] = temp[l][0];
						}
						else if(temp_length > 1){
							for(var m=0; m<temp_length; m++){
								if(temp[l][m] == temp[l][m+1]){
									arr[l+'_'+len] = 2*temp[l][m];
									setScore(2*temp[l][m]);
									m++;
								}else{
									arr[l+'_'+len] = temp[l][m];
								}
								len++;
							}
						}
					}
					}
					else if(mapped === 'right'){
						for(var i=grids-1; i>=0; i--){
							for(var j=grids-1; j>=0; j--){
								if(typeof arr[i+'_'+j] !== 'undefined')
									temp[i].push(arr[i+'_'+j]);
							}
						}
						//console.log(temp)
						arr = {};
						for(var l=0; l<grids; l++){
							var temp_length = temp[l].length, len = 0;
							if(temp_length == 1){
								arr[l+'_'+(grids-1)] = temp[l][0];
							}
							else if(temp_length > 1){
								for(var m=0; m<temp_length; m++){
									if(temp[l][m] == temp[l][m+1]){
										arr[l+'_'+(grids-1-len)] = 2*temp[l][m];
										setScore(2*temp[l][m]);
										m++;
									}else{
										arr[l+'_'+(grids-1-len)] = temp[l][m];
									}
									len++;
								}
							}
						}
						//console.log(arr);
					}
					arr = tilesArray(arr);
					setTiles(arr);
		    }
		});
	}
	function setTiles (arr) {
		if(Object.keys(arr).length === 0){
			tilesArray(arr);
		}
		else{
			var tc = document.getElementsByClassName('tiles-container')[0];
			tc.innerHTML = '';
			for(key in arr){
				if(arr.hasOwnProperty(key)){
					var tile = document.createElement('div');
					tile.className = 'tile tile-'+key.split('_')[0]+'-'+key.split('_')[1];
					tile.innerHTML = arr[key];
				}
				tc.appendChild(tile);
			}
		}
	}
	function tilesArray(arr) {
		var emptycells = [];
		for(var i = 0; i<grids; i++){
			for(var j = 0; j<grids; j++){
				if(typeof arr[i+'_'+j] === 'undefined'){
					emptycells.push(i+','+j);
				}
			}
		}
		//console.log(emptycells)
		var l = emptycells.length;
		if(l == 0){
			document.getElementById('score').innerHTML = 0;
			score = 0;
			alert('Game Over');
			return {};
		}
		var	r = Math.floor(Math.random()*l),
			s = emptycells[r];
		arr[s.split(',')[0]+'_'+s.split(',')[1]] = 2;
		setTiles(arr);
		return arr;
	}
	app.init = function () {
		document.getElementById('best-score').innerHTML = getBestScore();
		builGrid();
		keyInputsManager(tilesArray({}));
	}
	return app;
})();
window.onload = appController.init();