const socket = io();
const messagesList = document.querySelector('.messages');
const messageForm = document.querySelector('form.chat-message');
const messageInput = document.getElementById('message');
const chatHistory = document.querySelector('.chat-history');

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
  });
});

messageForm.addEventListener('submit', e => {
  e.preventDefault();

  if (!messageInput.value.trim()) return;

  const msg = buildUserMessage(true, formatDate(new Date()), '', messageInput.value);
  messagesList.insertAdjacentHTML('beforeend', msg);
  chatHistory.scrollTop = messagesList.scrollHeight;

  socket.emit('message', messageInput.value);

  messageInput.value = '';
});

socket.on('logout', function(data) {
  socket.disconnect();
  window.location.reload();
});

socket.on('system_message', data => {
  const msg = buildSystemMessage(formatDate(new Date()), data);
  messagesList.insertAdjacentHTML('beforeend', msg);
  chatHistory.scrollTop = messagesList.scrollHeight;
});

socket.on('user_message', ({user, date, text}) => {
  const msg = buildUserMessage(false, formatDate(new Date(date)), user, text);
  messagesList.insertAdjacentHTML('beforeend', msg);
  chatHistory.scrollTop = messagesList.scrollHeight;
});

function formatDate(date) {
  return `${date.getHours()}:${date.getMinutes()}`;
}

function buildUserMessage(isMyMessage, date, name, text) {
  const [blockClassName, messageClassName] = (() => {
    let _blockClassName = 'message-data';
    let _messageClassName = 'message';
    if (isMyMessage) {
      _messageClassName += ' my-message';
    } else {
      _blockClassName += ' align-right';
      _messageClassName += ' other-message float-right';
    }

    return [_blockClassName, _messageClassName];
  })();

  return `
    <li class="clearfix">
      <div class="${blockClassName}">
        <span class="message-data-time">${date}
        <span class="message-data-name">${name}</span>

      </div>
      <div class="${messageClassName}">
        ${text}
      </div>
    </li>
  `;
}
function buildSystemMessage(date, text) {
  return `
    <li class="clearfix">
      <div class="message-data">
        <span class="message-data-time">${date} ${text}</span>
    </li>
  `;
}
