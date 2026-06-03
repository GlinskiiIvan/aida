import React from 'react';
import { Button, ManagedTable, Modal, Page, Select, Stack, TextField, type ColumnTable, type SelectItem } from '../../ui/copmonents';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../../routes';

import { userApi } from '../../store/services/user';
import { roleApi, type Role } from '../../store/services/role';
import { useModal } from '../../ui/copmonents/Modal/useModal';

const UserPage = () => {
    const {t} = useTranslation();
    const navigate = useNavigate();
    
    const allDataQuery = userApi.useLazyFindAllUsersQuery();
    const oneDataQuery = userApi.useLazyFindOneUserQuery();

    const createMutation = userApi.useCreateUserMutation();
    const updateMutation = userApi.useUpdateUserMutation();
    const removeMutation = userApi.useRemoveUserMutation();

    const [updateUserRolesTrigger, updateUserRolesData] = userApi.useUpdateRolesMutation();
    const [allUserRolesTrigger, allUserRolesData] = userApi.useLazyFindAllUserRolesQuery();
    const [allRolesTrigger, allRolesData] = roleApi.useLazyFindAllRolesQuery();

    const allData = allDataQuery[1]?.data?.data || [];
    const oneData = oneDataQuery[1]?.data;

    const columns: ColumnTable<typeof allData[number]>[] = [
        {key: 'id', label: 'ID', sortable: false}, 
        {key: 'email', label: t('entities.user.fields.email'), sortable: false}, 
        {key: 'banned', label: t('entities.user.fields.banned'), sortable: false, render: (item) => item.banned ? <span>Да</span> : <span>Нет</span>}, 
        {key: 'banReason', label: t('entities.user.fields.banReason'), sortable: false}, 
    ];

    // FILTERS START //////////////////////////////////////////////////////////////
    const searchFieldOptions: SelectItem[] = [
        {
            title: t('entities.user.fields.email'),
            value: 'email',
        },
        {
            title: t('entities.user.fields.banReason'),
            value: 'banReason',
        },
    ];

    const sortedFieldOptions: SelectItem[] = searchFieldOptions;
    // FILTERS END//////////////////////////////////////////////////////////////////////

    // ACTIONS START /////////////////////////////////////////////////////////////////
    type RecordData = {
        email: string;
        password: string;
    };

    const initialRecordData: RecordData = {
        email: '',
        password: ''
    };

    const [recordFields, setRecordFields] = React.useState<RecordData>(initialRecordData);

    const recordData = {
        ...recordFields,
    };

    const canSubmitRecord = recordFields.email.trim() !== '' && recordFields.password.trim() !== '';

    const fillFormWithRecordData = () => {
        if(oneData) {
            setRecordFields({
                email: oneData.email || '',
                password: '',
            });
        }
    }

    const clearFieldsRecordHandler = () => {
        setRecordFields(initialRecordData);
    }
    // ACTIONS END ///////////////////////////////////////////////////////////////////
    
    const updateUserRolesModal = useModal('updateUserRolesModal');

    const openUpdateUserRolesModalHandler = () => {
        if(oneData) {
            allRolesTrigger({});
            allUserRolesTrigger(oneData.id);
        }
        updateUserRolesModal.open();
    }

    React.useEffect(() => {
        if(allUserRolesData.isSuccess) {
            setUserRoles(allUserRolesData.data ?? []);
        }
    }, [allUserRolesData.fulfilledTimeStamp, allUserRolesData.isSuccess])

    const updateUserRolesHandler = () => {
        if(oneData) {
            updateUserRolesTrigger({
                id: oneData.id,
                roles: userRoles.map(el => el.id)
            })
        }
        updateUserRolesModal.close();
    }

    React.useEffect(() => {
        if(!updateUserRolesModal.show) {
            setUserRoles([]);
        }
    }, [updateUserRolesModal.show])

    const [userRoles, setUserRoles] = React.useState<Role[]>([]);

    return (
        <>
            <ManagedTable
                blockPops={{
                    title: t('entities.user.plural'),
                    fullWidth: true,
                }}
                tableProps={{
                    table: {
                        maxHeight: 400,
                    },
                    thead: {
                        columns,
                    },
                    tbody: {
                        rowKey: 'id',
                        columns,
                        data: allData,
                    },
                }}
                filters={{
                    period: true,
                    searchFieldOptions,
                    sortedFieldOptions,
                }}
                hasPermissions={{
                    read: true,
                    create: true,
                    update: true,
                    delete: true,
                }}
                crudApiTable={{
                    getAllQuery: allDataQuery,
                    getOneQuery: oneDataQuery,
                    createMutation: createMutation,
                    updateMutation: updateMutation,
                    removeMutation: removeMutation,
                    limit: 15,
                }}
                record={{
                    body: (
                        <Stack direction='column' gap='md' justify='flex-start' align='stretch'>
                            <TextField 
                                value={recordFields.email} 
                                onChangeValue={(val: string) => setRecordFields((prev) => ({ ...prev, email: val }))}
                                label={t('entities.user.fields.email')} />
                            <TextField 
                                value={recordFields.password} 
                                onChangeValue={(val: string) => setRecordFields((prev) => ({ ...prev, password: val }))}
                                label={t('entities.user.fields.password')} />
                        </Stack>
                    ),
                    recordData,
                    canSubmitRecord,
                    fillFormWithRecordData,
                    clearFieldsRecordHandler,
                    modalActions: <>
                        <Button 
                            variant='secondary' intent='normal' icon='EDIT' 
                            onClick={openUpdateUserRolesModalHandler} >
                                {t('pages.admin.tables.user.editRoles')}
                        </Button>
                    </>
                }} >

            </ManagedTable>
            
            <Modal 
                title={`${t(`enums.action.edit`)} ${t('entities.role.pluralCases.genitive').toLocaleLowerCase()}`}
                options={updateUserRolesModal}
                footer={
                    <Stack direction='row' gap='sm' justify='flex-end' align='center'>
                        <Button variant='primary' intent='normal' icon='CHECK' onClick={updateUserRolesHandler} >{t('actions.confirm')}</Button>
                        <Button variant='secondary' intent='destructive' icon='CLOSE' onClick={() => updateUserRolesModal.close()} >{t('actions.cancel')}</Button>
                    </Stack>
                } >
                    {allRolesData.isSuccess && (
                        <Select<Role>
                            multiple dropdownMode='sticky'
                            label={t('entities.user.fields.roles')}
                            options={allRolesData.data.data} value={userRoles} onChangeValue={setUserRoles} 
                            getKey={(T) => T.id} getValue={(T) => T.value} />
                    )}
            </Modal>
        </>
    );
};

export default UserPage;