import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';



window.load_rod = function load_rod(scene,positions,radius,id,rod_material,element_material,n_elem){
  let sphere_elem_step = radius[0].length/(n_elem)
  let sphere_elem = sphere_elem_step
  for (let i=0;i<radius[0].length;i++){
    const geometry = new THREE.SphereGeometry( radius[0][i], 64, 32 ); 
    let sphere;
    if (Math.abs(sphere_elem-i)<1 && i>0 && i<radius[0].length-1){
      sphere = new THREE.Mesh( geometry, element_material );
      sphere_elem += sphere_elem_step;
    }
    else{
      sphere = new THREE.Mesh( geometry, rod_material );
    }

    sphere.name = id+"_"+String(i);
    sphere.position.set(positions[0][i][0],positions[0][i][1],positions[0][i][2]);
    sphere.castShadow = false;
    sphere.traverse((child) => {
      if (child.isMesh) {
        child.castShadow = true;
        child.receiveShadow = true;
      }
    });
    scene.add(sphere);
  }
}

window.update_rod = function update_rod(scene,time,positions,radius,id) {
  for (let i=0;i<radius[0].length;i++){
    var current_sphere = scene.getObjectByName(id+"_"+String(i));
    var scale = (radius[time][i]/(radius[time][i-1]));
    current_sphere.scale.setScalar(scale);
    current_sphere.position.set(positions[time][i][0],positions[time][i][1],positions[time][i][2]);
  }
}


window.load_mesh = function load_mesh(scene,mesh_path,scale,orientation,position,id,opacity,wireframeMaterial,texture_path = 0){
  const loader = new GLTFLoader().setPath(mesh_path);
  loader.load('scene.gltf', (gltf) => {
    const mesh = gltf.scene;
    
    let rotation = new THREE.Matrix4();
    rotation.set( orientation[0][0], orientation[0][1], orientation[0][2], 0, 
                  orientation[1][0], orientation[1][1], orientation[1][2], 0,
                  orientation[2][0], orientation[2][1], orientation[2][2], 0, 
                  0, 0, 0, 1 );
    
    mesh.scale.set(scale[0], scale[1], scale[2]);
    mesh.applyMatrix4(rotation);
    mesh.position.set(position[0],position[1],position[2]);
    const wireframe = mesh.clone();
    wireframe.position.set(position[0],position[1],position[2])
    
    wireframe.traverse((child) => {
      if (child.isMesh) {
        child.material = wireframeMaterial;
        child.material.transparent = true;
        child.material.opacity = 0;
      }
    });
    mesh.traverse((child) => {
      if (child.isMesh) {
        if (texture_path != 0){
          const texture = new THREE.TextureLoader().load(texture_path);
          console.log(texture)
          texture.wrapS = THREE.RepeatWrapping;
          texture.wrapT = THREE.RepeatWrapping;
          texture.repeat.set( 1, 1 );
          const meshMaterial = new THREE.MeshStandardMaterial({
          map: texture,
          });
          child.material = meshMaterial;
          }
        child.castShadow = false;
        child.receiveShadow = true;
        child.material.transparent = true;
        child.material.opacity = opacity;
      }
    });
    mesh.name = id;
    wireframe.name = "wireframe"+id;
    scene.add(mesh);  
    scene.add(wireframe);
    
  });
}


window.addCollapsibleElement = function addCollapsibleElement(name,content_list) {
  // Create the button element
  const button = document.createElement("button");
  button.textContent = name;
  button.classList.add("collapsible");
  button.style.display = "block";

  // Add the button and content to the DOM (e.g., to the body)
  const object_container = document.getElementById("objectcss")
  object_container.appendChild(button);
  for (let i=0;i<content_list.length;i++){
    object_container.appendChild(content_list[i]);
  }

  // Add event listener to toggle the content
  button.addEventListener("click", function() {
    button.classList.toggle("active");
    for (let i=0;i<content_list.length;i++){
      if (content_list[i].style.display === "block") {
        content_list[i].style.display = "none"
      } else {
        content_list[i].style.display = "block"

      }
      }
  });
}


