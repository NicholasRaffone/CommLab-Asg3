const ticket = document.getElementById("ticket");
const welcomeScreen = document.getElementById("welcome-screen");
const panel = document.getElementById("panel");
const speaker = document.getElementById("speaker");

const randTime = (min, max) => {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1) + min);
}

ticket.addEventListener("mousedown", () => {
    welcomeScreen.classList.add("hidden");
    setInterval(function() {
        speaker.classList.toggle("flip-h");
    }, randTime(2000, 10000));
})