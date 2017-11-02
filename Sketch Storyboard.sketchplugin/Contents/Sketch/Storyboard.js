/* global log */

// --------- Storyboard --------- //
function Storyboard(artboard) {
	this.artboard = artboard;
	this.layer = artboard;
	this.stories = [];
	this.overlays = [];
	this.isStoryboard = true;

}

(function () {

	Storyboard.prototype.init = function () {
		load.call(this);
		return this;
	};

	Storyboard.prototype.name = function () {
		return getLayerName(this.layer);
	};

	Storyboard.prototype.addStory = function (story) {
		var idx = this.stories.length;
		story.idx = idx;
		this.stories.push(story);
	};

	Storyboard.prototype.getStoryAt = function (idx) {
		if (idx >= 0 && idx < this.stories.length) {
			return this.stories[idx];
		} else {
			return null;
		}
	};

	// return the flat index of this story, or -1 if not found.
	// DEPRECATED: now, we have story.idx
	Storyboard.prototype.getIdxOf = function (story) {
		var i, l = this.stories.length;
		for (i = 0; i < l; i++) {
			if (story === this.stories[i]) {
				return i;
			}
		}
		return -1;
	};

	// recursively find the leaft first Story
	Storyboard.prototype.findFirstVisibleStory = function () {
		var firstVisibleStory = null;

		var stories = this.stories;


		for (var i = 0, l = stories.length; i < l; i++) {
			let story = stories[i];

			// if we do not have a firstVisibleStory yet and this one is visible, then, it is the first one for now
			// NOTE: need to ignore the artboard
			if (!firstVisibleStory && story.isVisible()) {
				firstVisibleStory = story;
				continue;
			}

			// if we have a firstVisible story, only children story can override it. 
			//story.parentSet().has(firstVisibleStory)
			if (firstVisibleStory && story.parentSet().has(firstVisibleStory)) {
				if (story.isVisible()) {
					firstVisibleStory = story;
				}
				continue;
			}

			// if we are still here and have firstVisibleStory, means that we are passed its children
			if (firstVisibleStory) {
				break;
			}
		}

		return firstVisibleStory;
	};

	// return flatIdx for the next story or -1 if none
	Storyboard.prototype.makeNextStoryVisible = function (currentIdx, stepMode) {
		// the step mode need to do an additional check before skipping the passthrough (i.e. >>) stories
		stepMode = (stepMode) ? true : false;

		const currentStory = this.getStoryAt(currentIdx);

		if (currentStory) {
			currentStory.hideAllOverlays();
		}

		// get the immediate next story
		let nextIdx = currentIdx + 1;
		let nextStory = this.getStoryAt(nextIdx);

		// Skip the "Passthrough" stories
		for (; nextStory && nextStory.isPassthrough();) {
			// if we are in stepMode and the story has some annotation, then, we show it. 
			if (stepMode && nextStory.hasOverlays()) {
				break;
			}

			const nextNextIdx = nextIdx + 1;
			const nextNextStory = this.getStoryAt(nextNextIdx);
			if (nextNextStory && nextNextStory.parentStory == nextStory) {
				nextIdx = nextNextIdx;
				nextStory = nextNextStory;
			}
			// otherwise, this nextNextStory is not a child of the nextStory, so we ignore it, and stick with the nextStory
			else {
				break;
			}
		}

		var excludeSet = (nextStory) ? nextStory.pathSet() : null;
		this.hideAll(excludeSet);

		this.showStory(nextStory);

		if (nextStory) {
			nextStory.hideAllOverlays();
		}
		return (nextStory) ? nextIdx : -1;
	};

	Storyboard.prototype.makePrevStoryVisible = function (currentIdx, showLastOverlay, stepMode) {

		// the step mode need to do an additional check before skipping the passthrough (i.e. >>) stories
		stepMode = (stepMode) ? true : false;

		// get the immediate prevStory
		let prevStoryIdx = currentIdx - 1;
		let prevStory = this.getStoryAt(prevStoryIdx);

		// find the previous non fast forward layer.
		let currentStory = this.getStoryAt(currentIdx);
		for (; prevStory && prevStory.name().startsWith('>>') && currentStory.parentStory == prevStory;) {
			if (prevStory.isPassthrough() && prevStory.hasOverlays()) {
				break;
			}
			prevStoryIdx -= 1;
			currentStory = prevStory;
			prevStory = this.getStoryAt(prevStoryIdx);
		}


		var excludeSet = (prevStory) ? prevStory.pathSet() : null;
		this.hideAll(excludeSet);

		this.showStory(prevStory);
		if (showLastOverlay && prevStory.hasOverlays()) {
			prevStory.hideAllOverlaysBut(prevStory.overlays.length - 1);
		}
	};

	// return true if the story has been found and shown
	// NOTE: DEPRECATED - Not used anymore,
	Storyboard.prototype.makeChildStoryVisible = function (story) {
		if (story) {
			story.hideAllOverlaysBut(-1);
			story.parentStory.hideAllStoriesBut(story);
			story.show();
			return true;
		} else {
			return false;
		}
	};

	Storyboard.prototype.hideAll = function (excludeSet) {
		this.stories.forEach(function (story) {
			if (!excludeSet || !excludeSet.has(story)) {
				story.hide();
			}
		});
	};

	Storyboard.prototype.showStory = function (story) {
		if (story) {
			story.show(true);
		}
	};

	Storyboard.prototype.hasGrid = function () {
		return (this.grid) ? true : false;
	};

	Storyboard.prototype.hideGrid = function () {
		if (this.hasGrid()) {
			this.grid.setIsVisible(false);
		}
	};

	Storyboard.prototype.showGrid = function () {
		if (this.hasGrid()) {
			this.grid.setIsVisible(true);
		}
	};


	Storyboard.prototype.toString = function () {
		var r = ["Storyboard",
			"stories.length: " + this.stories.length
		];


		if (this.stories) {
			r.push("Stories:");
			var names = [];
			this.stories.forEach(function (s) {
				var txt = "[" + s.idx + "]";
				if (s.layer.isVisible()) {
					txt += "+";
				}
				txt += " " + s.name();
				if (s.parentStory) {
					txt += " (" + s.parentStory.name() + ")";
				}
				names.push(txt);
			});
			r.push(names.join(", "));
		}
		return r.join(" ");
	};

	// --------- Private Methods --------- //
	function load() {
		var storyboard = this;
		var rootLayer = storyboard.layer;

		loadLayerTree(storyboard, rootLayer);
		// put the storyboard.grid from the first story .grid
		storyboard.grid = storyboard.stories[0].grid;
	}
	// --------- /Private Methods --------- //

	// private functions
	function loadLayerTree(storyboard, parentLayer, parentStory) {
		// the storyboard layer is always a Story (but might be .skip = true )
		if (isStoryLayer(parentLayer) || storyboard.layer === parentLayer) {
			parentStory = new Story(storyboard, parentLayer, parentStory);
			storyboard.addStory(parentStory);
			// var idx = storyboard.stories.length;
			// storyboard.stories.push(parentStory);
			// parentStory.idx = idx;
		}
		// 
		var story = parentStory || storyboard;

		var layers = getLayers(parentLayer);

		if (layers != null && layers.length > 0) {
			layers.forEach(function (layer) {
				var name = "" + layer.name();

				// TODO: we might want to do this only if the parentLayer is the story.layer

				if (isOverlayName(name)) {
					story.overlays.push(layer);
				} else if (isGridName(name)) {
					story.grid = layer;
				}

				loadLayerTree(storyboard, layer, parentStory);
			});
		}
	}


})();



