"use client";
import { useState, useCallback } from 'react';
import { useUIStore } from '@/store/uiStore';
import EventNode from "@/components/EventNode";
import { useMemo } from 'react';

const nodeTypes = { custom: EventNode };


import {
  ReactFlow,
  applyNodeChanges,
  applyEdgeChanges,
  addEdge,
  Background,
  BackgroundVariant,
  Position
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';

const initialNodes = [
  {
    id: 'n1',
    type: "custom",
    position: { x: 0, y: 0 },
    data: { label: 'Node 1' },
    sourcePosition: Position.Right,  
    targetPosition: Position.Left,   
    style: 
    { 
      width: 100, 
      height: 25,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    },
  },
  {
    id: 'n2',
    position: { x: 300, y: 0 },       
    data: { label: 'Node 2' },
    sourcePosition: Position.Right,
    targetPosition: Position.Left,
    type: "custom",

    style: 
    { 
      width: 100, 
      height: 25,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    },
  },
];

const initialEdges = [{ id: 'n1-n2', source: 'n1', target: 'n2' }];


export default function() {


  const {

    snapToGrid,
  } = useUIStore();

  const [nodes, setNodes] = useState(initialNodes);
  const [edges, setEdges] = useState(initialEdges);

  const onNodesChange = useCallback(
    (changes: any) => setNodes((nodesSnapshot) => applyNodeChanges(changes, nodesSnapshot)),
    [],
  );
  const onEdgesChange = useCallback(
    (changes: any) => setEdges((edgesSnapshot) => applyEdgeChanges(changes, edgesSnapshot)),
    [],
  );
  const onConnect = useCallback(
    (params: any) => setEdges((edgesSnapshot) => addEdge(params, edgesSnapshot)),
    [],
  );
  return (
    <div className="flex flex-col flex-1 items-center justify-center font-sans ">
      <main className="flex flex-1 w-full bg-black">


        <div style={{ width: '100vw', height: '100vh' }}>
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            fitView
            nodeTypes={nodeTypes} 
            snapGrid={[25,25]}
            
            snapToGrid={snapToGrid}
            proOptions={{ hideAttribution: true }}
          >
            <Background 
              color="#707070" 
              variant={BackgroundVariant.Lines} 
              gap={25} 
              size={1} 
              style={{
                maskImage: 'radial-gradient(ellipse at center, #000 10%, transparent 100%)',
                WebkitMaskImage: 'radial-gradient(ellipse at center, #000 10%, transparent 100%)',
              }}
            />
          </ReactFlow>
        </div>
      </main>
    </div>
  );
}
