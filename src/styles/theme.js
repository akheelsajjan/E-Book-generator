// Modern Dark Theme Configuration
// Based on theme.text specifications

export const theme = {
  // Color Palette
  colors: {
    // Background gradients
    bgPrimary: '#1a1a2e',
    bgSecondary: '#16213e',
    bgTertiary: '#0f3460',
    
    // Glass effect
    glass: 'rgba(255, 255, 255, 0.05)',
    glassHover: 'rgba(255, 255, 255, 0.08)',
    
    // Text colors
    textPrimary: '#e8eaed',
    textSecondary: 'rgba(255, 255, 255, 0.7)',
    textMuted: 'rgba(255, 255, 255, 0.5)',
    
    // Accent colors with gradients
    accentBlue: 'linear-gradient(45deg, #2196f3, #64b5f6)',
    accentGreen: 'linear-gradient(45deg, #4caf50, #66bb6a)',
    accentOrange: 'linear-gradient(45deg, #ff9800, #ffb74d)',
    accentPurple: 'linear-gradient(45deg, #9c27b0, #ba68c8)',
    
    // Solid accent colors
    blue: '#2196f3',
    green: '#4caf50',
    orange: '#ff9800',
    purple: '#9c27b0',
    
    // Borders
    border: 'rgba(255, 255, 255, 0.1)',
    borderHover: 'rgba(255, 255, 255, 0.2)',
    
    // Shadows
    shadow: '0 15px 40px rgba(0, 0, 0, 0.3)',
    shadowHover: '0 20px 50px rgba(0, 0, 0, 0.4)',
    shadowGlow: '0 0 20px rgba(33, 150, 243, 0.3)',
  },
  
  // Spacing
  spacing: {
    xs: '0.5rem',
    sm: '1rem',
    md: '1.5rem',
    lg: '2rem',
    xl: '3rem',
    xxl: '4rem',
  },
  
  // Border radius
  borderRadius: {
    sm: '8px',
    md: '12px',
    lg: '16px',
    xl: '20px',
    full: '50%',
  },
  
  // Transitions
  transitions: {
    fast: 'all 0.2s ease',
    normal: 'all 0.3s ease',
    slow: 'all 0.5s ease',
  },
  
  // Glassmorphism effects
  glass: {
    backdrop: 'blur(20px)',
    background: 'rgba(255, 255, 255, 0.05)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
  },
  
  // Gradients
  gradients: {
    primary: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)',
    card: 'linear-gradient(135deg, rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0.02) 100%)',
    button: 'linear-gradient(45deg, #2196f3, #64b5f6)',
    buttonHover: 'linear-gradient(45deg, #1976d2, #42a5f5)',
  },
  
  // Typography
  typography: {
    fontFamily: 'Segoe UI, system-ui, -apple-system, sans-serif',
    fontWeight: {
      light: 300,
      normal: 400,
      medium: 500,
      semibold: 600,
      bold: 700,
    },
    fontSize: {
      xs: '0.75rem',
      sm: '0.875rem',
      base: '1rem',
      lg: '1.125rem',
      xl: '1.25rem',
      '2xl': '1.5rem',
      '3xl': '1.875rem',
      '4xl': '2.25rem',
    },
  },
};

// Utility functions for theme usage
export const getGlassEffect = (opacity = 0.05) => ({
  backdropFilter: 'blur(20px)',
  background: `rgba(255, 255, 255, ${opacity})`,
  border: '1px solid rgba(255, 255, 255, 0.1)',
});

export const getGradient = (type = 'primary') => {
  const gradients = {
    primary: theme.gradients.primary,
    card: theme.gradients.card,
    button: theme.gradients.button,
    blue: theme.colors.accentBlue,
    green: theme.colors.accentGreen,
    orange: theme.colors.accentOrange,
    purple: theme.colors.accentPurple,
  };
  return gradients[type] || gradients.primary;
};

export const getShadow = (type = 'normal') => {
  const shadows = {
    normal: theme.colors.shadow,
    hover: theme.colors.shadowHover,
    glow: theme.colors.shadowGlow,
  };
  return shadows[type] || shadows.normal;
};

export default theme; 