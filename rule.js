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
let gameInterval;
let currentDirection = "right";

// Referencias a elementos HTML
const menu = document.getElementById("menu");
const game = document.getElementById("game");
const gameOver = document.getElementById("gameOver");
const finalScore = document.querySelector(".final-score");

// Botones del menú
document.getElementById("startButton").addEventListener("click", startGame);

// Botones de Game Over
document.getElementById("restartButton").addEventListener("click", () => {
    resetGame();
    startGame();
});
document.getElementById("menuButton").addEventListener("click", () => {
    resetGame();
    showMenu();
});

// Función principal del juego
function gameLoop() {
    update();
    if (isGameOver()) {
        clearInterval(gameInterval);
        showGameOver();
    } else {
        draw();
    }
}

// Función para iniciar el juego
function startGame() {
    menu.classList.add("hidden");
    gameOver.classList.add("hidden");
    game.classList.remove("hidden");

    score = 0;
    snake = [{ x: 200, y: 200 }];
    direction = { x: 0, y: 0 };
    food = generateFood();
    currentDirection = "right";  // Dirección inicial

    gameInterval = setInterval(gameLoop, 100); // velocidad del juego
}

// Función para mostrar el menú principal
function showMenu() {
    menu.classList.remove("hidden");
    game.classList.add("hidden");
    gameOver.classList.add("hidden");
}

// Función para mostrar la pantalla de Game Over
function showGameOver() {
    gameOver.classList.remove("hidden");
    game.classList.add("hidden");
    finalScore.textContent = `Final Score: ${score}`;
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
    const appleX = food.x + (blockSize - 20) / 2;
    const appleY = food.y + (blockSize - 20) / 2;
    ctx.drawImage(appleImage, appleX, appleY, 20, 20);

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
    // Bloquear el scroll al usar flechas
    if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(event.key)) {
        event.preventDefault();
    }

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
