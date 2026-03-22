import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import styles from './Message.module.scss';

interface MessageProps {
  type: 'success' | 'error' | 'warning' | 'info';
  message: string;
  duration?: number;
  onClose?: () => void;
}

const Message: React.FC<MessageProps> = ({
  type,
  message,
  duration = 3000,
  onClose
}) => {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => {
        setVisible(false);
        if (onClose) {
          onClose();
        }
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [duration, onClose]);



  if (!visible) return null;

  return (
    <motion.div
      className={`${styles.message} ${styles[`message-${type}`]}`}
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
    >
      <span className={styles.messageContent}>{message}</span>
    </motion.div>
  );
};

export default Message;