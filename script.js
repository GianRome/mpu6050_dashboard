/*
  Aggiornato per usare WebSocket invece di SSE
*/

let scene, camera, renderer, cube;

function parentWidth(elem) {
  return elem.parentElement.clientWidth;
}

function parentHeight(elem) {
  return elem.parentElement.clientHeight;
}

function init3D(){
  scene = new THREE.Scene();
  scene.background = new THREE.Color(0xffffff);

  camera = new THREE.PerspectiveCamera(75, parentWidth(document.getElementById("3Dcube")) / parentHeight(document.getElementById("3Dcube")), 0.1, 1000);

  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(parentWidth(document.getElementById("3Dcube")), parentHeight(document.getElementById("3Dcube")));

  document.getElementById('3Dcube').appendChild(renderer.domElement);

  const geometry = new THREE.BoxGeometry(5, 1, 4);
  const cubeMaterials = [
    new THREE.MeshBasicMaterial({color:0x03045e}),
    new THREE.MeshBasicMaterial({color:0x023e8a}),
    new THREE.MeshBasicMaterial({color:0x0077b6}),
    new THREE.MeshBasicMaterial({color:0x03045e}),
    new THREE.MeshBasicMaterial({color:0x023e8a}),
    new THREE.MeshBasicMaterial({color:0x0077b6}),
  ];

  const material = new THREE.MeshFaceMaterial(cubeMaterials);
  cube = new THREE.Mesh(geometry, material);
  scene.add(cube);
  camera.position.z = 5;
  renderer.render(scene, camera);
}

function onWindowResize(){
  camera.aspect = parentWidth(document.getElementById("3Dcube")) / parentHeight(document.getElementById("3Dcube"));
  camera.updateProjectionMatrix();
  renderer.setSize(parentWidth(document.getElementById("3Dcube")), parentHeight(document.getElementById("3Dcube")));
}

window.addEventListener('resize', onWindowResize, false);
init3D();

// WebSocket connection
const socket = new WebSocket("ws://http://192.168.1.102/:81/"); // ← metti qui l’IP del tuo ESP32

socket.onopen = () => {
  console.log("WebSocket Connected");
};

socket.onclose = () => {
  console.log("WebSocket Disconnected");
};

socket.onerror = (error) => {
  console.log("WebSocket Error:", error);
};

socket.onmessage = function(event) {
  const obj = JSON.parse(event.data);
  document.getElementById("yaw").textContent = obj.yaw.toFixed(2);
  document.getElementById("pitch").textContent = obj.pitch.toFixed(2);
  document.getElementById("roll").textContent = obj.roll.toFixed(2);

  // Update cube rotation
  cube.rotation.y = obj.yaw * Math.PI / 180;
  cube.rotation.x = obj.pitch * Math.PI / 180;
  cube.rotation.z = obj.roll * Math.PI / 180;

  renderer.render(scene, camera);
};
