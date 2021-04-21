import {
  AxesHelper,
  Clock,
  MathUtils,
  Mesh,
  MeshBasicMaterial,
  PerspectiveCamera,
  PlaneGeometry,
  Scene,
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

  // camera
  camera.position.set(10, 10, 10);
  camera.lookAt(scene.position);

  // helpers
  scene.add(new AxesHelper(10));

  const plane = new Mesh(
    new PlaneGeometry(40, 40),
    new MeshBasicMaterial({ color: 0xaaaaaa })
  );
  plane.rotation.set(MathUtils.degToRad(-90), 0, 0);
  plane.position.set(0, 0, 0);
  scene.add(plane);

  // startup sequence
  function init(): void {
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    // add tweakpane debugging UI
    const tp = new Tweakpane();
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
