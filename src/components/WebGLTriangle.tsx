import { useEffect, useRef } from "react";

const WebGLTriangle = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const initWebGL = () => {
      const canvas = canvasRef.current;
      if (!canvas) {
        console.error("Canvas element not found");
        return;
      }

      // Initialize the WebGL context
      const gl = canvas.getContext("webgl");
      if (!gl) {
        console.error(
          "Unable to initialize WebGL. Your browser may not support it."
        );
        return;
      }

      // Vertex shader source code
      const vertexShaderSource = `
        attribute vec2 position;
        void main() {
          gl_Position = vec4(position, 0.0, 1.0);
        }
      `;

      // Fragment shader source code
      const fragmentShaderSource = `
        void main() {
          gl_FragColor = vec4(0.0, 0.0, 1.0, 1.0); // Blue color
        }
      `;

      // Create shader function
      const createShader = (
        gl: WebGLRenderingContext,
        type: GLenum,
        source: string
      ) => {
        const shader = gl.createShader(type);
        if (!shader) {
          throw new Error("Invalud shader");
        }
        gl.shaderSource(shader, source);
        gl.compileShader(shader);
        if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
          console.error(
            "Shader compilation failed: ",
            gl.getShaderInfoLog(shader)
          );
          gl.deleteShader(shader);
          return null;
        }
        return shader;
      };

      // Create and compile shaders
      const vertexShader = createShader(
        gl,
        gl.VERTEX_SHADER,
        vertexShaderSource
      )!;
      const fragmentShader = createShader(
        gl,
        gl.FRAGMENT_SHADER,
        fragmentShaderSource
      )!;

      // Create and link program
      const shaderProgram = gl.createProgram()!;
      gl.attachShader(shaderProgram, vertexShader);
      gl.attachShader(shaderProgram, fragmentShader);
      gl.linkProgram(shaderProgram);
      if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
        console.error(
          "Shader program linking failed: ",
          gl.getProgramInfoLog(shaderProgram)
        );
        return;
      }
      gl.useProgram(shaderProgram);

      // Set up triangle vertices
      const vertices = new Float32Array([0.0, 0.5, -0.5, -0.5, 0.5, -0.5]);

      // Create buffer and pass vertex data
      const vertexBuffer = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
      gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

      // Get attribute location and enable it
      const positionLocation = gl.getAttribLocation(shaderProgram, "position");
      gl.enableVertexAttribArray(positionLocation);
      gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);

      // Clear the canvas and draw the triangle
      gl.clearColor(0.0, 0.0, 0.0, 1.0); // Black background
      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
    };

    initWebGL();
  }, []);

  return <canvas ref={canvasRef} width="640" height="480"></canvas>;
};

export default WebGLTriangle;
