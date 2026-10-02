import React, { memo } from 'react';
import { Handle, Position } from 'reactflow';
import { Play } from 'lucide-react';
import './nodes.css';

export const PlayPromptNode = memo(({ data }: any) => {
  return (
    <div className="custom-node play-prompt-node">
      <Handle type="target" position={Position.Top} className="node-handle" />
      <div className="node-header bg-primary-light text-primary-600">
        <Play size={16} />
        <span className="node-title">Play Prompt</span>
      </div>
      <div className="node-content">
        <div className="node-label">Prompt Name</div>
        <div className="node-value">{data.promptName || 'greeting_msg'}</div>
      </div>
      <Handle type="source" position={Position.Bottom} className="node-handle" />
    </div>
  );
});
