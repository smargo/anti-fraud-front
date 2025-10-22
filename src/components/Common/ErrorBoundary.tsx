import { ReloadOutlined } from '@ant-design/icons';
import { Alert, Button } from 'antd';
import { Component, ErrorInfo, ReactNode } from 'react';

/**
 * 错误边界组件Props
 */
interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
}

/**
 * 错误边界组件State
 */
interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
  errorInfo?: ErrorInfo;
}

/**
 * 错误边界组件
 * 用于捕获子组件中的JavaScript错误，记录错误信息，并显示降级UI
 */
class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    // 更新state，下次渲染时显示降级UI
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // 记录错误信息（生产环境可以替换为错误上报服务）
    if (process.env.NODE_ENV === 'development') {
      console.error('Component Error:', error, errorInfo);
    }
    this.setState({ error, errorInfo });
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: undefined, errorInfo: undefined });
  };

  render() {
    if (this.state.hasError) {
      // 自定义降级UI
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // 默认降级UI
      return (
        <div style={{ padding: '16px' }}>
          <Alert
            message="组件加载失败"
            description="加载组件出现错误，请重试或联系技术支持"
            type="error"
            showIcon
            action={
              <Button size="small" danger icon={<ReloadOutlined />} onClick={this.handleRetry}>
                重试
              </Button>
            }
          />
          {process.env.NODE_ENV === 'development' && this.state.error && (
            <details style={{ marginTop: '16px', whiteSpace: 'pre-wrap' }}>
              <summary>错误详情</summary>
              {this.state.error.toString()}
              <br />
              {this.state.errorInfo?.componentStack}
            </details>
          )}
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
