import React from 'react';
import styles from './Button.module.scss';
import type { IconPath } from '../Icon';
import clsx from 'clsx';
import Icon from '../Icon';
import type { ComponentSize, CSSVars } from '../types';

interface ButtonProps extends React.ComponentProps<'button'> {
    variant: 'primary' | 'secondary' | 'ghost';
    intent?: 'normal' | 'destructive';
    icon?: IconPath;
    size?: ComponentSize;
}

const Button: React.FC<ButtonProps> = ({
    variant,
    intent = 'normal',
    icon,
    size,
    className,
    style,
    children,
    disabled,
    ...props
}) => {
    const classes = clsx(className, styles.wrapper, styles[variant], styles[intent], disabled ? styles.disabled : styles.default);

    const inlineStyle: CSSVars = {
        '--fs-button': `var(--fs-${size})`,
        ...style
    };

    return (
        <button className={classes} style={inlineStyle} disabled={disabled} {...props}>
            {icon && <Icon className={styles.icon} name={icon} />}
            {children && children}
        </button>
    );
};

export default Button;