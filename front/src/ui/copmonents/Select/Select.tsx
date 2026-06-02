import React from 'react';
import styles from './Select.module.scss';
import FormField from '../FormField';
import FieldTrigger from '../FieldTrigger';
import type { ValidationInfo } from '../types';
import type { IconPath } from '../Icon';
import clsx from 'clsx';
import Icon from '../Icon';
import { useTranslation } from 'react-i18next';
import Badge from '../Badge';

type SingeSelect<T> = {
    multiple?: false;
    value: T | undefined;
    onChangeValue: (value: T | undefined) => void;
}

type MultipleSelect<T> = {
    multiple: true;
    value: T[];
    onChangeValue: (value: T[]) => void;
}

type SelectProps<T> = {
    label?: string;
    placeholder?: string;
    validation?: ValidationInfo;
    disabled?: boolean;

    options: T[];

    getKey?: (item: T) => React.Key;
    getValue?: (item: T) => React.ReactNode;

    decorativeIcon?: IconPath;
} & React.ComponentProps<'div'> & (SingeSelect<T> | MultipleSelect<T>)

const Select = <T,>({
    options = [],
    getKey,
    getValue,
    multiple,
    value,
    placeholder = '',
    onChangeValue,
    disabled = false,
    label,
    validation = {
        status: 'default',
        messages: []
    },
    decorativeIcon,
    className,
    ...props
}: SelectProps<T>) => {
    const {t} = useTranslation();
    
    const selectRef = React.useRef<HTMLDivElement>(null);

    const [isOpen, setIsOpen] = React.useState(false);
    
    const classesLayout = clsx(className, styles.fieldLayot);
    const classesWrapper = clsx(styles.wrapper, isOpen && styles.open);
    const classesList = clsx(styles.list, {[styles.open]: isOpen});

    const isObject = (item: unknown) => (item !== undefined) && (typeof item === 'object');
    const isGetters = (getValue !== undefined) && (getKey !== undefined);

    const onClickTrigger = React.useCallback(() => {
        setIsOpen(prev => !prev);
    }, [setIsOpen])

    const onChangeValueHandler = (item: T) => {
        if(multiple) {
            if(value.includes(item)) {
                onChangeValue(value.filter(el => getKey?.(el) !== getKey?.(item)));
            } else {
                onChangeValue([...value, item]);
            }
        } else {
            if(value === item) {
                onChangeValue(undefined);
            } else {
                onChangeValue(item);
            }
            setIsOpen(false);
        }
    }

    React.useEffect(() => {
        if(!isOpen) return;

        const handleClickOutside = (e: MouseEvent) => {
            if (
                selectRef.current &&
                !selectRef.current.contains(e.target as Node)
            ) {
                setIsOpen(false);
            }
        }

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [onClickTrigger, isOpen]);

    React.useEffect(() => {
        if(!isOpen) return;

        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                onClickTrigger();
            }
        };

        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, [onClickTrigger, isOpen]);

    const Placeholder = () => <span className={styles.placeholder}>{placeholder || t('ui.placeholder.select.default')}</span>;
    const SingeValue = () => <>
        {!multiple && (
            value === undefined
                ? <Placeholder />
                : isObject(value)
                ? getValue?.(value as T)
                : (value as React.ReactNode)
        )}
    </>;
    const MultipleValue = () => <>
        {(multiple) && (
            value.length === 0
            ? (<span className={styles.placeholder}>{placeholder || t('ui.placeholder.select.default')}</span>)
            : value.map(el => (
                <Badge key={getKey?.(el)} status={'default'} size={'xs'} text={isObject(el) ? getValue?.(el)?.toString() : (el as React.ReactNode)?.toString()} />
            ))
        )}
    </>;

    return (
        <FormField 
            {...props} className={classesLayout} ref={selectRef}
            label={label ? {text: label, direction: 'column'} : undefined} 
            validation={validation} disabled={disabled} >
            <div style={{position: 'relative'}}>
                <FieldTrigger disabled={disabled} status={validation?.status || 'default'} className={classesWrapper} >
                    {decorativeIcon && <Icon name={decorativeIcon} />}
                    <button className={styles.trigger} onClick={onClickTrigger} >
                        <SingeValue />
                        <MultipleValue />
                    </button>
                    <Icon className={styles.arrow} name='ARROWDOWN' />
                </FieldTrigger>
                <ul className={classesList}>
                    {options && options.map((item) => {
                        let display: React.ReactNode | string | number;
                        let key: React.Key;

                        if((item !== undefined) && isGetters && (typeof item === 'object')) {
                            display = getValue(item);
                            key = getKey(item);
                        } else {
                            display = item as string | number;
                            key = item as string | number;
                        }

                        let selected = multiple
                            ? value.some(el => isObject(el) ? (key === getKey?.(el)) : (key === el))
                            : isObject(value) ? (key === getKey?.(value)) : (key === value);
                        

                        const classesOption = clsx({[styles.selected]: selected}, styles.option);

                        return (
                            <button key={String(key)} tabIndex={isOpen ? 0 : -1} className={classesOption} onClick={() => onChangeValueHandler(item)}>
                                {display}
                                <Icon name='CHECK' />
                            </button>
                        )
                    })}
                </ul>
            </div>
        </FormField>
    );
};

export default Select;