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
  addNodeHandler: (xDirection: number, originNode: any) => void; // -1 left; 1 right
}

export default function EventNode({ node, zoom, updateNodePosition, gridSize, nodeWidth, nodeHeight, snapToGrid, addNodeHandler }: EventNodeProps) {

  const [showPorts, setShowPorts] = useState(false);

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

    const handlePointerUp = () => {
      document.removeEventListener('pointermove', handlePointerMove);
      document.removeEventListener('pointerup', handlePointerUp);
    };

    document.addEventListener('pointermove', handlePointerMove);
    document.addEventListener('pointerup', handlePointerUp);
  };

  const handlePointerEnter = () => {
    setShowPorts(true);
  }

  const handlePointerExit = () => {
    setShowPorts(false);
  }

  const handlePortRightUp =  () =>{
    addNodeHandler(1, node);
  }

  const handlePortLeftUp =  () =>{
    addNodeHandler(-1, node);
  }
  

  return (
    <div
      onPointerDown={handlePointerDown}
      onPointerEnter={handlePointerEnter}
      onPointerLeave={handlePointerExit}
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
          {node.id}
        </span>
      </div>

      <div
      onMouseUp={handlePortLeftUp}

        hidden={!showPorts}
        className="cursor-pointer z-10 flex justify-center items-center absolute -left-2.5 top-1/2 -translate-y-1/2 w-5 h-5 bg-amber-50 rounded-full border border-slate-300 shadow-sm"
      >
        <span className="text-gray-950 leading-none mb-0.5">+</span>
      </div>

      <div
      onMouseUp={handlePortRightUp}
        hidden={!showPorts}
        className="cursor-pointer z-10 flex justify-center items-center absolute -right-2.5 top-1/2 -translate-y-1/2 w-5 h-5 bg-amber-50 rounded-full border border-slate-300 shadow-sm"
      >
        <span className="text-gray-950 leading-none mb-0.5">+</span>
      </div>
    </div>
  );
}