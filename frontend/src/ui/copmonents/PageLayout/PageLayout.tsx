import React from 'react';
import styles from './PageLayout.module.scss';
import clsx from 'clsx';

const PageLayout: React.FC<React.ComponentProps<'div'>> = ({
    className,
    children,
    ...props
}) => {
    
    const classesLayout = clsx(styles.pageLayout, className);

    return (
        <div className={classesLayout} {...props} >
            {children}
        </div>
    );
};

export default PageLayout;