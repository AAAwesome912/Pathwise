// components/Logo.js
import React from 'react';

const Logo = ({ className="mx-auto mb-4", alt = 'PathWise', src = '/logo192.png', width=150, height=150 }) => {
  return (
    <img
      className={className}
      src={src}
      alt={alt} 
      width={width}
      height={height}
      center
    />
  );
};

export default Logo;