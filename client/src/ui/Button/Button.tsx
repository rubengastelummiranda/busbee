import React from 'react';
import styles from './Button.module.css';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary';
  children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  children,
  className = '',
  ...props
}) => {
  const buttonClass = `${styles.btn} ${styles[variant]} ${className}`;
  return (
    <button className={buttonClass} {...props}>
      {children}
    </button>
  );
};

export default Button;
