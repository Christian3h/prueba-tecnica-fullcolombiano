import './ErrorMessage.css';

const ErrorMessage = ({ message, onRetry }) => {
  return (
    <div className="error-container">
      <div className="error-icon">⚠️</div>
      <p className="error-message">{message}</p>
      {onRetry && (
        <button className="error-retry-btn" onClick={onRetry}>
          Intentar de nuevo
        </button>
      )}
    </div>
  );
};

export default ErrorMessage;
