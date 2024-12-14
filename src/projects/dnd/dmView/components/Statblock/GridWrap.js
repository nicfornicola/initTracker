import React from 'react';

const GridWrap = ({ children, columns = 3, gap = '10px', className = '', scroll = 'hidden', paddingTop = 0}) => {
    const gridStyle = {
        display: 'grid',
        width: '100%',
        gridTemplateColumns: `repeat(${columns}, 1fr)`, 
        gap, 
        overflowX: scroll, // Enables horizontal scrolling
        paddingTop: paddingTop
    }
  
    return (
        <div style={gridStyle} className={className}>
            {children}
        </div>
    );
  };
  
export default GridWrap;