import { Honeycomb, Hexagon } from "react-honeycomb";
import { useEffect, useState } from "react";

import boisImg from "./bois.jpg"
import blancoImg from "./blanco.jpg"
import darkgreyImg from "./darkgrey.jpg"
import lightgreyImg from "./lightgrey.jpg"
import planTravailImg from "./plan_travail.jpg"

function shuffle(arr: any[]) {
  let array = arr.slice()
  for (var i = array.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var temp = array[i];
      array[i] = array[j];
      array[j] = temp;
  }
  return array
}

const sideLength = 32;
const columns = 18 // Math.floor(2.6 * 8); // x mètres et 1 mètre = 8 carreaux de 20 cm
const lines = 17 // Math.floor(3.2 * 8);
const nbTiles = Math.floor(columns * lines * 1.1) + 6;
const DEFAULT_COLOR = "#EEEEEE"
const DEFAULT_JOINTS_COLOR = "#555555"
let DEFAULT_TILES = new Array(nbTiles).fill(DEFAULT_COLOR);
const COLORS = [darkgreyImg, lightgreyImg, blancoImg, boisImg];
const SIZES = [3, 6, 6, 3] 
const ITEM_LIST = COLORS.reduce( (list: string[], c, i) => [...list, ...(new Array(SIZES[i] * 16).fill("").map(_ => c))], [])

const startIlotFirstLine = 135;
const NB_ILOT_LINE = 12;
const NB_ILOT_COLUMNS = 5;
let ilotCentralIndexes: number[] = [];
for (let i = 0; i < NB_ILOT_LINE; i++) {
  const startIndex = startIlotFirstLine + i * 18;
  for (let j = 0; j < NB_ILOT_COLUMNS; j++) {
    ilotCentralIndexes.push(startIndex + j);    
  }
}

const NB_COLORS = COLORS.length

export default function App() {
  const [color, setColor] = useState(COLORS[0]);
  const [items, setItems] = useState(DEFAULT_TILES);
  // const [percents, updatePercents] = useState(COLORS.map(() => 1/NB_COLORS))
  const [percents, updatePercents] = useState([0.1666666, 0.333333, 0.333333, 0.1666])
  const [jointsColor, setJointsColors] = useState(DEFAULT_JOINTS_COLOR)
  const [reload, refresh] = useState<number | null>(null)

  useEffect(() => {
    const shuffledList = shuffle(ITEM_LIST)
    const newItems = items.map( (tile, index) => {
      // hide if it's ilot
      return ilotCentralIndexes.includes(index) ? "white" : shuffledList.pop()
    })

    setItems(newItems)
  }, [reload, percents, setItems])

  return (
    <div className="App">
      <Honeycomb
        columns={COLORS.length}
        size={sideLength}
        items={COLORS}
        renderItem={(tileColor) => (
          <div>
            {/* @ts-ignore */}
            <Hexagon>
              <div
                onClick={() => {
                  setColor(tileColor);
                }}
                style={{
                  width: "100%",
                  height: "100%",
                  backgroundImage: `url(${tileColor})`,
                  backgroundPosition: 'center',
                  backgroundSize: 'cover',
                  backgroundRepeat: 'no-repeat'
                }}
              />
            </Hexagon>
          </div>
        )}
      />
      <div style={{
        display: "flex",
        flexDirection: "row",
        justifyContent: "center",
        paddingLeft: "30px",
      }}>
        {COLORS.map(c => (
          <div style={{ padding: " 0 20px"}}>
            {items.filter(item => item === c).length}
          </div>
        ))}
      </div>

      <div style={{
        display: "flex",
        flexDirection: "row",
        justifyContent: "center",
        paddingLeft: "30px",
      }}>
        {COLORS.map(c => (
          <div style={{ padding: "15px"}}>
            {Math.ceil(items.filter(item => item === c).length / 16)} bt
          </div>
        ))}
      </div>

      <div style={{
        display: "flex",
        flexDirection: "row",
        justifyContent: "center",
        paddingLeft: "30px",
      }}>
        {percents.map( (percent, index) => (
          <input
            style={{width: "50px"}}
            key={"param" + index}
            type="number" 
            value={percent}
            step=".01"
            onChange={(e) => {
              const newPercents = percents.map( (p, i) => i === index ? parseFloat(e.target.value) : p)
              updatePercents(newPercents)
            }} 
          />
        ))}
      </div>
      <div style={{
        display: "flex",
        flexDirection: "row",
        paddingTop: "20px",
        margin:"auto",
        justifyContent: "space-around",
        paddingLeft: "30px",
        marginTop: "5px",
        width: "400px"
      }}>
        <input type="color" value={jointsColor} onChange={(e) => setJointsColors(e.target.value)}/>
        <div>({percents.reduce((sum, p) => sum + p, 0)})</div>
        <button onClick={() => refresh(Date.now())}>refresh</button>
      </div>
      
      <div 
        style={{
          backgroundColor: jointsColor,
          width: "fit-content",
          margin: "auto",
          position: "relative"
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
                  backgroundImage: `url(${tileColor})`,
                  backgroundPosition: 'center',
                  backgroundSize: 'cover',
                  backgroundRepeat: 'no-repeat'
                }}
              />
            </Hexagon>
          )}
        />
        <div style={{
          width: "340px",
          height: "620px",
          borderRadius: "10px 10px 0px 0px",
          backgroundImage: `url(${planTravailImg})`,
          backgroundPosition: 'center',
          backgroundSize: 'cover',
          backgroundRepeat: 'no-repeat',
          position: "absolute",
          top: "308px",
          left: "500px",
        }}/>
    </div>
  </div>
  );
}