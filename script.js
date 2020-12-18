
const params = new URLSearchParams(window.location.search.substr(1));
const goal = new Date(params.get("end") ? params.get("end") : "December 18 2020 13:00");
var fps, interval;
var showingGoal = false;
const counter = document.querySelector("#counter");
const detailed = document.querySelector("#detailed");


if (!window.requestAnimationFrame) {
    window.requestAnimationFrame = window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame;
}

const counterFinished = () => {

    if (interval) clearInterval(interval);
    interval = null;

    confetti.start();

}

const updateCounter = () => {

    var date = new Date();
    var secondsUntil = goal.getTime() - date.getTime();

    if (secondsUntil <= 0) counterFinished();

    var timeValues = {
        dagar: Math.floor(secondsUntil / (1000 * 60 * 60 * 24)),
        timmar: Math.floor((secondsUntil % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minuter: Math.floor((secondsUntil % (1000 * 60 * 60)) / (1000 * 60)),
        s: Math.floor((secondsUntil % (1000 * 60)) / 1000),
        ms: Math.floor((secondsUntil % 1000))
    }

    var formated = formatTime(timeValues);

    counter.innerText = formated.counter;
    if (!showingGoal) detailed.innerText = formated.detailed;
}

const formatTime = (timeValues) => {

    var counter = "";
    var detailed = "";

    for (key in timeValues) {
        var val = timeValues[key] <= 0 ? "0" : String(timeValues[key]).substr(0, 2);

        if (key == "dagar") {
            counter += val;
            detailed += val + " " + key;
        } else {
            counter += ":" + (val.length <= 1 ? "0" : "") + val;
            if (!["s", "ms"].includes(key)) detailed += ", " + val + " " + key;
        }
    }

    return {
        counter: counter,
        detailed: detailed + " kvar."
    };
}

detailed.addEventListener("mouseover", () => {
    showingGoal = true;

    const months = ["januari", "febuari", "mars", "april", "juni", "juli", "augusti", "september", "oktober", "november", "december"];
    const days = ["Mån", "Tis", "Ons", "Tors", "Fre", "Lör", "Sön"];

    var time = (String(goal.getHours()).length <= 1 ? "0" : "") + goal.getHours() + ":" + (String(goal.getMinutes()).length <= 1 ? "0" : "") + goal.getMinutes()

    detailed.innerText = days[goal.getDay() - 1] + "dag den " + goal.getDate() + " " + months[goal.getMonth() - 1] + " " + time + ", " + goal.getFullYear() + ".";
});

detailed.addEventListener("mouseout", () => {
    showingGoal = false;

    updateCounter()
});

var t = [];
function animate(now) {
    
    t.unshift(now);
    if (t.length > 50) {
        var t0 = t.pop();
        fps = Math.round(Math.floor(1000 * 50 / (now - t0)) / 10) * 10;
        interval = setInterval(updateCounter, 1000 / fps);
    }

    if (!fps) window.requestAnimationFrame(animate);
};

window.requestAnimationFrame(animate);