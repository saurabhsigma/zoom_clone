// // const express = require('express')
// // const app = express()
// // const server = require('http').Server(app)
// // const io = require('socket.io')(server)
// // const { v4: uuidV4 } = require('uuid')

// // app.set('view engine', 'ejs')
// // app.use(express.static('public'))

// // app.get('/', (req, res) => {
// //   res.redirect(`/${uuidV4()}`)
// // })

// // app.get('/:room', (req, res) => {
// //   res.render('room', { roomId: req.params.room })
// // })

// // io.on('connection', socket => {
// //   socket.on('join-room', (roomId, userId) => {
// //     socket.join(roomId)
// //     socket.broadcast.to(roomId).emit('user-connected', userId)

// //     socket.on('disconnect', () => {
// //       socket.to(roomId).broadcast.emit('user-disconnected', userId)
// //     })
// //   })
// // })

// // server.listen(3000)

// const express = require('express');
// const { v4: uuidV4 } = require('uuid');
// const app = express();
// const server = require('http').Server(app);
// const io = require('socket.io')(server);
// const { ExpressPeerServer } = require('peer');
// const peerServer = ExpressPeerServer(server, {
//   debug: true
// });

// app.use('/peerjs', peerServer);
// app.set('view engine', 'ejs');
// app.use(express.static('public'));

// app.get('/', (req, res) => {
//   res.redirect(`/${uuidV4()}`);
// });

// app.get('/:room', (req, res) => {
//   res.render('room', { roomId: req.params.room });
// });

// io.on('connection', socket => {
//   socket.on('join-room', (roomId, userId) => {
//     socket.join(roomId);
//     socket.to(roomId).emit('user-connected', userId);

//     socket.on('disconnect', () => {
//       socket.to(roomId).emit('user-disconnected', userId);
//     });
//   });
// });

// server.listen(3000);


const express = require('express');
const { v4: uuidV4 } = require('uuid');
const { ExpressPeerServer } = require('peer');
const http = require('http');
const app = express();
const server = http.createServer(app);
const io = require('socket.io')(server);

// PeerJS Server
const peerServer = ExpressPeerServer(server, {
  debug: true,
  path: '/'
});
app.use('/peerjs', peerServer);

app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  res.render('index');
});

app.post('/join', (req, res) => {
  res.redirect(`/${req.body.roomId}`);
});

app.get('/new', (req, res) => {
  res.redirect(`/${uuidV4()}`);
});

app.get('/:room', (req, res) => {
  res.render('room', { roomId: req.params.room });
});

io.on('connection', socket => {
  socket.on('join-room', (roomId, userId) => {
    socket.join(roomId);
    socket.broadcast.to(roomId).emit('user-connected', userId);

    socket.on('disconnect', () => {
      socket.to(roomId).emit('user-disconnected', userId);
    });
  });
});

server.listen(3000, () => {
  console.log('Server running on http://localhost:3000');
});
