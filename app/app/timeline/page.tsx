"use client";
import { useState, useCallback } from 'react';
import { useUIStore } from '@/store/uiStore';
import EditorCanvas from '@/components/EditorCanvas';

export default function TimeLine() {

  const nodes = [
    {
      id: 'node-1',
      position: { x: 100, y: 100 },
      data: { text: 'Input Node' }
    },
    {
      id: 'node-2',
      position: { x: 400, y: 150 },
      data: { text: 'Output Node' }
    }
  ];

  const edges = [
    {
      id: 'edge-1',
      source: 'node-1', // ID of the starting node
      target: 'node-2'  // ID of the ending node
    }
  ];

  return (
    <div className="flex flex-col flex-1 items-center justify-center font-sans ">
      <main className="flex flex-1 w-full bg-black">


        <div style={{ width: '100vw', height: '100vh' }}>
          <EditorCanvas nodes={nodes} edges={edges} />
        </div>
      </main>
    </div>
  );
}
