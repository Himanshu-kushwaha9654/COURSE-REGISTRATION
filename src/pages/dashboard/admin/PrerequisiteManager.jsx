import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { ReactFlow, ReactFlowProvider, useReactFlow, MiniMap, Controls, Background, addEdge, applyNodeChanges, applyEdgeChanges, MarkerType, Handle, Position } from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { Network, AlertTriangle, Filter, BookOpen } from 'lucide-react';
import api from '../../../api/axiosConfig';
import dagre from 'dagre';

// --- Premium Custom Node ---
const CustomCourseNode = ({ data }) => {
  return (
    <div className="w-[320px] relative group">
      {/* Animated glowing border effect */}
      <div className="absolute -inset-0.5 bg-gradient-to-r from-teal-500 via-emerald-400 to-cyan-500 rounded-[1.15rem] blur opacity-20 group-hover:opacity-60 transition duration-500"></div>
      
      {/* Main Glass Panel */}
      <div className="relative bg-[#080c16]/95 backdrop-blur-xl border border-slate-700/50 group-hover:border-teal-400/50 rounded-2xl overflow-hidden shadow-2xl transition-all duration-300">
        
        {/* Dynamic Top Gradient Bar */}
        <div className="h-1.5 w-full bg-gradient-to-r from-teal-400 via-emerald-400 to-cyan-400"></div>

        {/* Handles - Target */}
        <Handle type="target" position={Position.Left} className="w-3.5 h-3.5 bg-[#080c16] border-[2px] border-teal-400 -ml-1.5 z-20 group-hover:shadow-[0_0_10px_rgba(45,212,191,0.8)] transition-shadow" />
        <Handle type="target" position={Position.Top} className="w-3.5 h-3.5 bg-[#080c16] border-[2px] border-teal-400 -mt-1.5 z-20 group-hover:shadow-[0_0_10px_rgba(45,212,191,0.8)] transition-shadow" />
        
        {/* Header Section */}
        <div className="p-5 flex justify-between items-start relative overflow-hidden">
          {/* Inner Glow Blob */}
          <div className="absolute -top-12 -right-12 w-32 h-32 bg-teal-500/10 blur-[40px] rounded-full group-hover:bg-teal-400/20 transition-colors duration-500"></div>
          
          <div className="relative z-10 flex flex-col gap-1">
            <div className="flex items-center gap-2">
              <div className="p-1.5 bg-teal-950/50 rounded border border-teal-500/20 shadow-[0_0_10px_rgba(45,212,191,0.1)] group-hover:shadow-[0_0_15px_rgba(45,212,191,0.3)] transition-all">
                <BookOpen className="w-3.5 h-3.5 text-teal-400" />
              </div>
              <span className="text-teal-400 font-black tracking-[0.2em] text-[10px] uppercase">{data.code}</span>
            </div>
          </div>

          <div className="relative z-10 flex flex-col items-end">
            <span className="px-2.5 py-1 bg-teal-500/10 text-teal-300 text-[10px] font-bold tracking-widest uppercase rounded border border-teal-500/20 shadow-[0_0_10px_rgba(45,212,191,0.1)]">
              Sem {data.semester}
            </span>
          </div>
        </div>
        
        {/* Title Section */}
        <div className="px-5 pb-6 pt-1 relative z-10">
          <h3 className="text-slate-100 font-bold text-[17px] leading-tight tracking-tight mb-2 drop-shadow-md">
            {data.name}
          </h3>
          
          <div className="flex items-center gap-3 mt-4">
             <div className="h-px flex-1 bg-gradient-to-r from-teal-500/50 to-transparent"></div>
             <div className="w-1.5 h-1.5 rounded-full bg-teal-400 shadow-[0_0_8px_rgba(45,212,191,1)]"></div>
          </div>
        </div>
        
        {/* Handles - Source */}
        <Handle type="source" position={Position.Right} className="w-3.5 h-3.5 bg-[#080c16] border-[2px] border-cyan-400 -mr-1.5 z-20 shadow-[0_0_10px_rgba(34,211,238,0.5)] group-hover:shadow-[0_0_15px_rgba(34,211,238,0.8)] transition-shadow" />
        <Handle type="source" position={Position.Bottom} className="w-3.5 h-3.5 bg-[#080c16] border-[2px] border-cyan-400 -mb-1.5 z-20 shadow-[0_0_10px_rgba(34,211,238,0.5)] group-hover:shadow-[0_0_15px_rgba(34,211,238,0.8)] transition-shadow" />
      </div>
    </div>
  );
};

const nodeTypes = {
  course: CustomCourseNode,
};

// Auto-zoom component
const FitViewOnDataChange = ({ nodes }) => {
  const { fitView } = useReactFlow();
  
  useEffect(() => {
    if (nodes.length > 0) {
      setTimeout(() => {
        fitView({ padding: 0.3, duration: 800 });
      }, 50); // slight delay to ensure nodes are rendered
    }
  }, [nodes, fitView]);
  
  return null;
};

