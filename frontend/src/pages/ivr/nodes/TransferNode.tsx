import React, { memo } from 'react';
import { Handle, Position } from 'reactflow';
import { PhoneForwarded } from 'lucide-react';
import './nodes.css';

export const TransferNode = memo(({ data }: any) => {
  return (
    <div className="custom-node transfer-node">
      <Handle type="target" position={Position.Top} className="node-handle" />
      <div className="node-header bg-primary-light text-primary-600">
        <PhoneForwarded size={16} />
        <span className="node-title">Transfer</span>
      </div>
      <div className="node-content">
        <div className="node-label">Destination</div>
        <div className="node-value">{data.destination || 'queue:sales'}</div>
      </div>
      <Handle type="source" position={Position.Bottom} className="node-handle" />
    </div>
  );
});
