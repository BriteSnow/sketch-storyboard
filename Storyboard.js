// jshint ignore: start

// --------- Storyboard --------- //
function Storyboard(artboard){
	this.artboard = artboard;
	this.storyCount = 0;
	this.overlayCount = 0;
	this.flatStories = [];	
}

(function(){
	Storyboard.prototype.init = function(){
		this.topStory = new Story(this,this.artboard,null);
		this.storyCount++;
		this.topStory.init();
		this.flatStories = sortByName(this.flatStories);
	};

	Storyboard.prototype.addFlatStory = function(story){
		this.flatStories.push(story);
	};

	Storyboard.prototype.getFlatStoryAt = function(idx){
		if (idx >= 0 && idx < this.flatStories.length){
			return this.flatStories[idx];	
		}else{
			return null;
		}
	};

	// return the flat index of this story, or -1 if not found.
	Storyboard.prototype.getFlatIdxOf = function(story){
		var i, l = this.flatStories.length;
		for (i = 0; i < l; i++){
			if (story === this.flatStories[i]){
				return i;
			}
		}
		return -1;
	};

	// recursively find the leaft first Story
	Storyboard.prototype.findFirstVisibleStory = function(){
		var parentStory = this.topStory;

		var firstVisibleStory = null;

		var tmpStory = null;
		while (parentStory && parentStory.hasStories()){
			tmpStory = parentStory.findFirstVisibleStory();
			if (tmpStory){
				firstVisibleStory = tmpStory;
				parentStory = tmpStory;
			}else{
				parentStory = null; // to stop the loop
			}
		}
		return firstVisibleStory;
	};

	// return flatIdx for the next story or -1 if none
	Storyboard.prototype.makeNextStoryVisible = function(currentFlatIdx){
		

		var currentStory = this.getFlatStoryAt(currentFlatIdx);
		var nextStoryFlatIdx = currentFlatIdx + 1;
		var nextStory = this.getFlatStoryAt(nextStoryFlatIdx);

		hideStory(currentStory);
		showStory(nextStory);

		if (nextStory){
			return nextStoryFlatIdx;
		}else{
			return -1;
		}

	};

	Storyboard.prototype.makePrevStoryVisible = function(currentFlatIdx){

		var currentStory = this.getFlatStoryAt(currentFlatIdx);
		var prevStoryFlatIdx = currentFlatIdx - 1;
		var prevStory = this.getFlatStoryAt(prevStoryFlatIdx);

		hideStory(currentStory);
		showStory(prevStory);

		if (prevStory){
			return prevStoryFlatIdx;
		}else{
			return -1;
		}
		
	};

	// return true if the story has been found and shown
	Storyboard.prototype.makeChildStoryVisible = function(story){
		if (story){
			story.hideAllOverlaysBut(-1);
			parentStory.hideAllStoriesBut(story);
			story.show();
			return true;
		}else{
			return false;
		}
	};

	// hide all of the sub stories, overlays, and eventual grid from topStory
	Storyboard.prototype.hideAll = function(){
		this.topStory.hideAll();
	};

	Storyboard.prototype.hasGrid = function(){
		return (this.topStory.grid)?true:false;
	};

	Storyboard.prototype.hideGrid = function(){
		if (this.hasGrid()){
			this.topStory.grid.setIsVisible(false);
		}
	};

	Storyboard.prototype.showGrid = function(){
		if (this.hasGrid()){
			this.topStory.grid.setIsVisible(true);
		}
	};


	//// Private Helpers ////

	function showStory(story){
		if (story){
			if (!story.isTop()){
				story.show(true);
				// hide all sub stories
				story.hideAllStoriesBut(null);
				// make sure only this story is shown from the parent
				story.parentStory.hideAllStoriesBut(story);
			}
		}
	}

	function hideStory(story){
		if (story){
			if (!story.isTop()){
				story.hide(true);
			}			
		}
	}
	
})();
// --------- /Storyboard --------- //


// --------- Story --------- //
function Story(storyboard,layer,parentStory){
	this.storyboard = storyboard;
	this.layer = layer;
	this.parentStory = (parentStory)?parentStory:null;
	this.stories = [];
	this.overlays = [];
}


