export default function Edge({ 
  startX, startY, endX, endY , preview=false
}: { 
  startX: number; startY: number; endX: number; endY: number, preview?: boolean;
 
}) {
  // Control points pull the line horizontally to create an 'S' curve
  const controlPointX = (startX + endX) / 2;

  // The SVG path command (M = move to, C = cubic bezier to)
  const pathData = `M ${startX} ${startY} C ${controlPointX} ${startY}, ${controlPointX} ${endY}, ${endX} ${endY}`;

  return (
    <path
      d={pathData}
      fill="none"
      stroke="#94a3b8"
      strokeWidth="3"
      strokeDasharray={preview ? '6 4' : undefined}
      opacity={preview ? 0.5 : 1}
      className="transition-all duration-75"
    />
  );
}