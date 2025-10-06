import React from 'react'
import { AlertTriangle } from 'lucide-react'

class SafeComponent extends React.Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError() {
    return { hasError: true }
  }

  componentDidCatch(error, errorInfo) {
    console.error('Component error:', error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
          <div className="flex items-center gap-2 text-yellow-800">
            <AlertTriangle size={20} />
            <p className="text-sm">This section couldn't load. Other features are still available.</p>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}

export default SafeComponent
