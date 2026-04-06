'use client';

import { useUIStore } from '@/store/uiStore';
import { useState, useCallback } from 'react';
import Edge from './Edge';
import EventNode from './EventNode';

interface EditorCanvasProps {

    initialNodes: any,
    initialEdges: any

}

export default function EditorCanvas({ initialNodes, initialEdges }: EditorCanvasProps) {


    const [transform, setTransform] = useState({ x: 0, y: 0, zoom: 1 });
    const [isDragging, setIsDragging] = useState(false);

    const { gridColor, canvasColor } = useUIStore();

    // Track nodes in local state so they can be moved
    const [nodes, setNodes] = useState(initialNodes);
    const [edges, setEdges] = useState(initialEdges);

    // Configuration for the grid
    const GRID_SIZE = 30;

    const NODE_WIDTH = GRID_SIZE * 6;  // 25 * 6 = 150px
    const NODE_HEIGHT = GRID_SIZE * 3; // 25 * 3 = 75px

    

    const updateNodePosition = useCallback((id: string, x: number, y: number) => {
        setNodes((prevNodes: any) =>
            prevNodes.map((node: any) =>
                node.id === id ? { ...node, position: { x, y } } : node
            )
        );
    }, []);

    const handlePointerDown = useCallback((e: any) => {
        // Left click (0) or Middle click (1) to pan
        if (e.button === 0 || e.button === 1) {
            setIsDragging(true);
            // Capture the pointer to keep tracking if the mouse leaves the window bounds
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
            className={`w-full h-screen overflow-hidden ${isDragging ? 'cursor-grabbing' : 'cursor-grab'
                }`}
            style={{
                // touchAction: 'none' is crucial to prevent trackpad gestures 
                // from navigating back/forward or zooming the whole browser tab.
                touchAction: 'none',
                backgroundColor: canvasColor,
                // The CSS grid pattern
                backgroundImage: `linear-gradient(to right, ` + gridColor + ` 1px, transparent 1px),linear-gradient(to bottom,  ` + gridColor + ` 1px, transparent 1px)`,
                // Scale the grid pattern with the zoom state
                backgroundSize: `${scaledGridSize}px ${scaledGridSize}px`,
                // Move the grid pattern with the pan (x, y) state
                backgroundPosition: `${transform.x}px ${transform.y}px`,
            }}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerCancel={handlePointerUp} // Handle cases where dragging is interrupted
            onWheel={handleWheel}>
            <div
                className="absolute top-0 left-0 w-full h-full pointer-events-none"
                style={{
                    transform: `translate(${transform.x}px, ${transform.y}px) scale(${transform.zoom})`,
                    transformOrigin: '0 0',
                }}>
                {/* 1. SVG Layer for Edges (Bottom Layer) */}
                {/* overflow-visible is needed so thick strokes at the edge of the screen aren't cut off */}
                <svg className="absolute top-0 left-0 w-full h-full overflow-visible">
                    {edges.map((edge:any) => {
                        const sourceNode = nodes.find((n:any) => n.id === edge.source);
                        const targetNode = nodes.find((n:any) => n.id === edge.target);

                        if (!sourceNode || !targetNode) return null;

                        // Dynamic Port Math:
                        // Right side of the source node
                        const startX = sourceNode.position.x + NODE_WIDTH;
                        // Exact vertical center of the source node
                        const startY = sourceNode.position.y + (NODE_HEIGHT / 2);

                        // Left side of the target node
                        const endX = targetNode.position.x;
                        // Exact vertical center of the target node
                        const endY = targetNode.position.y + (NODE_HEIGHT / 2);

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
                </svg>

                {/* 2. HTML Layer for Nodes (Top Layer) */}
                {/* Enable pointer events again since the wrapper disabled them */}
                <div className="absolute top-0 left-0 w-full h-full pointer-events-auto">
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