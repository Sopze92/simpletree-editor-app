
# sTrevee Editor [Early WIP]
A tree-view document editor written in python and js

![Dynamic JSON Badge](https://img.shields.io/badge/dynamic/json?url=https%3A%2F%2Fgithub.com%2FSopze92%2Fsimpletree-editor-app%2Fraw%2Fmain%2Fpackage.json&query=%24.version&label=version)

This is a **-personal-** project I started to ease the creation and consulting of the design document of my small (and not so small) projects (often videogame projects), so it's a very humble application I'm creating in my free time.

## ▶️ What is this and what to expect it to turn into:
Some context is needed here: up to this date I create my 'nice-looking' design documents (GDDs in videogames) manually by editing a extensible XML/XSLT template I made long time ago, but I found it very messy and sketchy, as in the end is just editing an XML in a plain text editor (also very tedious if you need new type of elements, attributes, styles or functionalities)

This is actually how my template XMLs look, and therefore how this application's documents aim to look by default (document would be fully stylizable by the user eventually):
<img src=".\_github\xml_preview.webp"/>

Another example:
<img src=".\_github\example_rlevents.webp"/>

That's where this small App will come in handy, it will create this kind of documents, and editing/adding/removing elements in-place as well as drag'n'drop elements, reorganize, create new element groups, types, attributes etc...

Virtually any kind of data can be represented this way, you just need to setup your predefined element types then start building your document

Note to mention that the file handling works through a plugin system, so basically anybody can write custom file importers/exporters for this tool, there are several already planned ones

## ▶️ Current state:
As 0.2.0 is the first -usable- verion, currently it looks way more simpler than the images above, most menus and buttons are just placeholders, but you can compose very basic documents using a set of builtin **types** and **attrs** and save/load files.

### Classes

There are 3 main classes of elements:

  - **item**: a row in the document tree, just displays its **attrs**
  - **group**: an item that can also contain elements within its body
  - **block**: same as group, but can be open/closed by clicking on it

### Attrs

-- future: full control of document attrs (add/remove) + custom styles --

The **attrs** are just sections that divide the elements's row in the document tree, and they contain editable data such as text, images, links... among others

builtin **attrs** are:
| Name    | Class   | Description |
| ------- | ------- | ----------- | 
| name    | Simple  | inline text |
| desc    | Simple  | inline text |
| info    | Simple  | inline text |
| warn    | Simple  | internal only |
| error   | Simple  | internal only |
| text    | Simple  | inline text --future rich text-- |
| text    | Text    | paragraph, allows multiline --future rich text-- |
| class   | Simple  | inline text |
| key     | Simple  | inline text |
| value   | Simple  | inline text |
| image   | Image   | image (url or local) |
| link    | Link    | link (url) with label |
| file    | DocLink | another document link (url or local) with label |

**Note**: _The reason of having multiple 'simple texts' is for future styling purposes_<br>
**Note2**: _As attrs can only be used within a type's attr list, there are some currently unused_

### Types

Types are like the element's shape, they're actually what you place in the document to build it, they define its class, and in order to render its own -row- in the document tree, they also define an attr list.

-- future: user-created types + custom attr list + custom style conditions --

builtin **types** are:
| Name  | Class | Attrs                    | 
| ----- | ----- | ------------------------ | 
| obj   | Block | image, name              | 
| blk   | Block | name, desc, info         | 
| grp   | Group | name, desc, info         | 
| itm   | Item  | name, desc, info         | 
| txt   | Item  | text (Simple)            | 
| txt   | Item  | text (Text)              | 
| val   | Item  | key, value               | 
| var   | Item  | class, name, value, desc | 
| lnk   | Item  | name, link               | 
| doc   | Item  | name, file               | 

**Note**: _Its actually possible to create new **types** and **attrs** by manually editing the files with a text editor_

### Features:

**Menubar**<br>
  - File menu: only **new**, **open** and **save** and **save-as** work for now (save does work as save-as)
  - View menu: show/hide **toolbar**, **sidepanel** and **statusbar**, change sidepanel side, 
  - Help menu: only a few links work

**Toolbar** buttons
  - H: Toggle a element hovering overlay, (used for development)
  - D: Toggle a dev overlay, which shows the hierarchy-id of each element (used for development)
  - V: Switch between '**edit**' and '**view**' modes
  - type: **unimplemented**, will be used to toggle the 'type' attr visibility (the one that reads obj, grp, itm, etc...)
  - +/-: expand/contract all the Block items in the document

To edit the document you must be in '**edit**' mode, by now it is the default mode.

**Edit** mode features
  - Add new elements: drag a type from the Type Picker and drop it in your document
  - Select: Click on an item
  - Open/Close Block: Doubleclick on a Block item
  - Edit attr values: Select an item and write onto its fields on the Element Editor
  - Remove an element: Select an item and press the R button on the Element Editor
  - Move element: Drag an element and drop it between tow elements or onto a container element
  - Duplicate element: Move element + hold CTRL while dropping
  - Swap elements: Move element + hold SHIFT while dropping it (must drop on another element)

**View** mode features
  - Open/Close Block: Click on an item

The **Statusbar** shows some info about the currently hovered/selected element

**Note3**: _pressing ESC when editing an attr's field will cancel any unapplied changes_

## ▶️ Support me:
You can support me by just making an any-amount donation [here](https://buymeacoffe.com/sopze) (BuyMeACoffe.com) or do it on [Patreon](https://patreon.com/sopze), where you can (eventually) obtain some extra benefits for yourself

## ▶️ Some history behind this:
I actually took the idea of this audiobank dumps made with [wwiser tool](https://github.com/bnnm/wwiser) when I was investigating how to achieve audio modding for RocketLeague, they looked like this:
<img src=".\_github\wwise_dump.webp"/>
so I took that xml/xslt as reference and made my own extensible version for usage in different scopes, from simple -pretty- lists to more complex grouped elements with thumbnails and metadatas