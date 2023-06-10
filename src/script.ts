const canvas = <HTMLCanvasElement> document.getElementById("canvas");
const ctx = canvas.getContext("2d")!;
const width = 160;
const height = 144;

const myImageData = ctx.createImageData(width, height);
let index = 0;

function render(){
    const data = myImageData.data;
    data[index * 4] = 255;
    data[index * 4 + 3] = 255;

    ctx.putImageData(myImageData, 0, 0);
    index += 1;
}

setInterval(render, 1000/60);