'use client';

import { useUIStore } from '@/store/uiStore';
import { useState, useCallback } from 'react';
import Edge from './Edge';
import EventNode from './EventNode';

interface EditorCanvasProps {
    initialNodes: any;
    initialEdges: any;
}

export default function EditorCanvas({ initialNodes, initialEdges }: EditorCanvasProps) {

    const [transform, setTransform] = useState({ x: 0, y: 0, zoom: 1 });
    const [isDragging, setIsDragging] = useState(false);
    const { gridColor, canvasColor } = useUIStore();

    const [nodes, setNodes] = useState(initialNodes);
    const [edges, setEdges] = useState(initialEdges);

    const GRID_SIZE = 30;
    const NODE_WIDTH  = GRID_SIZE * 6; // 180px
    const NODE_HEIGHT = GRID_SIZE * 3; // 90px

    const updateNodePosition = useCallback((id: string, x: number, y: number) => {
        setNodes((prev: any) =>
            prev.map((node: any) =>
                node.id === id ? { ...node, position: { x, y } } : node
            )
        );
    }, []);

    const handlePointerDown = useCallback((e: any) => {
        if (e.button === 0 || e.button === 1) {
            setIsDragging(true);
            e.currentTarget.setPointerCapture(e.pointerId);
        }
    }, []);

    const handlePointerMove = useCallback((e: any) => {
        if (!isDragging) return;
        setTransform((prev) => ({
            ...prev,
            x: prev.x + e.movementX,
            y: prev.y + e.movementY,
        }));
    }, [isDragging]);

    const handlePointerUp = useCallback((e: any) => {
        setIsDragging(false);
        e.currentTarget.releasePointerCapture(e.pointerId);
    }, []);

    const handleWheel = useCallback((e: any) => {
        e.preventDefault();
        setTransform((prev) => {
            const delta = -e.deltaY * 0.001;
            const newZoom = Math.min(Math.max(0.1, prev.zoom + delta), 3);
            return { ...prev, zoom: newZoom };
        });
    }, []);

    const scaledGridSize = GRID_SIZE * transform.zoom;

    return (
        <div
            className={`${isDragging ? 'cursor-grabbing' : 'cursor-grab'}`}
            style={{
                position: 'relative',
                width: '100%',
                height: '100vh',
                overflow: 'hidden',
                touchAction: 'none',
                backgroundColor: canvasColor,
                backgroundImage:
                    `linear-gradient(to right, ${gridColor} 1px, transparent 1px),` +
                    `linear-gradient(to bottom, ${gridColor} 1px, transparent 1px)`,
                backgroundSize: `${scaledGridSize}px ${scaledGridSize}px`,
                backgroundPosition: `${transform.x}px ${transform.y}px`,
            }}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerCancel={handlePointerUp}
            onWheel={handleWheel}
        >
            {/* LAYER 1: Edges via full-viewport SVG with <g> transform */}
            <svg
                style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    pointerEvents: 'none',
                    overflow: 'visible',
                }}
            >
                <g transform={`translate(${transform.x}, ${transform.y}) scale(${transform.zoom})`}>
                    {edges.map((edge: any) => {
                        const sourceNode = nodes.find((n: any) => n.id === edge.source);
                        const targetNode = nodes.find((n: any) => n.id === edge.target);
                        if (!sourceNode || !targetNode) return null;

                        const startX = sourceNode.position.x + NODE_WIDTH;
                        const startY = sourceNode.position.y + NODE_HEIGHT / 2;
                        const endX   = targetNode.position.x;
                        const endY   = targetNode.position.y + NODE_HEIGHT / 2;

                        return (
                            <Edge
                                key={edge.id}
                                startX={startX}
                                startY={startY}
                                endX={endX}
                                endY={endY}
                            />
                        );
                    })}
                </g>
            </svg>

            {/* LAYER 2: Nodes via 0x0 overflow:visible transform origin div */}
            <div
                style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: 0,
                    height: 0,
                    overflow: 'visible',
                    pointerEvents: 'none',
                    transform: `translate(${transform.x}px, ${transform.y}px) scale(${transform.zoom})`,
                    transformOrigin: '0 0',
                }}
            >
                <div style={{ position: 'absolute', width: 0, height: 0, overflow: 'visible', pointerEvents: 'auto' }}>
                    {nodes.map((node: any) => (
                        <EventNode
                            key={node.id}
                            node={node}
                            zoom={transform.zoom}
                            updateNodePosition={updateNodePosition}
                            gridSize={GRID_SIZE}
                            nodeHeight={NODE_HEIGHT}
                            nodeWidth={NODE_WIDTH}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
}