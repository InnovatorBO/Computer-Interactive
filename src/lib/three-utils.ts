import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { OutlinePass } from 'three/examples/jsm/postprocessing/OutlinePass.js';

// Singleton to track Three.js instances
class ThreeJSManager {
  private static instance: ThreeJSManager;
  private renderers: Set<THREE.WebGLRenderer> = new Set();
  private scenes: Set<THREE.Scene> = new Set();

  static getInstance(): ThreeJSManager {
    if (!ThreeJSManager.instance) {
      ThreeJSManager.instance = new ThreeJSManager();
    }
    return ThreeJSManager.instance;
  }

  registerRenderer(renderer: THREE.WebGLRenderer): void {
    this.renderers.add(renderer);
  }

  registerScene(scene: THREE.Scene): void {
    this.scenes.add(scene);
  }

  unregisterRenderer(renderer: THREE.WebGLRenderer): void {
    this.renderers.delete(renderer);
  }

  unregisterScene(scene: THREE.Scene): void {
    this.scenes.delete(scene);
  }

  getRendererCount(): number {
    return this.renderers.size;
  }

  getSceneCount(): number {
    return this.scenes.size;
  }
}

// Utility functions
export function createRenderer(options: THREE.WebGLRendererParameters = {}): THREE.WebGLRenderer {
  const defaultOptions: THREE.WebGLRendererParameters = {
    antialias: true,
    powerPreference: "high-performance",
    ...options
  };
  
  const renderer = new THREE.WebGLRenderer(defaultOptions);
  ThreeJSManager.getInstance().registerRenderer(renderer);
  return renderer;
}

export function createScene(): THREE.Scene {
  const scene = new THREE.Scene();
  ThreeJSManager.getInstance().registerScene(scene);
  return scene;
}

export function disposeRenderer(renderer: THREE.WebGLRenderer): void {
  if (renderer) {
    ThreeJSManager.getInstance().unregisterRenderer(renderer);
    renderer.dispose();
    if (renderer.domElement && renderer.domElement.parentNode) {
      renderer.domElement.parentNode.removeChild(renderer.domElement);
    }
  }
}

export function disposeScene(scene: THREE.Scene): void {
  if (scene) {
    ThreeJSManager.getInstance().unregisterScene(scene);
    scene.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        if (child.geometry) {
          child.geometry.dispose();
        }
        if (child.material) {
          if (Array.isArray(child.material)) {
            child.material.forEach(material => material.dispose());
          } else {
            child.material.dispose();
          }
        }
      }
    });
  }
}

export function loadGLTFModel(url: string): Promise<THREE.Group> {
  return new Promise((resolve, reject) => {
    const loader = new GLTFLoader();
    loader.load(
      url,
      (gltf) => {
        const model = gltf.scene;
        // Ensure materials are properly configured
        model.traverse((child) => {
          if (child.isMesh) {
            if (child.material) {
              if (Array.isArray(child.material)) {
                child.material.forEach(mat => {
                  mat.needsUpdate = true;
                });
              } else {
                child.material.needsUpdate = true;
              }
            }
          }
        });
        resolve(model);
      },
      (progress) => {
        // Progress callback
      },
      (error) => {
        console.error('Error loading GLTF model:', error);
        reject(error);
      }
    );
  });
}

export function createBasicLights(scene: THREE.Scene): void {
  const ambientLight = new THREE.AmbientLight(0x404040, 0.6);
  scene.add(ambientLight);

  const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
  directionalLight.position.set(5, 10, 7.5);
  directionalLight.castShadow = true;
  directionalLight.shadow.mapSize.width = 2048;
  directionalLight.shadow.mapSize.height = 2048;
  scene.add(directionalLight);
}

export function createEffectComposer(renderer: THREE.WebGLRenderer, scene: THREE.Scene, camera: THREE.Camera): EffectComposer {
  const composer = new EffectComposer(renderer);
  const renderPass = new RenderPass(scene, camera);
  composer.addPass(renderPass);
  return composer;
}

export function createOutlinePass(scene: THREE.Scene, camera: THREE.Camera): OutlinePass {
  return new OutlinePass(
    new THREE.Vector2(window.innerWidth, window.innerHeight),
    scene,
    camera
  );
}

export function createOrbitControls(camera: THREE.Camera, renderer: THREE.WebGLRenderer): OrbitControls {
  const controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  return controls;
}

// Check for multiple instances warning
export function checkMultipleInstances(): void {
  const manager = ThreeJSManager.getInstance();
  const rendererCount = manager.getRendererCount();
  const sceneCount = manager.getSceneCount();
  
  if (rendererCount > 1 || sceneCount > 1) {
    console.warn(`Multiple Three.js instances detected: ${rendererCount} renderers, ${sceneCount} scenes`);
  }
}

export { ThreeJSManager };