// --------- /Storyboard --------- //


// --------- Story --------- //
function Story(storyboard, layer, parentStory) {
	this.storyboard = storyboard;
	this.layer = layer;
	this.parentStory = (parentStory) ? parentStory : null;
	this.overlays = [];
	var className = "" + layer.class();
	this.skip = false;
	this._isArtboard = (className === "MSArtboardGroup");
}


(function () {

	Story.prototype.name = function () {
		return getLayerName(this.layer);
	};

	Story.prototype.isArtboard = function () {
		return this._isArtboard;
	};

	Story.prototype.isPassthrough = function () {
		return this.name().startsWith('>>');
	};

	Story.prototype.getSuffixName = function () {
		// if artboard, then, no suffixName
		if (this.isArtboard()) {
			return "";
		}

		var name = this.name();
		// remove the eventual ">"
		if (name.indexOf(">") === 0) {
			name = name.substring(1);
		}
		// remove the eventual second ">"
		if (name.indexOf(">") === 0) {
			name = name.substring(1);
		}

		return name;
	};

	Story.prototype.getGrid = function () {
		return this.grid || this.storyboard.grid;
	};

	Story.prototype.parentSet = function () {
		var set = new Set();
		var parentStory = this.parentStory;
		while (parentStory) {
			set.add(parentStory);
			parentStory = parentStory.parentStory;
		}
		return set;
	};

	Story.prototype.pathSet = function () {
		var set = new Set();
		var story = this;
		while (story) {
			set.add(story);
			story = story.parentStory;
		}
		return set;
	};

	Story.prototype.isTop = function () {
		return (this.parentStory) ? false : true;
	};

	Story.prototype.hasOverlays = function () {
		return (this.overlays.length > 0);
	};

	Story.prototype.isVisible = function () {
		return this.layer.isVisible();
	};

	Story.prototype.hide = function (toTop) {
		toTop = (toTop === true) ? true : false;

		// never hide artboard
		if (!this.isArtboard()) {
			this.layer.setIsVisible(false);
		}

		if (toTop) {
			var parent = this.parentStory;
			while (parent) {
				parent.hide();
				parent = parent.parentStory;
			}
		}
	};

	Story.prototype.show = function (toTop) {
		toTop = (toTop === true) ? true : false;

		this.layer.setIsVisible(true);

		if (toTop) {
			var parent = this.parentStory;
			while (parent) {
				parent.show();
				parent = parent.parentStory;
			}
		}
	};

	Story.prototype.getFirstVisibleOverlayIndex = function () {
		return this.overlays.findIndex(function (l) { return (true && l.isVisible()); });
	};

	Story.prototype.hideAllOverlays = function () {
		this.hideAllOverlaysBut(-1);
	};

	Story.prototype.hideAllOverlaysBut = function (idx) {
		var i, l = this.overlays.length, overlay;
		for (i = 0; i < l; i++) {
			overlay = this.overlays[i];
			if (i !== idx) {
				overlay.setIsVisible(false);
			} else {
				overlay.setIsVisible(true);
			}
		}
	};

	Story.prototype.isLastOverlay = function (overlay) {
		var idx = this.overlays.findIndex(function (l) { return (l === overlay); });
		return (idx !== -1 && idx < this.overlays.length - 1);
	};


})();
// --------- /Story --------- //


// --------- Helpers --------- //
function getLayers(layer) {
	if (layer.layers) {
		return Array.prototype.slice.call(layer.layers()).reverse();
	} else {
		return null;
	}
}

function getLayerName(layer) {
	var name = "" + layer.name();
	return name.trim();
}

//var RGX_STORY_PREFIX = /^(-\d)\d\d*-.*-$/;
var RGX_STORY_PREFIX = /^>.*$/;
var RGX_OVERLAY = /^\(.*\)$/;
var RGX_GRID = /^_grid_$/;

function isStoryLayer(layer) {
	var className = "" + layer.class();
	var isStory = (className !== "MSTextLayer");
	var name = "" + layer.name();
	isStory = isStory && isStoryName(name);
	return isStory;
}

function isStoryName(name) {
	return matches(RGX_STORY_PREFIX, name);
}

function isOverlayName(name) {
	return matches(RGX_OVERLAY, name);
}

function isGridName(name) {
	return matches(RGX_GRID, name);
}
// --------- /Helpers --------- //