import io from 'socket.io-client';

const socket = io('http://localhost:5000', {
  transports: ['websocket'],
  reconnection: true
});

socket.on('connect', () => {
  console.log('Connected to server:', socket.id);
  socket.emit('message', JSON.stringify({ event: 'join', userId: 'test-partner' }));
});

socket.on('newOrder', (data) => {
  console.log('Received new order:', data);
});

socket.on('disconnect', () => {
  console.log('Disconnected from server');
});

socket.on('connect_error', (error) => {
  console.error('Connection error:', error);
});

socket.on('error', (error) => {
  console.error('Socket error:', error);
});