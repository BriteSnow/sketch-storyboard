// jshint ignore: start

// --------- Storyboard --------- //
function Storyboard(artboard){
	this.artboard = artboard;
	this.storyCount = 0;
	this.overlayCount = 0;	
}

(function(){
	Storyboard.prototype.init = function(){
		this.topStory = new Story(this,this.artboard,null);
		this.storyCount++;
		this.topStory.init();
	};

	// return the story info that has been made visible {story:,idx:} or null if nothing later
	Storyboard.prototype.makeNextStoryVisible = function(){
		var parentStory = this.topStory;

		var nextIdx = parentStory.findFirstVisibleStoryIdx() + 1;
		var story = parentStory.getStoryAt(nextIdx); 

		if (story){
			this.makeChildStoryVisible(parentStory, nextIdx);
			return {story:story,idx:nextIdx};
		}else{
			return null;
		}		
	};

	Storyboard.prototype.makePrevStoryVisible = function(){
		var parentStory = this.topStory;

		var firstVisibleStoryIdx = parentStory.findFirstVisibleStoryIdx();
		var prevIdx = firstVisibleStoryIdx -1;

		// because the first story the parent Story
		if (firstVisibleStoryIdx === 0){
			this.hideAll();
			return true;
		}else if (parentStory.getStoryAt(prevIdx)){
			this.makeChildStoryVisible(parentStory, prevIdx);
			return true;
		}else{
			return false;
		}		
	};

	// return true if the story has been found and shown
	Storyboard.prototype.makeChildStoryVisible = function(parentStory,idx){
		var story = parentStory.getStoryAt(idx);
		if (story){
			story.hideAllOverlaysBut(-1);
			parentStory.hideAllStoriesBut(idx);
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
	}

	Storyboard.prototype.hideGrid = function(){
		if (this.hasGrid()){
			this.topStory.grid.setIsVisible(false)
		}
	}	

	Storyboard.prototype.showGrid = function(){
		if (this.hasGrid()){
			this.topStory.grid.setIsVisible(true)
		}
	}
	//// Private Helpers

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
	}

	Story.prototype.hasOverlays = function(){
		return (this.overlays.length > 0);
	}

	// return the index of the first visible subStory or return null
	Story.prototype.findFirstVisibleStoryIdx = function(){
		var i, l = this.stories.length, story;
		for (i = 0; i < l; i++){
			story = this.stories[i];
			if (story.layer.isVisible()){
				return i;
			}
		}
		return -1;
	};

	Story.prototype.show = function(){
		this.layer.setIsVisible(true);
	};

	Story.prototype.hideAll = function(){
		this.hideAllStoriesBut(-1);
		this.hideAllOverlaysBut(-1);
		if (this.grid){
			this.grid.setIsVisible(false);
		}
	}

	Story.prototype.hideAllStoriesBut = function(idx){
		var i, l = this.stories.length, story;
		for (i = 0; i < l; i++){
			if (i !== idx){
				story = this.stories[i];
				story.layer.setIsVisible(false);
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
			if (isStoryName(name)){
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
var RGX_STORY_PREFIX = /^(\d\d*-)/
var RGX_OVERLAY = /^-.*-$/
var RGX_GRID = /^_grid_$/

function isStoryName(name){
	return matches(RGX_STORY_PREFIX,name);
}

function isOverlayName(name){
	return matches(RGX_OVERLAY,name);
}

function isGridName(name){
	return matches(RGX_GRID,name);
}
// --------- /Helpers --------- //