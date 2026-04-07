'use client';

import { useUIStore } from '@/store/uiStore';
import { useState, useCallback, useEffect, useRef } from 'react';
import Edge from './Edge';
import EventNode, { Node } from './EventNode';

interface EditorCanvasProps {
    initialNodes: any;
    initialEdges: any;
    snapToGrid: boolean;
    gridColor: string;
    canvasColor: string;
}

interface PendingEdge {
    sourceId: string;
    sourcePort: 'left' | 'right';
    currentX: number; 
    currentY: number;
    snapTargetId: string | null; 
    snapTargetPort: 'left' | 'right' | null;
}

export default function EditorCanvas({ initialNodes, initialEdges, snapToGrid, gridColor, canvasColor }: EditorCanvasProps) {

    const [nodeCount, setNodeCount] = useState(initialNodes.length);
    const [edgeCount, setEdgeCount] = useState(initialEdges.length);
    const edgeCountRef = useRef(edgeCount);
    useEffect(() => { edgeCountRef.current = edgeCount; }, [edgeCount]);

    const [transform, setTransform] = useState({ x: 0, y: 0, zoom: 1 });
    const transformRef = useRef(transform);
    useEffect(() => { transformRef.current = transform; }, [transform]);

    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (containerRef.current) {
            const { width, height } = containerRef.current.getBoundingClientRect();
            setTransform({ x: width / 2, y: height / 2, zoom: 1 });
        }
    }, []);

    const [isDragging, setIsDragging] = useState(false);
    const [nodes, setNodes] = useState(initialNodes);
    const [edges, setEdges] = useState(initialEdges);
    const [pendingEdge, setPendingEdge] = useState<PendingEdge | null>(null);
    const pendingEdgeRef = useRef(pendingEdge);
    useEffect(() => { pendingEdgeRef.current = pendingEdge; }, [pendingEdge]);

    const GRID_SIZE = 30;
    const NODE_WIDTH = GRID_SIZE * 6;   // 180px
    const NODE_HEIGHT = GRID_SIZE * 3;  // 90px

    const screenToCanvas = useCallback((screenX: number, screenY: number) => {
        const rect = containerRef.current!.getBoundingClientRect();
        const t = transformRef.current;
        return {
            x: (screenX - rect.left - t.x) / t.zoom,
            y: (screenY - rect.top - t.y) / t.zoom,
        };
    }, []);

    const portUnderPoint = (clientX: number, clientY: number): HTMLElement | null => {
        const el = document.elementFromPoint(clientX, clientY);
        if (!el) return null;
        // The port div itself or a child of it
        const port = (el as HTMLElement).closest('[data-port]') as HTMLElement | null;
        return port;
    };

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

    const addNode = (xDirection: number, originNode: Node) => {
        const distance = (NODE_WIDTH + 5 * GRID_SIZE) * xDirection;

        const newNode = {
            id: 'node-' + (nodeCount + 1),
            position: { x: originNode.position.x + distance, y: originNode.position.y },
            data: { text: 'New Event' }
        };

        setNodes((prev: any) => [...prev, newNode]);
        setNodeCount((c: number) => c + 1);

        const newEdge = {
            id: 'edge-' + (edgeCountRef.current + 1),
            source: originNode.id,
            target: newNode.id,
        };

        setEdges((prev: any) => [...prev, newEdge]);
        setEdgeCount((c: number) => c + 1);
    };

    const handlePortDragStart = useCallback((
        nodeId: string,
        port: 'left' | 'right',
        clientX: number,
        clientY: number
    ) => {
        const canvasPos = screenToCanvas(clientX, clientY);

        setPendingEdge({
            sourceId: nodeId,
            sourcePort: port,
            currentX: canvasPos.x,
            currentY: canvasPos.y,
            snapTargetId: null,
            snapTargetPort: null,
        });

        const handleMove = (moveEvent: PointerEvent) => {
            const c = screenToCanvas(moveEvent.clientX, moveEvent.clientY);
            const portEl = portUnderPoint(moveEvent.clientX, moveEvent.clientY);
            const hoveredNodeId = portEl?.getAttribute('data-node-id') ?? null;
            const hoveredPort = (portEl?.getAttribute('data-port') ?? null) as 'left' | 'right' | null;

            setPendingEdge(prev => prev ? {
                ...prev,
                currentX: c.x,
                currentY: c.y,
                snapTargetId: hoveredNodeId !== prev.sourceId ? hoveredNodeId : null,
                snapTargetPort: hoveredNodeId !== prev.sourceId ? hoveredPort : null,
            } : null);
        };

        const handleUp = (upEvent: PointerEvent) => {
            document.removeEventListener('pointermove', handleMove);
            document.removeEventListener('pointerup', handleUp);

            const pe = pendingEdgeRef.current;
            if (!pe) return;

            const portEl = portUnderPoint(upEvent.clientX, upEvent.clientY);
            const targetNodeId = portEl?.getAttribute('data-node-id') ?? null;

            if (targetNodeId && targetNodeId !== pe.sourceId) {
                // Determine edge direction: right-port is "out", left-port is "in"
                // Always store as source→target (left-to-right = outgoing→incoming)
                const sourceIsDragger = pe.sourcePort === 'right';
                const newEdge = {
                    id: 'edge-' + (edgeCountRef.current + 1),
                    source: sourceIsDragger ? pe.sourceId : targetNodeId,
                    target: sourceIsDragger ? targetNodeId : pe.sourceId,
                };
                setEdges((prev: any) => [...prev, newEdge]);
                setEdgeCount((c: number) => c + 1);
            }

            setPendingEdge(null);
        };

        document.addEventListener('pointermove', handleMove);
        document.addEventListener('pointerup', handleUp);
    }, [screenToCanvas]);

    const scaledGridSize = GRID_SIZE * transform.zoom;

    const getPendingEdgeGeometry = () => {
        if (!pendingEdge) return null;
        const sourceNode = nodes.find((n: any) => n.id === pendingEdge.sourceId);
        if (!sourceNode) return null;

        const startX = pendingEdge.sourcePort === 'right'
            ? sourceNode.position.x + NODE_WIDTH
            : sourceNode.position.x;
        const startY = sourceNode.position.y + NODE_HEIGHT / 2;

        // Snap endpoint to target port if hovering over one
        let endX = pendingEdge.currentX;
        let endY = pendingEdge.currentY;
        if (pendingEdge.snapTargetId && pendingEdge.snapTargetPort) {
            const targetNode = nodes.find((n: any) => n.id === pendingEdge.snapTargetId);
            if (targetNode) {
                endX = pendingEdge.snapTargetPort === 'right'
                    ? targetNode.position.x + NODE_WIDTH
                    : targetNode.position.x;
                endY = targetNode.position.y + NODE_HEIGHT / 2;
            }
        }

        return { startX, startY, endX, endY };
    };

    const pendingGeo = getPendingEdgeGeometry();

    return (
        <div
            ref={containerRef}
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
                // Show crosshair while drawing an edge
                cursor: pendingEdge ? 'crosshair' : undefined,
            }}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerCancel={handlePointerUp}
            onWheel={handleWheel}
        >
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
                    {/* Committed edges */}
                    {edges.map((edge: any) => {
                        const sourceNode = nodes.find((n: any) => n.id === edge.source);
                        const targetNode = nodes.find((n: any) => n.id === edge.target);
                        if (!sourceNode || !targetNode) return null;

                        const startX = sourceNode.position.x + NODE_WIDTH;
                        const startY = sourceNode.position.y + NODE_HEIGHT / 2;
                        const endX = targetNode.position.x;
                        const endY = targetNode.position.y + NODE_HEIGHT / 2;

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

                    {pendingGeo && (
                        <Edge
                            startX={pendingGeo.startX}
                            startY={pendingGeo.startY}
                            endX={pendingGeo.endX}
                            endY={pendingGeo.endY}
                            preview
                        />
                    )}
                </g>
            </svg>

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
                            snapToGrid={snapToGrid}
                            addNodeHandler={addNode}
                            onPortDragStart={handlePortDragStart}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
}