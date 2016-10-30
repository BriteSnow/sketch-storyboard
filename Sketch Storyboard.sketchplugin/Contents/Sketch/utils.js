// jshint ignore: start
@import 'sandbox.js'
@import 'Storyboard.js'

// --------- Sketch Helpers --------- //
function getArtboards(doc){	
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

function getCurrentArtboard(context){
	return context.document.currentPage().currentArtboard()
}

// return the current arboard if one selected, or null
function getSelectedArtboard(doc){
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


// --------- JS Utils --------- //
function pad(num, width){
	return Array(Math.max(width - String(num).length + 1, 0)).join("0") + num;
}

function matches(rgx,name){
	var r = rgx.exec(name);
	return (r != null)?true:false;
}

function sortByStories(list){
	return list.sort(function(a,b){
		var aName = a.name();
		var bName = b.name();
		if (aName === bName){
			if (b.parentStory === a){
				return -1;
			}else{
				return 1;
			}
		}else{
			return a.name() > b.name() ? 1 : -1;	
		}
		
	});
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

