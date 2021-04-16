import {
  AmbientLight,
  AxesHelper,
  BoxGeometry,
  CameraHelper,
  Clock,
  MathUtils,
  Mesh,
  MeshLambertMaterial,
  PerspectiveCamera,
  PlaneGeometry,
  PointLight,
  Scene,
  SphereGeometry,
  SpotLight,
  WebGLRenderer,
} from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import Tweakpane from 'tweakpane';

const stats = {
  frames: 0,
  fps: 0,
};

// initialize script globals
const clock = new Clock(true);
const renderer = new WebGLRenderer({ antialias: true });
const scene = new Scene();
let camera: PerspectiveCamera;
let orbitControls: OrbitControls;

function main(): void {
  // renderer
  renderer.setClearColor(0xffffff);
  renderer.shadowMap.enabled = true;

  // helpers
  scene.add(new AxesHelper(10));

  // objects
  const cube = new Mesh(
    new BoxGeometry(5, 5, 5),
    new MeshLambertMaterial({ color: 0xf9008a })
  );
  cube.position.set(-5, 3, 5);
  cube.castShadow = true;
  cube.receiveShadow = true;
  scene.add(cube);

  const sphere = new Mesh(
    new SphereGeometry(5, 10, 10),
    new MeshLambertMaterial({ color: 0x008af9 })
  );
  sphere.position.set(10, 5, -5);
  sphere.castShadow = true;
  sphere.receiveShadow = true;
  scene.add(sphere);

  const plane = new Mesh(
    new PlaneGeometry(40, 40),
    new MeshLambertMaterial({ color: 0xaaaaaa })
  );
  plane.rotation.set(MathUtils.degToRad(-90), 0, 0);
  plane.position.set(0, 0, 0);
  plane.castShadow = true;
  plane.receiveShadow = true;
  scene.add(plane);

  // ambient light
  const ambientLight = new AmbientLight(0xffffff, 1 / 3);
  scene.add(ambientLight);

  // point light
  const pointLight = new PointLight(0xffffff, 0);
  pointLight.position.set(16, 16, 16);
  pointLight.castShadow = true;
  scene.add(pointLight);

  // spot light
  const spotLight = new SpotLight(0xffffff, 1);
  spotLight.position.set(16, 16, 16);
  spotLight.penumbra = 1;
  spotLight.target = cube;
  spotLight.angle = MathUtils.degToRad(60);
  spotLight.castShadow = true;
  spotLight.shadow.mapSize.set(1024, 1024);
  scene.add(spotLight);

  // startup sequence
  function init(): void {
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    // debug frustrum view for the spotlight
    scene.add(new CameraHelper(spotLight.shadow.camera));

    // add tweakpane debugging UI
    const tp = new Tweakpane();
    // sphere
    tp.addInput(
      { 'Sphere XZ Plane': { x: sphere.position.x, y: sphere.position.z } },
      'Sphere XZ Plane',
      {
        x: { step: 0.01, min: -16, max: 16 },
        y: { step: 0.01, min: -16, max: 16 },
      }
    ).on('change', (e) =>
      sphere.position.set(e.value.x, sphere.position.y, e.value.y)
    );
    // pointlight
    tp.addInput({ PointLight: pointLight.position }, 'PointLight', {
      x: { step: 1, min: -16, max: 16 },
      y: { step: 1, min: -16, max: 16 },
      z: { step: 1, min: -16, max: 16 },
    }).on('change', (e) =>
      pointLight.position.set(e.value.x, e.value.y, e.value.z)
    );
    tp.addInput(
      { 'PointLight Intensity': pointLight.intensity },
      'PointLight Intensity',
      { min: 0, max: 2 }
    ).on('change', (e) => {
      pointLight.intensity = e.value;
    });
    // spotlight
    tp.addInput({ SpotLight: spotLight.position }, 'SpotLight', {
      x: { step: 1, min: -16, max: 16 },
      y: { step: 1, min: -16, max: 16 },
      z: { step: 1, min: -16, max: 16 },
    }).on('change', (e) =>
      spotLight.position.set(e.value.x, e.value.y, e.value.z)
    );
    tp.addInput(
      { 'SpotLight Intensity': spotLight.intensity },
      'SpotLight Intensity',
      { min: 0, max: 2 }
    ).on('change', (e) => {
      spotLight.intensity = e.value;
    });
    // fps monitor
    tp.addMonitor(stats, 'fps', { view: 'graph' });
  }

  // per-frame render call
  function update(): void {
    orbitControls.update();
    renderer.render(scene, camera);

    stats.frames += 1;
    if (clock.getElapsedTime() > 1.0) {
      stats.fps = stats.frames;
      stats.frames = 0;

      clock.start();
    }
  }

  // reset camera on resize
  function resetRenderer(): void {
    const width = renderer.domElement.offsetWidth;
    const height = renderer.domElement.offsetHeight;
    const fov = 75;

    camera = new PerspectiveCamera(fov, width / height, 0.01, 1000);
    camera.position.set(10, 10, 10);
    camera.lookAt(scene.position);
    orbitControls = new OrbitControls(camera, renderer.domElement);

    console.log(`resized camera: ${width}x${height} pixels`);
  }

  // run the application
  init();
  resetRenderer();
  clock.start();
  renderer.setAnimationLoop(() => update());

  // resize handling
  window.onresize = (): void => resetRenderer();
}

main();
