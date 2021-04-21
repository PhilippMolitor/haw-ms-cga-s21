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
  camera.position.set(10, 10, 10);
  camera.lookAt(scene.position);

  // helpers
  scene.add(new AxesHelper(10));

  // ambient light
  const ambientLight = new AmbientLight(0xffffff, 1 / 3);
  scene.add(ambientLight);

  // point light
  const pointLight = new PointLight(0xffffff, 1);
  pointLight.position.set(16, 16, 16);
  pointLight.castShadow = true;
  pointLight.shadow.mapSize.set(2048, 2048);
  scene.add(pointLight);

  const plane = new Mesh(
    new PlaneGeometry(40, 40),
    new MeshLambertMaterial({ color: 0xaaaaaa })
  );
  plane.rotation.set(MathUtils.degToRad(-90), 0, 0);
  plane.position.set(0, 0, 0);
  plane.receiveShadow = true;
  scene.add(plane);

  // cube and sphere (grouped)
  const cubeSphereGroup = new Group();

  const cube = new Mesh(
    new BoxGeometry(5, 5, 5),
    new MeshLambertMaterial({ color: 0xf9008a })
  );
  cube.castShadow = true;
  cube.position.set(-5, 3, 5);

  const sphere = new Mesh(
    new SphereGeometry(5, 10, 10),
    new MeshLambertMaterial({ color: 0x008af9 })
  );
  sphere.castShadow = true;
  sphere.position.set(10, 5, -5);

  cubeSphereGroup.add(cube, sphere);
  scene.add(cubeSphereGroup);

  // startup sequence
  function init(): void {
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    // add tweakpane debugging UI
    const tp = new Tweakpane();
    // cube + sphere group position
    tp.addInput(
      {
        'Cube + Sphere': cubeSphereGroup.position,
      },
      'Cube + Sphere',
      {
        x: { step: 1, min: -16, max: 16 },
        y: { step: 1, min: -16, max: 16 },
        z: { step: 1, min: -16, max: 16 },
      }
    ).on('change', (e) =>
      cubeSphereGroup.position.set(e.value.x, e.value.y, e.value.z)
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
