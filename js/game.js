var DOMReady = function(a,b,c){b=document,c='addEventListener';b[c]?b[c]('DOMContentLoaded',a):window.attachEvent('onload',a)}

DOMReady(function () {

	GAME = function() {
		var __game = this;

		this.log = "";
		this.logTag = "GAME";
		this.debug = false;

		this.mainContainerId = "smilesContainer";
		this.sunContainerId = "sun";
		this.progressbarContainerId = "progressbar";

		this.smileClassName = "smile";
		this.smileDefaultWidth = 65;
		this.smileDefaultHeight = 65;
		this.frequencyOfCreatingNewSmile = 800,
		this.smilesSpeed = 5000;
		this.smilesProportionalSize = 3;
		this.smilesFolderPath  = "img/smiles/"; // free smiles collection from - http://www.designsrazzi.com/2015/emoticons-smiley-icons-packs/
		this.countFolderSmiles = 80;
		this.smileKillSound = "res/pop.mp3";

		this.minScores = 100; // TODO: add more scores for fast compo killing. or level speed version
		this.progressStep = 10;

		this.fullscreenMode = false;
		this.animation = true; // animation effects here & css opasity etc
		this.visualization = true; // box shadow & border radius here
		// TODO: add colors and pathes params here?


		LOG = {
			add: function(tag, str) {
				__game.log = __game.log + tag.toUpperCase() + ": " + str + "\n";
			},

			show: function() {
				if (__game.debug == true) console.log("\n\n---- LOG (" + new Date() + ") ---\n" + __game.log);
			},

			cleanup: function() {
				__game.log = "";
			}
		}

		SUN = {
			id: __game.sunContainerId,
			defaultCssText: null,

			container: function() {
				return getById(this.id);
			},

			prepareUI: function() {
				var e = getById(this.id);

				e.style.width = Math.floor(__game.container().offsetWidth / 100 * 40) + "px";
				e.style.height = Math.floor(__game.container().offsetWidth / 100 * 40) + "px";
				e.style.top = e.offsetTop + "px";
				e.style.left = e.offsetLeft + "px";

				this.defaultCssText = e.style.cssText;
			},

			shake: function(oncomplete, distance, time) {
				// TODO: add function Int params to global
			    var e = getById(this.id); // TODO: remove getById in all methods. work with ...
			    if (!time) time = 600;
			    if (!distance) distance = 15;

			    var originalStyle = this.defaultCssText;

			    var start = (new Date()).getTime();
			    animate();

			    function animate() {
			        var now = (new Date()).getTime();
			        var elapsed = now - start;
			        var fraction = elapsed / time;

			        if (fraction < 1) {
			            var x = distance * Math.sin(fraction * 4 * Math.PI);

			            e.style.top = x + "px";
			            //e.style.left = x + "px";
			            e.style.width = Math.floor(e.offsetWidth + 2) + "px";
			            e.style.height = Math.floor(e.offsetHeight + 2) + "px";

			            setTimeout(animate, Math.min(8, time - elapsed));
			        }
			        else {
			            e.style.cssText = originalStyle;
			            
			            if (oncomplete) oncomplete(e);
			        }
			    }
			}
		}

		PROGRESSBAR = {
			id: __game.progressbarContainerId,

			countainer: function() {
				return getById(this.id);
			},

			prepareUI: function() {
				var progressbarHeight = Math.floor(__game.container().offsetHeight / 100 * 6) + "px";
				getById("progress").style.height = progressbarHeight;
				getById(this.id).style.top = progressbarHeight;
				// TODO: add progress % to progress container
			}
		}

		SMILE = function() {
			// WHY IT ALL PRIVVATE?? MADE STATIC OBJECT! OR PUBLIC METODS
			// TODO: remove getById() - clone object on construct into global?
			var id = "";
			var x = 0;
			var y = 0;
			var width = __game.smileDefaultWidth;
			var height = __game.smileDefaultHeight;

			var onclick = function() {
				var inGameSmile = getById(id);
				inGameSmile.onclick = function(){return false;}

				var audio = new Audio(__game.smileKillSound);
				audio.play();
				// TODO: add random child laugh mp3
				// TODO: add bg music

				// TODO: add scores bg effect (! today !)

				getById("kills").innerHTML = parseInt(getById("kills").innerHTML) + 1;
				getById("scores").innerHTML = parseInt(getById("scores").innerHTML) + __game.minScores;

				inGameSmile.className = inGameSmile.className + " killSmile";
				inGameSmile.title = "isKilled";

				SUN.shake();

				getById("progress").style.width = (getById("progress").offsetWidth + __game.progressStep) + "px"; // TODO: made progress in percent! 

				if (getById("progress").offsetWidth > getById("progressbar").offsetWidth) alert("TODO: NICE congratulations with RESET GAME (or NEXT level) button!!!\n NOW RELOAD THE PAGE!");

				return false;
			}


			this.init = function() {
				__prepare();
				__appendToMainContainer();

				__process();
			}


			function __prepare() {
				id = "smile_" + new Date().getTime();

				width = Math.floor(__game.container().offsetWidth / __game.smilesProportionalSize);
				height = width;

				var min = 0;
				var max = __game.container().offsetWidth - width;

				x = rand(min, max);
				y = __game.container().offsetHeight;
			}

			function __appendToMainContainer() {
				var newSmile = document.createElement('div');

				newSmile.id = id;
				newSmile.className = __game.smileClassName;
				newSmile.onclick = onclick;
				__game.container().appendChild(newSmile);

				var inGameSmile = getById(id);
				inGameSmile.style.width = width + "px";
				inGameSmile.style.height = height + "px";
				inGameSmile.style.left = x + "px";
				inGameSmile.style.top = y + "px";
				inGameSmile.style.backgroundImage = "url('"+__game.smilesFolderPath+rand(1, __game.countFolderSmiles)+".png')"; // optimaze all png size
				// TODO: add random rotation turn css class on start (to Left or to Right) (! today !)

				LOG.add(arguments.callee.name, "Append new Smile to main container with default coordinates");
			}

			function __process() {
				var inGameSmile = getById(id);

				// https://javascript.ru/blog/Andrej-Paranichev/Osnovy-programmnoj-animacii-JavaScript#osnovnaya-formula
				var from = inGameSmile.offsetTop;
				var to = -height * 2;
				var duration = __game.smilesSpeed;
				var start = new Date().getTime();

				setTimeout(function() {
					var now = (new Date().getTime()) - start;
					var progress = now / duration;
					var result = (to - from) * (Math.pow(progress, 4)) + from; // delta - (Math.pow(progress, 4))

					if (inGameSmile.offsetTop < (-inGameSmile.offsetHeight - 10) && inGameSmile.title != "isKilled") {
						var garbage = getById(inGameSmile.id);
						garbage.parentNode.removeChild(garbage);
						// add to comon func - remove()

						getById("fails").innerHTML = parseInt(getById("fails").innerHTML) - 1;
					} else {
						inGameSmile.style.top = result + "px";
						
						if (progress < 1) setTimeout(arguments.callee, 1);
					}
				}, 1);
			}
		}


		this.start = function() {
			__init();
		}

		this.container = function() {
			return (getById(__game.mainContainerId) != null ? getById(__game.mainContainerId) : getById("body")[0]); // TODO: check for fullscreen here
		}


		function getById(id) {
			return document.getElementById(id);
		}

		function rand(min, max) {
			return Math.floor(Math.random() * (max - min + 1) + min)
		}


		function __init() {
			__startGameTimer();

			//TODO:: check if default HTML container exists in document. if not, add them dunamicly
			
			SUN.prepareUI();
			PROGRESSBAR.prepareUI();

			// TODO: set proporcional grass container height with border-size: cover
			// TODO: add clouds like this - http://thecodeplayer.com/walkthrough/pure-css3-animated-clouds-background

			__mainGameLoop();
		}

		function __startGameTimer() {
	    	var timer = 0, minutes, seconds;

		    setInterval(function () {
		        minutes = parseInt(timer / 60, 10);
		        seconds = parseInt(timer % 60, 10);

		        minutes = minutes < 10 ? "0" + minutes : minutes;
		        seconds = seconds < 10 ? "0" + seconds : seconds;

		        getById("timer").innerHTML = minutes + ":" + seconds;

		        timer++;
		    }, 1000);
		}

		function __cleanupGarbage() {
			var cleanedSmiles = 0;
			var pageSmiles = document.getElementsByClassName(__game.smileClassName);

			for (var i = 0; i < pageSmiles.length; i++) {
				if (pageSmiles[i].offsetTop < (-pageSmiles[i].offsetHeight - 10)) {
					var garbage = getById(pageSmiles[i].id);
					garbage.parentNode.removeChild(garbage);
					// add to comon func - remove()

					cleanedSmiles++;
				}
			}

			LOG.add(arguments.callee.name, pageSmiles.length + " Smiles on the page");
			LOG.add(arguments.callee.name, cleanedSmiles + " garbage Smiles from page was cleaned");
		}

		function __mainGameLoop() {
			var gameTimerId = setInterval(function() {
				LOG.cleanup();

				__cleanupGarbage();

				var smile = new SMILE();
				smile.init();

				LOG.show();
			}, __game.frequencyOfCreatingNewSmile);
		}
	}


	var game = new GAME();
	game.start();

	console.log(game);
});