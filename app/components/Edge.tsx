import EventNode from "./EventNode";

interface EdgeProps {
    sourceNode: any,
    targetNode:any
}

// Conceptual Edge Component
export default function Edge({ sourceNode, targetNode }:EdgeProps)  {
  // Assuming ports are on the right/left center of the nodes
  const startX = sourceNode.position.x + 150; // Node width
  const startY = sourceNode.position.y + 25;  // Node half-height
  
  const endX = targetNode.position.x;
  const endY = targetNode.position.y + 25;

  // Control points pull the curve horizontally to create the "S" shape
  const controlPointX = (startX + endX) / 2;

  // The SVG Path command
  const pathData = `M ${startX} ${startY} C ${controlPointX} ${startY}, ${controlPointX} ${endY}, ${endX} ${endY}`;

  return (
    <path 
      d={pathData} 
      fill="none" 
      stroke="#94a3b8" 
      strokeWidth="2" 
    />
  );
};