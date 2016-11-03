
## About

Sketch Storyboard is a Sketch plugin which turns your sketch Artboards into Storyboards that can be easily exported as a set of .pngs or looped through via the plugin menus "Next Story" and "Prev Story." Everything is based on group layer naming convention, and support "Story Layers" as well as "Overlay Layers" concepts.

**IMPORTANT** The version 0.9.0 dramatically simplified the naming convention, see below the migration steps. 

## Install


- Download and Unzip [sketch-storyboard-master.zip](https://github.com/BriteSnow/sketch-storyboard/archive/master.zip)
- under `sketch-storyboard-master/` **double click** on **Sketch Storyboard.sketchplugin** (that should install it)

or 

- Via Sketch Toolbox (search for "storyboard")

_Note: Make sure to check for update once in a while (e.g., monthly)_

## Concept & Instructions

 This plugins allows your to "flag" some layers as story layers, annotation layers, so that you can flip through them easily. 

- To make a **layer** a **Story Layer** just prefix it with `>` (i.e. `>my first story layer`)
- Then, you will be able to loop through **Story Layers** with `Plugins > Storyboard > Next Story` or press `cmd ctrl N`
- You can also add make **layer** an **Annotation Layer** by just naming it in between `()` (i.e. `(my annotation)` )
- Then, you can loop through the **Story Layers** and their **Annotation Layers** with `Plugins > Storyboard > Next Step` *(cmd ctrl shift N)*

## Example

Open Demo/Example [sketch-storyboard-demo.sketch](http://files.britesnow.com/sketch-storyboard/sketch-storyboard-demo.sketch)

- Install sketch storyboard
- Download the file above. 
- Select the `Mickey-Simple` artboard
- Press `cmd ctrl N` to loop through each story
- Press `cmd ctrl shift N` to loop through each story and each of their annotation
- Select `Mickey-Advanced` artboard, and do the same. 


You can also export all of those "steps" by doing a `cmd ctrl E`

## Exporting 
Exporting **Mickey-Simple**
![Sketch-Storyboard Doc 01](http://files.britesnow.com/sketch-storyboard/sketch-storyboard-doc-01.png)

Will generate: 
- `Mickey-Simple-00.png`
- `Mickey-Simple-01-A.png`
- `Mickey-Simple-02-B.png`
- `Mickey-Simple-02-B+(annotation).png`
- `Mickey-Simple-03-C.png`

Exporting **Mickey-Advanced**
![Sketch-Storyboard Doc 01](http://files.britesnow.com/sketch-storyboard/sketch-storyboard-doc-02.png)

Will generate:
- `Mickey-Advanced-01-A.png`
- `Mickey-Advanced-02-Bs.png`
- `Mickey-Advanced-02-Bs+(annotation).png`
- `Mickey-Advanced-03.png`
- `Mickey-Advanced-04-B.1.png`
- `Mickey-Advanced-05-B.2.png`
- `Mickey-Advanced-05-B.2+(annotation).png`
- `Mickey-Advanced-06-C.png`
- `Mickey-Advanced-GRID-00.png`
- `Mickey-Advanced-GRID-01-A.png`
- `Mickey-Advanced-GRID-02-Bs.png`
- `Mickey-Advanced-GRID-03.png`
- `Mickey-Advanced-GRID-04-B.1.png`
- `Mickey-Advanced-GRID-05-B.2.png`
- `Mickey-Advanced-GRID-06-C.png`


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


