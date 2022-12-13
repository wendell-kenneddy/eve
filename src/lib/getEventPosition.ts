export function getEventPosition(
  e: MouseEvent | TouchEvent,
  c: HTMLCanvasElement
) {
  const point =
    e instanceof MouseEvent
      ? { x: e.clientX, y: e.clientY }
      : { x: e.touches[0].clientX, y: e.touches[0].clientY };
  const rect = c.getBoundingClientRect();
  return {
    x: point.x - rect.left - c.clientLeft,
    y: point.y - rect.top - c.clientTop,
  };
}
