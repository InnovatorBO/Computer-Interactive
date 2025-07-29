<script lang="ts">
  import {
    WebGLRenderer,
    PerspectiveCamera,
    Scene,
    Color,
    HemisphereLight,
    WebGLRenderTarget,
    Group,
    Box3,
    Vector3,
    MathUtils,
    Mesh,
    MeshPhongMaterial,
    DoubleSide,
    NoColorSpace,
    Quaternion,
  } from "three";
  import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
  import { OrbitControls } from "three/addons/controls/OrbitControls.js";
  import url from "./model.glb?url";
  import { onDestroy, onMount } from "svelte";
  import { on } from "svelte/events";

  let info = $state<undefined | { left: number; top: number; text: string }>();
  let canvas: HTMLCanvasElement;
  const camera = new PerspectiveCamera(45, 1, 0.1, 100);
  const scene = new Scene();
  scene.background = new Color("black");
  scene.add(new HemisphereLight(0xffffff, 0xffffff, 2));
  let mid = 1;
  const map = new Map<number, Mesh>();
  const pickTexture = new WebGLRenderTarget(1, 1);
  const pickBuffer = new Uint8Array(4);
  const pickingScene = new Scene();
  pickingScene.background = new Color(0);

  const toDestroy: (() => void)[] = [];
  let loaded = $state(false);
  onMount(async () => {
    // Not putting this in onMount sometimes causes it to be evaluated on the server, which causes issues
    const loader = new GLTFLoader();
    const { resolve, promise } = Promise.withResolvers<Group>();
    loader.load(url, (gltf) => resolve(gltf.scene));

    const renderer = new WebGLRenderer({
      antialias: true,
      canvas,
    });
    renderer.setSize(600, 600, false);
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

    scene.traverse((mesh) => {
      if (!(mesh instanceof Mesh)) return;
      map.set(mid, mesh);
      const pickingMaterial = new MeshPhongMaterial({
        emissive: new Color().setHex(mid, NoColorSpace),
        color: new Color(0, 0, 0),
        specular: new Color(0, 0, 0),
        side: DoubleSide,
      });
      const picked = new Mesh(mesh.geometry, pickingMaterial);
      pickingScene.add(picked);
      picked.position.copy(mesh.getWorldPosition(new Vector3()));
      picked.quaternion.copy(mesh.getWorldQuaternion(new Quaternion()));
      picked.scale.copy(mesh.getWorldScale(new Vector3()));
      mid++;
    });

    function handleUp(event: MouseEvent | Touch) {
      // https://stackoverflow.com/questions/6042202/how-to-distinguish-mouse-click-and-drag
      if (
        Math.abs(event.clientX - startX) >= 10 ||
        Math.abs(event.clientY - startY) >= 10
      )
        return;

      const rect = canvas.getBoundingClientRect();
      const pickPosition = {
        x: ((event.clientX - rect.left) * canvas.width) / rect.width,
        y: ((event.clientY - rect.top) * canvas.height) / rect.height,
      };
      const pixelRatio = renderer.getPixelRatio();
      camera.setViewOffset(
        renderer.getContext().drawingBufferWidth,
        renderer.getContext().drawingBufferHeight,
        Math.floor(pickPosition.x * pixelRatio),
        Math.floor(pickPosition.y * pixelRatio),
        1,
        1
      );
      renderer.setRenderTarget(pickTexture);
      renderer.render(pickingScene, camera);
      renderer.setRenderTarget(null);
      camera.clearViewOffset();
      renderer.readRenderTargetPixels(pickTexture, 0, 0, 1, 1, pickBuffer);

      const pid = (pickBuffer[0] << 16) | (pickBuffer[1] << 8) | pickBuffer[2];
      const object = map.get(pid);
      if (object) {
        info = {
          left: event.clientX,
          top: event.clientY,
          // todo need better text
          text: `${object.name} (more description here)`,
        };
      }
    }

    let startX: number, startY: number, down: boolean;
    toDestroy.push(
      on(canvas, "mousedown", (e) => {
        startX = e.clientX;
        startY = e.clientY;
        down = true;
      }),
      on(canvas, "touchstart", (e) => {
        startX = e.touches[0].clientX;
        startY = e.touches[0].clientY;
        down = true;
      }),
      on(canvas, "mousemove", () => {
        if (down) info = undefined;
      }),
      on(canvas, "touchmove", () => {
        if (down) info = undefined;
      }),
      on(canvas, "mouseup", (e) => {
        handleUp(e);
        down = false;
      }),
      on(canvas, "touchend", (e) => {
        handleUp(e.touches[0]);
        down = false;
      })
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

<div style:display={loaded ? "none" : "block"}>loading model...</div>
{#if info !== undefined}
  <div id="info" style:left={info.left + "px"} style:top={info.top + "px"}>
    <button onclick={() => (info = undefined)}>X</button>
    <div>{info.text}</div>
  </div>
{/if}
<canvas bind:this={canvas} style:display={loaded ? "block" : "none"}></canvas>

<style>
  button {
    background-color: transparent;
    border: none;
    float: right;
  }
  button:hover {
    cursor: pointer;
  }
  #info {
    position: absolute;
    width: 200px;
    height: 200px;
    border: 2px solid black;
    border-radius: 10px;
    background-color: white;
    padding: 2px;
  }
</style>
