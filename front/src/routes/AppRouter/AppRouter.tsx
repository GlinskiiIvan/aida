import React from 'react';
import {Navigate, Route, Routes} from "react-router-dom";
import { MainLayout } from '../../ui/layouts';
import { ROUTES } from '../routes';

import logo from '../../../public/logo.png';
import userPhoto from '../../assets/images/user.png';
import type { IconPath } from '../../ui/copmonents';
import {ExamplesPage} from '../../pages/examples';
import { MainPage, PatientCardPage, PatientPage, StudyCardPage, StudyPage } from '../../pages';
import RequireAuth from '../../ui/app/RequireAuth';
import { checkThunk, logout, logoutThunk, selectUserData } from '../../store/slices/auth';
import { useDispatch, useSelector } from 'react-redux';
import { store, type AppDispatch } from '../../store/store';
import {LoginPage} from '../../pages';
import { useTranslation } from 'react-i18next';
import { setLogoutHandler } from '../../store/http';
import AdminPage from '../../pages/AdminPage';
import { useModal } from '../../ui/copmonents/Modal/useModal';
import Settings from '../../ui/app/Settings';

const AppRouter: React.FC = () => {
    const {t} = useTranslation();
    
    const dispatch = useDispatch<AppDispatch>();
    const userData = useSelector(selectUserData);

    const logoutHandler = () => {
        dispatch(logoutThunk());
    }
    
    React.useEffect(() => {        
        dispatch(checkThunk());
    }, []);

    setLogoutHandler(() => {
        store.dispatch(logout()); 
    });

    const sidebatItems = [
        {
            links: [
                {
                    to: ROUTES.Admin,
                    label: t('sidebar.admin'),
                    tooltip: t('sidebar.admin'),
                    icon: 'INFO' as IconPath,
                },
                {
                    to: ROUTES.Main,
                    label: t('sidebar.main'),
                    tooltip: t('sidebar.main'),
                    icon: 'INFO' as IconPath,
                },
                {
                    to: ROUTES.Patients,
                    label: t('sidebar.patients'),
                    tooltip: t('sidebar.patients'),
                    icon: 'INFO' as IconPath,
                },
                {
                    to: ROUTES.Studies,
                    label: t('sidebar.studies'),
                    tooltip: t('sidebar.studies'),
                    icon: 'INFO' as IconPath,
                },
                // {
                //     to: ROUTES.Examples,
                //     label: t('sidebar.examples'),
                //     tooltip: t('sidebar.examples'),
                //     icon: 'INFO' as IconPath,
                // },
            ]
        }
    ];

    const settingsModal = useModal('settingsModal');
    
    return (
        <Routes>
            <Route path={ROUTES.Login} element={ <LoginPage /> } />
            <Route path={ROUTES.Main} element={
                <RequireAuth>
                    <MainLayout sidebar={{
                        items: sidebatItems,
                        organization: {
                            logo: logo,
                            name: 'AIDA',
                            to: ROUTES.Main
                        },
                        profile: {
                            name: userData?.email,
                            photo: userPhoto,
                            role: userData?.roles?.map(role => role.value).join(', '),
                            logout: logoutHandler,
                        },
                        openSettings: settingsModal.open
                    }} />
                    <Settings options={settingsModal} />
                </RequireAuth>
                
            }>
                <Route index element={<MainPage />} />
                <Route path={ROUTES.Patients} element={ <PatientPage /> } />
                <Route path={ROUTES.Patient} element={ <PatientCardPage /> } />
                <Route path={ROUTES.Studies} element={ <StudyPage /> } />
                <Route path={ROUTES.Study} element={ <StudyCardPage /> } />
                <Route path={ROUTES.Examples} element={ <ExamplesPage /> } />
                <Route path={ROUTES.Admin} element={ <AdminPage /> } />

            </Route>
            <Route path='*' element={ <Navigate to={ROUTES.Main}></Navigate> } />
        </Routes>        
    );
};

export default AppRouter;
