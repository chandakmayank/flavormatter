// Глобальные переменные
var canvas = document.querySelector('#canvas'),
    // Получаем объект canvas
trails = document.querySelector('#trails'),
    // Получаем объект canvas
ctx = canvas.getContext('2d'),
    // Получаем контекст отрисовки
Tctx = trails.getContext('2d'),
    // Получаем контекст отрисовки
PI = Math.PI; // Запись значения пи в константу

var COUNT = Math.floor(rand(2, 12)),
    R1 = rand(60, (window.innerHeight - 100) / 2),
    // Радиус большого круга
R2 = R1 / (PI * rand(1, 4)) * COUNT,
    // Радиус маленького круга
COLOR = '#fff',
    // Цвет контура
SPEED = rand(0.05, 2 / (COUNT * rand(0.5, 2))),
    // Скорость вращения большого круга
ANGLE = 0,
    // Начальный угол
ANGLEDIFF = 360 / COUNT * (PI / 180),
    // Отклонение угла
CENTER = {
  x: window.innerWidth / 2, // Центр окна по оси X
  y: window.innerHeight / 2 // Центр окна по оси Y
};

var lw = rand(0.5, 3);

// Функция запуска анимации
function init() {
  ctx.canvas.width = CENTER.x * 2;
  ctx.canvas.height = CENTER.y * 2;
  Tctx.canvas.width = CENTER.x * 2;
  Tctx.canvas.height = CENTER.y * 2;

  window.requestAnimationFrame(draw); // Перерисовываем анимацию
}

var opacityRand = rand(0.05, 0.3);
var overlayColor = 'rgba(' + Math.floor(rand(10, 100)) + ',' + Math.floor(rand(10, 100)) + ',' + Math.floor(rand(10, 100)) + ',' + opacityRand + ')';

// Перерисовка изображения на канвасе
function draw() {
  Tctx.fillStyle = overlayColor;
  Tctx.fillRect(0, 0, Tctx.canvas.width, Tctx.canvas.height);

  ctx.clearRect(0, 0, CENTER.x * 2, CENTER.y * 2);

  ANGLE -= PI / 360 * SPEED; // Угол в радианах

  // Drawing elements
  drawCenter(ctx);

  var COORDS = getCoordinates();

  drawFirstLevelPoints(COORDS.mainPoints);
  drawSecondLevelPoints(COORDS.secondaryPoints);
  drawConnectors(COORDS.mainPoints, COORDS.secondaryPoints);

  window.requestAnimationFrame(draw);
}

// Правка координат при ресайзе окна
window.addEventListener('resize', function () {
  CENTER = {
    x: window.innerWidth / 2,
    y: window.innerHeight / 2
  };

  ctx.canvas.width = CENTER.x * 2;
  ctx.canvas.height = CENTER.y * 2;
  Tctx.canvas.width = CENTER.x * 2;
  Tctx.canvas.height = CENTER.y * 2;
});

// Старт анимации
init();

// Вычисления ===========================================


// Получаем глобальный набор координат точек
function getCoordinates() {
  var coords = {
    mainPoints: [],
    secondaryPoints: []
  };

  var angles = [ANGLE];

  for (var i = 1; i < COUNT; i++) {
    angles.push(ANGLE + ANGLEDIFF * i);
  }

  angles.forEach(function (angle) {
    coords.mainPoints.push(getPointCoordinates(CENTER, angle, R1));
  });

  coords.mainPoints.forEach(function (point, index) {
    var localAngle = angles[index] + angles[index] * COUNT * 2;
    var newPointCoordinate = getPointCoordinates(point, localAngle, R2);

    coords.secondaryPoints.push(newPointCoordinate);
  });

  return coords;
}

// Получаем координаты точки из центра окружности, угла и радиуса
function getPointCoordinates(center, angle, radius) {
  var x = void 0,
      y = void 0;

  x = center.x + radius * Math.cos(angle);
  y = center.y + radius * Math.sin(angle);

  return { x: x, y: y };
}

// Отрисовка ===========================================

var randCircleCenterSize = rand(2, 20);
var randCircleInnerSize = rand(2, 10);
var randCircleOutterSize = rand(2, 8);
// Рисуем центр
function drawCenter(ctx) {
  drawCirclePoint(CENTER.x, CENTER.y, randCircleCenterSize);
  drawCircle(CENTER.x, CENTER.y, R1 - 4, true);
}
// Рисуем точки большого круга
function drawFirstLevelPoints(points) {
  points.map(function (point) {
    drawCirclePoint(point.x, point.y, randCircleInnerSize);
    drawCircle(point.x, point.y, R2 - 4);
  });
}
// Рисуем точки внешних кругов
function drawSecondLevelPoints(points) {
  points.map(function (point) {
    drawCirclePoint(point.x, point.y, randCircleOutterSize);
    drawPoint(point.x, point.y);
  });
}
// Рисуем линии между точками
function drawConnectors(innerPoints, outterPoints) {
  innerPoints.forEach(function (point, index) {
    drawLine(point, CENTER);
    drawLine(point, outterPoints[index]);
    var n = outterPoints.length;
    for (var i = 1; i < n; i++) {
      drawLine(outterPoints[0], outterPoints[n - 1]);
      drawLine(outterPoints[i], outterPoints[i - 1]);
    }
  });
}

// Отрисовка круга с обводкой
function drawCirclePoint(x, y, rad) {
  ctx.beginPath();
  ctx.strokeStyle = COLOR;
  ctx.lineWidth = rad;
  ctx.arc(x, y, rad / 2, 0, PI * 2, false);
  ctx.stroke();

  ctx.beginPath();
  ctx.strokeStyle = COLOR;
  ctx.lineWidth = lw;
  ctx.arc(x, y, rad + 4, 0, PI * 2, false);
  ctx.stroke();
}
// Отрисовка полупрозрачной окружности
function drawCircle(x, y, rad, isDashed) {
  isDashed ? ctx.setLineDash([2, 4]) : '';

  ctx.globalAlpha = 0.2;
  ctx.beginPath();
  ctx.strokeStyle = COLOR;
  ctx.lineWidth = 2;
  ctx.arc(x, y, rad + 4, 0, PI * 2, false);
  ctx.stroke();
  ctx.globalAlpha = 1;
  ctx.setLineDash([0]);
}

// Отрисовка линии
function drawLine(from, to) {
  ctx.globalAlpha = 0.5;
  ctx.beginPath();
  ctx.strokeStyle = COLOR;
  ctx.lineWidth = lw;
  ctx.moveTo(from.x, from.y);
  ctx.lineTo(to.x, to.y);
  ctx.stroke();
  ctx.globalAlpha = 1;
}
// Отрисовка точки
function drawPoint(x, y) {
  var radius = 1;

  Tctx.globalAlpha = 1;
  Tctx.beginPath();
  Tctx.strokeStyle = COLOR;
  Tctx.lineWidth = lw;
  Tctx.arc(x, y, radius / 2, 0, PI * 2, false);
  Tctx.stroke();
  Tctx.globalAlpha = 1;
  Tctx.setLineDash([0]);
}

function rand(min, max) {
  return Math.random() * (max - min) + min;
}