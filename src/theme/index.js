import { extendTheme } from '@chakra-ui/react';

export const therapeuticColors = {
  primary: {
    50: '#F0F8FF',
    100: '#E6F2FF',
    200: '#CCE9FF',
    300: '#B3E0FF',
    400: '#99D6FF',
    500: '#7FCBFF',
    600: '#66C2E6',
    700: '#4DA8CC',
    800: '#338FAD',
    900: '#1A718F'
  },
  growth: {
    50: '#F6FFF2',
    100: '#ECFFEA',
    200: '#DFFFD2',
    300: '#CFFFB9',
    400: '#BFFFA0',
    500: '#A7EFA0',
    600: '#8FDC8A',
    700: '#77C774',
    800: '#5FB25D',
    900: '#479D46'
  },
  mindfulness: {
    50: '#FFF6FF',
    100: '#FCEBFF',
    200: '#F8D9FF',
    300: '#F4C7FF',
    400: '#F0B5FF',
    500: '#E8A3FF',
    600: '#D591E6',
    700: '#BE7FCD',
    800: '#A86DAA',
    900: '#8F4E87'
  },
  caution: {
    50: '#FFF9F0',
    100: '#FFF3E6',
    200: '#FFE6CC',
    300: '#FFD9B3',
    400: '#FFCCA6',
    500: '#FFC199',
    600: '#E6A680',
    700: '#CC8B66',
    800: '#B3704C',
    900: '#995833'
  },
  crisis: {
    50: '#FFF2F2',
    100: '#FFEAEB',
    200: '#FFD7D9',
    300: '#FFC4C7',
    400: '#FFB0B3',
    500: '#FF9BA0',
    600: '#E68488',
    700: '#CC6D71',
    800: '#B3565A',
    900: '#993F44'
  }
};

export const theme = extendTheme({
  colors: therapeuticColors,
  fonts: {
    heading: 'Poppins, system-ui, sans-serif',
    body: 'Nunito, system-ui, sans-serif'
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
          bg: 'primary.300',
          color: 'primary.900',
          _hover: {
            bg: 'primary.200',
            transform: 'translateY(-2px)',
            boxShadow: 'md'
          },
          _active: {
            bg: 'primary.400',
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
