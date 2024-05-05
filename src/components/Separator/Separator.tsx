import { CSSProperties } from 'react';

interface SeparatorProps {
    color?: string,
    thickness?: string,
    margin?: string
}

export default function  Separator({ color, margin, thickness }: SeparatorProps) {
  const lineStyle: CSSProperties = {
    backgroundColor: color  || 'var(--background-secondary-color)',
    height: thickness || '1px',
    margin: margin || '5px'
  }

  return (
    <div style={lineStyle} ></div>
  )
}
