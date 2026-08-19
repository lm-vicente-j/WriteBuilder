"use client";
import { useUIStore } from '@/store/uiStore';
import EditorCanvas from '@/components/EditorCanvas';

export default function TimeLine() {
  const { gridColor, canvasColor, snapToGrid } = useUIStore();

  const nodes = [
    {
      id: 'node-1',
      position: { x: -360, y: -90 },
      data: { text: 'Input Node' }
    },
    {
      id: 'node-2',
      position: { x: 150, y: -90 },
      data: { text: 'Output Node' }
    }
  ];

  const edges = [
    {
      id: 'edge-1',
      source: 'node-1',
      target: 'node-2'
    }
  ];

  return (
    <div className="flex flex-col flex-1 h-full min-h-0">
      <main className="flex-1 w-full min-h-0 relative">
        <div className="absolute inset-0 overflow-hidden">
          <EditorCanvas 
            initialNodes={nodes} 
            initialEdges={edges} 
            snapToGrid={snapToGrid} 
            gridColor={gridColor} 
            canvasColor={canvasColor} 
          />
        </div>
      </main>
    </div>
  );
}