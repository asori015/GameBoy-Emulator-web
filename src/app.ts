import {Machine} from "./classes/machine"

const canvas = <HTMLCanvasElement> document.getElementById("canvas");
const ctx = canvas.getContext("2d")!;
const width = 160;
const height = 144;
const scale = 2;
let machine: Machine;

const colorMap = [0X00, 0X08, 0X10, 0X18, 0X20, 0X29, 0X31, 0X39,
                  0X41, 0X4A, 0X52, 0X5A, 0X62, 0X6A, 0X73, 0X7B,
                  0X83, 0X8B, 0X94, 0X9C, 0XA4, 0XAC, 0XB4, 0XBD,
                  0XC5, 0XCD, 0XD5, 0XDE, 0XE6, 0XEE, 0XF6, 0XFF]

                  
ctx.canvas.width = width * scale;
ctx.canvas.height = height * scale;
const myImageData = ctx.createImageData(width * scale, height * scale);

function wrapper(){
    const data = myImageData.data;
    let frame = machine.getFrame();

    let index1 = 0;
    for(let i = 0; i < height; i++){
        for(let x = 0; x < scale; x++){
            for(let j = 0; j < width; j++){
                for(let y = 0; y < scale; y++){
                    let index2 = (i * width) + j;
                    data[(index1 * 4)] = colorMap[(frame[index2] & 0x001F)]!;
                    data[(index1 * 4) + 1] = colorMap[(frame[index2] & 0x03E0) >> 5]!;
                    data[(index1 * 4) + 2] = colorMap[(frame[index2] & 0x7C00) >> 10]!;
                    data[(index1 * 4) + 3] = 255;
                    index1++;
                }
            }
        }
    }

    ctx.putImageData(myImageData, 0, 0);
}

const fileSelector = <HTMLInputElement> document.getElementById('file-selector');
fileSelector.addEventListener('change', (e) => {
    let files = (e.target as HTMLInputElement).files!;
    machine = new Machine(files[0]!);
    setInterval(wrapper, 1000/60);
});
