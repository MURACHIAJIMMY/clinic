export default function Alert({ type = 'info', children }) {
  const baseStyle = 'px-4 py-2 rounded text-sm border';
  const styles = {
    info: 'bg-blue-50 border-blue-300 text-blue-800',
    success: 'bg-green-50 border-green-300 text-green-800',
    warning: 'bg-yellow-50 border-yellow-300 text-yellow-800',
    error: 'bg-red-50 border-red-300 text-red-800',
  };

  return (
    <div className={`${baseStyle} ${styles[type] || styles.info}`}>
      {children}
    </div>
  );
}
