const LOADER = document.getElementById('js-loader');
const TRAY = document.getElementById('js-tray-slide');

TRAY.style.display = 'flex';
TRAY.style.alignItems = 'flex-start';

const DRAG_NOTICE = document.getElementById('js-drag-notice');

var theModel;
const MODEL_PATH = "SillaTest.glb";

var activeOption = 'Tapizado';
var loaded = false;

//DESDE ACA
const texturePath = 'Texturas/'; // Ruta de la carpeta de texturas
const textureFiles = [
  'PrannaBlancoNieve.jpg',
  'PrannaBlancoPuro.jpg',
  'PrannaAlaska.jpg',
  'PrannaAlmendra.jpg',
  'PrannaAzul.jpg',
  'PrannaAzulRey.jpg',
  'PrannaCeleste.jpg',
  'PrannaTurquesa.jpg',
  'PrannaVerde.jpg',
  'PrannaVerdeClaro.jpg',
  'PrannaVerdeManzana.jpg',
  'PrannaMandarina.jpg',
  'PrannaMostaza.jpg',
  'PrannaHielo.jpg',
  'PrannaCapuchino.jpg',
  'PrannaBronce.jpg',
  'PrannaCaramelo.jpg',
  'PrannaCeniza.jpg',
  'PrannaChocolate.jpg',
  'PrannaCobre.jpg',
  'PrannaCoral.jpg',
  'PrannaEscarlata.jpg',
  'PrannaGranate.jpg',
  'PrannaGris.jpg',
  'PrannaGrisMedio.jpg',
  'PrannaGrisOscuro.jpg',
  'PrannaHortensia.jpg',
  'PrannaMarron.jpg',
  'PrannaMocca.jpg',
  'PrannaNacar.jpg',
  'PrannaNegro.jpg',
  'PrannaOro.jpg',
  'PrannaPerla.jpg',
  'PrannaPetroleo.jpg',
  'PrannaPlata.jpg',
  'PrannaSafari.jpg',
  'PrannaSepia.jpg',
  'PrannaTabaco.jpg',
  'PrannaTaupe.jpg',
  'PrannaRojo.jpg',
  'PrannaRojoCereza.jpg',
  'PrannaRosado.jpg',
  'PrannaZafran.jpg'
];



const colors = textureFiles.map(filename => {
  return {
    texture: texturePath + filename,
    size: [4, 6, 4],
    shininess: 10
  };
});
//HASTA ACA


const BACKGROUND_COLOR = 0xf1f1f1;
// Init the scene
const scene = new THREE.Scene();
// Set background
scene.background = new THREE.Color(BACKGROUND_COLOR);
//scene.fog = new THREE.Fog(BACKGROUND_COLOR, 20, 100);

const canvas = document.querySelector('#c');

// Init the renderer
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
renderer.shadowMap.enabled = true;
renderer.setPixelRatio(window.devicePixelRatio);
var cameraFar = 2.5;
document.body.appendChild(renderer.domElement);



// Add a camerra
var camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = cameraFar;
camera.position.x = 1;
camera.position.y = -0.1; // Ajusta la altura deseada


// Initial material

const INITIAL_MTL = new THREE.MeshPhongMaterial({ color: 0x3448ad, shininess: 10 });
const INITIAL_ESTRUCTURA = new THREE.MeshPhongMaterial({ color: 0xFFFFFF, shininess: 10 });
const INITIAL_MAP = [
{ childID: "Estructura", mtl: INITIAL_ESTRUCTURA },
{ childID: "Tapizado", mtl: INITIAL_MTL }
/*,
{ childID: "cushions", mtl: INITIAL_MTL },
{ childID: "legs", mtl: INITIAL_MTL },
{ childID: "supports", mtl: INITIAL_MTL }*/];


// Init the object loader
var loader = new THREE.GLTFLoader();

