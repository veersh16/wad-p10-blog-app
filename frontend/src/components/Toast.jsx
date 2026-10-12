function Toast({ message, type, onClose }) {
  return (
    <div className={`toast toast-${type}`} role="status">
      <span>{message}</span>
      <button onClick={onClose} aria-label="Close">×</button>
    </div>
  );
}

export default Toast;
