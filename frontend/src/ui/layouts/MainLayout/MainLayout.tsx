import React from 'react';
import styles from './MainLayout.module.scss'
import {Outlet} from "react-router-dom";
import { Sidebar, type SidebarProps } from '../../copmonents';

interface IProps {
    sidebar: SidebarProps;
}

const MainLayout: React.FC<IProps> = ({sidebar}) => {
    return (
        <div className={styles.container}>
            <Sidebar {...sidebar} />

            <main className={styles.outlet}>
                <Outlet />
                {/* <Notice /> */}
            </main>
        </div>
    );
};

export default MainLayout;