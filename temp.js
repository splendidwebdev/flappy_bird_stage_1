const canvas = document.querySelector("#game");
const ctx = canvas.getContext("2d");

const canvas_size = {
    canvas_width: window.innerWidth / 1.1,
    canvas_height: window.innerHeight / 1.1
};

function collision(box1, box2) {
    return box1.x + box1.width >= box2.x &&
           box1.x <= box2.x + box2.width &&
           box1.y + box1.height >= box2.y &&
           box1.y <= box2.y + box2.height;
}

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
    update() {
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
        this.y = 2;
        this.velocity_x = 0;
        this.velocity_y = 0;
        this.gravity = 0.65;
        this.keys = [];
        this.speed = Math.min(canvas.width, canvas.height) * 0.0009;
        this.jump_power = 1.3;
        this.max_speed = 12;

        window.addEventListener("keydown", e => {
            if ((e.key === "ArrowRight" || e.key === "ArrowLeft" || e.key === "a" || e.key == "d" || e.key == " " || e.key == "ArrowUp") && this.keys.indexOf(e.key) == -1) this.keys.push(e.key);
        });
        window.addEventListener("touchstart", () => {
            this.keys.push(" ")
        })
        window.addEventListener("touchend", () => {
            this.keys.splice(" ")
        })
        window.addEventListener("mousedown", () => {
            this.keys.push(" ")
        })
        window.addEventListener("mouseup", () => {
            this.keys.splice(" ")
        })
        window.addEventListener("keyup", e => {
            if (this.keys.indexOf(e.key) != -1) this.keys.splice(this.keys.indexOf(e.key), 1);
        });
    }
    update() {
        this.velocity_y += this.gravity;
        if ((this.keys.includes(" ") || this.keys.includes("ArrowUp"))) {
            this.velocity_y -= this.jump_power;
        }
        if (this.y + this.height > canvas.height) {
            this.y = canvas.height - this.height;
            this.velocity_y = 0;
        } else if (this.y <= 0) {
            this.velocity_y += 2;
        }
        this.y += this.velocity_y;
        this.x += this.velocity_x;
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
    update() {
        this.pipes.forEach(pipe => {
            pipe.update();
            if (this.player.x + this.player.width > pipe.x &&
                this.player.y < pipe.theight &&
                this.player.x < pipe.width + pipe.x) {
            } else if (this.player.x + this.player.width > pipe.x &&
                       this.player.y + this.player.height > pipe.theight + pipe.gap &&
                       this.player.x < pipe.width + pipe.x) {
            }

            if (!pipe.passed && pipe.x + pipe.width < this.player.x) {
                pipe.passed = true;
                this.score++;
                console.log(this.score)
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


        this.player.update();
    }
    draw() {
        ctx.fillText(`Score: ${this.score}`, 20, 40);
        this.pipes.forEach(pipe => pipe.draw());
        this.player.draw();
    }
}

const game = new Game();

function render() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    game.update();
    game.draw();
    requestAnimationFrame(render);
}

render();
