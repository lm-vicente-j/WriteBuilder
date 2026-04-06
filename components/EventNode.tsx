'use client';

export default function EventNode({
  node,
  zoom,
  updateNodePosition,
  gridSize,
  nodeWidth,
  nodeHeight
}: {
  node: any;
  zoom: number;
  updateNodePosition: (id: string, x: number, y: number) => void;
  gridSize: number,
  nodeWidth: number,
  nodeHeight: number
}) {
  const GRID_SIZE = 30;

  const handlePointerDown = (e: React.PointerEvent) => {
    e.stopPropagation(); // Prevent the canvas from panning

    // Capture initial positions to calculate exact deltas
    const startX = e.clientX;
    const startY = e.clientY;
    const initialNodeX = node.position.x;
    const initialNodeY = node.position.y;

    const handlePointerMove = (moveEvent: PointerEvent) => {
      // 1. Calculate movement delta and divide by zoom to compensate for canvas scale
      const deltaX = (moveEvent.clientX - startX) / zoom;
      const deltaY = (moveEvent.clientY - startY) / zoom;

      // 2. Add delta to the original position
      let rawX = initialNodeX + deltaX;
      let rawY = initialNodeY + deltaY;

      // 3. Snap to grid
      const snappedX = Math.round(rawX / GRID_SIZE) * GRID_SIZE;
      const snappedY = Math.round(rawY / GRID_SIZE) * GRID_SIZE;

      updateNodePosition(node.id, snappedX, snappedY);
      const handlePointerMove = (moveEvent: PointerEvent) => {
        const deltaX = (moveEvent.clientX - startX) / zoom;
        const deltaY = (moveEvent.clientY - startY) / zoom;

        let rawX = initialNodeX + deltaX;
        let rawY = initialNodeY + deltaY;

        // The snapping math automatically adapts to whatever gridSize is passed in
        const snappedX = Math.round(rawX / gridSize) * gridSize;
        const snappedY = Math.round(rawY / gridSize) * gridSize;

        updateNodePosition(node.id, snappedX, snappedY);
      };
    };

    const handlePointerUp = () => {
      document.removeEventListener('pointermove', handlePointerMove);
      document.removeEventListener('pointerup', handlePointerUp);
    };

    document.addEventListener('pointermove', handlePointerMove);
    document.addEventListener('pointerup', handlePointerUp);
  };

  return (
    <div
      onPointerDown={handlePointerDown}
      style={{
        position: 'absolute',
        transform: `translate(${node.position.x}px, ${node.position.y}px)`,
        // Apply the dynamic dimensions here!
        width: `${nodeWidth}px`,
        height: `${nodeHeight}px`,
      }}
      className="bg-white border-2 border-slate-300 rounded-lg shadow-md p-4 cursor-grab active:cursor-grabbing flex items-center justify-center select-none"
    >
      <span className="font-semibold text-slate-700">{node.data.text}</span>

      {/* Visual Input Port (Left) */}
      <div className="absolute left-[-6px] top-1/2 -translate-y-1/2 w-3 h-3 bg-slate-400 rounded-full border-2 border-white" />

      {/* Visual Output Port (Right) */}
      <div className="absolute right-[-6px] top-1/2 -translate-y-1/2 w-3 h-3 bg-blue-500 rounded-full border-2 border-white" />
    </div>
  );
}