window.load_simulation = function load_simulation(scene,simulation_file){
  var simulation_objects = Object.keys(simulation_file);
  n_timesteps = simulation_file["n_timesteps"]
  timestep = simulation_file["timestep"]
  window.sliderDiv.max = n_timesteps-1;
  for (let i=0;i<rod_list.length;i++){
    for (let j=0;j<rod_list[i].radius[0].length;j++){
      var selectedObject = scene.getObjectByName(window.rod_list[i].id+"_"+String(j));
      scene.remove( selectedObject );
    }
    window.rod_list = [];
  }
  for (let i=0;i<mesh_list.length;i++){
    var selectedMesh = scene.getObjectByName(window.mesh_list[i].id);
    var selectedWireframe = scene.getObjectByName("wireframe"+window.mesh_list[i].id);
    scene.remove(selectedMesh);
    scene.remove(selectedWireframe);
    window.mesh_list = [];

  }
  var paras = document.getElementsByClassName('collapsible');
  while(paras[1]) {
      paras[1].parentNode.removeChild(paras[1]);
  }

  for (let i=0;i<simulation_objects.length;i++){
    if (simulation_objects[i].includes("mesh")){
      let current_mesh = simulation_file[simulation_objects[i]];
      let wireframeMaterial = new THREE.MeshPhongMaterial({
        color: 0x000000,
        wireframe: true //set's the wireframe
      });
      const meshOpacityInput = document.createElement("input");
      const meshOpacityInputLabel = document.createElement("label");
      meshOpacityInputLabel.setAttribute("for", "mesh_opacity"+current_mesh.id)
      meshOpacityInputLabel.textContent = "Mesh Opacity";
      meshOpacityInputLabel.style.display = "none";
      meshOpacityInputLabel.classList.add("content");
      meshOpacityInput.setAttribute("type", "range");
      meshOpacityInput.setAttribute("max", 100);
      meshOpacityInput.setAttribute("min", 0);
      meshOpacityInput.setAttribute("value", 100);
      meshOpacityInput.setAttribute("id", "mesh_opacity"+current_mesh.id)
      meshOpacityInput.setAttribute("class", "slider2")
      meshOpacityInput.classList.add("content");
      var opacity = 1.0
      const meshWireframeInput = document.createElement("input");
      const meshWireframeInputLabel = document.createElement("label");
      meshWireframeInputLabel.setAttribute("for", "mesh_wireframe"+current_mesh.id)
      meshWireframeInputLabel.textContent = "Wireframe";
      meshWireframeInputLabel.style.display = "none";
      meshWireframeInputLabel.classList.add("content");

      meshWireframeInput.setAttribute("type", "checkbox");
      meshWireframeInput.setAttribute("id", "mesh_wireframe"+current_mesh.id)
      meshWireframeInput.classList.add("content");
      const meshWireframeColorInput = document.createElement("input");
      meshWireframeColorInput.setAttribute("type", "color");
      meshWireframeColorInput.setAttribute("value", "#000000");
      meshWireframeColorInput.setAttribute("id", "wireframe_color"+current_mesh.id)
      meshWireframeColorInput.classList.add("content");
      meshWireframeColorInput.addEventListener("change", event => {
        var wireframeColor = meshWireframeColorInput.value;
        console.log(wireframeColor)
        wireframeMaterial.color.set(wireframeColor);
      });
      const content_list = [meshOpacityInputLabel,meshOpacityInput,meshWireframeInputLabel,meshWireframeInput,meshWireframeColorInput]
      addCollapsibleElement(current_mesh.id+" (Mesh)",content_list)
      window.mesh_list.push(current_mesh)
      if (typeof current_mesh.texture_path !== 'undefined'){
        load_mesh(scene,current_mesh.path,current_mesh.scale,current_mesh.orientation,current_mesh.position,current_mesh.id,opacity,wireframeMaterial,current_mesh.texture_path)
      }else{
        load_mesh(scene,current_mesh.path,current_mesh.scale,current_mesh.orientation,current_mesh.position,current_mesh.id,opacity,wireframeMaterial)
      }
      meshOpacityInput.addEventListener("change", event => {
        opacity = meshOpacityInput.value/100;
        // rod_material.color.set(rodColor);
        var meshObject = scene.getObjectByName(current_mesh.id);
        meshObject.traverse((child) => {
            if (child.isMesh) {   
              child.material.opacity = opacity;
            }
          });
        });
        meshWireframeInput.addEventListener("change", event => {
          var WireframeObject = scene.getObjectByName("wireframe"+current_mesh.id);
          WireframeObject.traverse((child) => {
              if (child.isMesh) { 
                if (meshWireframeInput.checked){
                  child.material.wireframe = true;
                  child.material.opacity = 1;
                } else{
                  child.material.wireframe = false;
                  child.material.opacity = 0;
                }

              }
            });
          });
    }
    if (simulation_objects[i].includes("rod")){
      let current_rod = simulation_file[simulation_objects[i]];
      let rod_material = new THREE.MeshPhysicalMaterial({})
      rod_material.color = new THREE.Color(0x8f86cc)
      let element_material = new THREE.MeshPhysicalMaterial({})
      element_material.color = new THREE.Color(0x8f86cc)
      // rod_material.ior = 1
      // rod_material.thickness = 10.0
      // rod_material.reflectivity = 1
      // rod_material.transmission = 0.5
      // rod_material.ior = 1
      // rod_material.reflectivity = 0
      // rod_material.transparent = true
      // rod_material.opacity = 1
      // element_material.transparent = true
      // element_material.opacity = 0.1
      // rod_material.roughness = 1
      // rod_material.clearcoat = 1
      // rod_material.clearcoatRoughness = 0
      const elementInput = document.createElement("input");
      const elementInputLabel = document.createElement("label");
      elementInputLabel.setAttribute("for", "show_elements"+current_rod.id)
      elementInputLabel.textContent = "Show Elements";
      elementInputLabel.style.display = "none";
      elementInputLabel.classList.add("content");

      elementInput.setAttribute("type", "checkbox");
      elementInput.setAttribute("id", "show_elements"+current_rod.id)
      elementInput.classList.add("content");
      elementInput.addEventListener("change", event => {
            if (elementInput.checked){
              element_material.color.set(0xff0000);
            } else{
              element_material.color.set(rodColorInput.value);
            }

        });
      
      const rodColorInput = document.createElement("input");
      const rodColorInputLabel = document.createElement("label");
      rodColorInputLabel.setAttribute("for", "rod_color"+current_rod.id)
      rodColorInputLabel.textContent = "Rod Color";
      rodColorInputLabel.style.display = "none";
      rodColorInputLabel.classList.add("content");
      rodColorInput.setAttribute("type", "color");
      rodColorInput.setAttribute("value", "#8f86cc");
      rodColorInput.setAttribute("id", "rod_color"+current_rod.id)
      rodColorInput.classList.add("content");
      rodColorInput.addEventListener("change", event => {
        var rodColor = rodColorInput.value;
        rod_material.color.set(rodColor);
        if (!elementInput.checked){
        element_material.color.set(rodColor);
        }
      });
      const content_list = [rodColorInputLabel,rodColorInput,elementInputLabel,elementInput]
      addCollapsibleElement(current_rod.id+" (Rod)",content_list)
      window.rod_list.push(current_rod)
      load_rod(scene,current_rod.positions,current_rod.radius,current_rod.id,rod_material,element_material,current_rod.n_elem)
    }
  }
}

window.n_timesteps = 100;
window.timestep = 1;
window.playback_speed = 1;
window.last_milliseconds = 0;

window.animate = function animate(milliseconds) {
  if (window.play_bool == true){
    if ((milliseconds-last_milliseconds)/1000>timestep/playback_speed){
      window.time++;
      window.time = window.time%n_timesteps;
      if (window.time == 0){
        window.play_bool = false;
        document.getElementById('buttoncss').classList.toggle('active');
      }
      last_milliseconds = milliseconds;
    }
  }
  for (let i=0;i<window.rod_list.length;i++){
    update_rod(scene,window.time,window.rod_list[i].positions,window.rod_list[i].radius,window.rod_list[i].id);
  }
  requestAnimationFrame(animate);
  window.controls.update();
  window.renderer.render(window.scene, window.camera);
  document.querySelector('#time').value = window.time;
  window.playback_speed = document.querySelector('#speed').value;
}

