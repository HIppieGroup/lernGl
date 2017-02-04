var scene, camera, renderer, modelLevel, loader, sphere, Key;
var gravity = true;

init();
render();

function init(){
  
  var webElementGl = document.getElementById('webgl');
  var winW = window.innerWidth;
  var winH = window.innerHeight;

  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera(75,winW/winH, .1, 500);
  renderer = new THREE.WebGLRenderer();

  renderer.setClearColor(0xdddddd);
  renderer.setSize(winW, winH);

  renderer.shadowMapEnabled = true;
  renderer.shadowMapSoft = true;

  webElementGl.appendChild(renderer.domElement);

  var light = new THREE.DirectionalLight( 0xffffff);
  light.position.set(100,200,0);
  light.castShadow = true;
  scene.add(light);


  function addSphere() {
    var sphereG = new THREE.SphereGeometry(2,20,20);
    var sphereM = new THREE.MeshLambertMaterial({
      color: 0xff3300,
      side: THREE.FrontSide
    });
    sphere = new THREE.Mesh(sphereG, sphereM);
    sphere.castShadow = true;
    sphere.position.y = 10;
    scene.add(sphere);
  }

  addSphere();

  camera.position.x = sphere.position.x + 10;
  camera.position.y = sphere.position.y + 10;
  camera.position.z = sphere.position.z -100;


  loader = new THREE.JSONLoader();
  loader.load('model/level.json',addModel); 

  modelLevel = new THREE.Mesh();

  function addModel(geometry, materials) {
    var mat = new THREE.MeshLambertMaterial({
      color: 0x2194ce,
      side: THREE.FrontSide
    });
    modelLevel = new THREE.Mesh(geometry,mat);
    modelLevel.receiveShadow = true;
    modelLevel.castShadow = true;
    modelLevel.scale.set(10,10,10);
    modelLevel.position.set(40,0,10);
    scene.add(modelLevel);
  }

  function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize ( window.innerWidth, innerHeight);
  }  

  Key = {
   _pressed :{},
   A: 65,
   W: 87,
   D: 68,
   S: 83,
   SPACE: 32,
   VK_LEFT: 37,
   VK_RIGHT: 39,
   VK_UP: 38,
   VK_SPACE: 32,
   VK_ENTER: 13,
   VK_DOWN: 40,

  isDown: function(keyCode){
    return this._pressed[keyCode];
  },
  onKeydown: function(event) {
    this._pressed[event.keyCode] = true;
  },
  onKeyup: function(event){
    delete this._pressed[event.keyCode];
  }
};


window.addEventListener('keyup',function(event){
    Key.onKeyup(event);
  },false);
window.addEventListener('keydown',function(event){
    Key.onKeydown(event);
  },false);
window.addEventListener( 'resize', onWindowResize, false );


};



function dynamo(){
  if (Key.isDown(Key.A)) {
    sphere.position.x += 1;
    sphere.rotation.z -= .3;
  }
  if (Key.isDown(Key.D)) {
    sphere.position.x -= 1;
    sphere.rotation.z += .3;

  }
  if (Key.isDown(Key.W)) {
    sphere.position.z += 1;
    sphere.rotation.x += .3;
  }
  if (Key.isDown(Key.S)) {
    sphere.position.z -= 1;
    sphere.rotation.x -= .3;
  }
  if (Key.isDown(Key.SPACE)) {
// проблема 
    var maxUp = 10;
      gravity = false;
      var intervalID = setInterval(jump , 10)
    
      function jump() {
        sphere.position.y += .5;
        maxUp -= 1;
        console.log(maxUp);
        if (maxUp <= 0 ) {
          clearInterval(intervalID)
          gravity = true;

        }
      }
      console.log(maxUp);
    
  }

  camera.position.x = sphere.position.x + 10;
  camera.position.y = sphere.position.y + 30;
  camera.position.z = sphere.position.z -50;
}

function onEarth() {
  var raycaster = new THREE.Raycaster();
  var birdsEys = 5;

  var zap = 1; 
  var zTop = 2;

  raycaster.ray.direction.set(0,-1,0);
  raycaster.ray.origin.copy(sphere.position);
  raycaster.ray.origin.y += birdsEys;

  var hits = raycaster.intersectObject(modelLevel);

if (gravity) {
  if (hits.length > 0) {
    var actualHeight = hits[0].distance - birdsEys;
    if (actualHeight < zap && actualHeight < zTop ) {
      sphere.position.y += 0.4;
    } 
    else if (actualHeight > 5) {
      sphere.position.y -= 2;
    } else if (actualHeight > 1.5) {
      sphere.position.y -= .3;
    }
  } else {
    sphere.position.y -= 3;
  }
}
  
}



function render() {
  dynamo();
  onEarth()
  camera.lookAt(sphere.position);
  requestAnimationFrame(render);
  renderer.render(scene, camera);
};



