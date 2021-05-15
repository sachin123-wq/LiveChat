// Node server which will handle socket io connections

const { createServer } = require('http');
const server = require('http').createServer();

const options = {
  cors: {
    // origin: 'http://127.0.0.1:5500',
    origin: '*',
  },
};
const io = require('socket.io')(server, options);


// console.log(io);
// const cors = require('cors');

const users = {};

io.on('connection' , socket => {

    socket.on('new-user-joined' , name => {

        // if a new user joined the chat then tell the other users which are already present in the chat box that A new user joined the chat.
        console.log("New user " , name);
        users[socket.id] = name;
        socket.broadcast.emit('user-joined' , name);
    });

    // if someone send the message brodcast to the others
    socket.on('send' , message => {
        socket.broadcast.emit('receive' , {message: message , name: users[socket.id]})
    });

    // if someone leaves the chat . let other know that someone leave the chat 
    // disconnect is predefined event present in socket.io
    // but above event (new-user-joined , send) are made by programmer.

    socket.on('disconnect' , message => {
      socket.broadcast.emit('leave' , users[socket.id]);
      delete users[socket.id];
    });
    
})

server.listen(8000, () => {
    console.log('Server ready....');
  });