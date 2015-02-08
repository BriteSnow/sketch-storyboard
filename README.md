### About

Story Exporter is a Ketch 3.2.2+ plugin that exports a Sketch file to a set of story like .pngs and with their eventual annotation variant. Perfect to export in one shortcut a full actionable story flow and dev specification. 

### Concept

- Naming convention is designed to alphabatically ordered. 
- Artboards are the main screen or "story layer", and can have sub "story layers" (each will be exported in separate pngs files)
- "story layers" are named with the following format 01-A-.... so, [two digits]-[one upercase letter]-[any name]
- The top "story layer" (i.e. the artboard one) can have a special "_grid_" layer that will be exported in a separate "...-grid-...png" file and with all the eventual "overlay" screens. 
- Any "story layer" can have a one or more "overlay layers" that starts and end by "-" (e.g., -annotations-) which will also result in a separate png with the parent story layer active (it will get hidden for the other export)

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

Then, the ...-grid-... version is exproted for the 02-... because the 02-A- artboard as the ```_grid_```
- taskmanager-spec-grid-02-A-ProjectList.png (this is because we had the special ```_grid_```)
- taskmanager-spec-grid-02-B-AddProject.png (this is because we had the special ```_grid_```)

and finally, the 03-A... and 03-B have some "overlay layers"
- taskmanager-spec-overlay-03-A-ProjectView.png (because we got the -overlay- as children of 03-A-ProjectView)
- taskmanager-spec-annotations-03-B-AddTicket.png (because we have the "-annotations-" as direct children of 03-B...)


## Install

- Find your Sketch folder by going to: "Plugins > Reveal Plugins Folder..."
- Copy this folder to this "Plugins"
    + You can 