loader.load(MODEL_PATH, function (gltf) {
  theModel = gltf.scene;

  theModel.traverse(o => {
    if (o.isMesh) {
      o.castShadow = true;
      o.receiveShadow = true;
    }
  });

  // Set the models initial scale   
  theModel.scale.set(1, 1, 1);
  theModel.rotation.y = 4.7;

  // Offset the y position a bit
  theModel.position.y = -1;

  // Set initial textures
  for (let object of INITIAL_MAP) {
    initColor(theModel, object.childID, object.mtl);
  }

  // Add the model to the scene
  scene.add(theModel);

  // Remove the loader
  LOADER.remove();

}, undefined, function (error) {
  console.error(error);
});

// Function - Add the textures to the models
function initColor(parent, type, mtl) {
  parent.traverse(o => {
    if (o.isMesh) {
      if (o.name.includes(type)) {
        o.material = mtl;
        o.nameID = type; // Set a new property to identify this object
      }
    }
  });
}


light = new THREE.SpotLight(0xFFFFFF,1);
light.position.set(-50,50,50);
light.castShadow = false;
light.shadow.bias = -0.0001;
light.shadow.mapSize.width = 2048;
light.shadow.mapSize.height = 2048;
scene.add( light );
hemiLight = new THREE.HemisphereLight(0xFFFFFF, 0xFFFFFF, 0.5);
scene.add(hemiLight);


/*
// Add lights
var ambientLight = new THREE.AmbientLight(0xffffff, 0.3);
scene.add(ambientLight);

var directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
directionalLight.position.set(0, 1, 0);
scene.add(directionalLight);

var spotLight = new THREE.SpotLight(0xffffff, 0.1);
spotLight.position.set(1, 5, 1);
spotLight.castShadow = true;
scene.add(spotLight);

// Aumentar la resolución del mapa de sombras del DirectionalLight
directionalLight.shadow.mapSize.width = 2048;
directionalLight.shadow.mapSize.height = 2048;

// Aumentar la resolución del mapa de sombras del SpotLight
spotLight.shadow.mapSize.width = 2048;
spotLight.shadow.mapSize.height = 2048;
*/


// Floor
var floorGeometry = new THREE.PlaneGeometry(7, 7, 1, 1);
var floorMaterial = new THREE.MeshPhongMaterial({
  map: new THREE.TextureLoader().load('img/Suelo.jpg'), // Agrega la ruta de la textura del suelo
  shininess: 0.5
});

// Ajustar el tamañoo de la textura
floorMaterial.map.repeat.set(7, 7); // Ajusta los valores de repetici��n horizontal y vertical
floorMaterial.map.wrapS = THREE.RepeatWrapping; // Repetir la textura horizontalmente
floorMaterial.map.wrapT = THREE.RepeatWrapping; // Repetir la textura verticalmente

var floor = new THREE.Mesh(floorGeometry, floorMaterial);
floor.rotation.x = -0.5 * Math.PI;
floor.receiveShadow = true;
floor.position.y = -1;
scene.add(floor);

// Walls
var wallHeight = 2; // Altura de las paredes
var wallThickness = 0.1; // Grosor de las paredes

//Textura Paredes
//var texture = new THREE.TextureLoader().load('img/TexturaParedes.jpg');
//Configurar el tamaño de la textura de las paredes
//texture.repeat.set(3, 3); // Ajusta los valores de repetición horizontal y vertical
//texture.wrapS = THREE.RepeatWrapping; // Repetir la textura horizontalmente
//texture.wrapT = THREE.RepeatWrapping; // Repetir la textura verticalmente
//Crear material de esa textura
var wallMaterial = new THREE.MeshPhongMaterial({ color: 0xD3D3D3 }); //Gris claro


// Pared frontal
var frontWallGeometry = new THREE.BoxGeometry(floorGeometry.parameters.width, wallHeight, wallThickness);
var frontWallMaterial = wallMaterial.clone();
var frontWall = new THREE.Mesh(frontWallGeometry, frontWallMaterial);
frontWall.position.y = 0;
frontWall.position.z = 3;
scene.add(frontWall);

