
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
let myPeerConnection;

async function getAudios() {
    try {
        const devices = await navigator.mediaDevices.enumerateDevices();
        const audios = devices.filter(device=> device.kind === 'audioinput');
        const currentAudio = myStream.getAudioTracks()[0];
        audios.map(audio => {
            console.log(currentAudio)
            console.log(audio)
            console.log(audio.deviceId)
            console.log(audio.label)
            const option = document.createElement('option');
            option.value = audio.deviceId;
            option.innerText = audio.label
            if (currentAudio.label === audio.label) {
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
        // video : { facingMode : 'user' },
        video : false
    }
    const cameraConstrains = {
        audio : true,
        video : false
    }
    try {
        myStream = await navigator.mediaDevices.getUserMedia(
            deviceId ? cameraConstrains : initialConstrains
        )
        myFace.srcObject = myStream
        if (!deviceId) {
            await getAudios();
        }
    }
    catch (e) {
        console.log(e)
    }
}

// 음성 온오프
function handleMuteClick() {
    // console.log(myStream.getAudioTracks());
    myStream.getAudioTracks().forEach(track=>track.enabled =!track.enabled);
    if (!muted) {
        muteBtn.innerHTML = 'Unmute';
        muted = true;
    } else {
        muteBtn.innerHTML = 'Mute';
        muted = false;
    }
}
// 카메라 온오프
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
    // getMedia => 나의 미디어 트랙을 찾는 함수
    await getMedia(camerasSelect.value);
    console.log(camerasSelect.value);
    if (myPeerConnection) {

        const audioTrack = myStream.getAudioTracks()[0]
        // videoSender => 말 그대로 비디
        const auduiSender = myPeerConnection.getSenders().find(sender => sender.track.kind === "audio");

        auduiSender.replaceTrack(audioTrack)
    }
}
muteBtn.addEventListener("click", handleMuteClick);
cameraBtn.addEventListener("click", handlecameraClick);
camerasSelect.addEventListener('input', handleCameraChange);



// 웰컴 관련 함수
const welcome = document.querySelector('#welcome')
const welcomeForm = welcome.querySelector('form');

async function initCall() {
    welcome.hidden = true;
    call.hidden = false;
    await getMedia();
    // RTC 연결
    makeConnection();
}

async function handleWelcomeSubmit (e) {
    e.preventDefault();
    const input = welcomeForm.querySelector('input');
    await initCall()
    socket.emit("join_room",input.value);
    roomName = input.value;
    input.value = '';
}
welcomeForm.addEventListener('submit', handleWelcomeSubmit);



// socket code
// peer A 브라우저에서 실행(먼저들어온 유저) 이미 들어와있는 유저에게만 실행됨
socket.on('welcome', async ()=> {
    console.log("누군가 입장했습니다.")
    // offer는 초대장(접속코드)와 같음
    const offer = await myPeerConnection.createOffer();
    myPeerConnection.setLocalDescription(offer)
    socket.emit("offer", offer, roomName)
})

// peer B 브라우저에서 실행(나중에 들어온 유저)
socket.on('offer', async (offer)=> {
    // console.log(offer)
    myPeerConnection.setRemoteDescription(offer)
    const answer = await myPeerConnection.createAnswer();
    myPeerConnection.setLocalDescription(answer);
    socket.emit('answer', answer, roomName);
})

// peer A 브라우저에서 실행(먼저들어온 유저)
socket.on('answer', answer => {
    myPeerConnection.setRemoteDescription(answer)
})

socket.on('ice', ice => {
    myPeerConnection.addIceCandidate(ice);
})

// RTC code
// 연결을 만드는 함수
function makeConnection() {
    myPeerConnection = new RTCPeerConnection({
        iceServers : [
            {
                urls : [
                    "stun:stun.l.google.com:19302",
                    "stun:stun1.l.google.com:19302",
                    "stun:stun2.l.google.com:19302",
                    "stun:stun3.l.google.com:19302",
                    "stun:stun4.l.google.com:19302"
                ]
            }
        ]
    });
    myPeerConnection.addEventListener('icecandidate', handleIce)
    myPeerConnection.addEventListener('addstream', handleAddStream)
    
    // addStream === addTrack 같은 함수
    // myStream.getAudioTracks()[0].forEach(track=>myPeerConnection.addTrack(track, myStream))
    
    // 음성밖에 없기 때문에 반복문을 쓸 필요가 없음
    myPeerConnection.addTrack(myStream.getAudioTracks()[0], myStream)
}

function handleIce(data) {
    console.log(data)
    console.log(myStream.getAudioTracks()[0])
    socket.emit('ice', data.candidate, roomName)
    console.log("got icecandidate");
}

function handleAddStream(data) {
    // 원본코드 {
    const peerFace = document.querySelector('#peerFace');
    // peerFace.srcObject = data.stream;
    // }
    // const peerFace = document.createElement('video');
    // peerFace.autoplay = true;
    // peerFace.playsInline = true;
    // peerFace.style.width = '400px'
    // peerFace.style.height = '400px'
    // peerFace.srcObject = data.stream;
    document.querySelector('#call').appendChild(peerFace)
    console.log('got an event from my peer');
    console.log(data)
}