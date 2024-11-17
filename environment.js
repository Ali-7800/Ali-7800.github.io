import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

window.renderer = new THREE.WebGLRenderer({ antialias: true });
window.renderer.outputColorSpace = THREE.SRGBColorSpace;

window.renderer.setSize(window.innerWidth, window.innerHeight);
window.renderer.setClearColor(0xffffff);
window.renderer.setPixelRatio(window.devicePixelRatio);

window.renderer.shadowMap.enabled = true;
window.renderer.shadowMap.type = THREE.PCFSoftShadowMap;

document.body.appendChild(renderer.domElement);

window.scene = new THREE.Scene();

window.camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
window.camera.position.set(3, 3, 3);
window.camera.up = new THREE.Vector3(0, 0, 1);

window.controls = new OrbitControls(camera, renderer.domElement);
window.controls.enableDamping = true;
window.controls.enablePan = true;
window.controls.minDistance = 1;
window.controls.maxDistance = 40;
window.controls.minPolarAngle = 0.5;
window.controls.maxPolarAngle = 1.5;
window.controls.autoRotate = false;
window.controls.target = new THREE.Vector3(0, 0, 0);
window.controls.update();

const groundGeometry = new THREE.PlaneGeometry(50, 50, 32, 32);
// groundGeometry.rotateX(-Math.PI / 2);
const groundMaterial = new THREE.MeshStandardMaterial({
  color: 0xffffff,
  side: THREE.DoubleSide
});
window.groundMesh = new THREE.Mesh(groundGeometry, groundMaterial);
window.groundMesh.castShadow = false;
window.groundMesh.receiveShadow = true;
window.groundMesh.position.set(0,0,-10)
window.scene.add(groundMesh);


// const hemiLight = new THREE.HemisphereLight( 0xffffff,0xffffff , 1 )
// hemiLight.position.set(0, 0, 1);
// window.scene.add(hemiLight);

// a light is required for MeshPhongMaterial to be seen
window.directionalLight = new THREE.DirectionalLight(0xffffff, 3)
window.directionalLight.position.set(0, 0, 1);
window.scene.add(window.directionalLight)

window.ambientLight = new THREE.AmbientLight(0xffffff, 1);
window.window.scene.add(window.ambientLight);


window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});


window.env_setup = function env_setup(){

  //color input
  const envColorInput = document.createElement("input");
  const envColorInputLabel = document.createElement("label");
  envColorInputLabel.setAttribute("for", "background")
  envColorInputLabel.textContent = "Background Color";
  envColorInputLabel.style.display = "none";
  envColorInputLabel.classList.add("content");
  envColorInput.setAttribute("type", "color");
  envColorInput.setAttribute("value", "#ffffff");
  envColorInput.setAttribute("id", "background")
  envColorInput.classList.add("content");
  envColorInput.style.display = "none";

  //top light input
  const envLightInput = document.createElement("input");
  const envLightInputLabel = document.createElement("label");
  envLightInputLabel.setAttribute("for", "env_light")
  envLightInputLabel.textContent = "Top Light";
  envLightInputLabel.style.display = "none";
  envLightInputLabel.classList.add("content");
  envLightInput.setAttribute("type", "range");
  envLightInput.setAttribute("max", 600);
  envLightInput.setAttribute("min", 0);
  envLightInput.setAttribute("value", 300);
  envLightInput.setAttribute("id", "env_light")
  envLightInput.setAttribute("class", "slider2")
  envLightInput.classList.add("content");

  //ambient light input
  const envAmbLightInputLabel = document.createElement("label");
  envAmbLightInputLabel.setAttribute("for", "env_amb_light")
  envAmbLightInputLabel.textContent = "Ambient Light";
  envAmbLightInputLabel.style.display = "none";
  envAmbLightInputLabel.classList.add("content");

  const envAmbLightInput = document.createElement("input");
  envAmbLightInput.setAttribute("type", "range");
  envAmbLightInput.setAttribute("max", 100);
  envAmbLightInput.setAttribute("min", 0);
  envAmbLightInput.setAttribute("value", 0);
  envAmbLightInput.setAttribute("id", "env_amb_light")
  envAmbLightInput.setAttribute("class", "slider2")
  envAmbLightInput.classList.add("content");

  const contentList = [envColorInputLabel,envColorInput,envAmbLightInputLabel,envAmbLightInput,envLightInputLabel,envLightInput]
  addCollapsibleElement("Environment",contentList)

  envLightInput.addEventListener("change", event => {
    window.directionalLight.intensity = envLightInput.value/100;
  });
  envAmbLightInput.addEventListener("change", event => {
    window.ambientLight.intensity = envAmbLightInput.value/100;
  });


  envColorInput.addEventListener("change", event => {
    var backgroundColor = envColorInput.value;
    window.renderer.setClearColor(backgroundColor);
    window.groundMesh.material.color.set(backgroundColor);
  });
}