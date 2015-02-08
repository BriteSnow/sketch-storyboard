### About

Story Exporter is a Sketch plugin which turns a sketch file into an actionable story flow and dev specification as a set of well organized .png files. Just follow the naming convention and Story Exporter will generate the multiple png output for in a clean and ordered way.

## Install

- Download and Unzip [sketch-storexporter-master.zip](https://github.com/BriteSnow/sketch-storyexporter/archive/master.zip)
- rename the unzipped folder to "Story Exporter"
- Move the "Store Exporter" into the Sketch Plugins folder (To find your Sketch folder, in Sketch menu, go to: "Plugins > Reveal Plugins Folder...")
- Now, in Sketch, you should see "Plugins > Story Exporter > 0. Story Export"


### Concept

- Naming convention is designed to alphabatically ordered. 
- Artboards are the main screens or "top story layer", and can have sub "story layers" (each will be exported in separate pngs files)
- Each "story layer" will result in at least one png. Sub story layers will be hidden, and shown one by one before export.
- "story layers" are named with the following format "01-A-Any Name" so, [two digits]-[one upercase letter]-[any name]
- The "top story layer" (i.e. the artboard one) can have a special "_grid_" layer, which if present, will be exported in a separate "...-grid-...png" file and with all the eventual "overlay layers". 
- Any "story layer" can have a zero or more "overlay layers" that starts and end by "-" (e.g., -annotations-) which will also result in a separate png with the parent story layer active (it will get hidden for the other export)

### Example

In a file "taskmanager-spec.sketch"

+ 01-A-Dashboard (first artboard)
    * some layer
    * some layer
    * 01-B-Dashboard-Add-widget (this will be hidden while exporting 01-A.. and set visible when exporting 01-B-...)
+ 02-A-ProjectList (second artboard)
    * some layer
    * 02-B-AddProject
    * some layer
    * ```_grid_``` (this is a special layer that will be included in the variants)
+ 03-A-ProjectView (third artboard)
    * some layer
    * -overlay-
    * 03-B-AddTicket
        - -annotations-
    * some other layer

**Will result in the following exports:**

The default story files (all variant layers are hidden as well as the ```_grid_```): 
- taskmanager-spec-01-A-Dashboard.png
- taskmanager-spec-01-B-Dashboard-Add-widget.png
- taskmanager-spec-02-A-ProjectList.png
- taskmanager-spec-02-B-AddProject.png
- taskmanager-spec-03-A-ProjectView.png
- taskmanager-spec-03-B-AddTicket.png

Then, since the 03-A-ProjectList artboard has the special ```_grid_``` layer, a "...-grid-..."" version of all the story layers for this artboard are exported as well. 
- taskmanager-spec-grid-02-A-ProjectList.png
- taskmanager-spec-grid-02-B-AddProject.png 

and finally, the story layers "03-A-ProjectView" and "03-B-AddTicket" has each an "overlay layer" name "-annotations-" and "-overlay-" respetively, which will result in the export of these two additional files: 
- taskmanager-spec-overlay-03-A-ProjectView.png (contains the -overlay- layer)
- taskmanager-spec-annotations-03-B-AddTicket.png (contains the "-annotations-")


