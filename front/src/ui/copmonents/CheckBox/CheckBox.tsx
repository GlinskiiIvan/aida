import React from 'react';
import styles from './CheckBox.module.scss';
import clsx from 'clsx';
import type { ValidationInfo } from '../types';
import Icon from '../Icon';
import FormField from '../FormField';

interface CheckBoxProps extends React.ComponentProps<'div'> {
    label?: string;
    validation?: ValidationInfo;
    value: boolean;
    changeValue: React.Dispatch<React.SetStateAction<boolean>>;
    disabled?: boolean;
}

const CheckBox: React.FC<CheckBoxProps> = ({
    label,
    validation,
    value,
    changeValue,
    className,
    disabled = false,
    ...props
}) => {

    const classes = clsx(className, styles.wrapper);
    const classesSquare = clsx(styles.square);

    const changeValueHandler = () => {
        changeValue(prev => !prev);
    }

    const inputId = React.useId();

    return (
        <FormField 
            {...props}
            className={classes}
            label={label ? {text: label, direction: 'row-reverse'} : undefined} 
            htmlFor={inputId} disabled={disabled} 
            validation={validation}>
            <input
                id={inputId}
                type="checkbox"
                checked={value}
                onChange={changeValueHandler}
                disabled={disabled}
                className={styles.input} />
            <span className={classesSquare}>
                <Icon name='CHECK' className={styles.check} color={disabled ? 'disabled' : 'inverse'} size='inherit' />
            </span>
        </FormField>
    );
};

export default CheckBox;