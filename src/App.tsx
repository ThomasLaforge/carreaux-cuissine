import { Honeycomb, Hexagon } from "react-honeycomb";
import { useState } from "react";

const sideLength = 32;
const columns = 2.6 * 5; // 2.4 mètre et 1 mètre = 5 carreaux de 20 cm
const lines = 3.2 * 5;
const nbTiles = columns * lines;
const DEFAULT_COLOR = "#EEEEEE"
let DEFAULT_TILES = new Array(nbTiles).fill(DEFAULT_COLOR);
const COLORS = ["grey", "darkgrey", "lightgrey", "rgb(167 146 139)"];

const startIlotFirstLine = 83;
const NB_ILOT_LINE = 10;
const NB_ILOT_COLUMNS = 5;
let ilotCentralIndexes: number[] = [];
for (let i = 0; i < NB_ILOT_LINE; i++) {
  const startIndex = startIlotFirstLine + i * 13;
  for (let j = 0; j < NB_ILOT_COLUMNS; j++) {
    ilotCentralIndexes.push(startIndex + j);    
  }
}

DEFAULT_TILES = DEFAULT_TILES.map( (tile, index) => {
  const random = Math.random()
  const percents = [0.2, 0.3, 0.2, 0.3]
  const cumulPercents = percents.map(
    (p, i) => p + percents.slice(0, i).reduce((sum, per) => sum + per, 0)
  )
  console.log("cumuls", cumulPercents)
  let indexOfRandom = 0;
  while(random > cumulPercents[indexOfRandom]){
    indexOfRandom++
  }
  const randomColor = COLORS[indexOfRandom]
  console.log("random color", random, indexOfRandom, randomColor)


  // hide if it's ilot
  return ilotCentralIndexes.includes(index) ? "white" : randomColor
})

export default function App() {
  const [color, setColor] = useState(COLORS[0]);
  const [items, setItems] = useState(DEFAULT_TILES);
  return (
    <div className="App">
      <Honeycomb
        columns={COLORS.length}
        size={sideLength}
        items={COLORS}
        renderItem={(tileColor) => (
          // @ts-ignore
          <Hexagon>
            <div
              onClick={() => {
                setColor(tileColor);
              }}
              style={{
                width: "100%",
                height: "100%",
                backgroundColor: tileColor,
              }}
            />
          </Hexagon>
        )}
      />
      <div 
        style={{
          // backgroundColor: "lightgrey",
          width: "fit-content",
          margin: "auto",
        }}
      >
        <Honeycomb
          columns={columns}
          size={sideLength}
          items={items}
          renderItem={(tileColor, index) => (
            // @ts-ignore
            <Hexagon>
              <div
                onClick={() => {
                  console.log("tile clicked", index);
                  if(!ilotCentralIndexes.includes(index)){
                    setItems(items.map((item, i) => (i === index ? (color === item ? DEFAULT_COLOR : color) : item)));
                  }
                }}
                style={{
                  width: "100%",
                  height: "100%",
                  backgroundColor: tileColor
                }}
              />
            </Hexagon>
          )}
        />
      </div>
    </div>
  );
}