import React, { memo } from 'react';
import { Handle, Position } from 'reactflow';
import { GitBranch } from 'lucide-react';
import './nodes.css';

export const BranchNode = memo(({ data }: any) => {
  return (
    <div className="custom-node branch-node">
      <Handle type="target" position={Position.Top} className="node-handle" />
      <div className="node-header bg-success-light text-success-600">
        <GitBranch size={16} />
        <span className="node-title">Branch</span>
      </div>
      <div className="node-content">
        <div className="node-label">Condition on</div>
        <div className="node-value">{data.variableName || 'user_dtmf'}</div>
      </div>
      <Handle type="source" position={Position.Bottom} id="1" style={{ left: '25%' }} className="node-handle" />
      <div className="handle-label" style={{ left: '25%', bottom: '-20px', position: 'absolute', fontSize: '10px' }}>1</div>
      
      <Handle type="source" position={Position.Bottom} id="2" style={{ left: '50%' }} className="node-handle" />
      <div className="handle-label" style={{ left: '50%', bottom: '-20px', position: 'absolute', fontSize: '10px' }}>2</div>
      
      <Handle type="source" position={Position.Bottom} id="default" style={{ left: '75%' }} className="node-handle" />
      <div className="handle-label" style={{ left: '75%', bottom: '-20px', position: 'absolute', fontSize: '10px' }}>*</div>
    </div>
  );
});
