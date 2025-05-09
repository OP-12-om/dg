
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const message = document.getElementById("message");

let doakes = { x: 400, y: 300, speed: 3 };
let keys = {};
let stage = "start"; // start, escape, tasks, chase, end
let tasks = [
    { x: 100, y: 100, done: false },
    { x: 700, y: 100, done: false },
    { x: 400, y: 500, done: false }
];
let dexter = { x: -50, y: -50, speed: 2 };

document.addEventListener("keydown", e => keys[e.key] = true);
document.addEventListener("keyup", e => keys[e.key] = false);

function gameLoop() {
    update();
    draw();
    requestAnimationFrame(gameLoop);
}

function update() {
    if (stage === "start" && keys[" "]) {
        stage = "escape";
        message.textContent = "You are Doakes. Escape the cage.";
    }

    if (stage === "escape" || stage === "tasks" || stage === "chase") {
        if (keys["ArrowUp"]) doakes.y -= doakes.speed;
        if (keys["ArrowDown"]) doakes.y += doakes.speed;
        if (keys["ArrowLeft"]) doakes.x -= doakes.speed;
        if (keys["ArrowRight"]) doakes.x += doakes.speed;
    }

    if (stage === "escape" && doakes.y < 250) {
        stage = "tasks";
        message.textContent = "Complete the 3 tasks!";
    }

    if (stage === "tasks") {
        tasks.forEach(task => {
            if (!task.done && Math.abs(doakes.x - task.x) < 20 && Math.abs(doakes.y - task.y) < 20) {
                task.done = true;
            }
        });
        if (tasks.every(t => t.done)) {
            stage = "chase";
            message.textContent = "Dexter is here! RUN!";
            dexter.x = 800;
            dexter.y = 600;
        }
    }

    if (stage === "chase") {
        if (doakes.x < dexter.x) dexter.x -= dexter.speed;
        if (doakes.x > dexter.x) dexter.x += dexter.speed;
        if (doakes.y < dexter.y) dexter.y -= dexter.speed;
        if (doakes.y > dexter.y) dexter.y += dexter.speed;

        if (Math.abs(doakes.x - dexter.x) < 20 && Math.abs(doakes.y - dexter.y) < 20) {
            stage = "end";
            message.textContent = "Dexter killed Doakes.";
        }
    }
}

function draw() {
    ctx.fillStyle = "#111";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw Doakes
    ctx.fillStyle = "#0f0";
    ctx.beginPath();
    ctx.arc(doakes.x, doakes.y, 10, 0, Math.PI * 2);
    ctx.fill();

    // Draw Tasks
    if (stage === "tasks") {
        ctx.fillStyle = "#ff0";
        tasks.forEach(task => {
            if (!task.done) {
                ctx.fillRect(task.x - 10, task.y - 10, 20, 20);
            }
        });
    }

    // Draw Dexter
    if (stage === "chase" || stage === "end") {
        ctx.fillStyle = "#f00";
        ctx.beginPath();
        ctx.arc(dexter.x, dexter.y, 10, 0, Math.PI * 2);
        ctx.fill();
    }

    if (stage === "end") {
        ctx.fillStyle = "#fff";
        ctx.fillText("Game Over", 350, 300);
    }
}

gameLoop();
