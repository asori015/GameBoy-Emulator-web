import {Machine} from "./classes/machine"

const canvas = <HTMLCanvasElement> document.getElementById('canvas');
const ctx = canvas.getContext("2d")!;
const width = 160;
const height = 144;
let machine: Machine;

const colorMap = [0X00, 0X08, 0X10, 0X18, 0X20, 0X29, 0X31, 0X39,
                  0X41, 0X4A, 0X52, 0X5A, 0X62, 0X6A, 0X73, 0X7B,
                  0X83, 0X8B, 0X94, 0X9C, 0XA4, 0XAC, 0XB4, 0XBD,
                  0XC5, 0XCD, 0XD5, 0XDE, 0XE6, 0XEE, 0XF6, 0XFF]

ctx.canvas.width = width;
ctx.canvas.height = height;
const myImageData = ctx.createImageData(width, height);
// 32-bit buffer for pixel data decoded into RGBA
const buf32 = new Uint32Array(myImageData.data.buffer);

// DMG frame length in ms (~59.7 Hz)
const frameMs = 1000 / 59.7;
// Most emulated frames to run per animation frame when catching up
const maxCatchup = 5;

let rafHandle = 0;
let lastTime = 0;
let accumulator = 0;
let latestFrame: Uint16Array | null = null;

// Decode the frame buffer into RGBA and draw it to the canvas
function paint(frame: Uint16Array){
    for(let i = 0; i < width * height; i++){
        let pixel = frame[i]!;
        let r = colorMap[(pixel & 0x001F)]!;
        let g = colorMap[(pixel & 0x03E0) >> 5]!;
        let b = colorMap[(pixel & 0x7C00) >> 10]!;
        // little-endian: 0xAABBGGRR
        buf32[i] = (255 << 24) | (b << 16) | (g << 8) | r;
    }

    ctx.putImageData(myImageData, 0, 0);
}

// Run emulated frames for the real time that has passed, then paint once
function loop(now: number){
    accumulator += now - lastTime;
    lastTime = now;

    let steps = 0;
    while(accumulator >= frameMs && steps < maxCatchup){
        latestFrame = machine.getFrame();
        accumulator -= frameMs;
        steps += 1;
    }
    // Drop the backlog instead of running fast after a stall
    if(steps == maxCatchup){
        accumulator = 0;
    }

    if(latestFrame != null && steps > 0){
        paint(latestFrame);
    }

    rafHandle = requestAnimationFrame(loop);
}

// Start the loop, or reset its timing when a new ROM is loaded
function start(){
    accumulator = 0;
    lastTime = performance.now();
    if(rafHandle == 0){
        rafHandle = requestAnimationFrame(loop);
    }
}

const fileSelector = <HTMLInputElement> document.getElementById('file-selector');
fileSelector.addEventListener('change', (e) => {
    let files = (e.target as HTMLInputElement).files!;
    machine = new Machine(files[0]!);
    start();
});

function loadRemoteFile(url: string){
    let xmlhttp = new XMLHttpRequest();
    xmlhttp.open("GET", url, true);
    xmlhttp.responseType = "blob";
    
    xmlhttp.onload = () => {
        let blob = xmlhttp.response;
        let file = new File([blob], url.substring(36), {type: "text/plain"});
        
        machine = new Machine(file);
        start();
    };

    xmlhttp.send();
}

const button1 = <HTMLButtonElement> document.getElementById('tetris');
button1.addEventListener("click", () => {
    loadRemoteFile('https://asori015.github.io/GB-Files/01-001.data');
});

const button2 = <HTMLButtonElement> document.getElementById('poke-red');
button2.addEventListener("click", () => {
    loadRemoteFile('https://asori015.github.io/GB-Files/02-001.data');
});

const button3 = <HTMLButtonElement> document.getElementById('zelda');
button3.addEventListener("click", () => {
    loadRemoteFile('https://asori015.github.io/GB-Files/03-001.data');
});