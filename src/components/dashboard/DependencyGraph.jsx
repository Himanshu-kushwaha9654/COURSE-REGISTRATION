import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { ReactFlow, ReactFlowProvider, useReactFlow, Background, Controls, Handle, Position } from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { Network, BookOpen, Clock } from 'lucide-react';
import dagre from 'dagre';
import api from '../../api/axiosConfig';

const CustomNode = ({ data }) => {
  return (
    <div className="w-[320px] relative group">
      {/* Optimized Main Panel without backdrop-blur and heavy filters */}
      <div className="relative bg-[#080c16] border border-slate-700/50 hover:border-indigo-400/50 rounded-2xl overflow-hidden shadow-xl transition-colors duration-200">
        
        {/* Dynamic Top Gradient Bar */}
        <div className="h-1.5 w-full bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400"></div>

        {/* Handles - Target */}
        <Handle type="target" position={Position.Left} className="w-3 h-3 bg-[#080c16] border-2 border-indigo-400 -ml-1.5 z-20" />
        <Handle type="target" position={Position.Top} className="w-3 h-3 bg-[#080c16] border-2 border-indigo-400 -mt-1.5 z-20" />
        
        {/* Header Section */}
        <div className="p-4 flex justify-between items-start relative overflow-hidden bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-indigo-900/20 via-transparent to-transparent">
          
          <div className="relative z-10 flex flex-col gap-1">
            <div className="flex items-center gap-2">
              <div className="p-1.5 bg-indigo-950 rounded border border-indigo-500/20">
                <BookOpen className="w-3.5 h-3.5 text-indigo-400" />
              </div>
              <span className="text-indigo-400 font-black tracking-[0.2em] text-[10px] uppercase">{data.code || 'COURSE'}</span>
            </div>
          </div>

          <div className="relative z-10 flex flex-col items-end gap-1.5">
            <span className="px-2 py-1 bg-indigo-900/30 text-indigo-300 text-[10px] font-bold tracking-widest uppercase rounded border border-indigo-500/20">
              Sem {data.semester || '-'}
            </span>
            {data.credits && (
              <span className="text-[9px] font-bold px-2 py-0.5 bg-[#0a0f1c] text-slate-300 rounded border border-slate-700 flex items-center gap-1">
                <Clock className="w-2.5 h-2.5 text-slate-400" /> {data.credits}
              </span>
            )}
          </div>
        </div>
        
        {/* Title Section */}
        <div className="px-4 pb-5 pt-1 relative z-10">
          <h3 className="text-slate-100 font-bold text-[15px] leading-tight tracking-tight mb-2">
            {data.label}
          </h3>
          
          <div className="flex items-center gap-2 mt-3 opacity-50">
             <div className="h-px flex-1 bg-gradient-to-r from-indigo-500 to-transparent"></div>
             <div className="w-1 h-1 rounded-full bg-indigo-400"></div>
          </div>
        </div>
        
        {/* Handles - Source */}
        <Handle type="source" position={Position.Right} className="w-3 h-3 bg-[#080c16] border-2 border-pink-400 -mr-1.5 z-20" />
        <Handle type="source" position={Position.Bottom} className="w-3 h-3 bg-[#080c16] border-2 border-pink-400 -mb-1.5 z-20" />
      </div>
    </div>
  );
};

const nodeTypes = {
  custom: CustomNode,
};

const getLayoutedElements = (nodes, edges, direction = 'LR') => {
  try {
    const nodeWidth = 360; 
    const nodeHeight = 180; 

    if (edges.length === 0) {
      // Pure grid layout if no edges exist at all
      const cols = Math.max(1, Math.floor(window.innerWidth / nodeWidth) - 1);
      nodes.forEach((node, idx) => {
        node.position = {
          x: (idx % cols) * nodeWidth,
          y: Math.floor(idx / cols) * nodeHeight
        };
      });
      return { nodes, edges };
    }

    // Hybrid Layout: Dagre for connected nodes, Grid for disconnected nodes
    const connectedNodeIds = new Set();
    edges.forEach(edge => {
      connectedNodeIds.add(edge.source);
      connectedNodeIds.add(edge.target);
    });

    const connectedNodes = nodes.filter(n => connectedNodeIds.has(n.id));
    const disconnectedNodes = nodes.filter(n => !connectedNodeIds.has(n.id));

    // 1. Run Dagre on connected nodes
    let maxDagreY = 0;
    if (connectedNodes.length > 0) {
      const dagreGraph = new dagre.graphlib.Graph();
      dagreGraph.setDefaultEdgeLabel(() => ({}));
      dagreGraph.setGraph({ rankdir: direction, ranksep: 120, nodesep: 80 });

      connectedNodes.forEach((node) => {
        dagreGraph.setNode(node.id, { width: 320, height: 150 });
      });

      edges.forEach((edge) => {
        dagreGraph.setEdge(edge.source, edge.target);
      });

      dagre.layout(dagreGraph);

      connectedNodes.forEach((node) => {
        const nodeWithPosition = dagreGraph.node(node.id);
        node.position = {
          x: nodeWithPosition.x - 160,
          y: nodeWithPosition.y - 75,
        };
        if (node.position.y > maxDagreY) {
          maxDagreY = node.position.y;
        }
      });
    }

    // 2. Run Grid layout on disconnected nodes, placed below the Dagre graph
    const gridStartY = connectedNodes.length > 0 ? maxDagreY + 300 : 0;
    const cols = Math.max(1, Math.floor(window.innerWidth / nodeWidth) - 1);

    disconnectedNodes.forEach((node, idx) => {
      node.position = {
        x: (idx % cols) * nodeWidth,
        y: gridStartY + Math.floor(idx / cols) * nodeHeight
      };
    });

    return { nodes, edges };
  } catch (error) {
    console.error("Dagre layout error:", error);
    return { nodes, edges };
  }
};

