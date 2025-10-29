// Font Configuration for Space4U
// This file defines the typography system for the mental health app

// Import fonts for better performance and offline support
import '@fontsource/inter/300.css';
import '@fontsource/inter/400.css';
import '@fontsource/inter/500.css';
import '@fontsource/inter/600.css';
import '@fontsource/inter/700.css';

import '@fontsource/poppins/300.css';
import '@fontsource/poppins/400.css';
import '@fontsource/poppins/500.css';
import '@fontsource/poppins/600.css';
import '@fontsource/poppins/700.css';

import '@fontsource/nunito/300.css';
import '@fontsource/nunito/400.css';
import '@fontsource/nunito/500.css';
import '@fontsource/nunito/600.css';
import '@fontsource/nunito/700.css';

import '@fontsource/lato/300.css';
import '@fontsource/lato/400.css';
import '@fontsource/lato/700.css';

import '@fontsource/open-sans/300.css';
import '@fontsource/open-sans/400.css';
import '@fontsource/open-sans/600.css';
import '@fontsource/open-sans/700.css';

// Font families for different use cases
export const fontFamilies = {
  // Primary font - Clean and modern for main content
  primary: `'Inter', system-ui, -apple-system, sans-serif`,

  // Secondary font - Friendly and approachable for headings
  secondary: `'Poppins', system-ui, -apple-system, sans-serif`,

  // Accent font - Rounded and warm for special elements
  accent: `'Nunito', system-ui, -apple-system, sans-serif`,

  // Professional font - For formal content
  professional: `'Lato', system-ui, -apple-system, sans-serif`,

  // Readable font - For long-form content
  readable: `'Open Sans', system-ui, -apple-system, sans-serif`,
};

// Font weights
export const fontWeights = {
  light: 300,
  normal: 400,
  medium: 500,
  semibold: 600,
  bold: 700,
};

// Font sizes for consistent typography
export const fontSizes = {
  xs: '0.75rem',    // 12px
  sm: '0.875rem',   // 14px
  base: '1rem',     // 16px
  lg: '1.125rem',   // 18px
  xl: '1.25rem',    // 20px
  '2xl': '1.5rem',  // 24px
  '3xl': '1.875rem', // 30px
  '4xl': '2.25rem', // 36px
  '5xl': '3rem',    // 48px
};

// Line heights for better readability
export const lineHeights = {
  tight: 1.25,
  normal: 1.5,
  relaxed: 1.75,
};

// Letter spacing for different text styles
export const letterSpacing = {
  tight: '-0.025em',
  normal: '0',
  wide: '0.025em',
};