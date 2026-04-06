'use client';

export default function EventNode({
  node,
  zoom,
  updateNodePosition,
  gridSize,
  nodeWidth,
  nodeHeight,
  snapToGrid
}: {
  node: any;
  zoom: number;
  updateNodePosition: (id: string, x: number, y: number) => void;
  gridSize: number;
  nodeWidth: number;
  nodeHeight: number;
  snapToGrid: boolean;
}) {

  const handlePointerDown = (e: React.PointerEvent) => {
    e.stopPropagation(); // Prevent the canvas from panning    

    // Capture initial positions to calculate exact deltas
    const startX = e.clientX; //screen
    const startY = e.clientY; // screen
    const initialNodeX = node.position.x; // canvas
    const initialNodeY = node.position.y; // canvas

    const handlePointerMove = (moveEvent: PointerEvent) => {
      // 1. Calculate movement delta and divide by zoom to compensate for canvas scale
      const deltaX = (moveEvent.clientX - startX) / zoom;
      const deltaY = (moveEvent.clientY - startY) / zoom;

      // 2. Add delta to the original position
      const rawX = initialNodeX + deltaX;
      const rawY = initialNodeY + deltaY;

      // 3. Pixel-perfect snap: round to the nearest grid cell using the gridSize prop
      const snappedX = snapToGrid ? Math.round(rawX / gridSize) * gridSize : rawX;
      const snappedY = snapToGrid ? Math.round(rawY / gridSize) * gridSize : rawY;

      updateNodePosition(node.id, snappedX, snappedY);
    };


    ////
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