# Canvas Table
Fast table implementation in Canvas

## Installation

```
npm i canvas-table
```

## Usage

### Usage in NodeJS

```ts
import { CanvasTable, CTConfig } from "canvas-table";
import { createCanvas } from "canvas";

const canvas = createCanvas(640, 250);
const config: CTConfig = { columns, data };
const ct = new CanvasTable(canvas, config);
await ct.generateTable();
await ct.renderToFile("test-table.png"); // You can get the buffer with renderToBuffer
```

### Usage in Browser

```ts
import { CanvasTable, CTConfig } from "canvas-table";

const canvas = document.getElementById("#canvas");
const config: CTConfig = { columns, data };
const ct = new CanvasTable(canvas, config);
await ct.generateTable();
// const blob = await ct.renderToBlob();
```



## Development

Initialize your environment with

```
npm i
```

To build:

```
npm run build
```

To run the tests:

```
npm run test
```