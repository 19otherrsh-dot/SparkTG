import React, { memo } from 'react';
import { Handle, Position } from 'reactflow';
import { Webhook } from 'lucide-react';
import './nodes.css';

export const HttpNode = memo(({ data }: any) => {
  return (
    <div className="custom-node http-node">
      <Handle type="target" position={Position.Top} className="node-handle" />
      <div className="node-header bg-warning-light text-warning-600">
        <Webhook size={16} />
        <span className="node-title">HTTP Request</span>
      </div>
      <div className="node-content">
        <div className="node-label">Method</div>
        <div className="node-value">{data.method || 'GET'}</div>
        <div className="node-label mt-2">URL</div>
        <div className="node-value" style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{data.url || 'https://api...'}</div>
      </div>
      <Handle type="source" position={Position.Bottom} id="success" style={{ left: '30%' }} className="node-handle" />
      <div className="handle-label" style={{ left: '30%', bottom: '-20px', position: 'absolute', fontSize: '10px' }}>Ok</div>
      
      <Handle type="source" position={Position.Bottom} id="failure" style={{ left: '70%' }} className="node-handle" />
      <div className="handle-label" style={{ left: '70%', bottom: '-20px', position: 'absolute', fontSize: '10px' }}>Err</div>
    </div>
  );
});
