import React from 'react';

const PageRenderer = ({ title, content, template, pageType = 'default' }) => {
  const getPageStyles = () => {
    const baseStyles = {
      fontFamily: template?.fontFamily || 'serif',
      fontSize: template?.fontSize || '16px',
      lineHeight: template?.lineHeight || '1.6',
      color: template?.textColor || '#333333',
      backgroundColor: template?.backgroundColor || '#ffffff',
    };

    // Page-specific margins based on specification
    const marginStyles = {
      cover: {
        margin: '0',
        padding: '0',
      },
      toc: {
        margin: '40px 48px',
        padding: '0',
      },
      author: {
        margin: '48px 40px',
        padding: '0',
      },
      preface: {
        margin: '56px 48px 40px 48px',
        padding: '0',
      },
      chapter: {
        margin: '40px 48px',
        padding: '0',
      },
      appendix: {
        margin: '48px 40px',
        padding: '0',
      },
      default: {
        margin: '40px 48px',
        padding: '0',
      },
    };

    return {
      ...baseStyles,
      ...marginStyles[pageType] || marginStyles.default,
    };
  };

  const renderTitle = () => {
    if (!title) return null;

    const titleStyles = {
      fontSize: pageType === 'chapter' ? 'text-2xl' : 'text-xl',
      fontWeight: 'bold',
      textAlign: 'center',
      marginBottom: '2rem',
      marginTop: pageType === 'chapter' ? '0' : '1rem',
    };

    return (
      <h1 className="page-title" style={titleStyles}>
        {title}
      </h1>
    );
  };

  const renderContent = () => {
    const contentStyles = {
      textAlign: 'justify',
      textIndent: '1.5em',
      marginBottom: '1rem',
    };

    // Split content into paragraphs
    const paragraphs = content.split('\n\n').filter(p => p.trim());

    return (
      <div className="page-content">
        {paragraphs.map((paragraph, index) => (
          <p key={index} style={contentStyles}>
            {paragraph}
          </p>
        ))}
      </div>
    );
  };

  const renderPageNumber = () => {
    if (!template?.showPageNumbers) return null;

    const pageNumberStyles = {
      position: 'absolute',
      bottom: '1rem',
      right: '2rem',
      fontSize: '0.875rem',
      color: '#666666',
    };

    return (
      <div className="page-number" style={pageNumberStyles}>
        {template.currentPage} of {template.totalPages}
      </div>
    );
  };

  return (
    <div 
      className="page-renderer"
      style={getPageStyles()}
    >
      {renderTitle()}
      {renderContent()}
      {renderPageNumber()}
    </div>
  );
};

export default PageRenderer; 