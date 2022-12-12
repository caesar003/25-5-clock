"use strict";

const breakEl = document.querySelector("#break-length");
const sessEl = document.querySelector("#session-length");
const timerLabel = document.querySelector("#timer-label");
const timeLeft = document.querySelector("#time-left");

const playBtn = document.querySelector("#start_stop");
const resetBtn = document.querySelector("#reset");

const adjustBtn = document.querySelectorAll(".adjust-time");
const beep = document.querySelector("#beep");

class Timer {
    constructor() {
        this.break = 5;
        this.session = 25;
        this.timeLeft = [25, 0];
        this.isRunning = false;
        this.currentState = "session";
        this.startInterval = null;
    }
    adjustTime({ target, direction }) {
        if (direction === "up") {
            if (parseInt(this[target]) === 60) return;
            this[target] = this[target] + 1;
            if (this.currentState === target) {
                this.timeLeft = [this.timeLeft[0] + 1, 0];
            }
        } else {
            if (parseInt(this[target]) === 1) return;
            this[target] = this[target] - 1;
            if (this.currentState === target) {
                this.timeLeft = [this.timeLeft[0] - 1, 0];
            }
        }
        this.render();
    }
    start() {
        this.isRunning = true;
        this.startInterval = setInterval(() => this.run(), 1000);
    }
    pause() {
        clearInterval(this.startInterval);
        this.isRunning = false;
    }
    reset() {
        this.pause();
        this.timeLeft = [25, 0];
        this.break = 5;
        this.session = 25;
        this.currentState = "session";
        this.render();
    }
    render() {
        const { currentState: state } = this;
        const [min, sec] = this.timeLeft;
        breakEl.innerHTML = this.break;
        sessEl.innerHTML = this.session;
        timerLabel.innerHTML = state[0].toUpperCase() + state.slice(1);
        timeLeft.innerHTML = this.addZero(min) + ":" + this.addZero(sec);
        if (min === 0) {
            timeLeft.classList.add("last-minute");
        } else {
            timeLeft.classList.remove("last-minute");
        }
        if (min === 0 && sec === 59) beep.play();
    }
    addZero(n) {
        return n < 10 ? "0" + n : n;
    }
    run() {
        const [min, sec] = this.timeLeft;
        if (sec === 0) {
            this.timeLeft[1] = 59;
            if (min === 0) {
                if (this.currentState === "session") {
                    this.currentState = "break";
                    this.timeLeft[0] = this.break - 1;
                } else {
                    this.currentState = "session";
                    this.timeLeft[0] = this.session - 1;
                }
            } else {
                this.timeLeft[0] = min - 1;
            }
        } else {
            this.timeLeft[1] = sec - 1;
        }

        this.render();
    }
}
const Remit = new Timer();
Remit.render();

adjustBtn.forEach((btn) => {
    btn.addEventListener("click", function (e) {
        const { dataset } = e.target.parentNode;
        Remit.adjustTime(dataset);
    });
});

playBtn.addEventListener("click", function (e) {
    if (Remit.isRunning) {
        Remit.pause();
    } else {
        Remit.start();
    }
});

resetBtn.addEventListener("click", function () {
    Remit.reset();
});
