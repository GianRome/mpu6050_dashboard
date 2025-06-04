const socket = new WebSocket("wss://tuo-server.onrender.com");

socket.onopen = () => {
  socket.send(JSON.stringify({ source: "browser" }));
};

socket.onmessage = function(event) {
  const data = JSON.parse(event.data);
  cube.rotation.x = data.pitch;
  cube.rotation.y = data.roll;
  cube.rotation.z = data.yaw;
  renderer.render(scene, camera);
};
