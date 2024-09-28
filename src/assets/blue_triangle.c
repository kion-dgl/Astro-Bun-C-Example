// src/assets/blue_triangle.c

#include <SDL.h>
#include <GLES2/gl2.h> // Use OpenGL ES 2.0/WebGL header
#include <emscripten.h>
#include <stdio.h>
#include <stdlib.h> // For malloc and free

SDL_Window* window;
SDL_GLContext glContext;

const char* vertexShaderSource = R"(
    attribute vec2 position;
    void main() {
        gl_Position = vec4(position, 0.0, 1.0);
    }
)";

const char* fragmentShaderSource = R"(
    void main() {
        gl_FragColor = vec4(0.0, 0.0, 1.0, 1.0); // Blue color
    }
)";

GLuint createShader(GLenum type, const char* source) {
    GLuint shader = glCreateShader(type);
    glShaderSource(shader, 1, &source, NULL);
    glCompileShader(shader);

    GLint compiled;
    glGetShaderiv(shader, GL_COMPILE_STATUS, &compiled);
    if (!compiled) {
        GLint infoLen = 0;
        glGetShaderiv(shader, GL_INFO_LOG_LENGTH, &infoLen);
        if (infoLen > 1) {
            char* infoLog = (char*)malloc(infoLen);
            glGetShaderInfoLog(shader, infoLen, NULL, infoLog);
            printf("Error compiling shader: %s\n", infoLog);
            free(infoLog);
        }
        glDeleteShader(shader);
        return 0;
    }

    return shader;
}

void initGL() {
    // Compile and link shaders
    GLuint vertexShader = createShader(GL_VERTEX_SHADER, vertexShaderSource);
    GLuint fragmentShader = createShader(GL_FRAGMENT_SHADER, fragmentShaderSource);
    GLuint shaderProgram = glCreateProgram();
    glAttachShader(shaderProgram, vertexShader);
    glAttachShader(shaderProgram, fragmentShader);
    glLinkProgram(shaderProgram);
    glUseProgram(shaderProgram);

    // Define vertices for a triangle
    GLfloat vertices[] = {
         0.0f,  0.5f, // Top vertex
        -0.5f, -0.5f, // Bottom-left vertex
         0.5f, -0.5f  // Bottom-right vertex
    };

    // Create and bind a vertex buffer object (VBO)
    GLuint VBO;
    glGenBuffers(1, &VBO);
    glBindBuffer(GL_ARRAY_BUFFER, VBO);
    glBufferData(GL_ARRAY_BUFFER, sizeof(vertices), vertices, GL_STATIC_DRAW);

    // Bind the vertex data to the "position" attribute in the vertex shader
    GLint positionAttribute = glGetAttribLocation(shaderProgram, "position");
    glEnableVertexAttribArray(positionAttribute);
    glVertexAttribPointer(positionAttribute, 2, GL_FLOAT, GL_FALSE, 2 * sizeof(GLfloat), (void*)0);

    // Set clear color to blue
    glClearColor(0.0f, 0.0f, 0.0f, 1.0f);
}

void render() {
    // Clear the screen
    glClear(GL_COLOR_BUFFER_BIT);

    // Draw the triangle
    glDrawArrays(GL_TRIANGLES, 0, 3);

    // Swap buffers to display the rendered image
    SDL_GL_SwapWindow(window);
}

void main_loop() {
    render();
}

int main() {
    // Initialize SDL with video and OpenGL context support
    if (SDL_Init(SDL_INIT_VIDEO) < 0) {
        return 1;
    }

    // Set OpenGL context attributes (WebGL is based on OpenGL ES 2.0)
    SDL_GL_SetAttribute(SDL_GL_CONTEXT_MAJOR_VERSION, 2);
    SDL_GL_SetAttribute(SDL_GL_CONTEXT_MINOR_VERSION, 0);
    SDL_GL_SetAttribute(SDL_GL_CONTEXT_PROFILE_MASK, SDL_GL_CONTEXT_PROFILE_ES);

    // Create SDL window with OpenGL context
    window = SDL_CreateWindow("Blue Triangle", SDL_WINDOWPOS_CENTERED, SDL_WINDOWPOS_CENTERED, 640, 480, SDL_WINDOW_OPENGL);
    if (!window) {
        SDL_Quit();
        return 1;
    }

    // Create OpenGL context
    glContext = SDL_GL_CreateContext(window);
    if (!glContext) {
        SDL_DestroyWindow(window);
        SDL_Quit();
        return 1;
    }

    // Initialize WebGL (OpenGL ES 2.0 in Emscripten)
    initGL();

    // Use Emscripten's main loop to repeatedly call render function
    emscripten_set_main_loop(main_loop, 0, 1);

    return 0;
}
