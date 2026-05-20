import React from 'react';
import styles from './Input.module.css';

interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement | HTMLSelectElement>, 'type'> {
  label?: string;
  error?: string;
  type?: string;
  options?: { value: string; label: string }[];
}

export const Input: React.FC<InputProps> = ({
  label,
  error,
  type = 'text',
  options = [],
  className = '',
  id,
  ...props
}) => {
  const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`;
  const isSelect = type === 'select';
  const hasError = !!error;

  return (
    <div className={`${styles.container} ${className}`}>
      {label && (
        <label htmlFor={inputId} className={styles.label}>
          {label}
        </label>
      )}
      {isSelect ? (
        <select
          id={inputId}
          className={`${styles.input} ${hasError ? styles.errorBorder : ''}`}
          {...(props as React.SelectHTMLAttributes<HTMLSelectElement>)}
        >
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      ) : (
        <input
          id={inputId}
          type={type}
          className={`${styles.input} ${hasError ? styles.errorBorder : ''}`}
          {...(props as React.InputHTMLAttributes<HTMLInputElement>)}
        />
      )}
      {error && <span className={styles.errorText}>{error}</span>}
    </div>
  );
};

export default Input;
