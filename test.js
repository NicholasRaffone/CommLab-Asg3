const getRandInt = (min, max) => {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1) + min);
}

const whichPerformance = getRandInt(0, 2);

const performances = ["pickleJuice.mp3", "timothee.mp3", "TSA.mp3"];
const titles = ["Pickle Juice", "Timothee", "TSA"];
title.textContent = titles[whichPerformance];

const rootUrl = "https://raw.githubusercontent.com/NicholasRaffone/CommLab-Asg3/main";

console.log(performances[whichPerformance]);

const testaudio = rootUrl + '/sounds/performances/' + performances[whichPerformance];

// const testaudio = 'https://raw.githubusercontent.com/NicholasRaffone/CommLab-Asg3/main/assets/laugh.wav'
const player = new Tone.Player(testaudio).toMaster()
const mainbutton = document.getElementById('ticket');

//timeout to make sure ppl don't spam click the living shit out of the button
// set to 2500ms
const GLOBAL_TIMEOUT = 2500;
let nextAvailablePress = 0;

//list of effectbuttons
/**
 * Structure:
 * {
 *  filepath->string: location of main sound effect
 *  buttonid->string: string of button iD in dom
 *  timeout->number: time in ms for how long to keep the sound effect & overlap playing
 *  overlapsounds->string[]: filepaths for overlap sounds, random selected everytime (empty string for no sound effect)
 * }
 */
 const effectbuttons = [{
    filepath: rootUrl + '/sounds/applause.wav',
    buttonid: 'button-1',
    timeout: 2500,
    overlapsounds: ['', rootUrl + '/assets/thankyou.wav']
    },
    {
    filepath: rootUrl + '/sounds/ba_dum_tss.wav',
    buttonid: 'button-2',
    timeout: 2500,
    overlapsounds: ['', rootUrl + '/assets/thankyou.wav']
    },
    {
    filepath: rootUrl + '/sounds/booing.mp3',
    buttonid: 'button-3',
    timeout: 2500,
    overlapsounds: ['', rootUrl + '/assets/thankyou.wav']
    },
    {
    filepath: rootUrl + '/sounds/bruh.mp3',
    buttonid: 'button-4',
    timeout: 2500,
    overlapsounds: ['', rootUrl + '/assets/thankyou.wav']
    },
    {
    filepath: rootUrl + '/sounds/cheering.mp3',
    buttonid: 'button-5',
    timeout: 2500,
    overlapsounds: ['', rootUrl + '/assets/thankyou.wav']
    },
    {
    filepath: rootUrl + '/sounds/crowd_laugh.wav',
    buttonid: 'button-6',
    timeout: 2500,
    overlapsounds: ['', rootUrl + '/assets/thankyou.wav']
    },
    {
    filepath: rootUrl + '/sounds/sad.mp3',
    buttonid: 'button-7',
    timeout: 2500,
    overlapsounds: ['', rootUrl + '/assets/thankyou.wav']
    }]

//current time of main player
let currTime = 0;

//play sound from player & offset: used for main player after pause
const playSound = (player, currTime=0) =>{
    player.start();
    player.seek(offset=Math.max(0, currTime-1))
}

//stop main sound, set currTime to the value where we stopped
const stopMainSound = (player) =>{
    currTime = player.now();
    player.stop();
}

const endingScreen = document.getElementById("ending-screen");

const showEndingScreen = () => {
    endingScreen.classList.remove("hidden");
}

const ticketEnd = document.getElementById("ticket-end")
ticketEnd.addEventListener("mousedown", () => {
    location.reload()
})

let prevstate = 'started';

const max_timeout = Math.max.apply(Math, effectbuttons.map((effectbutton)=>effectbutton.timeout));
console.log(max_timeout)
function checkAudio(){
    if([prevstate, player.state].every((val)=>val==='stopped')) {
        console.log('end')
        showEndingScreen()
    }
    prevstate = player.state
    setTimeout(checkAudio, max_timeout);
}


//Effect sound handler, takes in main player, effectplayer, etc.
//set currTimestamp to next available press on valid press
const effectSoundHandler = (player, effectplayer, timeout, overlapPlayers) =>{
    const currTimestamp = (new Date()).getTime()
    if(nextAvailablePress < currTimestamp){
        stopMainSound(player);
        playSound(effectplayer);
        const index = Math.floor(Math.random()*overlapPlayers.length);
        setTimeout(()=>{
            overlapPlayers&&overlapPlayers[index]&&playSound(overlapPlayers[index])
        },500)
        setTimeout(()=>{
            overlapPlayers&&overlapPlayers[index]&&overlapPlayers[index].stop()
            effectplayer.stop();
            playSound(player, currTime)}
        ,timeout)
        nextAvailablePress = currTimestamp + GLOBAL_TIMEOUT;
    }
}

const audience = ["audience.PNG", "audience2.PNG"];
let i = 0;

const audienceImg = document.getElementById("audience");
const changeAudience = () => {
    i = (i+1) % audience.length;
    audienceImg.src = "./images/" + audience[i];
}

const moveAudience = () => {
    for (let j=0; j<5; j++) {
        setTimeout(changeAudience, 300 * (j+1));
    }
}

//press main button to play main sound
mainbutton.addEventListener('mousedown',()=>{
    playSound(player, currTime);
    checkAudio();
})

//iterate over effectbuttons and create click eventlisteners
for(const effectbutton of effectbuttons){
    const {filepath, buttonid, timeout, overlapsounds} = effectbutton;
    const domButton = document.getElementById(buttonid)
    const effectPlayer = new Tone.Player(filepath).toMaster()
    let overlapPlayers
    if(overlapsounds){
        overlapPlayers = overlapsounds.map(sound=>(sound&&new Tone.Player(sound).toMaster()));
    }
    domButton.addEventListener(('click'),()=>{
        effectSoundHandler(player, effectPlayer, timeout, overlapPlayers);
        moveAudience();
    })
}

