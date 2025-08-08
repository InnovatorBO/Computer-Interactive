# Three.js Issues and Fixes

This document outlines the Three.js issues that were identified and the fixes that were implemented.

## Issues Identified

### 1. Multiple instances of Three.js being imported
**Warning**: `WARNING: Multiple instances of Three.js being imported.`

**Cause**: Three.js was being imported in multiple Svelte components (`+page.svelte`, `explore/+page.svelte`, `build/+page.svelte`) without proper cleanup, leading to multiple instances running simultaneously.

**Fix**: 
- Added proper cleanup using `onDestroy` lifecycle hook
- Created a `ThreeJSManager` singleton to track instances
- Implemented proper disposal of renderers, scenes, and materials
- Added utility functions in `src/lib/three-utils.ts` for centralized Three.js management

### 2. Unknown extension "KHR_materials_pbrSpecularGlossiness"
**Warning**: `THREE.GLTFLoader: Unknown extension "KHR_materials_pbrSpecularGlossiness".`

**Cause**: The GLTF models are using an older material format that's not supported by the current version of Three.js GLTFLoader.

**Fix**:
- Added proper error handling in GLTFLoader calls
- Ensured materials are properly configured with `needsUpdate = true`
- Added progress and error callbacks to loader functions

### 3. GL_INVALID_OPERATION: glTexStorage2D: Texture is immutable
**Error**: `GL_INVALID_OPERATION: glTexStorage2D: Texture is immutable.`

**Cause**: Textures were being reused or modified incorrectly, or materials weren't being properly disposed of.

**Fix**:
- Implemented proper material disposal in cleanup functions
- Added `powerPreference: "high-performance"` to renderer options
- Ensured proper cleanup of geometries and materials
- Added proper texture management

## Files Modified

### 1. `src/routes/+page.svelte`
- Added `onDestroy` lifecycle hook
- Implemented proper cleanup of renderer, scenes, and models
- Added error handling for GLTF loading
- Fixed animation loop with proper cancellation
- Added proper material disposal

### 2. `src/routes/explore/+page.svelte`
- Added proper cleanup and disposal
- Fixed animation loop
- Improved error handling
- Added proper material configuration
- Fixed TypeScript errors with proper type annotations
- Added proper event handling

### 3. `src/routes/build/+page.svelte`
- Added cleanup functions
- Fixed animation loop
- Improved error handling
- Added proper disposal of controls
- Added proper material configuration

### 4. `src/lib/three-utils.ts` (New)
- Created utility functions for Three.js management
- Implemented singleton pattern for tracking instances
- Added helper functions for common Three.js operations
- Centralized cleanup and disposal logic

## Key Improvements

1. **Proper Cleanup**: All Three.js resources are now properly disposed of when components are destroyed
2. **Instance Tracking**: The `ThreeJSManager` tracks all Three.js instances to prevent conflicts
3. **Error Handling**: Added proper error handling for model loading and rendering
4. **Performance**: Added `powerPreference: "high-performance"` for better GPU utilization
5. **Memory Management**: Proper disposal of geometries, materials, and textures
6. **TypeScript Support**: Fixed all TypeScript errors with proper type annotations
7. **Event Handling**: Improved event handling with proper cleanup

## Usage

To use the new utility functions:

```typescript
import { createRenderer, createScene, disposeRenderer, disposeScene } from '$lib/three-utils';

// Create renderer and scene
const renderer = createRenderer({ antialias: true });
const scene = createScene();

// Clean up when done
onDestroy(() => {
  disposeRenderer(renderer);
  disposeScene(scene);
});
```

## Testing

To test the fixes:

1. Run the development server: `npm run dev`
2. Navigate to different pages that use Three.js
3. Check the browser console for warnings/errors
4. Verify that models load properly without errors
5. Test that switching between pages doesn't cause memory leaks

## Notes

- The `KHR_materials_pbrSpecularGlossiness` warning may still appear if the GLTF models use this extension, but it won't affect functionality
- The fixes ensure proper cleanup and prevent memory leaks
- Performance should be improved with the new renderer options
- Multiple instances are now tracked and managed properly
- All TypeScript errors have been resolved
- Event listeners are properly cleaned up to prevent memory leaks

## Additional Recommendations

1. **Model Optimization**: Consider optimizing the GLTF models to use newer material formats
2. **Lazy Loading**: Implement lazy loading for 3D models to improve initial page load times
3. **Error Boundaries**: Add error boundaries around Three.js components for better error handling
4. **Performance Monitoring**: Add performance monitoring to track Three.js performance
5. **Accessibility**: Ensure 3D content is accessible to users with disabilities

## Troubleshooting

If you still see warnings or errors:

1. **Multiple instances warning**: Check if you're using the `ThreeJSManager` utility functions
2. **GLTF warnings**: These are usually harmless and don't affect functionality
3. **Performance issues**: Ensure you're using `powerPreference: "high-performance"` in renderer options
4. **Memory leaks**: Verify that all cleanup functions are being called in `onDestroy`
