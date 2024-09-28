import { useEffect, useRef } from 'react';

const BlueTriangle = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      const gl = canvas.getContext('webgl');
      if (!gl) {
        console.error('Unable to initialize WebGL.');
        return;
      }

      // Load WebAssembly
      const loadWasm = async () => {
        try {
          const response = await fetch('/src/assets/blue_triangle.wasm');
          const wasmBuffer = await response.arrayBuffer();
          const wasmModule = await WebAssembly.instantiate(wasmBuffer, {
            env: {
              memory: new WebAssembly.Memory({ initial: 256, maximum: 512 }),
              table: new WebAssembly.Table({ initial: 0, element: 'anyfunc' }),
              __memory_base: 1024,
              __table_base: 0,
              glCreateShader: (type: GLenum) => gl.createShader(type),
              glShaderSource: (shader: WebGLShader, sourcePtr: number, lengthPtr: number) => {
                const source = /* Get string from WebAssembly memory */;
                gl.shaderSource(shader, source);
              },
              glCompileShader: (shader: WebGLShader) => gl.compileShader(shader),
              // Add other WebGL functions as needed
            },
          });

          const { instance } = wasmModule;
          const { exports } = instance;

          // Initialize the canvas and WebGL context
          if (exports.initWebGL) {
            (exports.initWebGL as Function)(canvas);
          }

          const render = exports.render as Function;
          render();

        } catch (error) {
          console.error('Error loading the WebAssembly module:', error);
        }
      };

      loadWasm();
    }
  }, []);

  return (
    <div>
      <canvas ref={canvasRef} width="640" height="480"></canvas>
    </div>
  );
};

export default BlueTriangle;
