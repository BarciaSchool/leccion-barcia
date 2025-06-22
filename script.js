const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// --- Dimensiones y velocidad ---
const PADDLE_WIDTH = 10, PADDLE_HEIGHT = 100, PADDLE_SPEED = 6;
const BALL_SIZE = 10;
let leftPaddleY = (canvas.height - PADDLE_HEIGHT) / 2;
let rightPaddleY = leftPaddleY;
let ballX = canvas.width / 2 - BALL_SIZE / 2;
let ballY = canvas.height / 2 - BALL_SIZE / 2;
let ballVX = 4, ballVY = 4;
let scoreLeft = 0, scoreRight = 0;

// Controles
const keys = {};
window.addEventListener('keydown', e => keys[e.key] = true);
window.addEventListener('keyup', e => keys[e.key] = false);

// Dibujar rectángulo
function drawRect(x, y, w, h, color) {
    ctx.fillStyle = color;
    ctx.fillRect(x, y, w, h);
}

// Dibujar texto
function drawText(text, x, y) {
    ctx.fillStyle = '#fff';
    ctx.font = '32px sans-serif';
    ctx.fillText(text, x, y);
}

// Lógica de actualización
function update() {
    // Mover paletas
    if (keys['w'] && leftPaddleY > 0) leftPaddleY -= PADDLE_SPEED;
    if (keys['s'] && leftPaddleY + PADDLE_HEIGHT < canvas.height) leftPaddleY += PADDLE_SPEED;
    if (keys['ArrowUp'] && rightPaddleY > 0) rightPaddleY -= PADDLE_SPEED;
    if (keys['ArrowDown'] && rightPaddleY + PADDLE_HEIGHT < canvas.height) rightPaddleY += PADDLE_SPEED;

    // Mover bola
    ballX += ballVX;
    ballY += ballVY;

    // Rebote en paredes
    if (ballY <= 0 || ballY + BALL_SIZE >= canvas.height) {
        ballVY *= -1;
    }

    // Colisión con paletas
    if (
        ballX <= PADDLE_WIDTH &&
        ballY + BALL_SIZE >= leftPaddleY &&
        ballY <= leftPaddleY + PADDLE_HEIGHT
    ) {
        ballVX *= -1;
        ballX = PADDLE_WIDTH; // evitar “atascarse”
    }
    if (
        ballX + BALL_SIZE >= canvas.width - PADDLE_WIDTH &&
        ballY + BALL_SIZE >= rightPaddleY &&
        ballY <= rightPaddleY + PADDLE_HEIGHT
    ) {
        ballVX *= -1;
        ballX = canvas.width - PADDLE_WIDTH - BALL_SIZE;
    }

    // Puntuación
    if (ballX < 0) {
        scoreRight++;
        resetBall();
    }
    if (ballX > canvas.width) {
        scoreLeft++;
        resetBall();
    }
}

// Reiniciar bola al centro
function resetBall() {
    ballX = canvas.width / 2 - BALL_SIZE / 2;
    ballY = canvas.height / 2 - BALL_SIZE / 2;
    // invertir dirección X para quien acaba de recibir punto
    ballVX *= -1;
}

// Dibujar todo
function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    // Paletas
    drawRect(0, leftPaddleY, PADDLE_WIDTH, PADDLE_HEIGHT, '#fff');
    drawRect(
        canvas.width - PADDLE_WIDTH,
        rightPaddleY,
        PADDLE_WIDTH,
        PADDLE_HEIGHT,
        '#fff'
    );
    // Bola
    drawRect(ballX, ballY, BALL_SIZE, BALL_SIZE, '#fff');
    // Puntuación
    drawText(scoreLeft, canvas.width * 0.25, 50);
    drawText(scoreRight, canvas.width * 0.75, 50);
}

// Bucle principal
function gameLoop() {
    update();
    draw();
    requestAnimationFrame(gameLoop);
}
gameLoop();
