import React from 'react';
import type { IconProps } from '../Icon';
import clsx from 'clsx';
import Icon from '../Icon';
import styles from './IconButton.module.scss';

interface IconButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    icon: IconProps;
}

const IconButton: React.FC<IconButtonProps> = ({
    icon,
    className,
    ...props
}) => {
    const classes = clsx(styles.wrapper, className);

    return (
        <button type='button' className={classes} {...props}>
            <Icon className={styles.icon} {...icon} />
        </button>
    );
};

export default IconButton;