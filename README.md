# @v0rt4c/otbm

## Information 

This library can (parse/read) and write binary .OTBM open Tibia binary map files.
It should support all .OTBM map files up to version 3 that have been created with the popular open Tibia map editor from [Remere](https://github.com/hampusborgos/rme).

However, when it comes to some items (splash, fluid container and stackable). You need the corresponding .OTB file to be able to read and write them correctly. This is because the .OTBM file itself has no information of what kind of items it holds. Therefore some attributes might be missing for these items. More specifically for stackable items the count, for splash items what kind of splash it is (water, beer, manafluid) etc... I've tried to mitigate this problem for most cases by saving any unknown attribute value to an attribute property named subType.

During tests on a Macbook air with an M1 processor this library has proven to be relatively fast. It will parse a ~65MB .OTBM file and structure it up into a JavaScript object nodal tree in ~3.5 seconds. For reference a 65MB .OTBM map file is the equivalent of the whole Tibia world in version 7.4. Writing from the structured nodal tree back into .OTBM binary format again takes about half the time on the same computer, so for this example about 1.8 seconds.

### Compatability
The library has been created with compatability in mind. Therefore all work with binary data is done with Uint8Arrays that exist natively on all JS platforms (NodeJS, Deno & Browser). It does not use or require any third party dependencies. 

### Use cases
With this library you can create tools for working/editing/creating .OTBM files. You could even create a modern map editor that runs in the browser.

# How to use

## NodeJS / Browserify
**ES6**
```
import { OTBMReader, OTBMWriter } from '@v0rt4c/otbm';
```
**CommonJS**
```
const { OTBMReader, OTBMWriter } = require('@v0rt4c/otbm');
```

## Deno
```
import { OTBMReader, OTBMWriter } from 'https://deno.land/x/v0rt4c_otbm@0.2.0/mod.ts';
```

## All platforms
import the raw .OTBM buffer however you like, for example with fs.readFile in node, Deno.readFile for deno or with
a file input for browsers. Convert the buffer to an Uint8Array then:

### Reading

```
const reader = new OTBMReader(otbmFileBuffer);
const nodeTree = reader.getRootNode();
```

### Writing
```
const writer = new OTBMWriter(nodeTree);
const otbmBuffer = writer.writeBuffer();
```

# The tree
After parsing the .OTBM file you will receive a javascript object tree structure that looks like this:

```
<ref *1> RootNode {
  properties: {},
  parent: null,
  children: [
    MapData {
      properties: { description: [Array], spawnFile: "map-spawn.xml", houseFile: "map-house.xml" },
      parent: [Circular *1],
      children: [ [Object], [Object], [Object] ],
      prevSibling: null,
      nextSibling: null,
      type: 2
    }
  ],
  prevSibling: null,
  nextSibling: null,
  type: 0,
  version: 2,
  width: 2048,
  height: 2048,
  itemMinorVersion: 3,
  itemMajorVersion: 57
}
```

This structure resembles the browser DOM tree structure. And you can traverse it in a similar way.  
Each node in the map has a parent, prevSibling, nextSibling and a children property. Each node also has firstChild and lastChild getters.

The children propery is an array of nodes (If children exists).
If no prevSibling, nextSibling, firstChild or lastChild exists these will be null. 

If you instead want a clean JavaScript object representation of the node tree you can call the asRawObject() method on the
root node. 

```
const reader = new OTBMReader(otbmFileBuffer);
const nodeTree = reader.getRootNode().asRawObject();
```

