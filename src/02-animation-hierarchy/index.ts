import {
  AmbientLight,
  AxesHelper,
  BoxGeometry,
  Clock,
  Group,
  MathUtils,
  Mesh,
  MeshLambertMaterial,
  PerspectiveCamera,
  PlaneGeometry,
  PointLight,
  Scene,
  SphereGeometry,
  WebGLRenderer,
} from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import Tweakpane from 'tweakpane';

import { Television } from './models/television';

const stats = {
  frames: 0,
  fps: 0,
};

// initialize script globals
const clock = new Clock(true);
const renderer = new WebGLRenderer({ antialias: true });
const scene = new Scene();
const camera = new PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.01,
  1000
);
const orbitControls = new OrbitControls(camera, renderer.domElement);

function main(): void {
  // renderer
  renderer.setClearColor(0xffffff);
  renderer.shadowMap.enabled = true;

  // camera
  camera.position.set(60, 60, 60);
  camera.lookAt(scene.position);

  // helpers
  scene.add(new AxesHelper(10));

  // ambient light
  const ambientLight = new AmbientLight(0xffffff, 1 / 3);
  scene.add(ambientLight);

  // point light
  const pointLight = new PointLight(0xffffff, 1);
  pointLight.position.set(100, 100, 100);
  pointLight.castShadow = true;
  pointLight.shadow.mapSize.set(4096, 4096);
  scene.add(pointLight);

  const plane = new Mesh(
    new PlaneGeometry(200, 200),
    new MeshLambertMaterial({ color: 0xaaaaaa })
  );
  plane.rotation.set(MathUtils.degToRad(-90), 0, 0);
  plane.position.set(0, 0, 0);
  plane.receiveShadow = true;
  scene.add(plane);

  // television buffer geometry
  const television = new Television();
  television.position.set(0, 16.8, 0);
  scene.add(television);

  // startup sequence
  function init(): void {
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    // add tweakpane debugging UI
    const tp = new Tweakpane();
    tp.addInput(
      {
        Television: television.position,
      },
      'Television',
      {
        x: { step: 1, min: -16, max: 16 },
        y: { step: 1, min: -16, max: 16 },
        z: { step: 1, min: -16, max: 16 },
      }
    ).on('change', (e) =>
      television.position.set(e.value.x, e.value.y, e.value.z)
    );
    // fps monitor
    tp.addMonitor(stats, 'fps', { view: 'graph', interval: 1000 });
  }

  // per-frame render call
  function update(): void {
    orbitControls.update();
    renderer.render(scene, camera);

    // fps counter
    stats.frames += 1;
    if (clock.getElapsedTime() >= 1.0) {
      stats.fps = stats.frames;
      stats.frames = 0;
      clock.start();
    }
  }

  // reset camera on resize
  function resetRenderer(): void {
    const width = renderer.domElement.offsetWidth;
    const height = renderer.domElement.offsetHeight;

    renderer.setSize(width, height);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();

    console.log(`resized camera: ${width}x${height} pixels`);
  }

  // run the application
  init();
  clock.start();
  renderer.setAnimationLoop(() => update());

  // resize handling
  window.onresize = (): void => resetRenderer();
}

main();