// --- Layout Algorithms ---
const getLayoutedElements = (nodes, edges, mode) => {
  const nodeWidth = 360; 
  const nodeHeight = 180;

  if (mode === 'GRID') {
    // Premium Grid Layout for isolated semesters
    const cols = Math.ceil(Math.sqrt(nodes.length)) || 3;
    const spacingX = 400;
    const spacingY = 220;

    const newNodes = nodes.map((node, i) => {
      const col = i % cols;
      const row = Math.floor(i / cols);
      return {
        ...node,
        targetPosition: 'top',
        sourcePosition: 'bottom',
        position: { x: col * spacingX, y: row * spacingY },
      };
    });
    return { nodes: newNodes, edges };
  }

  // Hybrid Layout for full graph
  try {
    const connectedNodeIds = new Set();
    edges.forEach(edge => {
      connectedNodeIds.add(edge.source);
      connectedNodeIds.add(edge.target);
    });

    const connectedNodes = nodes.filter(n => connectedNodeIds.has(n.id));
    const disconnectedNodes = nodes.filter(n => !connectedNodeIds.has(n.id));

    let maxDagreY = 0;
    const newNodes = [];

    // 1. Run Dagre on connected nodes
    if (connectedNodes.length > 0) {
      const dagreGraph = new dagre.graphlib.Graph();
      dagreGraph.setDefaultEdgeLabel(() => ({}));
      dagreGraph.setGraph({ rankdir: 'LR', ranksep: 150, nodesep: 80 });

      connectedNodes.forEach((node) => {
        dagreGraph.setNode(node.id, { width: nodeWidth, height: nodeHeight });
      });

      edges.forEach((edge) => {
        dagreGraph.setEdge(edge.source, edge.target);
      });

      dagre.layout(dagreGraph);

      connectedNodes.forEach((node) => {
        const nodeWithPosition = dagreGraph.node(node.id);
        const yPos = (nodeWithPosition?.y || 0) - nodeHeight / 2;
        if (yPos > maxDagreY) maxDagreY = yPos;
        
        newNodes.push({
          ...node,
          targetPosition: 'left',
          sourcePosition: 'right',
          position: {
            x: (nodeWithPosition?.x || 0) - nodeWidth / 2,
            y: yPos,
          },
        });
      });
    }

    // 2. Grid Layout for disconnected nodes placed below the Dagre graph
    const gridStartY = connectedNodes.length > 0 ? maxDagreY + nodeHeight + 120 : 0;
    const cols = Math.max(1, Math.floor(window.innerWidth / (nodeWidth + 40)));

    disconnectedNodes.forEach((node, idx) => {
      newNodes.push({
        ...node,
        targetPosition: 'left',
        sourcePosition: 'right',
        position: {
          x: (idx % cols) * (nodeWidth + 40),
          y: gridStartY + Math.floor(idx / cols) * (nodeHeight + 40)
        }
      });
    });

    return { nodes: newNodes, edges };
  } catch (error) {
    console.error("Dagre layout failed:", error);
    return { nodes, edges };
  }
};

