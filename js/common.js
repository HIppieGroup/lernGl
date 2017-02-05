var scene, camera, renderer, modelLevel, loader, sphere, Key;
var gravity = true;
var scat = 0;
var planeScatX, planeScatZ;
var bigSphere
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

  var light = new THREE.SpotLight( 0xffffff);
  light.position.set(100,200,0);
  light.castShadow = true;
  scene.add(light);


  var bigSphereG = new THREE.SphereGeometry(180,200,200);
  var bigSphereM = new THREE.MeshBasicMaterial({
    map: THREE.ImageUtils.loadTexture('model/texture-panaram.jpg'),
    side: THREE.BackSide
  })

  bigSphere = new THREE.Mesh(bigSphereG,bigSphereM);
  bigSphere.position.y = 40;
  bigSphere.position.x = 50;
  bigSphere.position.z = 40;

  bigSphere.rotation.x = 27.1;
  bigSphere.rotation.y = 54.8;
  bigSphere.rotation.z = 51.4;

  scene.add(bigSphere);

  function addSphere() {
    var sphereG = new THREE.SphereGeometry(2,20,20);
    // var sphereM = new THREE.MeshLambertMaterial({
    //   color: 0xff3300,
    //   emissive: 0xa4f70,
    //   map: texture,
    //   wireframe: true,
    //   side: THREE.FrontSide
    // });

    var sphereM = new THREE.MeshBasicMaterial({
      map: THREE.ImageUtils.loadTexture('model/texture.jpg'),
    })

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
    sphere.rotation.x = 0;
    planeScatX = sphere.position.x;
  }
  if (Key.isDown(Key.D)) {
    sphere.position.x -= 1;
    sphere.rotation.z += .3;
    sphere.rotation.x = 0;
    planeScatX = sphere.position.x;
  }
  if (Key.isDown(Key.W)) {      
    sphere.position.z += 1;
    sphere.rotation.x += .3;
    sphere.rotation.z = 0;
    planeScatZ = sphere.position.z;
  }
  if (Key.isDown(Key.S)) {
    sphere.position.z -= 1;
    sphere.rotation.x -= .3;
    sphere.rotation.z = 0;
    planeScatZ = sphere.position.z;
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


function gravityPower() {
  var rightRay = new THREE.Raycaster();
  var leftRay = new THREE.Raycaster();
  var frontRay = new THREE.Raycaster();
  var backRay = new THREE.Raycaster();

  rightRay.ray.direction.set(0,-1,0);
  leftRay.ray.direction.set(0,-1,0);
  frontRay.ray.direction.set(0,-1,0);
  backRay.ray.direction.set(0,-1,0);

  rightRay.ray.origin.copy(sphere.position);
  rightRay.ray.origin.y += 5;
  rightRay.ray.origin.x -= 2;

  leftRay.ray.origin.copy(sphere.position);
  leftRay.ray.origin.y += 5;
  leftRay.ray.origin.x += 2;

  frontRay.ray.origin.copy(sphere.position);
  frontRay.ray.origin.y += 5;
  frontRay.ray.origin.z += 2;

  backRay.ray.origin.copy(sphere.position);
  backRay.ray.origin.y += 5;
  backRay.ray.origin.z -= 2;


  var intersectR = rightRay.intersectObject(modelLevel);
  var intersectL = leftRay.intersectObject(modelLevel);
  var intersectF = frontRay.intersectObject(modelLevel);
  var intersectB = backRay.intersectObject(modelLevel);



  if (intersectR.length > 0 && intersectL.length > 0) {
    
    if (pleseDistans(intersectR) < pleseDistans(intersectL)) {
      if (planeScatX > sphere.position.x) {
        var speed = (planeScatX - sphere.position.x)/100;
        sphere.position.x = sphere.position.x + ( 0.1 + speed ) ;
        sphere.rotation.z = sphere.rotation.z - ( 0.1 + speed);
        sphere.rotation.x = 0;
      }else {
        sphere.position.x = sphere.position.x + .1 ;
        sphere.rotation.z -= .1;
        sphere.rotation.x = 0;
      }
    } else if(pleseDistans(intersectR) > pleseDistans(intersectL)){
      if (planeScatX > sphere.position.x) {
        var speed = (planeScatX - sphere.position.x)/100;
        sphere.position.x = sphere.position.x - ( 0.1 + speed ) ;
        sphere.rotation.z = sphere.rotation.z + ( 0.1 + speed);
        sphere.rotation.x = 0;
      }else{
        sphere.position.x = sphere.position.x - 0.1;
        sphere.rotation.z += .1;
        sphere.rotation.x = 0;
      }
      
    }
  }

  if (intersectF.length > 0 && intersectB.length > 0) {
    if (pleseDistans(intersectF) < pleseDistans(intersectB)) {

      if (planeScatZ > sphere.position.z) {
        var speed = (planeScatZ - sphere.position.z)/100;
        sphere.position.z = sphere.position.z - ( 0.1 + speed ) ;
        sphere.rotation.x = sphere.rotation.x - ( 0.1 + speed);
        sphere.rotation.z = 0;
      }else{
      sphere.position.z = sphere.position.z - .1 ;
      sphere.rotation.x -= .1;
      sphere.rotation.z = 0;
      }
    } else if(pleseDistans(intersectF) > pleseDistans(intersectB)){


      if (planeScatZ > sphere.position.z) {
        var speed = (planeScatZ - sphere.position.z)/100;
        sphere.position.z = sphere.position.z + ( 0.1 + speed ) ;
        sphere.rotation.x = sphere.rotation.x + ( 0.1 + speed);
        sphere.rotation.z = 0;
      }else{
      sphere.position.z = sphere.position.z + .1 ;
      sphere.rotation.x += .1;
      sphere.rotation.z = 0;
      }
    }
  }
  
  function pleseDistans(arrObj) {
    return ((arrObj[0].distance*1000) - (5*1000)).toFixed(0)/1;
  }

  
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
    sphere.position.y -= 2;
    if (sphere.position.y < -50) {
      sphere.position.set(0,0,0);
    }
  }
}
  
}



function render() {
  gravityPower();
  dynamo();
  onEarth()
  camera.lookAt(sphere.position);
  requestAnimationFrame(render);
  renderer.render(scene, camera);
};



