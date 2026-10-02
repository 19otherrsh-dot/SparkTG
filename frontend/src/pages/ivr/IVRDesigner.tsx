import React, { useState, useCallback, useRef, useEffect } from 'react';
import ReactFlow, {
  ReactFlowProvider,
  addEdge,
  useNodesState,
  useEdgesState,
  Controls,
  Background,
} from 'reactflow';
import type { Connection, Edge } from 'reactflow';
import 'reactflow/dist/style.css';
import { useAuth } from '../contexts/AuthContext';
import { PlayPromptNode } from './nodes/PlayPromptNode';
import { CollectInputNode } from './nodes/CollectInputNode';
import { BranchNode } from './nodes/BranchNode';
import { TransferNode } from './nodes/TransferNode';
import { HttpNode } from './nodes/HttpNode';
import { HangupNode } from './nodes/HangupNode';
import { Play, Keyboard, GitBranch, Save, RefreshCcw, PhoneForwarded, Webhook, PhoneOff } from 'lucide-react';
import { IVRSimulator } from './IVRSimulator';
import './IVRDesigner.css';

const nodeTypes = {
  playPrompt: PlayPromptNode,
  collectInput: CollectInputNode,
  branch: BranchNode,
  transfer: TransferNode,
  httpRequest: HttpNode,
  hangup: HangupNode,
};

const initialNodes = [
  { id: '1', type: 'playPrompt', data: { promptName: 'welcome_greeting' }, position: { x: 250, y: 50 } },
  { id: '2', type: 'collectInput', data: { variableName: 'dtmf', maxDigits: 1 }, position: { x: 250, y: 150 } },
  { id: '3', type: 'branch', data: { variableName: 'dtmf' }, position: { x: 250, y: 300 } },
  { id: '4', type: 'transfer', data: { destination: 'Sales Queue' }, position: { x: 100, y: 450 } },
  { id: '5', type: 'hangup', data: { reason: 'Normal Clearing' }, position: { x: 400, y: 450 } },
];

const initialEdges = [
  { id: 'e1-2', source: '1', target: '2' },
  { id: 'e2-3', source: '2', target: '3' },
  { id: 'e3-4', source: '3', target: '4', sourceHandle: '1' },
  { id: 'e3-5', source: '3', target: '5', sourceHandle: 'default' },
];

let id = 10;
const getId = () => `dndnode_${id++}`;