function DependencyGraphInner({ selectedUniversity, selectedProgram, selectedSemester }) {
  const [nodes, setNodes] = useState([]);
  const [edges, setEdges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { fitView } = useReactFlow();

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      const [graphRes, coursesRes] = await Promise.all([
        api.get('/graph/data'),
        api.get('/courses')
      ]);

      const courseMap = {};
      coursesRes.data.forEach(c => {
        courseMap[c.id] = c;
      });

      // Filter nodes based on selected props
      let filteredNodes = graphRes.data.nodes.map(node => {
        const course = courseMap[node.id];
        return {
          id: node.id,
          type: 'custom',
          position: { x: 0, y: 0 },
          data: { 
            label: course ? course.courseName : (node.label || node.id),
            code: course ? course.courseCode : '',
            credits: course ? course.credits : null,
            semester: course ? course.semester : null,
            universityName: course?.program?.university?.name || '',
            programName: course?.program?.name || ''
          }
        };
      });

      if (selectedUniversity) {
        filteredNodes = filteredNodes.filter(n => n.data.universityName === selectedUniversity);
      }
      if (selectedProgram) {
        filteredNodes = filteredNodes.filter(n => n.data.programName === selectedProgram);
      }
      if (selectedSemester && selectedSemester !== 'All') {
        filteredNodes = filteredNodes.filter(n => n.data.semester?.toString() === selectedSemester.toString());
      }

      // Filter edges to only keep those where both source and target are in the filtered nodes
      const validNodeIds = new Set(filteredNodes.map(n => n.id));
      
      const filteredEdges = graphRes.data.edges
        .filter(edge => validNodeIds.has(edge.source) && validNodeIds.has(edge.target))
        .map(edge => ({
          id: `e-${edge.source}-${edge.target}`,
          source: edge.source,
          target: edge.target,
          animated: true,
          type: 'smoothstep',
          style: { stroke: '#6366f1', strokeWidth: 2, opacity: 0.6 }
        }));

      const layouted = getLayoutedElements(filteredNodes, filteredEdges, 'LR');
      setNodes(layouted.nodes);
      setEdges(layouted.edges);
      
      setTimeout(() => fitView({ padding: 0.2, duration: 800 }), 50);

    } catch (e) {
      console.error(e);
      setError("Failed to load dependency graph.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [selectedUniversity, selectedSemester]);

  return (
    <div className="flex-1 w-full rounded-2xl overflow-hidden border border-slate-800 bg-[#040508] relative shadow-inner">
      {loading && (
        <div className="absolute inset-0 z-10 flex items-center justify-center bg-[#08090C]/80 backdrop-blur-sm">
          <div className="text-indigo-400 font-bold tracking-widest uppercase text-sm animate-pulse">Mapping Dependencies...</div>
        </div>
      )}
      {error && (
        <div className="absolute inset-0 z-10 flex items-center justify-center bg-[#08090C]/80 backdrop-blur-sm">
          <div className="text-red-400 font-bold">{error}</div>
        </div>
      )}
      <ReactFlow 
        nodes={nodes} 
        edges={edges} 
        nodeTypes={nodeTypes}
        colorMode="dark" 
        fitView
      >
        <Background color="#334155" gap={24} size={2} variant="dots" opacity={0.3} />
        <Controls className="bg-slate-900 border-slate-800 fill-slate-300" />
      </ReactFlow>
    </div>
  );
}

export default function DependencyGraph({ selectedUniversity, selectedProgram, selectedSemester }) {
  return (
    <div className="glass-panel rounded-3xl p-8 mb-8 h-[700px] flex flex-col relative overflow-hidden group">
      <div className="absolute -right-20 -top-20 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl group-hover:bg-indigo-500/20 transition-colors duration-700"></div>
      
      <div className="flex items-center justify-between mb-6 relative z-10">
        <div>
          <h3 className="text-2xl font-black flex items-center gap-3 text-slate-100">
            <div className="p-2 bg-indigo-500/10 border border-indigo-500/20 rounded-xl">
               <Network className="w-6 h-6 text-indigo-400"/>
            </div>
            Interactive Roadmap Graph
          </h3>
          <p className="text-sm opacity-60 mt-2 font-medium">Explore the prerequisite hierarchy of your curriculum dynamically.</p>
        </div>
        <div className="flex gap-4 text-xs font-bold bg-[#0f172a] px-4 py-2 rounded-xl border border-slate-800">
          <span className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-indigo-500 shadow-[0_0_10px_rgba(99,102,241,0.5)]"></div> Course Node</span>
        </div>
      </div>
      <ReactFlowProvider>
        <DependencyGraphInner selectedUniversity={selectedUniversity} selectedProgram={selectedProgram} selectedSemester={selectedSemester} />
      </ReactFlowProvider>
    </div>
  );
}