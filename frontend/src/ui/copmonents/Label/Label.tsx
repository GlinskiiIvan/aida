import React from 'react';
import styles from './Label.module.scss';
import type { ComponentSize, CSSVars, TextColors } from '../types';
import clsx from 'clsx';

interface LabelProps extends React.ComponentProps<'span'> {
    size?: ComponentSize;
    color?: TextColors;
}

const Label: React.FC<LabelProps> = ({
    size = 'sm',
    color = 'secondary',
    className,
    style,
    children,
    ...props
}) => {
    const classes = clsx(className, styles.wrapper);

    const inlineStyle: CSSVars = {
        '--fs-label': `var(--fs-${size})`,
        '--color-label': `var(--text-${color})`,
        ...style
    };

    return (        
        <span className={classes} style={inlineStyle} {...props}>
            {children}
        </span>
    );
};

export default Label;