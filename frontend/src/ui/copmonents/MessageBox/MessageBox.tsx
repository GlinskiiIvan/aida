import React from 'react';
import styles from './MessageBox.module.scss';
import { type ComponentSize, ComponentStatusMap, type CSSVars, type ValidationInfo } from '../types';
import clsx from 'clsx';
import { v4 as uuidv4 } from 'uuid';
import Stack from '../Stack';

const MessageBoxStatus: Record<'default', string> & typeof ComponentStatusMap = {
    ...ComponentStatusMap,
    default: 'secondary'
}

interface MessageBoxProps extends Exclude<React.ComponentProps<'div'>, 'children'> {
    validation?: ValidationInfo;
    size?: ComponentSize;
}

const MessageBox: React.FC<MessageBoxProps> = ({
    validation = {
        status: 'default',
        messages: [],
    },
    size = 'xs',
    className,
    style,
    ...props
}) => {
    const classes = clsx(className, styles.wrapper);

    const inlineStyle: CSSVars = {
        ...style,
        ...((validation && validation.status) && {'--text-color': `var(--text-${MessageBoxStatus[validation.status]})`}),
        '--fs': `var(--fs-${size})`
    }

    return (
        <Stack 
            className={classes} style={inlineStyle} {...props}
            direction='column' gap='sm'
            justify='flex-start' align='flex-start' >
            {(validation && validation.messages) && validation.messages.map((m: string) => (
                <span key={uuidv4()}>{m}</span>
            ))}
        </Stack>
    );
};

export default MessageBox;