// Pared trasera
var backWallGeometry = new THREE.BoxGeometry(floorGeometry.parameters.width, wallHeight, wallThickness);
var backWallMaterial = wallMaterial.clone();
var backWall = new THREE.Mesh(backWallGeometry, backWallMaterial);
backWall.position.y = 0;
backWall.position.z = -3;
scene.add(backWall);

// Pared izquierda
var leftWallGeometry = new THREE.BoxGeometry(wallThickness, wallHeight, floorGeometry.parameters.width);
var leftWallMaterial = wallMaterial.clone();
var leftWall = new THREE.Mesh(leftWallGeometry, leftWallMaterial);
leftWall.position.y = 0;
leftWall.position.x = -floorGeometry.parameters.width / 2 + wallThickness / 2;
scene.add(leftWall);

// Pared derecha
var rightWallGeometry = new THREE.BoxGeometry(wallThickness, wallHeight, floorGeometry.parameters.width);
var rightWallMaterial = wallMaterial.clone();
var rightWall = new THREE.Mesh(rightWallGeometry, rightWallMaterial);
rightWall.position.y = 0;
rightWall.position.x = floorGeometry.parameters.width / 2 - wallThickness / 2;
scene.add(rightWall);

//Variables Zoom In y Out
var maxZoomIn = 1;  // Valor m��ximo de zoom in
var maxZoomOut = 3; // Valor m��ximo de zoom out

var controls = new THREE.OrbitControls(camera);
controls.target.set(0, -0.6, 0); // Establece el punto de enfoque en el centro del modelo 3D

function render() {
  renderer.render(scene, camera);
}

function animate() {
  controls.update();

  // Restringe el zoom in y zoom out dentro de los l��mites establecidos
  controls.minDistance = maxZoomIn;
  controls.maxDistance = maxZoomOut;
  controls.zoomSpeed = 0.8;
  controls.rotateSpeed = 0.2;

  const cameraHeight = camera.position.y;
  const floorHeight = floor.position.y;

  if (cameraHeight < floorHeight) {
    camera.position.y = Math.max(camera.position.y, floorHeight);
  }

  renderer.render(scene, camera);
  requestAnimationFrame(animate);

  if (resizeRendererToDisplaySize(renderer)) {
    const canvas = renderer.domElement;
    camera.aspect = canvas.clientWidth / canvas.clientHeight;
    camera.updateProjectionMatrix();
  }

  if (theModel != null && loaded == false) {
    initialRotation();
    DRAG_NOTICE.classList.add('start');
  }
}

controls.addEventListener('change', render); // Asocia la funci��n 'render' a los eventos de cambio de los controles
controls.minPolarAngle = 0; // Establece el ��ngulo polar m��nimo en 0 (no puede mirar hacia abajo)
controls.maxPolarAngle = Math.PI * 0.5; // Establece el ��ngulo polar m��ximo en PI/2 (90 grados, no puede mirar hacia arriba m��s all�� de la horizontal)

animate();


// Function - New resizing method
function resizeRendererToDisplaySize(renderer) {
  const canvas = renderer.domElement;
  var width = window.innerWidth;
  var height = window.innerHeight;
  var canvasPixelWidth = canvas.width / window.devicePixelRatio;
  var canvasPixelHeight = canvas.height / window.devicePixelRatio;

  const needResize = canvasPixelWidth !== width || canvasPixelHeight !== height;
  if (needResize) {

    renderer.setSize(width, height, false);
  }
  return needResize;
}

// Function - Build Colors

function buildColors(colors) {
  for (let [i, color] of colors.entries()) {
    let swatch = document.createElement('div');
    swatch.classList.add('tray__swatch');

    if (color.texture)
    {
      swatch.style.backgroundImage = "url(" + color.texture + ")";
    } else
    {
      swatch.style.background = "#" + color.color;
    }

    swatch.setAttribute('data-key', i);
    TRAY.append(swatch);
  }
}

