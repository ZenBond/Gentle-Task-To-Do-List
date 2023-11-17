document.addEventListener("DOMContentLoaded", function () {
  // Three.js initialization
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(80, window.innerWidth / window.innerHeight, 0.1, 1000);
  const renderer = new THREE.WebGLRenderer();
  // scene.fog = new THREE.Fog(0x74aac9, 2, 36);
  renderer.shadowMap.enabled = true;
  renderer.setSize(window.innerWidth, window.innerHeight);
  
  document.getElementById('threejs-container').appendChild(renderer.domElement);

  // Set background color
  scene.background = new THREE.Color(0xecfbf6);

  const deskMaterial = new THREE.MeshStandardMaterial({ color: 0xf3fdfc, roughness: 0.4, metalness: 0.1 }); 
  
  // Create a desk
  const deskGeometry = new THREE.BoxGeometry(10, .3, 8); 
  const desk = new THREE.Mesh(deskGeometry, deskMaterial);
  desk.position.set(4, -.2, -4.2); 
  desk.rotation.y = Math.PI / 5;
  scene.add(desk);

  const legGeometry = new THREE.BoxGeometry(0.3, 3, 0.3); 
  const backRightLegGeometry = new THREE.BoxGeometry(0.2, 2.5, 0.3); 

  // Create four legs and position them at each corner of the desk
  const frontLeftLeg = new THREE.Mesh(legGeometry, deskMaterial);
  frontLeftLeg.position.set(4, -1.8, -8); y
  scene.add(frontLeftLeg);

  const frontRightLeg = new THREE.Mesh(legGeometry, deskMaterial);
  frontRightLeg.position.set(8.83, -1.55, -3); 
  scene.add(frontRightLeg);

  const backLeftLeg = new THREE.Mesh(legGeometry, deskMaterial);
  backLeftLeg.position.set(-1.9, -1.6, -4.7); 
  scene.add(backLeftLeg);

  const backRightLeg = new THREE.Mesh(backRightLegGeometry, deskMaterial);
  backRightLeg.position.set(2.5, -1.55, 1.55); 
  scene.add(backRightLeg);
  

  const monitorMaterial = new THREE.MeshStandardMaterial({ color: 0x000000, emissive: 0x444444, roughness: 0.1, metalness: 0.8 });
  const monitorGeometry = new THREE.BoxGeometry(1.3, 4, 5);
  const monitor = new THREE.Mesh(monitorGeometry, monitorMaterial);
  monitor.position.set(4.2, 3.4, -3);
  monitor.rotation.x = Math.PI / 30;
  monitor.rotation.y = Math.PI / 3
  scene.add(monitor);

  const borderMaterial = new THREE.MeshStandardMaterial({ color: 0xffffff }); 
  const borderGeometry = new THREE.BoxGeometry(1, 4.3, 5.3);

  const border = new THREE.Mesh(borderGeometry, borderMaterial);
  border.position.copy(monitor.position); 
  border.rotation.copy(monitor.rotation); 
  scene.add(border);

  // Create CPU case
  const cpuMaterial = new THREE.MeshStandardMaterial({ color: 0xf4f2f2, roughness: -1, metalness: 0.8 });
  const cpuGeometry = new THREE.BoxGeometry(2, 1, 3);
  const cpu = new THREE.Mesh(cpuGeometry, cpuMaterial);
  cpu.position.set(5, 0.7, -4);
  cpu.rotation.x = Math.PI / 1;
  cpu.rotation.y = Math.PI / 3.5;
  scene.add(cpu);

  const keyboardMaterial = new THREE.MeshStandardMaterial({ color: 0xb1a4a5, roughness: -1, metalness: 0.8 });
  const keyboardGeometry = new THREE.BoxGeometry(4, 0.2, 2);
  const keyboard = new THREE.Mesh(keyboardGeometry, keyboardMaterial);
  keyboard.position.set(1.6, 0.1, -2);
  keyboard.rotation.y = Math.PI / 1.45
  scene.add(keyboard);

  const mouseMaterial = new THREE.MeshStandardMaterial({ color: 0xb1a4a5, roughness: -1, metalness: 0.8 });
  const mouseGeometry = new THREE.SphereGeometry(.2, .3, 7);
  const mouse = new THREE.Mesh(mouseGeometry, mouseMaterial);
  mouse.position.set(1.9, 0.5, 1.8);
  mouse.rotation.y = Math.PI / 10
  scene.add(mouse);

  const bookMaterial = new THREE.MeshStandardMaterial({ color: 0xc7bdbe, roughness: 0.1, metalness: 0.8 });
  const bookGeometry = new THREE.BoxGeometry(4, .5, 8);
  const book = new THREE.Mesh(bookGeometry, bookMaterial);
  book.position.set(10, 4, 1);
  book.rotation.x = Math.PI / -1.01
  book.rotation.y = Math.PI / 1.2
  scene.add(book);

  

  // Position the camera
  camera.position.set(-6, 3, 14);


  // Add ambient light
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
  scene.add(ambientLight);

  // Add directional light
  const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
  directionalLight.position.set(5, 5, 5);
  directionalLight.castShadow = true;
  scene.add(directionalLight);

  // Function to handle window resize
  const handleResize = function () {
    const newWidth = window.innerWidth;
    const newHeight = window.innerHeight;

    camera.aspect = newWidth / newHeight;
    camera.updateProjectionMatrix();

    renderer.setSize(newWidth, newHeight);
  };

  // Call handleResize initially and add an event listener for window resize
  handleResize();
  window.addEventListener('resize', handleResize);

  // Animation loop
  const animate = function () {
    requestAnimationFrame(animate);

    // Update the renderer
    renderer.render(scene, camera);
  };

  animate();
});
