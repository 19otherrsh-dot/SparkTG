import React, { memo } from 'react';
import { Handle, Position } from 'reactflow';
import { Keyboard } from 'lucide-react';
import './nodes.css';

export const CollectInputNode = memo(({ data }: any) => {
  return (
    <div className="custom-node collect-input-node">
      <Handle type="target" position={Position.Top} className="node-handle" />
      <div className="node-header bg-warning-light text-warning-600">
        <Keyboard size={16} />
        <span className="node-title">Collect Input</span>
      </div>
      <div className="node-content">
        <div className="node-label">Save Variable</div>
        <div className="node-value">{data.variableName || 'user_dtmf'}</div>
        <div className="node-label mt-2">Max Digits: {data.maxDigits || 1}</div>
      </div>
      <Handle type="source" position={Position.Bottom} className="node-handle" />
    </div>
  );
});
