const canvas = document.getElementById("canvasMap");
const ctx = canvas.getContext("2d");

// Subir imagen de la cabeza
const headImage = new Image();
headImage.src = "head.gif"; // Asegúrate de tener esta imagen

// Subir imagen de la manzana
const appleImage = new Image();
appleImage.src = "manzana.png"; 

// Tamaño de la cabeza (35x35)
const headWidth = 35;
const headHeight = 35;

// Tamaño del canvas y tamaño de cada bloque
const canvasSize = 400;
const blockSize = 20;
canvas.width = canvasSize;
canvas.height = canvasSize;

// Configuración inicial de la serpiente y la comida
let snake = [{ x: 200, y: 200 }];
let food = generateFood();
let direction = { x: 0, y: 0 };
let score = 0;

// Variable para determinar la dirección
let currentDirection = "right"; // Dirección inicial

// Función principal del juego
function gameLoop() {
    update();
    if (isGameOver()) {
        alert("Game Over! Puntuación: " + score);
        resetGame();
    } else {
        draw();
        setTimeout(gameLoop, 100); // velocidad del juego
    }
}

// Función para actualizar la posición de la serpiente
function update() {
    const head = { x: snake[0].x + direction.x * blockSize, y: snake[0].y + direction.y * blockSize };
    snake.unshift(head);

    if (head.x === food.x && head.y === food.y) {
        score++;
        food = generateFood();
    } else {
        snake.pop();
    }
}

// Función para dibujar la serpiente, comida y puntuación
function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const head = snake[0];

    // Dibujar la cabeza de la serpiente
    ctx.save();
    const headX = head.x + (blockSize - headWidth) / 2;
    const headY = head.y + (blockSize - headHeight) / 2;
    ctx.translate(headX + headWidth / 2, headY + headHeight / 2);
    switch (currentDirection) {
        case "up":
            ctx.rotate(Math.PI / 2);
            break;
        case "down":
            ctx.rotate(-Math.PI / 2);
            break;
        case "left":
            ctx.rotate(0);
            break;
        case "right":
            ctx.rotate(Math.PI);
            break;
    }
    ctx.drawImage(headImage, -headWidth / 2, -headHeight / 2, headWidth, headHeight);
    ctx.restore();

    // Dibujar el cuerpo de la serpiente
    ctx.fillStyle = "#6abe30";
    snake.slice(1).forEach(part => ctx.fillRect(part.x, part.y, blockSize, blockSize));

    // Dibujar la manzana
    const appleX = food.x + (blockSize - 20) / 2; // Ajustar para centrar la manzana
    const appleY = food.y + (blockSize - 20) / 2; // Ajustar para centrar la manzana
    ctx.drawImage(appleImage, appleX, appleY, 20, 20); // Tamaño de 20x20

    // Actualizar la puntuación
    document.querySelector(".points").textContent = "POINTS: " + score;
}

// Genera una nueva posición para la comida
function generateFood() {
    const x = Math.floor(Math.random() * (canvas.width / blockSize)) * blockSize;
    const y = Math.floor(Math.random() * (canvas.height / blockSize)) * blockSize;
    return { x, y };
}

// Función para detectar colisiones y fin del juego
function isGameOver() {
    const head = snake[0];
    if (head.x < 0 || head.x >= canvas.width || head.y < 0 || head.y >= canvas.height) return true;
    for (let i = 1; i < snake.length; i++) {
        if (head.x === snake[i].x && head.y === snake[i].y) return true;
    }
    return false;
}

// Función para reiniciar el juego
function resetGame() {
    snake = [{ x: 200, y: 200 }];
    direction = { x: 0, y: 0 };
    score = 0;
    food = generateFood();
}

// Control de teclas de dirección
document.addEventListener("keydown", (event) => {
    switch (event.key) {
        case "ArrowUp":
            if (direction.y === 0) {
                direction = { x: 0, y: -1 };
                currentDirection = "up";
            }
            break;
        case "ArrowDown":
            if (direction.y === 0) {
                direction = { x: 0, y: 1 };
                currentDirection = "down";
            }
            break;
        case "ArrowLeft":
            if (direction.x === 0) {
                direction = { x: -1, y: 0 };
                currentDirection = "left";
            }
            break;
        case "ArrowRight":
            if (direction.x === 0) {
                direction = { x: 1, y: 0 };
                currentDirection = "right";
            }
            break;
    }
});

// Iniciar el juego
addEventListener("load", () => {
    gameLoop();
});
