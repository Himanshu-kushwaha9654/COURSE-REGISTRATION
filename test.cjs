const fs = require('fs');
const dagre = require('dagre');

const nodes = [
  { id: '1', data: { semester: 1 } },
  { id: '2', data: { semester: 2 } }
];

const selectedSemester = '1';
let fNodes = nodes.filter(n => Number(n.data.semester) === Number(selectedSemester));
console.log('Filtered nodes length:', fNodes.length);

const dagreGraph = new dagre.graphlib.Graph();
dagreGraph.setDefaultEdgeLabel(() => ({}));
dagreGraph.setGraph({ rankdir: 'LR', ranksep: 150, nodesep: 80 });
fNodes.forEach(n => dagreGraph.setNode(n.id, { width: 320, height: 120 }));
dagre.layout(dagreGraph);

const output = fNodes.map(node => {
  const pos = dagreGraph.node(node.id);
  return { id: node.id, x: pos.x, y: pos.y };
});
console.log('Output nodes:', output);
