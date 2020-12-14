
const express = require('express');


const app = express();










const server = app.listen(3001, function() {
    console.log('server running on port 3001');
});

var sockets = []

const io = require('socket.io')(server);


io.on('connection', function(socket) {

    socket.on('LOGIN', function(data) {

        sockets.push([socket.id, data.user])
        console.log(sockets)
        sendOnline()

    });

    console.log(socket.id)
    socket.on('SEND_MESSAGE', function(data) {

        if (data.recipient == "everyone"){
            io.emit('MESSAGE', data)
        } else{
            io.to(socket.id).emit('MESSAGE', data)
            sockets.forEach(Element =>{
                if (Element[1] == data.recipient){
                    io.to(Element[0]).emit('MESSAGE', data)
                }
            })

        }

    });

    socket.on('disconnect', function () {

        sockets.forEach(function(item, index, object) {
            if (item[0] == socket.id) {
                object.splice(index, 1);
                sendOnline()
            }
        });

    });
});

function sendOnline(){
    var onlineUsernames = []
    sockets.forEach(Element=>{
        onlineUsernames.push(Element[1])
    })
    io.emit('ONLINE', onlineUsernames)
}