
const socket = io();

const myFace = document.querySelector('#myFace');
const muteBtn = document.querySelector("#mute")
const cameraBtn = document.querySelector('#camera')
// stream 은 비디오와 오디오가 결합된 것

let myStream;
let muted = false;
let cameraOff = false;

async function getMedia() {
    try {
        myStream = await navigator.mediaDevices.getUserMedia({
            audio : true,
            video :true
        })
        console.log(myStream)
        myFace.srcObject = myStream
    }
    catch (e) {
        console.log(e)
    }
}

getMedia();

function handleMuteClick() {
    if (!muted) {
        muteBtn.innerHTML = 'Unmute'
        muted = true;
    } else {
        muteBtn.innerHTML = 'Mute'
        muted = false;
    }
}
function handlecameraClick() {
    if (cameraOff) {
        cameraBtn.innerText = "Turn Camera Off"
        cameraOff = false;
    } else {
        cameraBtn.innerText = "Turn Camera On"
        cameraOff = true;
    }
}
muteBtn.addEventListener("click", handleMuteClick)
cameraBtn.addEventListener("click", handlecameraClick)