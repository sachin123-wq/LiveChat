// By this following lline we make the connection with server
const socket = io('http://localhost:8000/');

// Get DOM elements in respective Js variables

const form = document.getElementById('send-container');
// console.log(form);
const messageInput = document.getElementById('messageInp');
// console.log(messageInput);
// The Document method querySelector() returns the first Element within the document that matches the specified selector, or group of selectors. If no matches are found, null is returned. 
const messageContainer = document.querySelector(".container");
// console.log(messageContainer);

// Audio that will play on recieving messages.
var audio = new Audio('msg_ting.mp3');
console.log(audio);


// Append function which will appened event info to the container

const append = (message , position) => {

    const messageElement = document.createElement('div');
    messageElement.innerText = message;
    messageElement.classList.add('message');
    messageElement.classList.add(position);
    messageContainer.append(messageElement);

    if(position == 'left')
        audio.play();
}

// Ask new user for his/her name and let the server know

const name1 = prompt("enter your name to join");
// console.log(name);
// const name1 = "sachin";

socket.emit('new-user-joined' , name1);

// if the new user joins , receive his/her name from the server
socket.on('user-joined' , name => {
    append(`${name} joined the chat` , 'right');
});

// if server send a message receive it
socket.on('receive' , data => {
    append(`${data.name}: ${data.message} ` , 'left');
});


// if a user leaves the chat , append the info to the container
socket.on('leave' , name => {
    append(`${name} left the chat` , 'right');
});


// if the form get submitted , send server the message

form.addEventListener('submit' , (e) => {
    e.preventDefault();
    const message = messageInput.value;
    append(`You : ${message}` , 'right');
    socket.emit('send' , message);
    messageInput.value = '';
});

