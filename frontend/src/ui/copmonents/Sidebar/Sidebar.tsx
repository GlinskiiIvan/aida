import React from 'react';

import styles from './Sidebar.module.scss'
import Icon, { type IconPath } from '../Icon';
import Stack from '../Stack';
import Button from '../Button';

import clsx from 'clsx';
import { NavLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

export interface SidebarLinks {
    to: string;
    label: string;
    tooltip?: string;
    icon?: IconPath;
}

export interface SidebarSections {
    section?: string;
    links: SidebarLinks[]
}

export interface SidebarOrg {
    logo: string;
    name: string;
    to?: string;
};

export interface SidebarProfile {
    photo: string;
    name?: string;
    role?: string;
    logout: () => void;
};

export interface SidebarProps {
    items: SidebarSections[];
    organization: SidebarOrg;
    profile?: SidebarProfile;
    openSettings?: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({
    items,
    organization,
    profile,
    openSettings,
}) => {
    const {t} = useTranslation();
    
    const [menuShrink, setMenuShrink] = React.useState(false);
    const [activeTab, setActiveTab] = React.useState(sessionStorage.getItem('activeTab') || 0);

    const toggleMenu = () => {
        setMenuShrink(!menuShrink);
    }

    const changeLink = (id: number) => {
        setActiveTab(id);
        sessionStorage.setItem('activeTab', id.toString());
    }

    const changeLinkHandler = (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>, linkNumber: number) => {
        // e.preventDefault();
        changeLink(linkNumber);
    }

    const logoutHandler = () => {
        if(!profile) return;

        profile.logout();
        sessionStorage.removeItem('activeTab');
    }

    let i = 0;

    const onKeyDownShrink = (event: React.KeyboardEvent<HTMLElement>) => {
        if(event.code === 'Space') {
            event.preventDefault();
            toggleMenu();
        }
        if(event.code === 'Escape') {
            setMenuShrink(true);
        }
    }

    const getOrg = () => (
        <Stack 
            className={styles.header}
            direction='row' gap='sm' justify='flex-start' align='center' >
            <img src={organization.logo} alt="" className={styles.logo}/>
            <h3 className={clsx(styles.companyName, styles.hide)}>{organization.name}</h3>
        </Stack>
    );

    return (
        <nav className={menuShrink ? `${styles.wrapper} ${styles.shrink}` : styles.wrapper} onKeyDown={onKeyDownShrink}>

            <Stack 
                className={styles.header}
                direction='row' gap='sm' justify='flex-start' align='center' >
                <span className={styles.shrink_btn} onClick={toggleMenu}>
                    <Icon name='ARROWDOWN' color='primary' size='xl' />
                </span>
                
                {organization.to && (<NavLink to={organization.to} className={styles.logoLink}> { getOrg() } </NavLink>)}
                {!organization.to && (getOrg())}
            </Stack>

            <Stack 
                className={styles.content}
                direction='column' gap='xl' justify='flex-start' align='stretch' >

                {items.map((item, index) => {                 
                    return (
                        <React.Fragment key={`${item.section}$${index}`}>
                            {item.section && (
                                <div className={styles.split}>
                                    <h4 className={styles.hide}>{item.section}</h4>
                                    {menuShrink && <span></span>}
                                </div>
                            )}
                            <ul>
                                {/* {index === 0 && (
                                    <div className={styles.activeTab} style={{top: `calc(${activeTab} * 70px + 10px)`}}></div>
                                )} */}
                                {item.links.map((el) => {
                                    const linkNumber = index + i;
                                    i++
                                    return (
                                        <li key={el.to} className={styles.tooltipWrapper}>
                                            <NavLink className={({ isActive }) => (isActive ? styles.active : '')} to={el.to} onClick={() => changeLink(linkNumber)}>
                                                {el.icon && (
                                                    <div className={styles.iconWrapper}>
                                                        <Icon name={el.icon} />
                                                    </div>
                                                )}
                                                <p className={styles.hide}>{el.label}</p>
                                                {el.tooltip && (<span className={styles.tooltip}>{el.tooltip}</span>)}
                                            </NavLink>
                                        </li>
                                        // <li key={el.to} className={styles.tooltipWrapper}>
                                        //     <a
                                        //         href={el.to}
                                        //         className={linkNumber === activeTab ? styles.active : ''}
                                        //         onClick={(e) => changeLinkHandler(e, linkNumber)}
                                        //     >
                                        //         {el.icon && (
                                        //             <div className={styles.iconWrapper}>
                                        //                 <Icon name={el.icon} />
                                        //             </div>
                                        //         )}
                                        //         <p className={styles.hide}>{el.label}</p>
                                        //     </a>
                                        //     {el.tooltip && (<span className={styles.tooltip}>{el.tooltip}</span>)}
                                        // </li>
                                    )
                                })}
                            </ul>
                        </React.Fragment>
                    )
                })}
            </Stack>
            <Stack 
                className={styles.footer}
                direction='column' gap='md' justify='center' align='stretch' >
                {profile && (
                    <Stack 
                        className={`${styles.profile} ${styles.tooltipWrapper}`}
                        direction='row' gap='md' justify='flex-start' align='center' >
                        <img src={profile.photo} alt=""/>
                        <Stack 
                            className={`${styles.info} ${styles.hide}`}
                            direction='column' gap='sm' justify='flex-start' align='stretch' >
                            <span className={styles.name}>{profile?.name || 'Пользователь'}</span>
                            {profile.role && (<span className={styles.role}>{profile.role}</span>)}
                        </Stack>
                        <span className={styles.tooltip}>{profile.name}</span>
                    </Stack>
                )}
                {openSettings && (
                    <Button 
                        className={styles.tooltipWrapper} size='sm'
                        variant={'secondary'} icon='SETTINGS'
                        onClick={openSettings} >
                        <p className={styles.hide}>{t('common.settings')}</p>
                        <span className={styles.tooltip}>{t('common.settings')}</span>
                    </Button>
                )}
                {profile && (
                    <Button 
                        className={styles.tooltipWrapper} size='sm'
                        variant={'secondary'} intent='destructive' icon='LOGOUT'
                        onClick={logoutHandler} >
                        <p className={styles.hide}>{t('actions.logout')}</p>
                        <span className={styles.tooltip}>{t('actions.logout')}</span>
                    </Button>
                )}
            </Stack>
        </nav>
    );
};

export default Sidebar;