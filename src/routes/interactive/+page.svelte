<script lang="ts">
  import {
    WebGLRenderer,
    PerspectiveCamera,
    Scene,
    Color,
    HemisphereLight,
    MeshBasicMaterial,
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
    Material,
  } from "three";
  import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
  import { OrbitControls } from "three/addons/controls/OrbitControls.js";
  import url from "./model.glb?url";
  import { onDestroy, onMount } from "svelte";
  import { on } from "svelte/events";

  let canvas: HTMLCanvasElement;

  const pickPosition = {
    x: 0,
    y: 0,
  };
  clearPickPosition();

  function getCanvasRelativePosition(event: MouseEvent | Touch) {
    const rect = canvas.getBoundingClientRect();
    return {
      x: ((event.clientX - rect.left) * canvas.width) / rect.width,
      y: ((event.clientY - rect.top) * canvas.height) / rect.height,
    };
  }

  function setPickPosition(event: MouseEvent | Touch) {
    const pos = getCanvasRelativePosition(event);
    pickPosition.x = pos.x;
    pickPosition.y = pos.y;
  }

  function clearPickPosition() {
    pickPosition.x = -100000;
    pickPosition.y = -100000;
  }

  const camera = new PerspectiveCamera(45, 1, 0.1, 100);
  const scene = new Scene();
  scene.background = new Color("black");
  scene.add(new HemisphereLight(0xffffff, 0xffffff, 2));
  const redMaterial = new MeshBasicMaterial({
    color: 0xff0000,
  });
  let mid = 1;
  const map = new Map();
  const pickTexture = new WebGLRenderTarget(1, 1);
  const pickBuffer = new Uint8Array(4);
  const pickingScene = new Scene();
  pickingScene.background = new Color(0);

  let destroy = () => {};
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

    destroy = on(
      window,
      "touchstart",
      (event) => {
        event.preventDefault();
        setPickPosition(event.touches[0]);
      },
      {
        passive: false,
      }
    );

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

    let last: Mesh | undefined, lastColor: Material, id: number;
    function render() {
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
      const intersectedObject = map.get(pid);
      if (last) {
        last.material = lastColor;
        last = undefined;
      }
      if (intersectedObject) {
        lastColor = intersectedObject.material;
        intersectedObject.material = redMaterial;
        last = intersectedObject;
      }
      renderer.render(scene, camera);
      id = requestAnimationFrame(render);
    }
    render();
    loaded = true;
  });

  onDestroy(destroy);
</script>

<svelte:window
  onmousemove={setPickPosition}
  onmouseout={clearPickPosition}
  onmouseleave={clearPickPosition}
  ontouchmove={(event) => setPickPosition(event.touches[0])}
  ontouchend={clearPickPosition}
/>
<div style:display={loaded ? "none" : "block"}>loading model...</div>
<canvas bind:this={canvas} style:display={loaded ? "block" : "none"}></canvas>

<style>
</style>
