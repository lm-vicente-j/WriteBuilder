'use client';

import { useUIStore } from '@/store/uiStore';
import { useState, useCallback } from 'react';

export default function EditorCanvas() {
  const [transform, setTransform] = useState({ x: 0, y: 0, zoom: 1 });
  const [isDragging, setIsDragging] = useState(false);

  const {gridColor, canvasColor} = useUIStore();

  // Configuration for the grid
  const GRID_SIZE = 30;

  const handlePointerDown = useCallback((e:any) => {
    // Left click (0) or Middle click (1) to pan
    if (e.button === 0 || e.button === 1) {
      setIsDragging(true);
      // Capture the pointer to keep tracking if the mouse leaves the window bounds
      e.currentTarget.setPointerCapture(e.pointerId); 
    }
  }, []);

  const handlePointerMove = useCallback((e:any) => {
    if (!isDragging) return;
    
    setTransform((prev) => ({
      ...prev,
      x: prev.x + e.movementX,
      y: prev.y + e.movementY,
    }));
  }, [isDragging]);

  const handlePointerUp = useCallback((e:any) => {
    setIsDragging(false);
    e.currentTarget.releasePointerCapture(e.pointerId);
  }, []);

  const handleWheel = useCallback((e:any) => {
    // Prevent the browser from scrolling the page
    e.preventDefault(); 
    
    setTransform((prev) => {
      // Zoom sensitivity factor
      const zoomSensitivity = 0.001; 
      const delta = -e.deltaY * zoomSensitivity;
      
      // Clamp the zoom level between 0.1x and 3x
      const newZoom = Math.min(Math.max(0.1, prev.zoom + delta), 3);
      
      return { ...prev, zoom: newZoom };
    });
  }, []);

  // Calculate dynamic sizes based on the current zoom level
  const scaledGridSize = GRID_SIZE * transform.zoom;

  return (
    <div
      className={`w-full h-screen overflow-hidden ${
        isDragging ? 'cursor-grabbing' : 'cursor-grab'
      }`}
      style={{
        // touchAction: 'none' is crucial to prevent trackpad gestures 
        // from navigating back/forward or zooming the whole browser tab.
        touchAction: 'none',
        backgroundColor: canvasColor,
        // The CSS dot pattern
        backgroundImage: `linear-gradient(to right, ` + gridColor + ` 1px, transparent 1px),
          linear-gradient(to bottom,  ` + gridColor + ` 1px, transparent 1px)`,
        // Scale the grid pattern with the zoom state
        backgroundSize: `${scaledGridSize}px ${scaledGridSize}px`,
        // Move the grid pattern with the pan (x, y) state
        backgroundPosition: `${transform.x}px ${transform.y}px`,
      }}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp} // Handle cases where dragging is interrupted
      // In React, onWheel is passive by default. For strict preventDefault, 
      // you might need a ref and addEventListener, but standard React onWheel 
      // combined with touchAction: 'none' usually works for node editors.
      onWheel={handleWheel}
    >
      {/* The Transform Layer: 
        Later, we will place the nodes and edges inside this inner div. 
        It scales and translates to match the background grid exactly.
      */}
      <div
        className="absolute top-0 left-0 w-full h-full pointer-events-none"
        style={{
          transform: `translate(${transform.x}px, ${transform.y}px) scale(${transform.zoom})`,
          transformOrigin: '0 0',
        }}
      >
        {/* Nodes and Edges will be rendered here */}
      </div>
    </div>
  );
}