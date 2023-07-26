import React, { useState } from 'react';
import styles from './Modal.module.css';

const Modal = ({ showModal, onClose, response, children }) => {
  const modalStyle = {
    display: showModal ? 'flex' : 'none',
    position: 'fixed',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    backgroundColor: '#35363a',
    padding: '20px',
    borderRadius: '8px',
    boxShadow: '0 2px 4px rgba(55,65,81,255)',
    zIndex: 1000,
  };

  return (
    <div style={modalStyle}>
      <div className={styles.modalContent}>
        {response ? (
          <div>
            {Object.entries(response).map(([key, value]) => (
              <p key={key}>
                {key}: {value}
              </p>
            ))}
            <div style={{ textAlign: 'center', marginTop: '20px' }}>
              <button className={styles.closeButton} onClick={onClose}>
                Close
              </button>
            </div>
          </div>
        ) : (
          <div>
            {children}
            <div style={{ textAlign: 'center', marginTop: '20px' }}>
              <button className={styles.closeButton} onClick={onClose}>
                Close
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};


export default Modal;
