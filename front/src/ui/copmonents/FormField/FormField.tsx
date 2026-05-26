import React from 'react';
import styles from './FormField.module.scss';
import type { CSSVars, ValidationInfo } from '../types';
import clsx from 'clsx';
import Label from '../Label';
import MessageBox from '../MessageBox';
import Stack from '../Stack';

interface FormFieldProps extends React.ComponentProps<'div'> {
    validation?: ValidationInfo;
    disabled?: boolean;
    htmlFor?: string;
    label?: {
        text: string;
        direction: 'column' | 'row' | 'column-reverse' | 'row-reverse';
    }
}

const FormField: React.FC<FormFieldProps> = ({
    label,
    validation,
    className,
    style,
    disabled = false,
    htmlFor,
    children,
    ...props
}) => {
    const classes = clsx(styles.wrapper, className);
    const classesLabel = clsx('form-field', styles.label, label ? styles[label.direction] : styles.column);

    const inlineStyle: CSSVars = {
        ...style,
        ...(disabled && {pointerEvents: 'none'})
    };

    return (
        <Stack 
            className={classes} style={inlineStyle} {...props}
            direction='column' gap='xs'
            justify='flex-start' align='stretch' >
            <label htmlFor={htmlFor} className={classesLabel}>
                {label && <Label className={styles.labelText}>{label?.text}</Label>}
                {children}
            </label>
            <MessageBox validation={validation} className={styles.msgBox} />
        </Stack>
    );
};

export default FormField;