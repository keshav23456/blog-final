import React from 'react';

function Logo({ width = '100px' }) {
  return (
    <img
      src="https://cdn-icons-png.flaticon.com/512/5231/5231019.png" // cute cartoon girl
      alt="Logo"
      style={{ width }}
      className="object-contain rounded-full"
    />
  );
}

export default Logo;
