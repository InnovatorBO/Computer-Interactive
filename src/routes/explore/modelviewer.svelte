<script lang="ts">
  import {
    WebGLRenderer,
    PerspectiveCamera,
    Scene,
    Color,
    HemisphereLight,
    Box3,
    Vector3,
    MathUtils,
    Group,
    Quaternion,
    Mesh,
  } from "three";
  import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
  import { OrbitControls } from "three/addons/controls/OrbitControls.js";
  import { onMount, onDestroy, createEventDispatcher } from "svelte";
  import { on } from "svelte/events";
  

  export let modelUrl: string;
  export let width = 600;
  export let height = 600;

  let canvas: HTMLCanvasElement;
  let loaded = false;
  const toDestroy: (() => void)[] = [];

  const scene = new Scene();
  scene.background = new Color("black");
  scene.add(new HemisphereLight(0xffffff, 0xffffff, 2));

  const camera = new PerspectiveCamera(45, 1, 0.1, 100);

  onMount(async () => {
    const loader = new GLTFLoader();
    const { resolve, promise } = Promise.withResolvers<Group>();
    loader.load(modelUrl, (gltf) => resolve(gltf.scene));

    const renderer = new WebGLRenderer({
      antialias: true,
      canvas,
    });
    renderer.setSize(width, height, false);
    const controls = new OrbitControls(camera, canvas);

    const root = await promise;
    scene.add(root);
    const box = new Box3().setFromObject(root);
    const boxSize = box.getSize(new Vector3()).length();
    const boxCenter = box.getCenter(new Vector3());

    controls.maxDistance = boxSize * 10;
    controls.target.copy(boxCenter);
    controls.update();

    const halfSizeToFitOnScreen = boxSize * 0.25;
    const halfFovY = MathUtils.degToRad(camera.fov * 0.5);
    const distance = halfSizeToFitOnScreen / Math.tan(halfFovY);
    const direction = new Vector3()
      .subVectors(camera.position, boxCenter)
      .multiply(new Vector3(1, 0, 1))
      .normalize();

    camera.position.copy(direction.multiplyScalar(distance).add(boxCenter));
    camera.near = boxSize / 100;
    camera.far = boxSize * 100;
    camera.updateProjectionMatrix();
    camera.lookAt(boxCenter.x, boxCenter.y, boxCenter.z);

    // No click handling added here — orbit still works

    toDestroy.push(
      on(canvas, "mousedown", () => {}),
      on(canvas, "mousemove", () => {}),
      on(canvas, "mouseup", () => {}),
      on(canvas, "touchstart", () => {}),
      on(canvas, "touchmove", () => {}),
      on(canvas, "touchend", () => {})
    );

    function render() {
      renderer.render(scene, camera);
      requestAnimationFrame(render);
    }
    render();
    loaded = true;
  });

  onDestroy(() => {
    for (const callback of toDestroy) callback();
  });
</script>

<div style:display={loaded ? "none" : "block"}>Loading model...</div>
<canvas
  bind:this={canvas}
  style="display: {loaded
    ? 'block'
    : 'none'}; width: {width}px; height: {height}px"
/>
