import React from 'react';
import styles from './InfoList.module.scss';

export interface InfoListOption {
    key: string;
    value: React.ReactNode;
}

interface InfoListProps extends React.ComponentProps<'ul'> {
    oprions: InfoListOption[];
}

const InfoList: React.FC<InfoListProps> = ({
    oprions,
    ...props
}) => {
    return (
        <ul className={styles.wrapper} {...props}>
            {oprions.map((item) => (
                <li key={item.key} className={styles.option}>
                    <span className={styles.key}>{item.key}:</span>
                    <span className={styles.divider} />
                    <span className={styles.value}>{item.value}</span>
                </li>
            ))}
        </ul>
    );
};

export default InfoList;