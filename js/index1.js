class Game {
    constructor() {
        this.canvas = document.querySelector("canvas");
        this.ctx = this.canvas.getContext("2d");
        this.w = 40;
        this.pos = {};
        this.blank = {};
        this.flag = true;
        this.overSence = document.querySelector(".over");
        this.win = document.querySelector(".win span");
        this.startSence = document.querySelector(".control");
        this.container = document.querySelector(".container");
        this.restart = document.querySelector("#restart");
        this.start = document.querySelector("#start");
        this.ctx.translate(30, 30);
        this.AI = false;
        this.AIMode = document.querySelector("#AI");
        this.PVPMode = document.querySelector("#PVP");
        this.getManual = document.querySelector("#get-manual");
        this.music = document.querySelector("#music");
        this.audio = document.querySelector("audio");
        this.musicR = true;
        this.black = document.querySelector(".black");
        this.white = document.querySelector(".white");
        this.back = document.querySelector(".back");
    }

    AIControl() {
        this.AIMode.onfocus = function () {
            this.AI = true;
        }.bind(this);
        this.PVPMode.onfocus = function () {
            this.AI = false;
        }.bind(this);
    }

    GameControl() {
        this.start.onclick = function () {
            this.container.classList.add("fuck-start");
            this.startSence.style.display = "none";
        }.bind(this);
        this.canvas.onclick = function (e) {
            let x = Math.round((e.offsetX - 30) / this.w);
            let y = Math.round((e.offsetY - 30) / this.w);
            if (this.pos[this._formPos(x, y)]) {
                return;
            }
            if (this.flag) {
                this.black.classList.remove("rotate");
                this.white.classList.add("rotate");
                this._drawChess(x, y, "#000");
                this.pos[this._formPos(x, y)] = "#000";
                if (this._checkChess(x, y, "#000") >= 5) {
                    this.overSence.style.display = "block";
                    this.win.innerHTML = "黑棋获胜";
                }
                if (this.AI) {
                    this.white.classList.remove("rotate");
                    this.black.classList.add("rotate");
                    let AIPos = this._getAIPos();
                    this._drawChess(AIPos.x, AIPos.y, "#fff");
                    this.pos[this._formPos(AIPos.x, AIPos.y)] = "#fff";
                    if (this._checkChess(AIPos.x, AIPos.y, "#fff") >= 5) {
                        this.overSence.style.display = "block";
                        this.win.innerHTML = "你被智障AI击败了";
                    }
                    return;
                }
            } else {
                this.white.classList.remove("rotate");
                this.black.classList.add("rotate");
                this._drawChess(x, y, "#fff");
                this.pos[this._formPos(x, y)] = "#fff";
                if (this._checkChess(x, y, "#fff") >= 5) {
                    this.overSence.style.display = "block";
                    this.win.innerHTML = "白棋获胜";
                }
            }
            this.flag = !this.flag;
        }.bind(this);
        this.back.onclick = this.restart.onclick = function () {
            this.white.classList.remove("rotate");
            this.black.classList.add("rotate");
            this.ctx.clearRect(-30, -30, 620, 620);
            this.pos = {};
            this.flag = true;
            this.musicR = true;
            this.AI = false;
            this.container.classList.remove("fuck-start");
            this.startSence.style.display = "block";
            this.overSence.style.display = "none";
            this.drawBoard();
            this.PVPMode.checked = "true";

        }.bind(this);
        this.getManual.onclick = function () {

        };
        this.music.onclick = function () {
            if (this.musicR) {
                this.audio.pause();
                this.music.style.animationPlayState = "paused";
                this.musicR = false;
            } else {
                this.audio.play();
                this.music.style.animationPlayState = "running";
                this.musicR = true;
            }

        }.bind(this);
    }

    drawBoard() {
        this.ctx.save();
        this.ctx.beginPath();
        this.ctx.strokeStyle = "#000";
        this.ctx.lineWidth = 26;
        this.ctx.rect(-30, -30, 620, 620);
        this.ctx.stroke();
        this.ctx.strokeStyle = "#000";
        this.ctx.lineWidth = 2;
        this.ctx.rect(-4, -4, 568, 568);
        this.ctx.stroke();
        this.ctx.restore();
        this.ctx.beginPath();
        this.ctx.save();
        for (let i = 1; i < 14; i++) {
            this.ctx.moveTo(this.w * i + 0.5, 0);
            this.ctx.lineTo(this.w * i + 0.5, 560);
            this.ctx.moveTo(0, this.w * i + 0.5);
            this.ctx.lineTo(560, this.w * i + 0.5);
            this.ctx.stroke();
        }
        this.ctx.rect(0.5, 0.5, 559, 559);
        this.ctx.stroke();
        this.ctx.restore();
        this._drawDot(3, 3);
        this._drawDot(3, 11);
        this._drawDot(11, 3);
        this._drawDot(11, 11);
        this._drawDot(7, 7);
        for (let i = 0; i < 15; i++) {
            for (let j = 0; j < 15; j++) {
                this.blank[this._formPos(i, j)] = true;
            }
        }
    }

    _drawDot(x, y) {
        this.ctx.beginPath();
        this.ctx.save();
        this.ctx.arc(x * this.w, y * this.w, 4, 0, 2 * Math.PI);
        this.ctx.fill();
        this.ctx.restore();
    }

    _formPos(x, y) {
        return x + "_" + y;
    }

    _drawChess(x, y, color) {
        this.ctx.beginPath();
        this.ctx.save();
        this.ctx.arc(x * this.w, y * this.w, 15, 0, 2 * Math.PI);
        this.ctx.fillStyle = color;
        this.ctx.fill();
        this.ctx.restore();
        delete this.blank[this._formPos(x, y)];
    }

    _checkChess(x, y, color) {
        //行
        let row = 1;
        let i = 1;
        while (this.pos[this._formPos(x + i, y)] === color) {
            row++;
            i++;
        }
        i = 1;
        while (this.pos[this._formPos(x - i, y)] === color) {
            row++;
            i++;
        }
        //列
        let col = 1;
        i = 1;
        while (this.pos[this._formPos(x, y + i)] === color) {
            col++;
            i++;
        }
        i = 1;
        while (this.pos[this._formPos(x, y - i)] === color) {
            col++;
            i++;
        }
        //左上右下
        let mdia = 1;
        i = 1;
        while (this.pos[this._formPos(x + i, y + i)] === color) {
            mdia++;
            i++;
        }
        i = 1;
        while (this.pos[this._formPos(x - i, y - i)] === color) {
            mdia++;
            i++;
        }
        //右上左下
        let sdia = 1;
        i = 1;
        while (this.pos[this._formPos(x + i, y - i)] === color) {
            sdia++;
            i++;
        }
        i = 1;
        while (this.pos[this._formPos(x - i, y + i)] === color) {
            sdia++;
            i++;
        }
        return Math.max(row, col, mdia, sdia);

    }

    _getAIPos() {
        let attPos = {};
        let defPos = {};
        let attMax = 0;
        let defMax = 0;
        for (let i in this.blank) {
            let x = parseInt(i.split("_")[0]);
            let y = parseInt(i.split("_")[1]);
            let attNum = this._checkChess(x, y, "#fff");
            if (attNum > attMax) {
                attMax = attNum;
                attPos = {x, y};
            }
        }
        for (let i in this.blank) {
            let x = parseInt(i.split("_")[0]);
            let y = parseInt(i.split("_")[1]);
            let defNum = this._checkChess(x, y, "#000");
            if (defNum > defMax) {
                defMax = defNum;
                defPos = {x, y};
            }
        }

        if (attMax >= defMax) {
            return attPos;
        } else {
            return defPos;
        }
    }
}
let game = new Game();
game.GameControl();
game.drawBoard();
game.AIControl();