import React, { useState, useEffect } from 'react';
import './alert.css'

const Alert = ({ message, type = "success", show, onClose, duration = 5000 }) => {
  const [visible, setVisible] = useState(show);

  useEffect(() => {
    if (show) {
      setVisible(true);

      if (duration) {
        const timer = setTimeout(() => {
          setVisible(false);
          if (onClose) onClose(); 
        }, duration);

        return () => clearTimeout(timer);
      }
    }
  }, [show, duration, onClose]);

  if (!visible) return null;

  return (
    <div className="alert-container">
      <div className={`alert alert-${type} alert-dismissible fade show`} role="alert">
        <strong>{message}</strong>
        <button type="button" className="btn-close" onClick={() => setVisible(false)}></button>
      </div>
    </div>
  );
};

export default Alert;