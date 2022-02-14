const socket = io()

const welcome = document.querySelector('#welcome');
const form = welcome.querySelector('form');
const room = document.querySelector('#room');

room.hidden = true

let roomName;
function addMessage(msg) {
    const ul = room.querySelector("ul")
    const li = document.createElement('li');
    li.innerHTML = msg;
    ul.appendChild(li)
}

function handleMessageSubmit(e) {
    e.preventDefault();
    const input = room.querySelector("#msg input");
    socket.emit("new_message", input.value, roomName, ()=> {
        addMessage(`You : ${input.value}`);
    })
}

function handleNicknameSubmit(e) {
    e.preventDefault();
    const input = room.querySelector("#name input");
    socket.emit("nickname", input.value);
}

function showRoom() {
    welcome.hidden = true;
    room.hidden = false;
    const h3 = room.querySelector("h3");
    h3.innerHTML = `Room : ${roomName}`
    const msgForm = room.querySelector('#msg');
    const nameForm = room.querySelector("#name");
    msgForm.addEventListener("submit", handleMessageSubmit);
    nameForm.addEventListener("submit", handleNicknameSubmit);
}
form.addEventListener("submit", (e)=> {
    e.preventDefault();
    const input = form.querySelector("input");
    // 소켓 이벤트를 실행한 뒤에 코드를 실행하려면 데이터 다음 인자로 넘져준다.
    socket.emit("enter_room", input.value, showRoom);
    roomName = input.value;
    input.value = ""
})

socket.on("welcome", (user, newCount)=> {
    const h3 = room.querySelector("h3");
    h3.innerHTML = `Room : ${roomName} (${newCount})`
    addMessage(`${user} arrived!`)
})

socket.on("bye", (left, newCount)=> {
    const h3 = room.querySelector("h3");
    h3.innerHTML = `Room : ${roomName} (${newCount})`
    addMessage(`${left} someone left!`)
})

socket.on("new_message", addMessage)

socket.on("room_change", (rooms)=> {
    const roomList = welcome.querySelector("ul");
    roomList.innerHTML = "";
    if(rooms.length === 0) {
        return;
    }
    rooms.forEach(room=> {
        const li = document.createElement("li");
        li.innerHTML = room;
        roomList.appendChild(li);
    })
})