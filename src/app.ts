import {Machine} from "./classes/machine"

const canvas = <HTMLCanvasElement> document.getElementById("canvas");
const ctx = canvas.getContext("2d")!;
const width = 160;
const height = 144;
const scale = 1;

const myImageData = ctx.createImageData(width, height);
let index = 0;

function render(){
    const data = myImageData.data;
    data[index * 4] = 255;
    data[index * 4 + 3] = 255;

    ctx.putImageData(myImageData, 0, 0);
    index += 1;
}

let machine = new Machine("TBD");

function wrapper(){
    const data = myImageData.data;
    let frame = machine.getFrame();

    for(let i = 0; i < height; i++){
        for(let x = 0; x < scale; x++){
            for(let j = 0; j < width; j++){
                for(let y = 0; y < scale; y++){
                    index = (i * width) + j;
                    data[(index * 4)] = frame[index];
                    data[(index * 4) + 1] = frame[index];
                    data[(index * 4) + 2] = frame[index];
                    data[(index * 4) + 3] = 255;
                }
            }
        }
    }

    data[0] = 255;
    data[1] = 0;
    data[2] = 0;
    data[3] = 255;

    ctx.putImageData(myImageData, 0, 0);
}

render();
wrapper();

//setInterval(render, 1000/60);
setInterval(wrapper, 1000/60);

