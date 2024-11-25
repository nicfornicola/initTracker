import React from 'react';

const GridWrap = ({ children, columns = 3, gap = '10px', className = ''}) => {
    const gridStyle = {
      display: 'grid',
      gridTemplateColumns: `repeat(${columns}, 1fr)`, // Dynamically set columns
      gap, // Optional gap for spacing
    }
  
    return (
      <div style={gridStyle} className={className}>
        {children}
      </div>
    );
  };
  
export default GridWrap;