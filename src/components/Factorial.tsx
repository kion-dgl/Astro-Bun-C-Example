import React, { useState, useEffect } from 'react';

const Factorial: React.FC = () => {
  const [result, setResult] = useState<number | null>(null);
  const [input, setInput] = useState<number>(5);  // Default input value

  useEffect(() => {
    const loadWasm = async () => {
      try {
        // Fetch and compile the WebAssembly module directly
        const response = await fetch('/src/assets/factorial.wasm');
        const wasmBuffer = await response.arrayBuffer();
        const wasmModule = await WebAssembly.instantiate(wasmBuffer);

        const { exports } = wasmModule.instance;
        console.log(exports)

        // The factorial function should be available in the exports
        const factorial = exports.factorial as Function;

        const factorialResult = factorial(input);
        setResult(factorialResult);
      } catch (error) {
        console.error('Error loading Wasm module:', error);
      }
    };

    loadWasm();
  }, [input]);

  return (
    <div>
      <h1>Factorial Calculator using WebAssembly (TypeScript)</h1>
      <input
        type="number"
        value={input}
        onChange={(e) => setInput(Number(e.target.value))}
        placeholder="Enter a number"
      />
      {result !== null && (
        <p>The factorial of {input} is: {result}</p>
      )}
    </div>
  );
};

export default Factorial;
