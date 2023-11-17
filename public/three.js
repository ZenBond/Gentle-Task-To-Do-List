document.addEventListener("DOMContentLoaded", function () {
  // Three.js initialization
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(80, window.innerWidth / window.innerHeight, 0.1, 1000);
  const renderer = new THREE.WebGLRenderer();
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.getElementById('threejs-container').appendChild(renderer.domElement);

  // Set background color
  scene.background = new THREE.Color(0xecfbf6);

  
  
  const deskMaterial = new THREE.MeshStandardMaterial({ color: 0xf3fdfc, roughness: 0.4, metalness: 0.1 }); 
  const whiteboardMaterial = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.1, metalness: 0.1, transparent: true, opacity: 0.8 });
  const whiteboardBorderMaterial = new THREE.MeshStandardMaterial({ color: 0xf09472, roughness: 0.1, metalness: 0.1, transparent: true, opacity: 0.8 });


  // Create a desk
  const deskGeometry = new THREE.BoxGeometry(2, 0.1, 3.2); // Adjust dimensions accordingly
  const desk = new THREE.Mesh(deskGeometry, deskMaterial);
  desk.position.set(4, -.2, -3.2); // Adjust position accordingly
  scene.add(desk);

  const legGeometry = new THREE.BoxGeometry(0.1, 3.5, 0.1); // Adjust dimensions accordingly

  // Create four legs and position them at each corner of the desk
  const frontLeftLeg = new THREE.Mesh(legGeometry, deskMaterial);
  frontLeftLeg.position.set(4.6, -2, -4.2); // Adjust position accordingly
  scene.add(frontLeftLeg);

  const frontRightLeg = new THREE.Mesh(legGeometry, deskMaterial);
  frontRightLeg.position.set(4.8, -1.9, -1.7); // Adjust position accordingly
  scene.add(frontRightLeg);

  const backLeftLeg = new THREE.Mesh(legGeometry, deskMaterial);
  backLeftLeg.position.set(3.1, -1.9, -4.5); // Adjust position accordingly
  scene.add(backLeftLeg);

  const backRightLeg = new THREE.Mesh(legGeometry, deskMaterial);
  backRightLeg.position.set(3.08, -1.9, -1.7); // Adjust position accordingly
  scene.add(backRightLeg);

  const whiteboardGeometry = new THREE.BoxGeometry(3.5, 2.3, 0.05);
  const whiteboardBorderGeometry = new THREE.BoxGeometry(3.3, 2.1, 0.06);
  const whiteboard = new THREE.Mesh(whiteboardGeometry, whiteboardMaterial);
  const whiteboardBorder = new THREE.Mesh(whiteboardBorderGeometry, whiteboardBorderMaterial);
  whiteboard.position.set(-1.4, .2, -1.7); // Adjust position accordingly
  whiteboardBorder.position.copy(whiteboard.position);
  scene.add(whiteboard);
  scene.add(whiteboardBorder);

  // Position the camera
  camera.position.set(-5, 0, 7);

  // Add ambient light
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
  scene.add(ambientLight);

  // Add directional light
  const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
  directionalLight.position.set(5, 5, 5);
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
