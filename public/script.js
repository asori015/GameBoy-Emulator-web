var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");
var width = 160;
var height = 144;
var myImageData = ctx.createImageData(width, height);
var index = 0;
function render() {
    var data = myImageData.data;
    data[index * 4] = 255;
    data[index * 4 + 3] = 255;
    ctx.putImageData(myImageData, 0, 0);
    index += 1;
}
setInterval(render, 1000 / 60);

let add = (a: number, b: number) => {
    console.log(a + b);
}