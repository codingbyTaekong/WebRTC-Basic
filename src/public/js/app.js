const socket = io()

const welcom = document.querySelector('#welcome');
const form = welcom.querySelector('form');
const room = document.querySelector('#room');

room.hidden = true

let roomName;
function showRoom() {
    welcom.hidden = true;
    room.hidden = false;
    const h3 = room.querySelector("h3");
    h3.innerHTML = `Room : ${roomName}`
}
form.addEventListener("submit", (e)=> {
    e.preventDefault();
    const input = form.querySelector("input");
    // 소켓 이벤트를 실행한 뒤에 코드를 실행하려면 데이터 다음 인자로 넘져준다.
    socket.emit("enter_room", input.value, showRoom);
    roomName = input.value;
    input.value = ""
})