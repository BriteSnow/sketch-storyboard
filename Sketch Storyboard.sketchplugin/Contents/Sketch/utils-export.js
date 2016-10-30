// jshint ignore: start
@import 'sandbox.js'
@import 'Storyboard.js'
@import 'utils.js'


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

function saveArtboard(doc, artboard,fullPath){

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
	// COScript.currentCOScript().garbageCollect()
	// [NSThread sleepForTimeInterval:.2]	
}

function in_sandbox(){
  var environ = [[NSProcessInfo processInfo] environment];
  return (nil != [environ objectForKey:@"APP_SANDBOX_CONTAINER_ID"]);
}
// --------- /Sketch Save Helpers --------- //

// --------- Storyboard Export Methods --------- //
function exportArtboardStories(doc, artboard, baseFilePath, dryrun){	
	var logs = [];
	var storyboard = new Storyboard(artboard);
	
	var artboardName = "" + artboard.name();

	if (artboardName.indexOf(">") === 0){
		artboardName = artboardName.substring(1);
	}

	baseFilePath = baseFilePath + artboardName;

	storyboard.init();

	storyboard.hideAll();
	
	// export the topStory
	// var exportStoryLogs = exportStory(doc, storyboard.topStory,baseFilePath, dryrun);
	// logs.push.call(logs,exportStoryLogs);

	var nextStoryIdx = storyboard.makeNextStoryVisible(-1);
	var story = storyboard.getStoryAt(nextStoryIdx);
	while (story){
		exportStoryLogs = exportStory(doc, story,baseFilePath, dryrun);
		logs.push.apply(logs,exportStoryLogs);		
		nextStoryIdx = storyboard.makeNextStoryVisible(nextStoryIdx);
		story = storyboard.getStoryAt(nextStoryIdx);
	}
	
	storyboard.hideAll();

	return logs;
}

function exportStory(doc, story, baseFilePath, dryrun){
	var logs = [];

	story.hideAllOverlays();
	var storyboard = story.storyboard;
	var artboard = storyboard.artboard;

	// remove the ">"
	var storyName = story.name();
	// if it isArtboard, then, just empty name (the name is already in the path)
	if (story.isArtboard()){
		storyName = "";
	}
	// otherwise, if it start with a ">" (as it should except in some case for the storyboard story), remove it
	else if (storyName.indexOf(">") === 0){
		storyName = storyName.substring(1);
	}
	storyName = storyName.trim();

	// pad the index (for now with 2).
	var num = story.idx;
	var numStr = pad(num,2);
	// add - only if we have a not empty storyName
	storyPathName = numStr + ((storyName.length > 0)?"-":"") + storyName;
	//log("export.. " + storyName + " " + storyName);
	// export the top one
	var fullPath = baseFilePath + "-" + storyPathName + ".png";
	logs.push(fullPath);
	if (!dryrun){
		saveArtboard(doc, artboard,fullPath);	
	}	

	// export the grid
	if (storyboard.hasGrid()){
		fullPath = baseFilePath + "-GRID-" + storyPathName + ".png";
		storyboard.showGrid();
		logs.push(fullPath);
		if (!dryrun){
			saveArtboard(doc, artboard,fullPath);
		}
		storyboard.hideGrid();
	}
	
	// export the overlays
	if (story.hasOverlays()){
		story.overlays.forEach(function(overlay){		
			overlay.setIsVisible(true);
			var overlayName = overlay.name();
			fullPath = baseFilePath + "-" + storyPathName + "+" + overlayName + ".png";
			logs.push(fullPath);
			if (!dryrun){
				saveArtboard(doc, artboard,fullPath);
			}
			overlay.setIsVisible(false);
		});
	}

	return logs;
}
// --------- /Storyboard Export Methods --------- //

