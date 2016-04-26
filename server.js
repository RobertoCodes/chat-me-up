var Hapi = require('hapi');

var server = new Hapi.Server();
server.connection({port: 3000});

const loginHandler = function (request, reply) {

    reply.view('login.html', {});
};

server.register(require('vision'), (err) => {

    if (err) {
        throw err;
    }

    server.views({
        engines: { html: require('handlebars') },
        path: __dirname + '/public'
    });

    server.route({ method: 'GET', path: '/', handler: loginHandler });
});

// server.register(require('inert'), (err) => {
//
//   if (err) {
//     throw err;
//   }
//
//   server.route({
//     method: 'GET',
//     path: '/',
//     handler: handler
//   });
//
//   server.route({
//     method: 'GET',
//     path: '/login',
//     handler: function(request, reply){
//       reply.file('./public/login.html');
//     }
//   });
//
//   server.route({
//     method: 'POST',
//     path: '/login',
//     handler: function(request, reply){
//       var person = {
//         name: request.payload.name
//       };
//       reply.file('./public/index.html', person);
//     }
//   });
// });


var listener = server.listener;

var io = require('socket.io')(listener);

server.start((err) => {

  if (err) {
    throw err;
  }
  console.log('Server running at: ', server.info.uri);
});

io.on('connection', function(socket){
  console.log('a user connected');
  socket.on('chat message', function(message){
    io.emit('message event', message);
  });
  socket.on('disconnect', function(){
    console.log('a user disconnected');
  });
});
