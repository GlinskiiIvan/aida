import React from 'react';
import styles from './FieldTrigger.module.scss';
import type { ComponentStatus } from '../types';
import clsx from 'clsx';
import Stack from '../Stack';

interface FieldTriggerProps extends React.ComponentProps<'div'> {
    status?: ComponentStatus;
    disabled?: boolean;
}

const FieldTrigger: React.FC<FieldTriggerProps> = ({
    status,
    className,
    children,
    disabled = false,
    ...props
}) => {
    const classesWrapper = clsx(className, styles.wrapper, status ? styles[status] : styles.default, disabled && styles.disabled);

    return (
        <Stack 
            className={classesWrapper} {...props}
            direction='row' gap='sm' justify='flex-start' align='center' >
            {children}
        </Stack>
    );
};

export default FieldTrigger;