// jshint ignore: start

#import 'sandbox.js'
#import 'Storyboard.js'

// --------- Sketch Helpers --------- //
function getArtboards(){
	var currentPage = [doc currentPage]

	var artboard_array = [currentPage artboards]
	var artboards = []
	var artboard;

	for(var i=0; i < [artboard_array count]; i++){
		artboard = artboard_array[i];
		if ("MSArtboardGroup" == artboard.class()){
			artboards.push(artboard);	
		}
	}

	return sortByName(artboards);
}

function getCurrentArtboard(){
	var page = [doc currentPage]
	var current = [page currentArtboard]
	return current;
}

// return the current arboard if one selected, or null
function getSelectedArtboard(){
	var page = [doc currentPage]
	var current = [page currentArtboard]
	if (current != null && current.isSelected() === 1){
		return current;
	}else{
		return null;
	}
}

// return {layer:,idx:} of the first visible from a layers array
function getFirstVisible(layers){
	var i, l = layers.length, layer;
	for (i = 0; i < l; i++){
		layer = layers[i];
		if (layer.isVisible()){
			return {layer:layer,idx:i};
		}
	}
	return null;
}
// --------- /Sketch Helpers --------- //

// --------- Sketch Save Helpers --------- //
function pickFolder(baseFolder){
	baseFolder = baseFolder || [@"~/Desktop/" stringByExpandingTildeInPath];
	var openPanel = [NSOpenPanel openPanel]

	openPanel.setCanChooseDirectories(true);
	openPanel.setCanChooseFiles(false);
	openPanel.setCanCreateDirectories(true);
	openPanel.setDirectoryURL([NSURL fileURLWithPath:baseFolder]);
	openPanel.setAllowsMultipleSelection(false);
	openPanel.setTitle("Choose a directory!");
	openPanel.setPrompt("Choose");
	// openPanel.ok(function(){
	// 	log("OK.....")
	// })
	var button = openPanel.runModal();
	if (button == NSFileHandlingPanelOKButton){
		var url = "" + openPanel.URLs()[0];
		return url.substring(7);
	}else{
		return null;
	}
}

function saveArtboard(artboard,fullPath){

	if (in_sandbox()) {
	  var sandboxAccess = AppSandboxFileAccess.init({
	    message: "Please authorize Sketch to write to this folder. You will only need to do this once per folder.",
	    prompt:  "Authorize",
	    title: "Sketch Authorization"
	  });
	  sandboxAccess.accessFilePath_withBlock_persistPermission(fullPath, function(){
	    [doc saveArtboardOrSlice:artboard toFile:fullPath];
	  }, true);
	} else {
	  [doc saveArtboardOrSlice:artboard toFile:fullPath];
	}


	[doc showMessage:"Saved as " + fullPath];

	// Hack: Wait to prevent GC to crash
	COScript.currentCOScript().garbageCollect()
	[NSThread sleepForTimeInterval:.2]	
}

function in_sandbox(){
  var environ = [[NSProcessInfo processInfo] environment];
  return (nil != [environ objectForKey:@"APP_SANDBOX_CONTAINER_ID"]);
}
// --------- /Sketch Save Helpers --------- //

// --------- Storyboard Export Methods --------- //
function exportArtboardStories(artboard, baseFilePath){
	var storyboard = new Storyboard(artboard);
	storyboard.init();

	storyboard.hideAll();

	// export the topStory
	exportStory(storyboard.topStory,baseFilePath);

	var nextStoryFlatIdx = storyboard.makeNextStoryVisible(0);
	var story = storyboard.getFlatStoryAt(nextStoryFlatIdx);
	while (story){
		exportStory(story,baseFilePath);
		nextStoryFlatIdx = storyboard.makeNextStoryVisible(nextStoryFlatIdx);
		story = storyboard.getFlatStoryAt(nextStoryFlatIdx);
	}
	
	storyboard.hideAll();
}

function exportStory(story,baseFilePath){
	story.hideAll();

	var storyboard = story.storyboard;
	var artboard = storyboard.artboard;

	var storyName = getNamePrefix("" + story.name());
	log("export.. " + storyName + " " + storyName);
	// export the top one
	var fullPath = baseFilePath + "-" + storyName + ".png";
	saveArtboard(artboard,fullPath);	

	// export the grid
	if (storyboard.hasGrid()){
		fullPath = baseFilePath + "-_grid_-" + storyName + ".png";
		storyboard.showGrid();
		saveArtboard(artboard,fullPath);
		storyboard.hideGrid();
	}
	
	// export the overlays
	if (story.hasOverlays()){
		story.overlays.forEach(function(overlay){		
			overlay.setIsVisible(true);
			var overlayName = getNamePrefix("" + overlay.name());
			fullPath = baseFilePath + "-" + overlayName + "-" + storyName + ".png";
			saveArtboard(artboard,fullPath);
			overlay.setIsVisible(false);
		});
	}

	
}
// --------- /Storyboard Export Methods --------- //


// --------- JS Utils --------- //
function matches(rgx,name){
	var r = rgx.exec(name)
	return (r != null)?true:false;
}

function sortByName(list){
	return list.sort(function(a,b){
		return a.name() > b.name() ? 1 : -1;
	});
}

function inspect(obj){
	
	var keys = Object.keys(obj);
	var txt = ">> " + obj.class() + " keys: " + keys.length;
	log(txt);
}

