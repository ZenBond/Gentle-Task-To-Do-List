document.addEventListener("DOMContentLoaded", function () {
  // Three.js initialization
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(80, window.innerWidth / window.innerHeight, 0.1, 1000);
  const renderer = new THREE.WebGLRenderer();
  renderer.shadowMap.enabled = true;
  renderer.setSize(window.innerWidth, window.innerHeight);
  
  document.getElementById('threejs-container').appendChild(renderer.domElement);

  
  scene.background = new THREE.Color(0xecfbf6);

  const deskMaterial = new THREE.MeshStandardMaterial({ color: 0xf3fdfc, roughness: 0.4, metalness: 0.1 }); 
  
  
  const deskGeometry = new THREE.BoxGeometry(10, .3, 8); 
  const desk = new THREE.Mesh(deskGeometry, deskMaterial);
  desk.position.set(4, -.2, -4.2); 
  desk.rotation.y = Math.PI / 5;
  scene.add(desk);

  const legGeometry = new THREE.BoxGeometry(0.3, 3, 0.3); 
  const backRightLegGeometry = new THREE.BoxGeometry(0.2, 2.5, 0.3); 

 
  const frontLeftLeg = new THREE.Mesh(legGeometry, deskMaterial);
  frontLeftLeg.position.set(4, -1.8, -8); 
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

  const borderMaterial = new THREE.MeshStandardMaterial({ color: 0xbbcbc5 }); 
  const borderGeometry = new THREE.BoxGeometry(1, 4.3, 5.3);

  const border = new THREE.Mesh(borderGeometry, borderMaterial);
  border.position.copy(monitor.position); 
  border.rotation.copy(monitor.rotation); 
  scene.add(border);

  
  const cpuMaterial = new THREE.MeshStandardMaterial({ color: 0x4e6260});
  const cpuGeometry = new THREE.BoxGeometry(2, 1, 3);
  const cpu = new THREE.Mesh(cpuGeometry, cpuMaterial);
  cpu.position.set(5, 0.7, -4);
  cpu.rotation.x = Math.PI / 1;
  cpu.rotation.y = Math.PI / 3.5;
  scene.add(cpu);

  const keyboardMaterial = new THREE.MeshStandardMaterial({ color: 0x4e6260 });
  const keyboardGeometry = new THREE.BoxGeometry(4, 0.2, 2);
  const keyboard = new THREE.Mesh(keyboardGeometry, keyboardMaterial);
  keyboard.position.set(1.6, 0.1, -2);
  keyboard.rotation.y = Math.PI / 1.45
  scene.add(keyboard);

  const mouseMaterial = new THREE.MeshStandardMaterial({ color: 0x4e6260});
  const mouseGeometry = new THREE.SphereGeometry(.2, .3, 7);
  const mouse = new THREE.Mesh(mouseGeometry, mouseMaterial);
  mouse.position.set(1.9, 0.5, 1.8);
  mouse.rotation.y = Math.PI / 10
  scene.add(mouse);

  
  const fanMaterial = new THREE.MeshStandardMaterial({ color: 0x555555, roughness: 0.7, metalness: 0.8 });
  const bladeMaterial = new THREE.MeshStandardMaterial({ color: 0x888888, roughness: 0.5, metalness: 0.8 });

  
  const mountGeometry = new THREE.CylinderGeometry(0.2, 0.2, 0.1, 16);
  const mount = new THREE.Mesh(mountGeometry, fanMaterial);
  mount.position.set(-7, 4, 8);
  scene.add(mount);


  const baseGeometry = new THREE.CylinderGeometry(0.1, 0.1, 0.2, 16);
  const base = new THREE.Mesh(baseGeometry, fanMaterial);
  base.position.y = 0.1;
  base.position.set(-7, 4, 8);
  scene.add(base);


  const bladeGeometry = new THREE.BoxGeometry(0.01, 0.1, 1);
  const fanBlades = new THREE.Group();

  for (let i = 0; i < 3; i++) {
    const blade = new THREE.Mesh(bladeGeometry, bladeMaterial);
    blade.position.set(-7.2 + Math.cos((i / 3) * Math.PI * 2) * 0.2, 3.9 + 0.05, 8 + Math.sin((i / 3) * Math.PI * 2) * 0.2);
    blade.rotation.y = (i / 3) * Math.PI * 2;
    fanBlades.add(blade);
  }

  scene.add(fanBlades);

  const rugMaterial = new THREE.MeshStandardMaterial({ color: 0xe1b074 });
  const rugGeometry = new THREE.PlaneGeometry(12, 10); 
  
  
  const rug = new THREE.Mesh(rugGeometry, rugMaterial);
  rug.rotation.x = -Math.PI / 2; 
  rug.position.set(4, -3, -4.2); 
  scene.add(rug);

  const borderMaterial1 = new THREE.MeshStandardMaterial({ color: 0xc0dbef });
  const borderGeometry1 = new THREE.PlaneGeometry(12.5, 10.6);


  const border1 = new THREE.Mesh(borderGeometry1, borderMaterial1);
  border1.rotation.x = -Math.PI / 2;
  border1.position.set(4, -3, -4.2);
  scene.add(border1);


  const borderMaterial2 = new THREE.MeshStandardMaterial({ color: 0xe1b074});
  const borderGeometry2 = new THREE.PlaneGeometry(13, 11);


  const border2 = new THREE.Mesh(borderGeometry2, borderMaterial2);
  border2.rotation.x = -Math.PI / 2;
  border2.position.set(4, -3, -4.2);
  scene.add(border2);

  const windowMaterial = new THREE.MeshStandardMaterial({ color: 0xf2f4f3, opacity: 0.8 });
  const windowGeometry = new THREE.PlaneGeometry(12, 8); 
  const windowMesh = new THREE.Mesh(windowGeometry, windowMaterial);
  windowMesh.position.set(11, 11, -9.5); 
  windowMesh.rotation.y = Math.PI / -5; 
  scene.add(windowMesh);

  
  const textureLoader = new THREE.TextureLoader();
  const windowTexture = textureLoader.load('image.jpeg'); 
  windowMaterial.map = windowTexture;

  const playerMaterial = new THREE.MeshStandardMaterial({ color: 0x2d2f38 });
  const playerGeometry = new THREE.BoxGeometry(1, 1, .5);
  const musicPlayer = new THREE.Mesh(playerGeometry, playerMaterial);
  musicPlayer.position.set(6.5, .5, -2);
  scene.add(musicPlayer);

  const speakerMaterial = new THREE.MeshStandardMaterial({ color: 0xeeeeef });
  const speakerGeometry = new THREE.CylinderGeometry(0.2, 0.3, 0.1, 17);
  const speaker = new THREE.Mesh(speakerGeometry, speakerMaterial);
  speaker.rotation.y = Math.PI / 10;
  speaker.rotation.x = Math.PI / 2;
  speaker.position.set(5.8, .6, -1);
  scene.add(speaker);



  camera.position.set(-7, 2, 11);


 
  const ambientLight = new THREE.AmbientLight(0xf1f4f3, 1);
  scene.add(ambientLight);

  
  const directionalLight = new THREE.DirectionalLight(0xf1f4f3, .2);
  directionalLight.position.set(2, 2, 2);
  directionalLight.castShadow = true;
  scene.add(directionalLight);

  
  const handleResize = function () {
    const newWidth = window.innerWidth;
    const newHeight = window.innerHeight;

    camera.aspect = newWidth / newHeight;
    camera.updateProjectionMatrix();

    renderer.setSize(newWidth, newHeight);
  };

  
  handleResize();
  window.addEventListener('resize', handleResize);

  
  const animate = function () {
    requestAnimationFrame(animate);

    

    
    renderer.render(scene, camera);
  };

  animate();
});
