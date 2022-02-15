
const socket = io();

const myFace = document.querySelector('#myFace');
const muteBtn = document.querySelector("#mute")
const cameraBtn = document.querySelector('#camera')
const camerasSelect = document.querySelector('#cameras')
// stream 은 비디오와 오디오가 결합된 것

const call = document.querySelector('#call')

call.hidden = true;

let myStream;
let muted = false;
let cameraOff = false;
let roomName;

async function getCameras() {
    try {
        const devices = await navigator.mediaDevices.enumerateDevices();
        const cameras = devices.filter(device=> device.kind === 'videoinput');
        const currentCamera = myStream.getVideoTracks()[0];
        cameras.map(camera => {
            const option = document.createElement('option');
            option.value = camera.deviceId;
            option.innerText = camera.label
            if (currentCamera.label === camera.label) {
                option.selected = true;
            }
            camerasSelect.appendChild(option)
        })
    } catch (error) {
        console.log(error)
    }
}

async function getMedia(deviceId) {
    const initialConstrains = {
        audio : true,
        video : { facingMode : 'user' }
    }
    const cameraConstrains = {
        audio : true,
        video : { deviceId : { exact : deviceId } }
    }
    try {
        myStream = await navigator.mediaDevices.getUserMedia(
            deviceId ? cameraConstrains : initialConstrains
        )
        myFace.srcObject = myStream
        if (!deviceId) {
            await getCameras();
        }
    }
    catch (e) {
        console.log(e)
    }
}

function handleMuteClick() {
    console.log(myStream.getAudioTracks());
    myStream.getAudioTracks().forEach(track=>track.enabled =!track.enabled);
    if (!muted) {
        muteBtn.innerHTML = 'Unmute';
        muted = true;
    } else {
        muteBtn.innerHTML = 'Mute';
        muted = false;
    }
}
function handlecameraClick() {
    myStream.getVideoTracks().forEach(track=>track.enabled =!track.enabled);
    if (cameraOff) {
        cameraBtn.innerText = "Turn Camera Off";
        cameraOff = false;
    } else {
        cameraBtn.innerText = "Turn Camera On";
        cameraOff = true;
    }
}
async function handleCameraChange() {
    await getMedia(camerasSelect.value);
    console.log(camerasSelect.value);
}
muteBtn.addEventListener("click", handleMuteClick);
cameraBtn.addEventListener("click", handlecameraClick);
camerasSelect.addEventListener('input', handleCameraChange);



// 웰컴 관련 함수
const welcome = document.querySelector('#welcome')
const welcomeForm = welcome.querySelector('form');

function startMedia() {
    welcome.hidden = true;
    call.hidden = false;
    getMedia();
}

function handleWelcomeSubmit (e) {
    e.preventDefault();
    const input = welcomeForm.querySelector('input');
    socket.emit("join_room",input.value, startMedia);
    roomName = input.value;
    input.value = '';
}
welcomeForm.addEventListener('submit', handleWelcomeSubmit);



// socket code

socket.on('welcome', ()=> {
    console.log("someone joined")
})