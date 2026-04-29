// generateMap.mjs
// Run with: node generateMap.mjs
// Outputs map.json in Tiled JSON format

import { writeFileSync, mkdirSync } from "fs";

const COLS = 50;
const ROWS = 50;
const TILE_SIZE = 32;

// Tileset tile IDs (1-indexed, 0 = empty)
// Row 0: grass1=1, grass2=2, grass3=3, dirt1=4, dirt2=5, grass_dark=6, water1=7, water2=8
// Row 1: tree_canopy=9, tree_trunk=10, bush=11, stone=12, stone_dark=13, path=14, path_dark=15, fern=16
// Row 2: wall_h=17, wall_v=18, floor=19, floor_dark=20, door=21, well_base=22, well_dark=23, well_stone=24
// Row 3: deepwood1=25, deepwood2=26, bog=27, bog_dark=28, ruins=29, ruins_dark=30, void=31, void_dark=32

const T = {
  EMPTY: 0,
  GRASS1: 1,
  GRASS2: 2,
  GRASS3: 3,
  DIRT1: 4,
  DIRT2: 5,
  GRASS_DARK: 6,
  WATER1: 7,
  WATER2: 8,
  TREE_CANOPY: 9,
  TREE_TRUNK: 10,
  BUSH: 11,
  STONE: 12,
  STONE_DARK: 13,
  PATH: 14,
  PATH_DARK: 15,
  FERN: 16,
  DEEPWOOD1: 25,
  DEEPWOOD2: 26,
};

// Helper: create empty layer data
function emptyLayer() {
  return new Array(COLS * ROWS).fill(0);
}

// Helper: set tile at col, row
function setTile(data, col, row, tileId) {
  if (col < 0 || col >= COLS || row < 0 || row >= ROWS) return;
  data[row * COLS + col] = tileId;
}

function getTile(data, col, row) {
  if (col < 0 || col >= COLS || row < 0 || row >= ROWS) return 0;
  return data[row * COLS + col];
}

// ─── GROUND LAYER ────────────────────────────────────────────────────────────

const ground = emptyLayer();

// Fill everything with alternating grass
for (let row = 0; row < ROWS; row++) {
  for (let col = 0; col < COLS; col++) {
    const variant = (row + col) % 3;
    setTile(ground, col, row, variant === 0 ? T.GRASS1 : variant === 1 ? T.GRASS2 : T.GRASS3);
  }
}

// Dirt clearing in center (homestead area) — oval shape
const cx = 25, cy = 25;
for (let row = 0; row < ROWS; row++) {
  for (let col = 0; col < COLS; col++) {
    const dx = (col - cx) / 8;
    const dy = (row - cy) / 6;
    if (dx * dx + dy * dy < 1) {
      const variant = (row + col) % 2;
      setTile(ground, col, row, variant === 0 ? T.DIRT1 : T.DIRT2);
    }
  }
}

// Dirt path going north from clearing
for (let row = cy - 6; row > 5; row--) {
  setTile(ground, cx, row, T.PATH);
  setTile(ground, cx + 1, row, T.PATH_DARK);
}

// Dirt path going east
for (let col = cx + 9; col < COLS - 5; col++) {
  setTile(ground, col, cy, T.PATH);
  setTile(ground, col, cy + 1, T.PATH_DARK);
}

// Dirt path going south
for (let row = cy + 7; row < ROWS - 5; row++) {
  setTile(ground, cx, row, T.PATH);
  setTile(ground, cx + 1, row, T.PATH_DARK);
}

// Dirt path going west
for (let col = 5; col < cx - 8; col++) {
  setTile(ground, col, cy, T.PATH);
  setTile(ground, col, cy + 1, T.PATH_DARK);
}

// Deepwood patches in corners
const deepwoodCorners = [
  [3, 3], [4, 3], [3, 4], [4, 4], [5, 3], [3, 5],
  [45, 3], [46, 3], [45, 4], [46, 4], [44, 3], [46, 5],
  [3, 45], [4, 45], [3, 46], [4, 46], [5, 46], [3, 44],
  [45, 45], [46, 45], [45, 46], [46, 46], [44, 46], [46, 44],
];
deepwoodCorners.forEach(([col, row]) => {
  setTile(ground, col, row, (col + row) % 2 === 0 ? T.DEEPWOOD1 : T.DEEPWOOD2);
});

// ─── DECORATION LAYER ────────────────────────────────────────────────────────

const decoration = emptyLayer();

