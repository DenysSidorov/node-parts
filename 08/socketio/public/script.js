const socket = io();

function showStatus(status, message) {
  document.querySelector('[data-status]').innerHTML = message || status;
  document.querySelector('[data-status]').setAttribute('data-status', status);
}

socket
  .on('error', function(message) {
    console.error(message);
    showStatus('error', message);
  });

'connect disconnect reconnect reconnecting reconnect_failed'.split(' ').forEach(function(event) {
  socket.on(event, function() {
    showStatus(event);
  })
});

socket.on('logout', function() {
  socket.disconnect();
  window.location.reload();
});

socket.emit('test', 'test', (m) => {
  console.log('from server', m);
});

socket.on('message', function(message, cb) {
  console.log(message);
  if (cb) cb("from client");
});
