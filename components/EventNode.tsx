'use client';

import { useState } from "react";

export type Node = {id: string, position: {x:number, y:number}, data:{text:string}};
export type Edge = {id: string, source: string, target: string};

interface EventNodeProps {
  node: Node;
  zoom: number;
  updateNodePosition: (id: string, x: number, y: number) => void;
  gridSize: number;
  nodeWidth: number;
  nodeHeight: number;
  snapToGrid: boolean;
  addNodeHandler: (xDirection: number, originNode: any) => void;
  onPortDragStart: (nodeId: string, port: 'left' | 'right', clientX: number, clientY: number) => void;
}

const DRAG_THRESHOLD = 5;

export default function EventNode({
  node, zoom, updateNodePosition, gridSize, nodeWidth, nodeHeight,
  snapToGrid, addNodeHandler, onPortDragStart
}: EventNodeProps) {

  const [showPorts, setShowPorts] = useState(false);

  const handlePointerDown = (e: React.PointerEvent) => {
    e.stopPropagation();

    const startX = e.clientX;
    const startY = e.clientY;
    const initialNodeX = node.position.x;
    const initialNodeY = node.position.y;

    const handlePointerMove = (moveEvent: PointerEvent) => {
      const deltaX = (moveEvent.clientX - startX) / zoom;
      const deltaY = (moveEvent.clientY - startY) / zoom;
      const rawX = initialNodeX + deltaX;
      const rawY = initialNodeY + deltaY;
      const snappedX = snapToGrid ? Math.round(rawX / gridSize) * gridSize : rawX;
      const snappedY = snapToGrid ? Math.round(rawY / gridSize) * gridSize : rawY;
      updateNodePosition(node.id, snappedX, snappedY);
    };

    const handlePointerUp = () => {
      document.removeEventListener('pointermove', handlePointerMove);
      document.removeEventListener('pointerup', handlePointerUp);
    };

    document.addEventListener('pointermove', handlePointerMove);
    document.addEventListener('pointerup', handlePointerUp);
  };

  const handlePortPointerDown = (port: 'left' | 'right', e: React.PointerEvent) => {
    e.stopPropagation();

    const startX = e.clientX;
    const startY = e.clientY;
    let dragCommitted = false;

    const handleMove = (moveEvent: PointerEvent) => {
      if (dragCommitted) return;
      const dx = moveEvent.clientX - startX;
      const dy = moveEvent.clientY - startY;
      if (Math.sqrt(dx * dx + dy * dy) > DRAG_THRESHOLD) {
        dragCommitted = true;
        onPortDragStart(node.id, port, moveEvent.clientX, moveEvent.clientY);
        cleanup();
      }
    };

    const handleUp = () => {
      if (!dragCommitted) {
        if (port === 'right') addNodeHandler(1, node);
        else addNodeHandler(-1, node);
      }
      cleanup();
    };

    const cleanup = () => {
      document.removeEventListener('pointermove', handleMove);
      document.removeEventListener('pointerup', handleUp);
    };

    document.addEventListener('pointermove', handleMove);
    document.addEventListener('pointerup', handleUp);
  };

  return (
    <div
      onPointerDown={handlePointerDown}
      onPointerEnter={() => setShowPorts(true)}
      onPointerLeave={() => setShowPorts(false)}
      style={{
        position: 'absolute',
        transform: `translate(${node.position.x}px, ${node.position.y}px)`,
        width: `${nodeWidth}px`,
        height: `${nodeHeight}px`,
        overflow: 'visible',
      }}
      className="cursor-grab active:cursor-grabbing select-none"
    >
      <div className="w-full h-full bg-white border-2 border-slate-300 rounded-lg shadow-md p-4 flex items-center justify-center">
        <span className="font-semibold text-slate-700">
          {node.data.text}
        </span>
      </div>

      {/* Left port */}
      <div
        data-node-id={node.id}
        data-port="left"
        onPointerDown={(e) => handlePortPointerDown('left', e)}
        hidden={!showPorts}
        className="cursor-crosshair z-10 flex justify-center items-center absolute -left-2.5 top-1/2 -translate-y-1/2 w-5 h-5 bg-amber-50 rounded-full border border-slate-300 shadow-sm hover:bg-amber-200 hover:border-amber-400 transition-colors"
      >
        <span className="text-gray-950 leading-none mb-0.5 pointer-events-none">+</span>
      </div>

      {/* Right port */}
      <div
        data-node-id={node.id}
        data-port="right"
        onPointerDown={(e) => handlePortPointerDown('right', e)}
        hidden={!showPorts}
        className="cursor-crosshair z-10 flex justify-center items-center absolute -right-2.5 top-1/2 -translate-y-1/2 w-5 h-5 bg-amber-50 rounded-full border border-slate-300 shadow-sm hover:bg-amber-200 hover:border-amber-400 transition-colors"
      >
        <span className="text-gray-950 leading-none mb-0.5 pointer-events-none">+</span>
      </div>
    </div>
  );
}