buildColors(colors);

// Select Option
const options = document.querySelectorAll(".option");

for (const option of options) {
  option.addEventListener('click', selectOption);
}

function selectOption(e) {
  let option = e.target;
  activeOption = e.target.dataset.option;
  for (const otherOption of options) {
    otherOption.classList.remove('--is-active');
  }
  option.classList.add('--is-active');
}

// Swatches
const swatches = document.querySelectorAll(".tray__swatch");

for (const swatch of swatches) {
  swatch.addEventListener('click', selectSwatch);
}

function selectSwatch(e) {
  let color = colors[parseInt(e.target.dataset.key)];
  let new_mtl;

  if (color.texture) {

    let txt = new THREE.TextureLoader().load(color.texture);

    txt.repeat.set(color.size[0], color.size[1], color.size[2]);
    txt.wrapS = THREE.RepeatWrapping;
    txt.wrapT = THREE.RepeatWrapping;

    const textureName = color.texture.split('/').pop().split('.')[0];
    const separatedName = textureName.replace(/([a-z])([A-Z])/g, '$1 $2');
    colorName = separatedName;

    new_mtl = new THREE.MeshPhongMaterial({
      map: txt,
      shininess: color.shininess ? color.shininess : 10 });

    

  } else

  {
    new_mtl = new THREE.MeshPhongMaterial({
      color: parseInt('0x' + color.color),
      shininess: color.shininess ? color.shininess : 10 });


  }

  setMaterial(theModel, activeOption, new_mtl);
  const colorTextElement = document.getElementById('colorText');
  colorTextElement.textContent = `Color elegido: ${colorName}`;
}

function setMaterial(parent, type, mtl) {
  parent.traverse(o => {
    if (o.isMesh && o.nameID != null) {
      if (o.nameID == type) {
        o.material = mtl;
      }
    }
  });
}




// Function - Opening rotate
let initRotate = 0;

function initialRotation() {
  initRotate++;
  if (initRotate <= 120) {
    theModel.rotation.y += Math.PI / 60;
  } else {
    loaded = true;
  }
}

var slider = document.getElementById('js-tray'),sliderItems = document.getElementById('js-tray-slide'),difference;

function slide(wrapper, items) {
  var posX1 = 0,
  posX2 = 0,
  posInitial,
  threshold = 20,
  posFinal,
  slides = items.getElementsByClassName('tray__swatch');

  // Mouse events
  items.onmousedown = dragStart;

  // Touch events
  items.addEventListener('touchstart', dragStart);
  items.addEventListener('touchend', dragEnd);
  items.addEventListener('touchmove', dragAction);


  function dragStart(e) {
    e = e || window.event;
    posInitial = items.offsetLeft;
    difference = sliderItems.offsetWidth - slider.offsetWidth;
    difference = difference * -1;

    if (e.type == 'touchstart') {
      posX1 = e.touches[0].clientX;
    } else {
      posX1 = e.clientX;
      document.onmouseup = dragEnd;
      document.onmousemove = dragAction;
    }
  }

  function dragAction(e) {
    e = e || window.event;

    if (e.type == 'touchmove') {
      posX2 = posX1 - e.touches[0].clientX;
      posX1 = e.touches[0].clientX;
    } else {
      posX2 = posX1 - e.clientX;
      posX1 = e.clientX;
    }

    if (items.offsetLeft - posX2 <= 0 && items.offsetLeft - posX2 >= difference) {
      items.style.left = items.offsetLeft - posX2 + "px";
    }
  }

  function dragEnd(e) {
    posFinal = items.offsetLeft;
    if (posFinal - posInitial < -threshold) {

    } else if (posFinal - posInitial > threshold) {

    } else {
      items.style.left = posInitial + "px";
    }

    document.onmouseup = null;
    document.onmousemove = null;
  }

}

slide(slider, sliderItems);