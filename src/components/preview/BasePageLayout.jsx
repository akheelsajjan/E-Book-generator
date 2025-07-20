import React from 'react';

const BasePageLayout = ({ children, className = '', ...props }) => {
  return (
    <div 
      className={`
        h-full
        bg-white 
        text-gray-900 
        font-serif 
        leading-relaxed
        p-8 
        max-w-4xl 
        mx-auto
        shadow-lg
        rounded-lg
        border border-gray-200
        ${className}
      `}
      style={{
        height: 'calc(100vh - 200px)', // Account for header and footer
        marginTop: '1rem',
        marginBottom: '6rem', // Space for fixed footer
        lineHeight: '1.5', // 1.5x line spacing
        textAlign: 'justify', // Justified text alignment
        textAlignLast: 'left' // Left-align last line for better readability
      }}
      {...props}
    >
      {children}
    </div>
  );
};

export default BasePageLayout; 