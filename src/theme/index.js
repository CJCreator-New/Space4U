import { extendTheme } from '@chakra-ui/react';

export const therapeuticColors = {
  primary: {
    50: '#E3F2FD',
    100: '#BBDEFB',
    200: '#90CAF9',
    300: '#64B5F6',
    400: '#42A5F5',
    500: '#4A90C2',
    600: '#3A7AA2',
    700: '#2A6482',
    800: '#1A4E62',
    900: '#0A3842'
  },
  growth: {
    50: '#F1F8E9',
    100: '#DCEDC8',
    200: '#C5E1A5',
    300: '#AED581',
    400: '#9CCC65',
    500: '#7FB069',
    600: '#6A9A57',
    700: '#558445',
    800: '#406E33',
    900: '#2B5821'
  },
  mindfulness: {
    50: '#F3E5F5',
    100: '#E1BEE7',
    200: '#CE93D8',
    300: '#BA68C8',
    400: '#AB47BC',
    500: '#8E7CC3',
    600: '#7565AB',
    700: '#5C4E93',
    800: '#43377B',
    900: '#2A2063'
  },
  caution: {
    50: '#FFF8E1',
    100: '#FFECB3',
    200: '#FFE082',
    300: '#FFD54F',
    400: '#FFCA28',
    500: '#F5B041',
    600: '#E09B2A',
    700: '#CB8613',
    800: '#B67100',
    900: '#A15C00'
  },
  crisis: {
    50: '#FFEBEE',
    100: '#FFCDD2',
    200: '#EF9A9A',
    300: '#E57373',
    400: '#EF5350',
    500: '#D64545',
    600: '#B83838',
    700: '#9A2B2B',
    800: '#7C1E1E',
    900: '#5E1111'
  }
};

export const theme = extendTheme({
  colors: therapeuticColors,
  fonts: {
    heading: 'Inter, system-ui, sans-serif',
    body: 'Inter, system-ui, sans-serif'
  },
  fontSizes: {
    xs: '14px',
    sm: '16px',
    md: '18px',
    lg: '20px',
    xl: '24px',
    '2xl': '32px',
    '3xl': '40px'
  },
  breakpoints: {
    base: '0px',
    sm: '480px',
    md: '768px',
    lg: '992px',
    xl: '1280px',
    '2xl': '1536px'
  },
  space: {
    xs: '8px',
    sm: '16px',
    md: '24px',
    lg: '32px',
    xl: '48px',
    '2xl': '64px'
  },
  radii: {
    sm: '8px',
    md: '12px',
    lg: '16px',
    xl: '24px',
    '2xl': '32px',
    full: '9999px'
  },
  shadows: {
    sm: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
    md: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
    lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
    xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1)'
  },
  components: {
    Button: {
      baseStyle: {
        fontWeight: 'medium',
        borderRadius: 'lg',
        minH: '44px',
        minW: '44px'
      },
      variants: {
        solid: {
          bg: 'primary.500',
          color: 'white',
          _hover: {
            bg: 'primary.600',
            transform: 'translateY(-2px)',
            boxShadow: 'md'
          },
          _active: {
            bg: 'primary.700',
            transform: 'translateY(0)'
          }
        }
      }
    },
    Input: {
      baseStyle: {
        field: {
          borderRadius: 'lg',
          minH: '44px'
        }
      }
    }
  },
  config: {
    initialColorMode: 'light',
    useSystemColorMode: true
  }
});

export default theme;
