let f = document.querySelector("#r0");
let x = document.querySelector("#r1");

rules = {};
rules['F'] = 'X';
rules['X'] = "F[+X]F[-X]";
rules['+'] = "+";
rules['-'] = "-";
rules['['] = "[";
rules[']'] = "]";

const LINE_LENGTH = 5;
const ANGLE_INCREMENT = Math.PI / 15.0

// Seed updates
let seed = "X"
let seedElem = document.querySelector("#seed");
seedElem.value = seed;
seedElem.placeholder = seed;
seedElem.addEventListener("change", () => {
    seed = seedElem.value
});

// Rule updates
let fRule = document.querySelector("#F");
let xRule = document.querySelector("#X");
fRule.addEventListener("change", () => {
    rules['F'] = fRule.value;
});
xRule.addEventListener("change", () => {
    rules['X'] = xRule.value;
});

document.querySelector("#growBtn").addEventListener("click", (e) => {
    update();
    draw();
});

// Canvas
const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");

// Stack
stack = [];
stack.push({ x: canvas.width / 2, y: canvas.height - canvas.height / 10, theta: -Math.PI / 2 });

function draw_line(pos) {
    let new_pos = { x: pos.x, y: pos.y, theta: pos.theta };
    console.log(new_pos);
    new_pos.x += LINE_LENGTH * Math.cos(pos.theta);
    new_pos.y += LINE_LENGTH * Math.sin(pos.theta);

    ctx.beginPath();
    ctx.moveTo(pos.x, pos.y);
    ctx.lineTo(new_pos.x, new_pos.y);
    ctx.stroke();

    console.log("Seed: " + seed);
    console.log("Drawing from " + pos.x, + " " + pos.y + " to " + new_pos.x + " " + new_pos.y);

    return new_pos;
}

function rotate_left(pos) {
    let new_pos = { ...pos };
    new_pos.theta += ANGLE_INCREMENT;
    return new_pos;
}

function rotate_right(pos) {
    let new_pos = { ...pos };
    new_pos.theta -= ANGLE_INCREMENT;
    return new_pos;
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    // pos is { x: num, y: num, theta: num}
    let pos = stack[stack.length - 1];
    for (let i = 0; i < seed.length; i++) {
        switch (seed[i]) {
            default: break;
            case 'F':
                pos = draw_line(pos);
                break;
            case '+':
                pos = rotate_left(pos);
                break;
            case '-':
                pos = rotate_right(pos);
                break;
            case '[':
                stack.push({ ...pos });
                break;
            case ']':
                pos = stack.pop();
                break;
        }
    }
}

function update() {
    let newSeed = ""
    for (let i = 0; i < seed.length; i++) {
        newSeed += rules[seed[i]] || seed[i];
    }
    seed = newSeed;
}

