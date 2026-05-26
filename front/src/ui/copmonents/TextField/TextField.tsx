import React from 'react';
import styles from './TextField.module.scss';
import FormField from '../FormField';
import type { ValidationInfo } from '../types';
import Icon, { type IconPath } from '../Icon';
import clsx from 'clsx';
import IconButton from '../IconButton';
import FieldTrigger from '../FieldTrigger';
import { useTranslation } from 'react-i18next';

interface ActionIcon {
    name: IconPath;
    onClick: () => void;
    visible?: boolean
}

interface TextFieldProps extends React.ComponentProps<'input'> {
    value: string | undefined;
    onChangeValue: (value: string) => void;

    label?: string;
    placeholder?: string;
    validation?: ValidationInfo;
    disabled?: boolean;
    decorativeIcon?: IconPath;
    actionIcon?: ActionIcon | React.ReactNode;
} 

const TextField: React.FC<TextFieldProps> = ({
    value,
    onChangeValue,

    label,
    placeholder = '',
    validation = {
        status: 'default',
        messages: []
    },
    disabled = false,
    decorativeIcon,
    actionIcon,

    type='text',
    className,
    ...props
}) => {
    const {t} = useTranslation();
    
    const inputId = React.useId();
    const inputRef = React.useRef<HTMLInputElement>(null);

    const isActionIcon = typeof actionIcon === 'object' && actionIcon !== null && 'name' in actionIcon;

    const classesLayout = clsx(styles.fieldLayot);
    const classesWrapper = clsx(styles.wrapper);
    const actionIconClasses = clsx(styles.actionIcon, {[styles.visible]: isActionIcon && actionIcon.visible});


    const changeValueHandler = (e: React.ChangeEvent<HTMLInputElement, HTMLInputElement>) => {
        onChangeValue(e.target.value);
    }

    const onClickActionHandler = (action: () => void) => {
        action();
        setTimeout(() => {
            inputRef.current?.focus();
        }, 0);
    }

    return (
        <FormField 
            className={classesLayout}
            label={label ? {text: label, direction: 'column'} : undefined} 
            validation={validation} disabled={disabled}
            htmlFor={inputId} >
            <FieldTrigger status={validation?.status || 'default'} className={classesWrapper} disabled={disabled} >
                {decorativeIcon && <Icon name={decorativeIcon} />}
                <input 
                    {...props}
                    ref={inputRef} id={inputId}
                    type={type} placeholder={placeholder || t('ui.placeholder.textField.default')}
                    className={styles.input} disabled={disabled}
                    value={value} onChange={changeValueHandler} />
                {React.isValidElement(actionIcon) && actionIcon}
                {isActionIcon && <IconButton 
                                    className={actionIconClasses} disabled={disabled}
                                    icon={{name: actionIcon.name}} onClick={() => onClickActionHandler(actionIcon.onClick)}
                                    tabIndex={!actionIcon.visible ? -1 : 0} />}
            </FieldTrigger>
        </FormField>
    );
};

export default TextField;