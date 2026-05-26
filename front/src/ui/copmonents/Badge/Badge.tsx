import React from 'react';
import { clsx } from 'clsx';
import Icon, { type IconPath } from '../Icon';
import styles from './Badge.module.scss';
import { type ComponentSize, type ComponentStatus, ComponentStatusMap, type CSSVars } from '../types';
import IconButton from '../IconButton';
import Stack from '../Stack';

const BadgeStatus: Record<'default', string> & typeof ComponentStatusMap = {
    ...ComponentStatusMap,
    default: 'primary',
};

interface BadgeAction {
    icon: IconPath;
    onClick: () => void;
}

interface BadgeProps extends React.ComponentProps<'div'> {
    status: ComponentStatus;
    size: ComponentSize;
    text?: string;
    icon?: IconPath;
    action?: BadgeAction;
}

const Badge: React.FC<BadgeProps> = ({
    status = 'default', 
    size = 'md',    
    text,
    icon,
    action,
    className,
    style,
    children,
    ...props
}) => {
    const classes = clsx(styles.wrapper, className);

    const inlineStyle: CSSVars = {
        '--border-color-badge': `var(--border-${BadgeStatus[status]})`,
        '--fs-badge': `var(--fs-${size})`,
        ...style
    };

    return (
        <Stack 
            className={classes} style={inlineStyle} {...props}
            fitContent direction='row' gap='xs'
            justify='center' align='center' >
            {icon && <Icon name={icon} color='tertiary' />}
            {text ?? children}   
            {action && (<IconButton icon={{name: action.icon}} onClick={action.onClick} />)}
        </Stack>
    );
};

export default Badge;