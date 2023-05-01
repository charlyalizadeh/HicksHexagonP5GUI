let gui;


function setup() {
    let canvas = createCanvas(1000, 1000);
    canvas.position(0, 0);
    gui = new HicksHexagonGui();
}

function draw() {
    gui.draw();
}
