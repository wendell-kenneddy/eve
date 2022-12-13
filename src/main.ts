import './styles/style.css';
import { getEventPosition } from './lib/getEventPosition';

export interface Point {
  x: number;
  y: number;
}

const canvas = document.getElementById('drawing-area') as HTMLCanvasElement;
const ctx = canvas.getContext('2d', {
  alpha: false,
}) as CanvasRenderingContext2D;
let prevPosition: Point = { x: 0, y: 0 };
let isDrawing = false;
let brushType = 1;
let brushWidth = 1;
let brushColor = '#000';

function initialize() {
  resizeCanvas();
  configureCanvas();
  clearCanvas();
  setupCanvasListeners();
  setupToolbarListeners();
}

function configureCanvas() {
  ctx.lineCap = 'round';
  ctx.lineWidth = brushWidth;
  ctx.strokeStyle = brushType === 1 ? brushColor : '#fff';
}

function setupCanvasListeners() {
  window.addEventListener('resize', handleWindowResize);
  canvas.addEventListener('touchstart', (e) => {
    e.preventDefault();
    isDrawing = true;
  });
  canvas.addEventListener('touchend', (e) => {
    e.preventDefault();
    isDrawing = false;
    prevPosition = { x: 0, y: 0 };
  });
  canvas.addEventListener('touchmove', (e) => {
    e.preventDefault();
    draw(e);
  });
  canvas.addEventListener('mousedown', (e) => {
    e.preventDefault();
    isDrawing = true;
  });
  canvas.addEventListener('mouseup', () => (isDrawing = false));
  canvas.addEventListener('mouseleave', () => (isDrawing = false));
  canvas.addEventListener('mousemove', draw);
}

function setupToolbarListeners() {
  const clearButton = document.getElementById(
    'clear-canvas'
  ) as HTMLButtonElement;
  const saveButton = document.getElementById('save') as HTMLButtonElement;
  const colorInput = document.getElementById('brush-color') as HTMLInputElement;
  const brushInput = document.getElementById('brush-type') as HTMLInputElement;
  const brushWidthInput = document.getElementById(
    'brush-width'
  ) as HTMLInputElement;

  clearButton.addEventListener('click', clearCanvas);
  saveButton.addEventListener('click', saveDrawing);
  colorInput.addEventListener('change', handleBrushColorChange);
  brushInput.addEventListener('change', handleBrushTypeChange);
  brushWidthInput.addEventListener('change', handleBrushWidthChange);
}

function resizeCanvas() {
  canvas.parentElement && (canvas.width = canvas.parentElement.clientWidth);
}

function clearCanvas() {
  ctx.fillStyle = '#fff';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
}

function handleWindowResize() {
  resizeCanvas();
  configureCanvas();
  clearCanvas();
}

function handleBrushWidthChange(e: Event) {
  const { value } = e.target as HTMLInputElement;
  brushWidth = Number(value);
  ctx.lineWidth = Number(value);
}

function handleBrushColorChange(e: Event) {
  const { value } = e.target as HTMLInputElement;
  brushColor = value;
  ctx.strokeStyle = value;
}

function handleBrushTypeChange(e: Event) {
  const { value } = e.target as HTMLInputElement;
  ctx.strokeStyle = Number(value) === 1 ? brushColor : '#fff';
  brushType = Number(value);
}

function draw(e: MouseEvent | TouchEvent) {
  const point = getEventPosition(e, canvas);

  if (!prevPosition.x || !prevPosition.y || !isDrawing) {
    prevPosition = point;
    return;
  }

  const currPosition = point;
  ctx.beginPath();
  ctx.moveTo(prevPosition.x, prevPosition.y);
  ctx.lineTo(currPosition.x, currPosition.y);
  ctx.stroke();
  prevPosition = currPosition;
}

function saveDrawing() {
  const data = canvas.toDataURL('img/png', 1.0);
  const date = new Date();
  const a = document.createElement('a');
  a.href = data;
  a.download = `eve-${date.toLocaleDateString('pt-br', { hour12: false })}.png`;
  document.body.append(a);
  a.click();
  document.body.removeChild(a);
}

initialize();
