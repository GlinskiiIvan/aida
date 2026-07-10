import React from 'react';
import styles from './Block.module.scss';
import type { IconPath } from '../Icon';
import clsx from 'clsx';
import Icon from '../Icon';
import Stack from '../Stack';
import type { CSSVars } from '../types';

export interface BlockProps extends React.ComponentProps<'div'> {
    title?: string;
    decorativeIcon?: IconPath;
    fullWidth?: boolean;
    actions?: React.ReactNode;
    footer?: React.ReactNode;
}

const Block: React.FC<BlockProps> = ({
    title,
    decorativeIcon,
    actions,
    fullWidth = false,
    className,
    style,
    children,
    footer,
    ...props
}) => {
    const classesWrapper = clsx(className, styles.wrapper);

    const inlineStyle: CSSVars = {
        '--width-block': fullWidth ? '100%' : 'fit-content',
        ...style,
    };

    return (
        <Stack 
            className={classesWrapper} style={inlineStyle} {...props}
            direction='column' gap='xl'
            justify='flex-start' align='stretch' >
            {(title || decorativeIcon || actions) && (
                <Stack 
                    className={styles.header}
                    direction='row' gap='lg'
                    justify='space-between' align='flex-start' >
                    <Stack 
                        fitContent
                        className={styles.title} 
                        direction='row' gap='sm'
                        justify='flex-start' align='center' >
                        {decorativeIcon && <Icon name={decorativeIcon} size='inherit' color='primary' />}
                        {title && <h6>{title}</h6>}
                    </Stack>
                    {actions && (actions)}
                </Stack>
            )}
            {children}
            {footer && (footer)}
        </Stack>
    );
};

export default Block;