import { Handle, Position, useReactFlow } from '@xyflow/react';
import { useState } from 'react';

export default function EventNode({ id, data }: { id: string; data: any }) {
  const { addNodes, addEdges, getNode } = useReactFlow();
  const [showAdd, setShowAdd] = useState(false);

  const handleAddNode = (direction: 'left' | 'right') => {
    const current = getNode(id);
    const newId = `n${Date.now()}`;
    const offset = direction === 'right' ? 250 : -250;

    addNodes({
      id: newId,
      type: 'custom',
      position: {
        x: (current?.position.x ?? 0) + offset,
        y: current?.position.y ?? 0,
      },
      data: { label: 'New Node' },
    });

    addEdges({
      id: direction === 'right' ? `${id}-${newId}` : `${newId}-${id}`,
      source: direction === 'right' ? id : newId,
      target: direction === 'right' ? newId : id,
    });
  };

  return (
    <div
      onMouseEnter={() => setShowAdd(true)}
      onMouseLeave={() => setShowAdd(false)}
      style={{
        width: 100,
        height: 25,
        background: '#fff',
        border: '1px solid #ccc',
        borderRadius: 3,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
      }}
    >
      <Handle
        type="target"
        position={Position.Left}
        style={{ width: 1, height: 1, background: 'transparent', border: 'none' }}
      />

      {showAdd && (
        <div
          onClick={(e) => { e.stopPropagation(); handleAddNode('left'); }}
          style={{
            position: 'absolute',
            left: -10,
            width: 12,
            height: 12,
            borderRadius: '50%',
            background: '#fff',
            border: '1px solid #999',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 10,
            cursor: 'pointer',
            zIndex: 10,
          }}
        >
          +
        </div>
      )}

      <span style={{ fontSize: 11 }}>{data.label}</span>

      <Handle
        type="source"
        position={Position.Right}
        style={{ width: 1, height: 1, background: 'transparent', border: 'none' }}
      />

      {showAdd && (
        <div
          onClick={(e) => { e.stopPropagation(); handleAddNode('right'); }}
          style={{
            position: 'absolute',
            right: -10,
            width: 12,
            height: 12,
            borderRadius: '50%',
            background: '#fff',
            border: '1px solid #999',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 10,
            cursor: 'pointer',
            zIndex: 10,
          }}
        >
          +
        </div>
      )}
    </div>
  );
}