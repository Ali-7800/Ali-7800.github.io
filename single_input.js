/**
 * Fetches, reads, and compiles GLSL; sets global variables; and begins
 * the animation
 */
 async function setup() {
  window.play_bool = false
  window.time = 0;
  window.rod_list = [];
  window.mesh_list = [];
  window.sliderDiv = document.getElementById("time");
  document.getElementById('slidercss').style.display = "block";
  document.getElementById('buttoncss').style.display = "flex";
  // Create the content div
  window.env_setup()
  // document.getElementById('colorcss').style.display = "block";
  let sim_path = document.getElementById('sim_path')
  console.log(sim_path.textContent)
  let snake = await fetch(sim_path.textContent).then(res => res.json())
  load_simulation(window.scene,snake);
  (xhr) => {console.log(`loading ${xhr.loaded / xhr.total * 100}%`);}
  (error) => {console.error(error);}
  
  
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
    window.play_bool = false;
    window.time = Number(document.querySelector('#time').value) || 0
  })
  
  requestAnimationFrame(animate)
}

window.addEventListener('load', setup)
