import React, { useState } from 'react';
import styles from './Modal.module.css';

const Modal = ({ showModal, onClose, children }) => {
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
          <div
            className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"
            role="status">
            <span
              className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">
              Loading...
            </span>
            <div style={{ textAlign: 'center', marginTop: '20px' }}>
              <button className={styles.closeButton} onClick={onClose}>
                Close
              </button>
            </div>
          </div>
      </div>
    </div>
  );
};


export default Modal;
