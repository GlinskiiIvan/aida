import React from 'react';
import styles from './Page.module.scss';
import type { IconPath } from '../Icon';
import PageLayout from '../PageLayout';
import Stack from '../Stack';
import Icon from '../Icon';

export interface PageProps {
    readonly title?: string;
    readonly description?: string;
    readonly decorativeIcon?: IconPath;
    readonly children: React.ReactNode;
};

const Page: React.FC<PageProps> = ({
    title,
    decorativeIcon,
    description,
    children
}) => {

    return (
        <PageLayout>
            <Stack 
                direction='column' justify='flex-start'
                align='center' gap='xl' >
                <Stack 
                    className={styles.header} 
                    direction='row' justify='flex-start' 
                    align='flex-start' gap='md' >
                    {decorativeIcon && <Icon className={styles.icon} name={decorativeIcon} color='secondary' />}
                    <Stack 
                        className={styles.content} 
                        direction='column' justify='flex-start' 
                        align='flex-start' gap='xs' >
                        {title && (<h1 className={styles.title}>{title}</h1>)}
                        {description && (<p className={styles.desc}>{description}</p>)}
                    </Stack>
                </Stack>
                {children}
            </Stack>
        </PageLayout>
    );
};

export default Page;