export const IVRDesigner: React.FC = () => {
  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [reactFlowInstance, setReactFlowInstance] = useState<any>(null);
  const [selectedNode, setSelectedNode] = useState<any>(null);
  const [currentFlowId, setCurrentFlowId] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [showSimulator, setShowSimulator] = useState(false);

  useEffect(() => {
    apiFetch('http://localhost:3001/api/ivr/flows')
      .then(res => res.json())
      .then(flows => {
        if (flows.length > 0) {
          const flow = flows[0];
          setCurrentFlowId(flow.id);
          try {
            if (flow.nodes) setNodes(JSON.parse(flow.nodes));
            if (flow.edges) setEdges(JSON.parse(flow.edges));
          } catch(e) {}
        }
      })
      .catch(err => console.error("Failed to fetch flows", err));
  }, [setNodes, setEdges]);

  const onSave = async () => {
    setIsSaving(true);
    const flowData = {
      name: 'Agent Flow v1',
      nodes,
      edges
    };
    
    try {
      const url = currentFlowId 
        ? `http://localhost:3001/api/ivr/flows/${currentFlowId}` 
        : 'http://localhost:3001/api/ivr/flows';
        
      const res = await apiFetch(url, {
        method: currentFlowId ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(flowData)
      });
      const savedFlow = await res.json();
      setCurrentFlowId(savedFlow.id);
      alert('Workflow saved successfully!');
    } catch (err) {
      console.error(err);
      alert('Failed to save workflow');
    } finally {
      setIsSaving(false);
    }
  };

  const onNodeClick = useCallback((event: React.MouseEvent, node: any) => {
    setSelectedNode(node);
  }, []);

  const onPaneClick = useCallback(() => {
    setSelectedNode(null);
  }, []);

  const updateNodeData = (id: string, dataObj: any) => {
    setNodes((nds) =>
      nds.map((n) => {
        if (n.id === id) {
          n.data = { ...n.data, ...dataObj };
        }
        return n;
      })
    );
    setSelectedNode((prev: any) => {
      if (prev && prev.id === id) {
        return { ...prev, data: { ...prev.data, ...dataObj } };
      }
      return prev;
    });
  };

  const onConnect = useCallback(
    (params: Connection | Edge) => setEdges((eds) => addEdge(params, eds)),
    []
  );

  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const onDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();

      const type = event.dataTransfer.getData('application/reactflow');

      if (typeof type === 'undefined' || !type) {
        return;
      }

      const position = reactFlowInstance.screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      });
      const newNode = {
        id: getId(),
        type,
        position,
        data: { label: `${type} node` },
      };

      setNodes((nds) => nds.concat(newNode));
    },
    [reactFlowInstance, setNodes]
  );

  const onDragStart = (event: React.DragEvent, nodeType: string) => {
    event.dataTransfer.setData('application/reactflow', nodeType);
    event.dataTransfer.effectAllowed = 'move';
  };

  return (
    <div className="ivr-designer animate-fade-in">
      <div className="page-header">
        <div>
          <h1 className="page-title">IVR Designer</h1>
          <p className="page-subtitle">Drag and drop nodes to build your call flow</p>
        </div>
        <div className="header-actions">
          <button className="btn bg-bg-hover text-text-primary" onClick={() => setShowSimulator(true)}>
            <RefreshCcw size={16} /> Test Flow
          </button>
          <button className="btn btn-primary" onClick={onSave} disabled={isSaving}>
            <Save size={16} /> {isSaving ? 'Saving...' : 'Save Workflow'}
          </button>
        </div>
      </div>

      <div className="designer-container glass">
        <div className="designer-sidebar">
          <h3 className="sidebar-title">Nodes</h3>
          <div className="node-palette">
            <div
              className="palette-item play"
              onDragStart={(event) => onDragStart(event, 'playPrompt')}
              draggable
            >
              <Play size={18} /> Play Prompt
            </div>
            <div
              className="palette-item collect"
              onDragStart={(event) => onDragStart(event, 'collectInput')}
              draggable
            >
              <Keyboard size={18} /> Collect Input
            </div>
            <div
              className="palette-item branch"
              onDragStart={(event) => onDragStart(event, 'branch')}
              draggable
            >
              <GitBranch size={18} /> Branch
            </div>
            <div
              className="palette-item transfer"
              onDragStart={(event) => onDragStart(event, 'transfer')}
              draggable
            >
              <PhoneForwarded size={18} /> Transfer Call
            </div>
            <div
              className="palette-item http"
              onDragStart={(event) => onDragStart(event, 'httpRequest')}
              draggable
            >
              <Webhook size={18} /> HTTP Request
            </div>
            <div
              className="palette-item hangup"
              onDragStart={(event) => onDragStart(event, 'hangup')}
              draggable
            >
              <PhoneOff size={18} /> Hangup
            </div>
          </div>
          
          <div className="properties-panel mt-8">
            <h3 className="sidebar-title">Properties</h3>
            {!selectedNode ? (
              <p className="text-sm text-muted">Select a node to edit its properties.</p>
            ) : (
              <div className="properties-form animate-fade-in">
                {selectedNode.type === 'playPrompt' && (
                  <div className="form-group">
                    <label>Prompt Name</label>
                    <input 
                      type="text" 
                      className="text-input full-width" 
                      value={selectedNode.data.promptName || ''}
                      onChange={(e) => updateNodeData(selectedNode.id, { promptName: e.target.value })}
                    />
                  </div>
                )}
                {selectedNode.type === 'collectInput' && (
                  <>
                    <div className="form-group">
                      <label>Save Variable</label>
                      <input 
                        type="text" 
                        className="text-input full-width" 
                        value={selectedNode.data.variableName || ''}
                        onChange={(e) => updateNodeData(selectedNode.id, { variableName: e.target.value })}
                      />
                    </div>
                    <div className="form-group mt-4">
                      <label>Max Digits</label>
                      <input 
                        type="number" 
                        className="text-input full-width" 
                        value={selectedNode.data.maxDigits || 1}
                        onChange={(e) => updateNodeData(selectedNode.id, { maxDigits: parseInt(e.target.value, 10) || 1 })}
                      />
                    </div>
                  </>
                )}
                {selectedNode.type === 'branch' && (
                  <div className="form-group">
                    <label>Condition on Variable</label>
                    <input 
                      type="text" 
                      className="text-input full-width" 
                      value={selectedNode.data.variableName || ''}
                      onChange={(e) => updateNodeData(selectedNode.id, { variableName: e.target.value })}
                    />
                  </div>
                )}
                {selectedNode.type === 'transfer' && (
                  <div className="form-group">
                    <label>Destination Queue/Number</label>
                    <input 
                      type="text" 
                      className="text-input full-width" 
                      value={selectedNode.data.destination || ''}
                      onChange={(e) => updateNodeData(selectedNode.id, { destination: e.target.value })}
                    />
                  </div>
                )}
                {selectedNode.type === 'httpRequest' && (
                  <>
                    <div className="form-group">
                      <label>HTTP Method</label>
                      <select 
                        className="select-input full-width"
                        value={selectedNode.data.method || 'GET'}
                        onChange={(e) => updateNodeData(selectedNode.id, { method: e.target.value })}
                      >
                        <option value="GET">GET</option>
                        <option value="POST">POST</option>
                        <option value="PUT">PUT</option>
                      </select>
                    </div>
                    <div className="form-group mt-4">
                      <label>Endpoint URL</label>
                      <input 
                        type="url" 
                        className="text-input full-width" 
                        value={selectedNode.data.url || ''}
                        onChange={(e) => updateNodeData(selectedNode.id, { url: e.target.value })}
                      />
                    </div>
                  </>
                )}
                {selectedNode.type === 'hangup' && (
                  <div className="form-group">
                    <label>Hangup Reason</label>
                    <select 
                      className="select-input full-width"
                      value={selectedNode.data.reason || 'Normal Clearing'}
                      onChange={(e) => updateNodeData(selectedNode.id, { reason: e.target.value })}
                    >
                      <option value="Normal Clearing">Normal Clearing</option>
                      <option value="Busy">Busy</option>
                      <option value="Rejected">Rejected</option>
                    </select>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        <div className="reactflow-wrapper" ref={reactFlowWrapper}>
          <ReactFlowProvider>
            <ReactFlow
              nodes={nodes}
              edges={edges}
              onNodesChange={onNodesChange}
              onEdgesChange={onEdgesChange}
              onConnect={onConnect}
              onInit={setReactFlowInstance}
              onDrop={onDrop}
              onDragOver={onDragOver}
              onNodeClick={onNodeClick}
              onPaneClick={onPaneClick}
              nodeTypes={nodeTypes}
              fitView
              className="react-flow-canvas"
            >
              <Controls />
              <Background color="var(--text-muted)" gap={16} />
            </ReactFlow>
          </ReactFlowProvider>
        </div>
      </div>
      
      {showSimulator && (
        <IVRSimulator 
          nodes={nodes} 
          edges={edges} 
          onClose={() => setShowSimulator(false)} 
        />
      )}
    </div>
  );
};
