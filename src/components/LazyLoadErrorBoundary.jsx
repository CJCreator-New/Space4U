import { Component } from 'react';
import { Box, Button, Heading, Text, VStack } from '@chakra-ui/react';
import { AlertCircle, RefreshCw } from '../config/icons';

class LazyLoadErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Lazy load error:', error, errorInfo);
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: null });
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <Box 
          minH="400px" 
          display="flex" 
          alignItems="center" 
          justifyContent="center"
          p={8}
        >
          <VStack spacing={4} textAlign="center" maxW="md">
            <AlertCircle size={48} color="#e53e3e" />
            <Heading size="lg">Failed to Load Page</Heading>
            <Text color="gray.600">
              {this.state.error?.message || 'There was a problem loading this page.'}
            </Text>
            <Button
              leftIcon={<RefreshCw size={18} />}
              colorScheme="blue"
              onClick={this.handleRetry}
            >
              Reload Page
            </Button>
          </VStack>
        </Box>
      );
    }

    return this.props.children;
  }
}

export default LazyLoadErrorBoundary;