// Tree positions — border + interior scattered
const treePositions = [
  // Top border
  [2,1],[5,1],[9,1],[13,1],[17,1],[21,1],[25,1],[29,1],[33,1],[37,1],[41,1],[45,1],
  // Bottom border
  [2,48],[5,48],[9,48],[13,48],[17,48],[21,48],[25,48],[29,48],[33,48],[37,48],[41,48],[45,48],
  // Left border
  [1,5],[1,9],[1,13],[1,17],[1,21],[1,29],[1,33],[1,37],[1,41],
  // Right border
  [48,5],[48,9],[48,13],[48,17],[48,21],[48,29],[48,33],[48,37],[48,41],
  // Interior scattered (away from center clearing)
  [8,8],[12,10],[6,15],[10,18],[15,7],[7,20],
  [38,8],[42,11],[44,6],[40,12],[36,7],[45,15],
  [8,38],[11,42],[6,36],[13,44],[7,32],
  [40,38],[43,42],[45,36],[38,44],[46,32],
  [18,14],[20,18],[15,22],[18,30],[14,35],
  [32,14],[35,18],[38,22],[32,30],[36,35],
];

treePositions.forEach(([col, row]) => {
  setTile(decoration, col, row, T.TREE_CANOPY);
  setTile(decoration, col, row + 1, T.TREE_TRUNK);
});

// Bush and fern clusters
const bushPositions = [
  [10,12],[14,8],[7,25],[9,30],[16,40],[20,42],
  [35,10],[39,15],[42,25],[44,30],[32,40],[28,44],
  [22,8],[27,6],[30,10],[20,38],[25,44],[28,40],
];
bushPositions.forEach(([col, row]) => {
  setTile(decoration, col, row, T.BUSH);
});

const fernPositions = [
  [11,13],[8,26],[17,41],[36,11],[43,26],[33,41],
  [23,9],[29,45],[19,39],[31,9],
];
fernPositions.forEach(([col, row]) => {
  setTile(decoration, col, row, T.FERN);
});

// Stones near paths
const stonePositions = [
  [20,24],[22,26],[28,24],[30,26],
  [24,20],[26,30],[24,16],[26,34],
];
stonePositions.forEach(([col, row]) => {
  setTile(decoration, col, row, (col + row) % 2 === 0 ? T.STONE : T.STONE_DARK);
});

// ─── COLLISION LAYER ─────────────────────────────────────────────────────────

const collision = emptyLayer();

// Every tree trunk gets a collision tile
treePositions.forEach(([col, row]) => {
  setTile(collision, col, row + 1, T.STONE); // Any non-zero tile blocks
});

// Stones also block
stonePositions.forEach(([col, row]) => {
  setTile(collision, col, row, T.STONE);
});

// ─── ABOVE LAYER ─────────────────────────────────────────────────────────────

const above = emptyLayer();

// Tree canopies render above the player
treePositions.forEach(([col, row]) => {
  setTile(above, col, row, T.TREE_CANOPY);
});

// ─── ASSEMBLE TILED JSON ─────────────────────────────────────────────────────

function makeLayer(name, data, id) {
  return {
    data,
    height: ROWS,
    id,
    name,
    opacity: 1,
    type: "tilelayer",
    visible: true,
    width: COLS,
    x: 0,
    y: 0,
  };
}

const mapJson = {
  compressionlevel: -1,
  height: ROWS,
  infinite: false,
  layers: [
    makeLayer("ground", ground, 1),
    makeLayer("decoration", decoration, 2),
    makeLayer("collision", collision, 3),
    makeLayer("above", above, 4),
  ],
  nextlayerid: 5,
  nextobjectid: 1,
  orientation: "orthogonal",
  renderorder: "right-down",
  tiledversion: "1.10.0",
  tileheight: TILE_SIZE,
  tilesets: [
    {
      columns: 8,
      firstgid: 1,
      image: "../tilemaps/tileset.png",
      imageheight: 128,
      imagewidth: 256,
      margin: 0,
      name: "hollow-home",
      spacing: 0,
      tilecount: 32,
      tileheight: TILE_SIZE,
      tilewidth: TILE_SIZE,
    },
  ],
  tilewidth: TILE_SIZE,
  type: "map",
  version: "1.10",
  width: COLS,
};

writeFileSync("map.json", JSON.stringify(mapJson, null, 2));
console.log("✅ map.json generated!");
console.log(`   ${COLS}x${ROWS} tiles`);
console.log(`   ${treePositions.length} trees placed`);
console.log(`   ${bushPositions.length} bushes placed`);
console.log(`   ${fernPositions.length} ferns placed`);
console.log("   Copy map.json to public/assets/tilemaps/map.json");
