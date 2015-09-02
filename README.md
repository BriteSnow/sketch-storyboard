### About

Sketch Storyboard is a Sketch plugin which turns your sketch Artboards into Storyboards that can be easily exported as a set of .pngs or looped through via the plugin menus "Next Story" and "Prev Story." Everything is based on group layer naming convention, and support "Story Layers" as well as "Overlay Layers" concepts.

## Install

- Download and Unzip [sketch-storyboard-master.zip](https://github.com/BriteSnow/sketch-storyboard/archive/master.zip)
- rename the unzipped folder to "Sketch Storyboard"
- Move the "Sketch Storyboard" folder into the Sketch Plugins folder (To find your Sketch folder, in Sketch menu, go to: "Plugins > Reveal Plugins Folder...")
- Now, in Sketch, you should see "Plugins > Sketch Storyboard > 0. Story Export"

### Concept

This plugins is driven by a layer naming convention. "Special" layers start and end with "-". 

- Naming convention is designed to alphabatically ordered. 
- Artboards are the main screens or "top story layer", and can have sub "story layers" (each will be exported in separate pngs files)
- Each "story layer" will result in at least one png. Sub story layers will be hidden, and shown one by one before export.
- "story layers" are named with the following format ```-01-A-Any Name-``` so, -[two or more digits]-[any name]- 
- The "top story layer" (i.e. the artboard one) can have a special ```-_grid_-``` layer, which if present, will be exported in a separate "...-GRID-...png" file. 
- Any "story layer" can have a zero or more "overlay layers" that starts and start with "-(" and end with ")-" for example ```-(annotations)-``` , which will also result in a separate png with the parent story layer active (it will get hidden for the other export)

### Shortcuts

When a artboard that have "story layers" is selected, you can use the following command to navigate and export a storyboard.

- CMD CTRL P (for previous story)
- CMD CTRL N (for next story)
- CMD CTRL E (export current storyboard, an artboard/storyboard must be selected)

Global command (does not require to select a storyboard)

- CMD CTRL A (export all storyboard from page)


### Example

In a file "taskmanager-spec.sketch"

+ ```-01-A-Dashboard- ``` (first artboard)
    * ```some layer```
    * ```some layer```
    * ```-01-B-Dashboard-Add-widget-``` (this will be hidden while exporting 01-A.. and set visible when exporting 01-B-...)
+ ```-02-A-ProjectList-``` (second artboard)
    * ```some layer```
    * ```-02-B-AddProject-```
    * ```some layer```
    * ```-_grid_-``` (this is a special layer that will be included in the variants)
+ ```-03-A-ProjectView-``` (third artboard)
    * ```some layer```
    * ```-(overlay)-```
    * ```-03-B-AddTicket-```
        - ```-(annotations)-```
    * ```some other layer```

**Will result in the following exports:**

The default story files (all variant layers are hidden as well as the ```_grid_```): 
- ```taskmanager-spec-01-A-Dashboard.png```
- ```taskmanager-spec-01-B-Dashboard-Add-widget.png```
- ```taskmanager-spec-02-A-ProjectList.png```
- ```taskmanager-spec-02-B-AddProject.png```
- ```taskmanager-spec-03-A-ProjectView.png```
- ```taskmanager-spec-03-B-AddTicket.png```

Then, since the 03-A-ProjectList artboard has the special ```_grid_``` layer, a "...-grid-..."" version of all the story layers for this artboard are exported as well. 
- ```taskmanager-spec-GRID-02-A-ProjectList.png```
- ```taskmanager-spec-GRID-02-B-AddProject.png ```

and finally, the story layers "03-A-ProjectView" and "03-B-AddTicket" has each an "overlay layer" name "-annotations-" and "-overlay-" respetively, which will result in the export of these two additional files: 
- ```taskmanager-spec-OVERLAY-03-A-ProjectView-(overlay).png``` (contains the -(overlay)- layer)
- ```taskmanager-spec-OVERLAY-03-B-AddTicket-(annotations).png``` (contains the "-(annotations)-")


## Possible issue of empty exports

Sometime, there might be an issue when exporting at valid artboard/storyboard with many stories does not export any files even if it displayed it did. 

This can come from two things: 

1) Make sure you do not have spaces or special characters in your folder path of file names. "-" are ok. 

2) Could be a weird OSX Sandbox issues, and the best way is to reinstall the application. 
    
    - a) Shutdown sketch 
    - b) Delete the folder /Users/your_user_name/Containers/com.bohemiancoding.sketch3
    - c) Delete the Sketch.app in Applications folder
    - d) Open App Store, go to Purchases tab, search for sketch, and click on install
    - e) Launch Sketch.app from Applications folder
    - f) Reinstall plugins with Sketch Toolbox (you might have to "uninstall" and "install" them as Sketch Toolbox keeps its own cache of what was installed)
    - g) Now, export should work. 

