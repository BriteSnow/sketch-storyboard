
## About

Turns your sketch Artboards into Storyboards that can be easily exported as a set of .pngs or looped through via the plugin menus "Next Story" and "Prev Story." Everything is based on group layer naming convention, and support "Story Layers" as well as "Overlay Layers" concepts.

- **NEW IN 0.9.2: Passthrough stories** Layers starting with `>>` (passthrough story) are skipped in favor of their first child, but are still part of their peer stories cycle. (this allows to have some base elements for a group of nested stories). See [sketch-storyboard-demo.sketch](http://files.britesnow.com/sketch-storyboard/sketch-storyboard-demo.sketch)
- **NEW IN 0.9.2 - Support Sketch plugin update system**.

## Install

**Latest version:** 0.9.2

**Initial install:**

- Download and Unzip [sketch-storyboard-v-0.9.2.zip](https://github.com/BriteSnow/sketch-storyboard/archive/v-0.9.2.zip)
- Unzip and double click on  **Sketch Storyboard.sketchplugin** 

**Updates**

- As of v-0.9.2, Sketch Storyboard supports Sketchapp plugin update system (Plugins > Manage Plugins...)

## Features: 

- To make a **layer** a **Story Layer** just prefix it with `>` (i.e. `>my first story layer`)
- Then, you will be able to loop through **Story Layers** with `Plugins > Storyboard > Next Story` or press `cmd ctrl N`
- You can also add make **layer** an **Annotation Layer** by just naming it in between `()` (i.e. `(my annotation)` )
- Then, you can loop through the **Story Layers** and their **Annotation Layers** with `Plugins > Storyboard > Next Step` *(cmd ctrl shift N)*
- You can export all the stories and layers with `cmd ctrl E`
- **NEW IN 0.9.2: Passthrough stories** Layers starting with `>>` (passthrough story) are skipped in favor of their first child, but are still part of their peer stories cycle. (this allows to have some base elements for a group of nested stories). See [sketch-storyboard-demo.sketch](http://files.britesnow.com/sketch-storyboard/sketch-storyboard-demo.sketch)
- **NEW IN 0.9.2 - Support Sketch plugin update system**.


## Example

Open Demo/Example [sketch-storyboard-demo.sketch](http://files.britesnow.com/sketch-storyboard/sketch-storyboard-demo.sketch)

- Install sketch storyboard
- Download the file above. 
- Select the `Test-Simple` artboard
- Press `cmd ctrl N` to loop through each story
- Press `cmd ctrl shift N` to loop through each story and each of their annotation
- Select `Test-Advanced` artboard, and do the same. 


You can also export all of those "steps" by doing a `cmd ctrl E`

## Exporting 

#### Exporting `Test-Simple`

![Sketch-Storyboard Doc 01](http://files.britesnow.com/sketch-storyboard/sketch-storyboard-doc-01.png)

Will generate: 
- `Test-Simple-00.png`
- `Test-Simple-01-A.png`
- `Test-Simple-02-B.png`
- `Test-Simple-02-B+(annotation).png`
- `Test-Simple-03-C.png`

#### Exporting `Test-Advanced`

![Sketch-Storyboard Doc 02](http://files.britesnow.com/sketch-storyboard/sketch-storyboard-doc-02.png)

Will generate:
- `Test-Advanced-00.png`
- `Test-Advanced-00+(annotation).png`
- `Test-Advanced-01-A.png`
- `Test-Advanced-02-B.png`
- `Test-Advanced-02-B+(annotation).png`
- `Test-Advanced-03-Bs+(some annotations).png`
- `Test-Advanced-04-B.1.png`
- `Test-Advanced-05-B.2.png`
- `Test-Advanced-05-B.2+(annotation).png`
- `Test-Advanced-06-B.3.png`
- `Test-Advanced-06-B.3+(annotation).png`
- `Test-Advanced-07-C.png`
- `Test-Advanced-GRID-00.png`
- `Test-Advanced-GRID-01-A.png`
- `Test-Advanced-GRID-02-B.png`
- `Test-Advanced-GRID-04-B.1.png`
- `Test-Advanced-GRID-05-B.2.png`
- `Test-Advanced-GRID-06-B.3.png`
- `Test-Advanced-GRID-07-C.png`


#### Exporting `Test-Simple-With-Exports`
You can also add exports setting per artboard and the stories export will follow those settings. 

So, assumeing the "Test-Simple above" with two export settings `1x scale, "" suffix, and .png format` and `2x scale, "@2x" suffix, and .png format`, the export will be:

- `Test-Simple-With-Exports-00.png`
- `Test-Simple-With-Exports-01-A.png`
- `Test-Simple-With-Exports-02-B.png`
- `Test-Simple-With-Exports-02-B+(annotation).png`
- `Test-Simple-With-Exports-03-C.png`
- `Test-Simple-With-Exports@2x-00.png`
- `Test-Simple-With-Exports@2x-01-A.png`
- `Test-Simple-With-Exports@2x-02-B.png`
- `Test-Simple-With-Exports@2x-03-C.png`

Note that the grid and annotation export won't follow the export settings and will be exported 1x, png, and no suffix. 



## Next Features

- Follow the artboard export settings to export each story/annotation/grid
- Add `cmd ctrl S` to toggle layer as story layer (will just add/remove the leading `>`)
- Add `cmd ctrl A` to toggler a lyer as an annotation layer (will just add/remove the `()`)

## Legacy naming upgrade

Prior to 0.9.0, the naming convention was relatively cryptic and was relying on the user to name the story layers in a orderly fashion. 0.9.0 dramatically simplify this as it automatically index the stories based on their layer order.

Consequently, to update to the new naming convention you can simply: 
- Prefix the legacy `-01-...-` **Story Layer** names with `>` as `>-01-...-` (you can obviously remove the number and `-` all together now)
- Remove the `-` for the legacy **Annotation Layer** so `-(my annotation)-` should become simply `(my annotation)`
- Remove the `-` for the **grid layer**, so `-_grid_-` should become simply `_grid_`


