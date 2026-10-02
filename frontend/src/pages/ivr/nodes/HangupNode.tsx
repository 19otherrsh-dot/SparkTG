import React, { memo } from 'react';
import { Handle, Position } from 'reactflow';
import { PhoneOff } from 'lucide-react';
import './nodes.css';

export const HangupNode = memo(({ data }: any) => {
  return (
    <div className="custom-node hangup-node">
      <Handle type="target" position={Position.Top} className="node-handle" />
      <div className="node-header bg-danger-light text-danger-600">
        <PhoneOff size={16} />
        <span className="node-title">Hangup</span>
      </div>
      <div className="node-content">
        <div className="node-label">Reason</div>
        <div className="node-value">{data.reason || 'Normal Clearing'}</div>
      </div>
    </div>
  );
});
