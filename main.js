function onReaderLoad(event){
  var simulation_file = JSON.parse(event.target.result);
  load_simulation(window.scene,simulation_file);
}

/**
 * Fetches, reads, and compiles GLSL; sets global variables; and begins
 * the animation
 */
 async function setup() {
  window.play_bool = false
  window.time = 0;
  window.rod_list = [];
  window.mesh_list = [];
  document.querySelector('#simulation_file').addEventListener('change', event => {
      window.sliderDiv = document.getElementById("time");
      document.getElementById('slidercss').style.display = "block";
      document.getElementById('buttoncss').style.display = "flex";
      // Create the content div
      window.env_setup()
      var reader = new FileReader();
      reader.onload = onReaderLoad;
      let simulation_file = event.target.files[0]
      reader.readAsText(simulation_file);
      document.getElementById('progress-container').style.display = 'none';}, 
      (xhr) => {console.log(`loading ${xhr.loaded / xhr.total * 100}%`);}, (error) => {
      console.error(error);
      
      
  })
  // document.querySelector('#background').addEventListener("change", event => {
  //   var backgroundColor = document.getElementById('background').value;
  //   window.renderer.setClearColor(backgroundColor);
  //   groundMesh.material.color.set(backgroundColor);
  // });
  
  // document.querySelector('#rod_color').addEventListener("change", event => {
  //   var rodColor = document.getElementById('rod_color').value;
  //   rod_material.color.set(rodColor);
  // });
  document.querySelector('#play').addEventListener('click', event => {
    if (window.play_bool == true){
      window.play_bool = false;
    } else {
      window.play_bool = true;
    }
  })
  document.querySelector('#time').addEventListener('change', event => {
    if (window.play_bool == true){
    window.play_bool = false;
    document.getElementById('buttoncss').classList.toggle('active');
    }

    console.log(document.querySelector('#time').value);
    window.time = Number(document.querySelector('#time').value)
  })
  
  requestAnimationFrame(animate)
}

window.addEventListener('load', setup)
