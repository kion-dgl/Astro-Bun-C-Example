# Client-Side C with WebAssembly in AstroJS (Proof of Concept)

This project is a **proof of concept** demonstrating how to run client-side C code in an **AstroJS** application using **Bun**. The project compiles a simple C function (factorial calculation) into **WebAssembly** (Wasm) and integrates it with a **React** component that runs in an Astro page. The purpose is to showcase how you can combine modern JavaScript frameworks, WebAssembly, and C to create performant client-side functionality.

## Technologies Used

- **AstroJS**: A modern web framework for building static sites using JavaScript frameworks like React, Svelte, and others.
- **Bun**: A fast JavaScript runtime and package manager, used to run the development server and build the project.
- **Emscripten**: A toolchain that compiles C/C++ to WebAssembly.
- **TypeScript**: Provides static typing and better developer tooling for JavaScript.
- **WebAssembly (Wasm)**: A binary instruction format for a stack-based virtual machine that allows running C code in the browser.

## Features

- Compiles a simple C program (factorial calculation) to WebAssembly.
- Integrates WebAssembly into a React component in an Astro page.
- Demonstrates client-side interaction with a C function via WebAssembly.
- Uses TypeScript for type safety.

## Folder Structure

The project has the following structure:

```
astro-project/
  ├── src/
  │   ├── assets/
  │   │   ├── factorial.c              # C source code that calculates factorial
  │   │   ├── factorial.wasm           # Compiled WebAssembly binary (from the C code)
  │   ├── components/
  │   │   ├── Factorial.tsx            # React component that loads and calls the Wasm function
  │   ├── pages/
  │   │   ├── index.astre              # Astro page that includes the Factorial component
  ├── package.json                     # Scripts and dependencies for the project
  ├── bun.lockb                        # Bun lockfile for managing dependencies
  └── tsconfig.json                    # TypeScript configuration
```


### Key Folders & Files:

- **`src/assets/factorial.c`**: The C source code that contains the factorial calculation function.
- **`src/assets/factorial.wasm`**: The compiled WebAssembly file generated from the C code.
- **`src/components/Factorial.tsx`**: The React component that dynamically loads the Wasm file and calls the factorial function.
- **`src/pages/wasm.tsx`**: The Astro page that renders the `Factorial` React component, showcasing the integration of WebAssembly into AstroJS.

## Setup and Usage

### Prerequisites

- **Bun**: Install Bun from [https://bun.sh/](https://bun.sh/) if you haven't already.
- **Emscripten**: Follow the instructions to install Emscripten from [https://emscripten.org/docs/getting_started/downloads.html](https://emscripten.org/docs/getting_started/downloads.html).

### Installation

Clone this repository and install the necessary dependencies:

```bash
bun install
```

### Compiling C Code to WebAssembly

To compile the factorial.c file into WebAssembly, use the compile:wasm script in package.json:

```
bun run compile:wasm
```

This will generate factorial.js and factorial.wasm in the src/assets/ folder, ready to be used in the React component.

### Running the Development Server

Once the WebAssembly files are generated, you can start the Astro development server:

```
bun dev
```

### Package.json Overview

The package.json contains the essential scripts and dependencies for the project:

```
{
  "name": "my-astro-project-using-bun",
  "type": "module",
  "version": "0.0.1",
  "scripts": {
    "dev": "npm run compile:wasm && bunx --bun astro dev",
    "build": "npm run compile:wasm && bunx --bun astro check && bunx --bun astro build",
    "preview": "bunx --bun astro preview",
    "astro": "astro",
    "compile:wasm": "emcc src/assets/factorial.c -s WASM=1 -o src/assets/factorial.js -s EXPORTED_FUNCTIONS=\"['_factorial']\" -s EXTRA_EXPORTED_RUNTIME_METHODS=\"['ccall']\""
  },
  "dependencies": {
    "@astrojs/check": "^0.9.3",
    "@astrojs/react": "^3.6.2",
    "@types/react": "^18.3.8",
    "@types/react-dom": "^18.3.0",
    "astro": "^4.15.8",
    "react": "^18.3.1",
    "react-dom": "^18.3.1",
    "typescript": "^5.6.2"
  },
  "devDependencies": {
    "@types/bun": "^1.1.10"
  }
}
```

## Scripts

- `dev`: Runs the compile:wasm script and then starts the Astro dev server using Bun.
- `build`: Runs the compile:wasm script, performs an Astro check, and builds the project using Bun.
- `preview`: Previews the built Astro site using Bun.
- `compile:wasm`: Uses Emscripten (emcc) to compile the C code (factorial.c) into WebAssembly (factorial.wasm).

## How It Works

The C code located in src/assets/factorial.c is compiled to WebAssembly using Emscripten.
The React component (Factorial.tsx) dynamically loads the .wasm file using the browser’s native WebAssembly API.
The factorial function, which is compiled from C to Wasm, is called via JavaScript using WebAssembly.instantiate, and the result is rendered in the browser.
The Astro page (wasm.tsx) includes the React component and renders it in the browser as part of the static site.

## Conclusion

This project demonstrates a simple proof of concept for integrating client-side C code via WebAssembly into an AstroJS application using Bun. It showcases the power of WebAssembly in the browser and how you can leverage C/C++ code for performance-critical tasks while using modern JavaScript frameworks like React.

## License

This project is licensed under the MIT License.