export default function PrerequisiteManager() {
  const [nodes, setNodes] = useState([]);
  const [edges, setEdges] = useState([]);
  const [error, setError] = useState(null);
  const [selectedSemester, setSelectedSemester] = useState('All');
  
  const [activeNodes, setActiveNodes] = useState([]);
  const [activeEdges, setActiveEdges] = useState([]);

  useEffect(() => {
    fetchGraphData();
  }, []);

  const fetchGraphData = async () => {
    try {
      const res = await api.get('/graph/data');
      
      const formattedNodes = res.data.nodes.map(n => {
        const parts = n.data.label.split(' - ');
        const code = parts[0];
        const name = parts.slice(1).join(' - ') || parts[0];

        return {
          id: n.id,
          type: 'course', 
          position: { x: 0, y: 0 }, 
          data: { 
            label: n.data.label, 
            code: code,
            name: name,
            semester: n.data.semester 
          }
        };
      });

      const formattedEdges = res.data.edges.map(e => ({
        id: e.id,
        source: e.source,
        target: e.target,
        animated: true,
        style: { stroke: '#2dd4bf', strokeWidth: 2, opacity: 0.6 },
        markerEnd: { type: MarkerType.ArrowClosed, color: '#2dd4bf' }
      }));

      setNodes(formattedNodes);
      setEdges(formattedEdges);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    if (nodes.length === 0) return;

    let fNodes = nodes;
    let fEdges = edges;
    let mode = 'DAGRE';

    if (selectedSemester !== 'All') {
      fNodes = nodes.filter(n => Number(n.data.semester) === Number(selectedSemester));
      const nodeIds = new Set(fNodes.map(n => n.id));
      fEdges = edges.filter(e => nodeIds.has(e.source) && nodeIds.has(e.target));
      mode = 'GRID';
    }

    const { nodes: layoutedNodes, edges: layoutedEdges } = getLayoutedElements(fNodes, fEdges, mode);
    setActiveNodes(layoutedNodes);
    setActiveEdges(layoutedEdges);
  }, [nodes, edges, selectedSemester]);

  const onNodesChange = useCallback(
    (changes) => setActiveNodes((nds) => applyNodeChanges(changes, nds)),
    []
  );

  const onEdgesChange = useCallback(
    (changes) => setActiveEdges((eds) => applyEdgeChanges(changes, eds)),
    []
  );

  const onConnect = useCallback(async (params) => {
    try {
      setError(null);
      await api.post(`/graph/edge?targetCourseId=${params.target}&reqCourseId=${params.source}`);
      
      const newEdge = { ...params, animated: true, style: { stroke: '#2dd4bf', strokeWidth: 2, opacity: 0.6 }, markerEnd: { type: MarkerType.ArrowClosed, color: '#2dd4bf' } };
      
      setActiveEdges((eds) => addEdge(newEdge, eds));
      
    } catch (e) {
      setError(e.response?.data || "Failed to add prerequisite. A cycle may have been detected.");
      setTimeout(() => setError(null), 5000);
    }
  }, []);

  const semesters = useMemo(() => {
    const sems = new Set(nodes.map(n => n.data.semester).filter(s => s !== undefined && s !== null));
    return Array.from(sems).sort((a, b) => a - b);
  }, [nodes]);

  return (
    <div className="h-full flex flex-col">
      <div className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black mb-2 flex items-center gap-3">
            <div className="p-2 bg-teal-500/10 rounded-xl border border-teal-500/20">
              <Network className="text-teal-400 w-6 h-6" />
            </div>
            Prerequisite Graph Manager
          </h1>
          <p className="text-slate-400">Visually map out course dependencies. Drag from a course handle to another to create a prerequisite.</p>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-teal-400 pointer-events-none" />
            <select
              value={selectedSemester}
              onChange={(e) => setSelectedSemester(e.target.value)}
              className="bg-[#0f172a] border border-teal-500/30 rounded-xl py-2 pl-10 pr-8 text-sm text-teal-100 focus:outline-none focus:ring-2 focus:ring-teal-500/50 appearance-none cursor-pointer hover:bg-[#1e293b] transition-colors"
            >
              <option value="All">All Semesters (Hierarchy View)</option>
              {semesters.map(sem => (
                <option key={sem} value={sem}>Semester {sem}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="flex-1 glass-panel rounded-3xl overflow-hidden relative border border-slate-800">
        {error && (
          <div className="absolute top-4 left-1/2 -translate-x-1/2 z-50 bg-red-500/20 border border-red-500/50 text-red-200 px-6 py-3 rounded-2xl shadow-2xl backdrop-blur-md flex items-center gap-3 animate-in fade-in slide-in-from-top-4">
            <AlertTriangle className="w-5 h-5 text-red-400" />
            <span className="font-semibold">{error}</span>
          </div>
        )}
        
        <ReactFlowProvider>
          <ReactFlow
            nodes={activeNodes}
            edges={activeEdges}
            nodeTypes={nodeTypes}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            fitView
            panOnScroll={true}
            panOnScrollMode="free"
            className="bg-[#0b1120]"
            defaultEdgeOptions={{ type: 'smoothstep' }}
          >
            <Background color="#1e293b" gap={32} size={2} />
            <Controls className="bg-[#0f172a] border border-[#1e293b] fill-slate-400" />
            <MiniMap 
              nodeColor="#0f172a"
              maskColor="rgba(11, 17, 32, 0.8)"
              className="bg-[#0b1120] border border-slate-800 rounded-xl overflow-hidden" 
            />
            <FitViewOnDataChange nodes={activeNodes} />
          </ReactFlow>
        </ReactFlowProvider>

        <div className="absolute bottom-4 left-4 z-10 pointer-events-none">
          <div className="p-4 bg-[#0f172a]/90 border border-teal-500/20 rounded-2xl backdrop-blur-xl shadow-2xl flex items-start gap-4 max-w-sm">
            <div className="p-2 bg-teal-500/20 rounded-lg shrink-0">
              <Network className="w-5 h-5 text-teal-400" />
            </div>
            <div>
              <strong className="text-teal-100 block mb-1 text-sm font-bold">
                {selectedSemester === 'All' ? 'Premium Flow Layout' : 'Premium Grid Layout'}
              </strong>
              <p className="text-slate-400 text-xs leading-relaxed">
                {selectedSemester === 'All' 
                  ? 'Graph automatically flows from Left to Right (BFS style). Cycles are actively blocked.' 
                  : 'Courses automatically arranged to optimally fill the screen space.'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
