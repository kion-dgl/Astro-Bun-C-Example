import { useEffect, useRef } from 'react';

const BlueTriangle = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const loadWasm = async () => {
      try {
        // Fetch and compile the WebAssembly module directly
        const response = await fetch('/src/assets/blue_triangle.wasm');
        const wasmBuffer = await response.arrayBuffer();
        const wasmModule = await WebAssembly.instantiate(wasmBuffer, {
          env: {
            // Any necessary imports or stubs (e.g., SDL functions, memory allocation)
            memory: new WebAssembly.Memory({ initial: 256, maximum: 512 }),
            table: new WebAssembly.Table({ initial: 0, element: 'anyfunc' }),
            __memory_base: 1024,
            __table_base: 0,
            abort: () => console.error("Abort called in WebAssembly module")
          },
        });

        const { instance } = wasmModule;
        const { exports } = instance;

        console.log('WASM exports:', exports);

        // Initialize the canvas and WebGL context using the WASM functions
        if (canvasRef.current) {
          const canvas = canvasRef.current;

          // Assuming the WebAssembly module has a method to initialize WebGL context
          if (exports.initWebGL) {
            (exports.initWebGL as Function)(canvas);
          }

          const render = exports.render as Function;
          render();
          

        }

      } catch (error) {
        console.error('Error loading the WebAssembly module:', error);
      }
    };

    loadWasm();
  }, []);

  return (
    <div>
      <canvas ref={canvasRef} width="640" height="480"></canvas>
    </div>
  );
};

export default BlueTriangle;
