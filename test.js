const testaudio = 'https://raw.githubusercontent.com/NicholasRaffone/CommLab-Asg3/main/assets/laugh.wav'
const player = new Tone.Player(testaudio).toMaster()
const mainbutton = document.getElementById('testbutton');

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
    filepath: 'https://raw.githubusercontent.com/NicholasRaffone/CommLab-Asg3/main/assets/laugh.wav',
    buttonid : 'laughbutton',
    timeout: 2500,
    overlapsounds: ['','https://raw.githubusercontent.com/NicholasRaffone/CommLab-Asg3/main/assets/thankyou.wav']
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

let prevstate = 'started';

const max_timeout = Math.max.apply(Math, effectbuttons.map((effectbutton)=>effectbutton.timeout));
function checkAudio(){
    if([prevstate, player.state].every((val)=>val==='stopped'))
        console.log('end')
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

//press main button to play main sound
mainbutton.addEventListener('click',()=>{
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
    })
}

