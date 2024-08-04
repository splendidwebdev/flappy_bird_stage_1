const canvas = document.querySelector("#game");
const ctx = canvas.getContext("2d");

const canvas_size = {
    canvas_width: window.innerWidth / 1.1,
    canvas_height: window.innerHeight / 1.1
};

canvas.width = canvas_size.canvas_width;
canvas.height = canvas_size.canvas_height;

class Pipe {
    constructor() {
        this.width = 80;
        this.gap = 150;
        this.theight = Math.floor(Math.random() * (canvas.height - this.gap));
        this.bottom = canvas.height - this.theight - this.gap;
        this.x = canvas.width;
        this.y = 0;
        this.y2 = this.theight + this.gap;
        this.passed = 0;
    }
    update(dt) {
        this.x -= 3;
    }
    draw() {
        ctx.fillStyle = 'green';
        ctx.fillRect(this.x, this.y, this.width, this.theight);
        ctx.fillRect(this.x, this.y2, this.width, this.bottom);
    }
}

class Player {
    constructor() {
        this.width = 20;
        this.height = 20;
        this.x = (canvas.width / 2) - this.width;
        this.y = 2;  // Ensure initial y position is a number
        this.velocity_x = 0;
        this.velocity_y = 0;  // Ensure initial velocity is a number
        this.gravity = 2700;
        this.keys = [];
        this.speed = Math.min(canvas.width, canvas.height) * 0.0009;
        this.jump_power = 5000;
        this.max_speed = 12;

        window.addEventListener("keydown", e => {
            if ((e.key === "ArrowRight" || e.key === "ArrowLeft" || e.key === "a" || e.key == "d" || e.key == " " || e.key == "ArrowUp") && this.keys.indexOf(e.key) == -1) this.keys.push(e.key);
        });
        window.addEventListener("touchstart", () => {
            this.keys.push(" ");
        });
        window.addEventListener("touchend", () => {
            this.keys = this.keys.filter(key => key !== " ");
        });
        window.addEventListener("mousedown", () => {
            this.keys.push(" ");
        });
        window.addEventListener("mouseup", () => {
            this.keys = this.keys.filter(key => key !== " ");
        });
        window.addEventListener("keyup", e => {
            if (this.keys.indexOf(e.key) != -1) this.keys.splice(this.keys.indexOf(e.key), 1);
        });
    }
    update(dt) {
        // Ensure dt is a number and valid
        if (isNaN(dt)) {
            dt = 0;
        }
        if (isNaN(this.y)) {
            this.y = 0;
        }
        if (isNaN(this.velocity_y)) {
            this.velocity_y = 0;
        }

        this.velocity_y += this.gravity * dt;
        if (this.keys.includes(" ") || this.keys.includes("ArrowUp")) {
            this.velocity_y -= this.jump_power * dt;
        }
        if (this.y + this.height > canvas.height) {
            this.y = canvas.height - this.height;
            this.velocity_y = 0;
        } else if (this.y <= 0) {
            this.y = 0;  // Fix player going out of bounds at the top
            this.velocity_y = 0;
        }
        this.y += this.velocity_y * dt;
        this.x += this.velocity_x * dt;

        // Log updated player position
    }
    draw() {
        ctx.font = "20px Rubik";
        ctx.fillStyle = "#333";
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }
}

class Game {
    constructor() {
        this.pipes = [new Pipe()];
        this.player = new Player();
        this.insert = false;
        this.score = 0;
    }
    update(dt) {
        this.pipes.forEach(pipe => {
            pipe.update(dt);
            if (this.player.x + this.player.width > pipe.x &&
                this.player.y < pipe.theight &&
                this.player.x < pipe.width + pipe.x) {
                // Collision logic here
            } else if (this.player.x + this.player.width > pipe.x &&
                       this.player.y + this.player.height > pipe.theight + pipe.gap &&
                       this.player.x < pipe.width + pipe.x) {
                // Collision logic here
            }

            if (!pipe.passed && pipe.x + pipe.width < this.player.x) {
                pipe.passed = true;
                this.score++;
            }
            if (pipe.x <= canvas.width / 2 - pipe.width && !this.insert) {
                this.insert = true;
                this.pipes.push(new Pipe());
            }

            if (pipe.x + pipe.width <= 0) {
                this.insert = false;
                this.pipes.splice(this.pipes.indexOf(pipe), 1);
            }
        });

        this.player.update(dt);
    }
    draw() {
        ctx.fillText(`Score: ${this.score}`, 20, 40);
        this.pipes.forEach(pipe => pipe.draw());
        this.player.draw();
    }
}

const game = new Game();
let lastTime = 0;

function render(currentTime) {
    let deltaTime = (currentTime - lastTime) / 1000;
    if (deltaTime > 0.1) deltaTime = 0.1;  // Cap deltaTime to avoid large jumps
    lastTime = currentTime;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    game.update(deltaTime);
    game.draw();
    requestAnimationFrame(render);
}

render();