(function(){
	Story.prototype.init = function(){
		// add this story to storyboard.flatStories
		this.storyboard.addFlatStory(this);
		// load stories
		loadStories.call(this);
	};

	Story.prototype.name = function(){
		return this.layer.name();
	};

	Story.prototype.isTop = function(){
		return (this.parentStory)?false:true;
	};	

	Story.prototype.hasStories = function(){
		return (this.stories.length > 0);
	};

	Story.prototype.hasOverlays = function(){
		return (this.overlays.length > 0);
	};

	// return first 
	Story.prototype.findFirstVisibleStory = function(){
		var i, l = this.stories.length, story;
		for (i = 0; i < l; i++){
			story = this.stories[i];
			if (story.layer.isVisible()){
				return story;
			}
		}
		return null;
	};

	Story.prototype.hide = function(toTop){
		toTop = (toTop === true)?true:false;

		this.layer.setIsVisible(false);

		if (toTop){
			var parent = this.parentStory;
			while (parent && !parent.isTop()){
				parent.hide();
				parent = parent.parentStory;
			}
		}
	};

	Story.prototype.show = function(toTop){
		toTop = (toTop === true)?true:false;

		this.layer.setIsVisible(true);

		if (toTop){
			var parent = this.parentStory;
			while (parent && !parent.isTop()){
				parent.show();
				parent = parent.parentStory;
			}
		}
	};

	Story.prototype.hideAll = function(){
		this.hideAllStoriesBut(null);
		this.hideAllOverlaysBut(-1);
		if (this.grid){
			this.grid.setIsVisible(false);
		}
	};

	Story.prototype.hideAllStoriesBut = function(story){
		var i, l = this.stories.length, tmpStory;
		for (i = 0; i < l; i++){
			var tmpStory = this.stories[i];
			if (story !== tmpStory){
				tmpStory.layer.setIsVisible(false);
			}
		}		
	};

	Story.prototype.hideAllOverlaysBut = function(idx){
		var i, l = this.overlays.length, overlay;
		for (i = 0; i < l; i++){
			if (i !== idx){
				overlay = this.overlays[i];
				overlay.setIsVisible(false);
			}
		}				
	};

	// return the Story
	Story.prototype.getStoryAt = function(idx){
		if (idx >= 0 && idx < this.stories.length ){
			return this.stories[idx];	
		}else{
			return null;
		}
	};

	Story.prototype.getLastStoryIdx = function(){
		return this.stories.length - 1;
	};

	// --------- Private Story Methods --------- //
	function loadStories(){
		var parentLayer = this.layer;
		var layer_array = [parentLayer layers];
		var i, count = [layer_array count], layer, name;

		var stories = [];
		for (i = 0; i < count; i++){
			layer = [layer_array objectAtIndex: i];
			name = layer.name();
			if (isStoryLayer(layer)){
				stories.push(new Story(this.storyboard,layer,this));
				this.storyboard.storyCount++;
			}else if (isOverlayName(name)){
				this.overlays.push(layer);
				this.storyboard.overlayCount++;
			}else if (isGridName(name)){
				this.grid = layer;
			}
		}

		this.stories = sortByName(stories);

		this.stories.forEach(function(story){
			story.init();
		});		
	}	
	// --------- /Private Story Methods --------- //

})();
// --------- /Story --------- //


// --------- Helpers --------- //
var RGX_STORY_PREFIX = /^(-\d)\d\d*-.*-$/;
var RGX_OVERLAY = /^-\(.*\)-$/;
var RGX_GRID = /^-_grid_-$/;

function isStoryLayer(layer){
	var className = "" + layer.class();
	var isStory = (className === "MSLayerGroup")
	var isStory = isStory && isStoryName(layer.name());
	return isStory;
}

function isStoryName(name){
	return matches(RGX_STORY_PREFIX,name);
}

function isOverlayName(name){
	return matches(RGX_OVERLAY,name);
}

function isGridName(name){
	return matches(RGX_GRID,name);
}

function getNamePrefix(layerName){
	return layerName.substring(1,layerName.length - 1)
}
// --------- /Helpers --------- //