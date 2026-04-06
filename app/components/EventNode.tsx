

interface EventNodeProps {
  id: any,
  position: any,
  zoom: any,
  updateNodePosition: any,
}

export default function EventNode({id,position,zoom,updateNodePosition} : EventNodeProps) {
  const handlePointerDown = (e:any) => {
    e.stopPropagation(); // Stops the canvas from panning

    const handlePointerMove = (moveEvent:any) => {
      // Compensate for the zoom level!
      const deltaX = moveEvent.movementX / zoom;
      const deltaY = moveEvent.movementY / zoom;

      updateNodePosition(id, deltaX, deltaY);
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
        transform: `translate(${position.x}px, ${position.y}px)`, // Better performance than top/left
      }}
      className="bg-white border rounded shadow-sm p-4"
    >
      Node Content
    </div>
  );
}