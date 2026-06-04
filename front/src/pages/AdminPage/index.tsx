import React from 'react';
import { useTranslation } from 'react-i18next';
import { Page } from '../../ui/copmonents';
import UserTable from './User';
import RoleTable from './Role';
import DoctorTable from './Doctor';

const AdminPage = () => {
    const {t} = useTranslation();
    return (
        <Page
            decorativeIcon='INFO'
            title={t('pages.admin.title')}
            description={t('pages.admin.description')} >

            <UserTable />
            <RoleTable />
            <DoctorTable />
        </Page>
    );
};

export default AdminPage;