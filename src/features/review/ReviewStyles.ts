
/**
 * Shared styles for the Review feature.
 * Implements a "Modern Han Elegant" aesthetic with glassmorphism.
 */
export const ReviewStyles = {
  glassCard: `
    background: rgba(255, 255, 255, 0.85);
    backdrop-filter: blur(15px);
    -webkit-backdrop-filter: blur(15px);
    box-shadow: 0 15px 35px rgba(0, 0, 0, 0.1);
    border: 1px solid rgba(139, 0, 0, 0.1);
  `,
  typography: {
    serif: '"Noto Serif SC", serif',
    sans: "'Outfit', sans-serif"
  },
  colors: {
    deepRed: '#8B0000',
    gold: '#DAA520',
    text: '#1a1a1a',
    muted: '#666'
  }
};
