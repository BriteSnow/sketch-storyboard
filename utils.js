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

function getLayers(artboard, rgx, deep){ // 
	deep = (deep === true)?true:false;
	var layers = [];

	_getLayers(artboard,rgx,deep,layers);

	return sortByName(layers);
}

function _getLayers(parent, rgx, deep, layers){
	var className = "" + parent.class();
	// for now, constrains to LayerGroup/ArtboardGroup to avoid crash (when too many layers)	
	if ("MSArtboardGroup" == className || "MSLayerGroup" == className){

		// for now, if story layer (recursive), then avoid going down variant and grid group
		var parentName = parent.name()
		if (rgx === RGX_STORY_PREFIX && (matches(RGX_GRID,parentName) || matches(RGX_VARIANT,parentName))){
			return;	
		}

		var layer_array = [parent layers]
		var i, count = [layer_array count], layer, name;

		for (i = 0; i < count; i++){

			layer = [layer_array objectAtIndex: i];
			name = layer.name();

			if ((typeof rgx === "undefined") || rgx && matches(rgx,name) ){
				layers.push(layer);		
			}
			if (deep){

				_getLayers(layer, rgx, deep, layers);
			}
		}
	}
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


	[doc showMessage:"Saved as " + fullPath + ".png"];
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

	var storyCtx = storyboard.makeNextStoryVisible();

	while (storyCtx){
		exportStory(storyCtx.story,baseFilePath);
		storyCtx = storyboard.makeNextStoryVisible();
	}
	
	storyboard.hideAll();
}

function exportStory(story,baseFilePath){
	story.hideAll();

	var storyboard = story.storyboard;
	var artboard = storyboard.artboard;

	// export the top one
	var fullPath = baseFilePath + story.name() + ".png";
	saveArtboard(artboard,fullPath);	

	// export the grid
	if (storyboard.hasGrid()){
		fullPath = baseFilePath + "grid-" + story.name() + ".png";
		storyboard.showGrid();
		saveArtboard(artboard,fullPath);
		storyboard.hideGrid();
	}

	// export the overlays
	if (story.hasOverlays()){
		story.overlays.forEach(function(overlay){
			overlay.setIsVisible(true);
			var name = overlay.name().substring(1);
			fullPath = baseFilePath + name + story.name() + ".png";
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

