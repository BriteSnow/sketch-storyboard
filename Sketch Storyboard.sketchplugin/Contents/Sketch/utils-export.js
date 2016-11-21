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

	doc.saveArtboardOrSlice_toFile(artboard, fullPath)
	doc.showMessage("Saved as " + fullPath);

	// Hack: Wait to prevent GC to crash
	// COScript.currentCOScript().garbageCollect()
	// [NSThread sleepForTimeInterval:.2]	
}

function saveSlices(doc, slices, folderPath, suffix, dryrun){
	var logs = [];
	var i = 0, l = slices.length, slice, filePath, fileName;
	for (; i < l ; i++){
		slice = slices[i];
		fileName = "" + slice.name() + "-" + suffix + "." + slice.format();
		filePath = folderPath + fileName;
		logs.push(fileName);
		//log("exporting " + fileName);
		if (!dryrun){
			
			doc.saveArtboardOrSlice_toFile(slice, filePath);	
		}			
	}
	return logs;
}

// TO DEPRECATE
function in_sandbox(){
  var environ = [[NSProcessInfo processInfo] environment];
  return (nil != [environ objectForKey:@"APP_SANDBOX_CONTAINER_ID"]);
}
// --------- /Sketch Save Helpers --------- //

// --------- Storyboard Export Methods --------- //
function exportArtboardStories(doc, artboard, folderPath, dryrun){	
	var logs = [];

	var storyboard = new Storyboard(artboard);		
	storyboard.init();
	storyboard.hideAll();

	// export the topStory
	// var exportStoryLogs = exportStory(doc, storyboard.topStory,baseFilePath, dryrun);
	// logs.push.call(logs,exportStoryLogs);

	var nextStoryIdx = storyboard.makeNextStoryVisible(-1);
	var story = storyboard.getStoryAt(nextStoryIdx);
	while (story){
		exportStoryLogs = exportStory(doc, story, folderPath, dryrun);
		logs.push.apply(logs,exportStoryLogs);
		nextStoryIdx = storyboard.makeNextStoryVisible(nextStoryIdx);
		story = storyboard.getStoryAt(nextStoryIdx);
	}
	
	storyboard.hideAll();

	return logs;
}

function exportStory(doc, story, folderPath, dryrun){
	var logs = [];

	story.hideAllOverlays();
	var storyboard = story.storyboard;
	var artboard = storyboard.artboard;

	// pad the index (for now with 2).
	var num = story.idx;
	var numStr = pad(num,2);

	// add - only if we have a not empty storyName
	var storySuffixName = story.getSuffixName();
	var suffix = numStr + ((storySuffixName.length > 0)?"-":"") + storySuffixName;
	//log("export.. " + storyName + " " + storyName);

	// Export the story slice(s)
	// NOTE: slices needs to be request for each story export, because, it "caches" the hide/show state of layers.
	var slices = MSExportRequest.exportRequestsFromExportableLayer(artboard);
	var saveSlicesLogs = saveSlices(doc, slices, folderPath, suffix, dryrun)
	logs.push.apply(logs,saveSlicesLogs);

	var basePath = folderPath + artboard.name();
	var fullPath;

	// export the grid
	if (storyboard.hasGrid()){
		fullPath = basePath + "-GRID-" + suffix + ".png";
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
			fullPath = basePath + "-" + suffix + "+" + overlayName + ".png";
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

