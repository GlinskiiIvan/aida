import React from 'react';
import { Button, ManagedTable, Modal, Page, Select, Stack, TextField, type ColumnTable, type SelectItem } from '../../ui/copmonents';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../../routes';

import { roleApi } from '../../store/services/role';
import { useModal } from '../../ui/copmonents/Modal/useModal';
import { permissionApi, type Permission } from '../../store/services/permission';

const rolePage = () => {
    const {t} = useTranslation();
    const navigate = useNavigate();
    
    const allDataQuery = roleApi.useLazyFindAllRolesQuery();
    const oneDataQuery = roleApi.useLazyFindOneRoleQuery();

    const createMutation = roleApi.useCreateRoleMutation();
    const updateMutation = roleApi.useUpdateRoleMutation();
    const removeMutation = roleApi.useRemoveRoleMutation();

    const [updateRolePermissionsTrigger, updateRolePermissionsData] = roleApi.useUpdatePermissionsMutation();

    const [allRolePermissionsTrigger, allRolePermissionsData] = roleApi.useLazyFindAllRolePermissionsQuery();
    const [allPermissionsTrigger, allPermissionsData] = permissionApi.useLazyFindAllPermissionsQuery();

    const [actionMode, setActionMode] = React.useState<'create' | 'edit'>('create');

    const allData = allDataQuery[1]?.data?.data || [];
    const oneData = oneDataQuery[1]?.data;

    const columns: ColumnTable<typeof allData[number]>[] = [
        {key: 'id', label: 'ID', sortable: false}, 
        {key: 'value', label: t('entities.role.fields.value'), sortable: false}, 
        {key: 'description', label: t('entities.role.fields.description'), sortable: false}, 
    ];

    // FILTERS START //////////////////////////////////////////////////////////////
    const searchFieldOptions: SelectItem[] = [
        {
            title: t('entities.role.fields.value'),
            value: 'value',
        },
        {
            title: t('entities.role.fields.description'),
            value: 'description',
        },
    ];

    const sortedFieldOptions: SelectItem[] = searchFieldOptions;
    // FILTERS END//////////////////////////////////////////////////////////////////////

    // ACTIONS START /////////////////////////////////////////////////////////////////
    type RecordData = {
        value: string;
        description: string;
    };

    const initialRecordData: RecordData = {
        value: '',
        description: ''
    };

    const [recordFields, setRecordFields] = React.useState<RecordData>(initialRecordData);

    const recordData = {
        ...recordFields,
    };

    const canSubmitRecord = recordFields.value.trim() !== '' && recordFields.description.trim() !== '';

    const fillFormWithRecordData = () => {
        if(oneData) {
            setActionMode('edit');
            setRecordFields({
                value: oneData.value || '',
                description: oneData.description || '',
            });
        }
    }

    const clearFieldsRecordHandler = () => {
        setActionMode('create');
        setRecordFields(initialRecordData);
    }
    // ACTIONS END ///////////////////////////////////////////////////////////////////
    
    const updateRolePermissionsModal = useModal('updateRolePermissionsModal');

    const openUpdateRolePermissionsModalHandler = () => {
        if(oneData) {
            allPermissionsTrigger({});
            allRolePermissionsTrigger(oneData.id);
        }
        updateRolePermissionsModal.open();
    }

    React.useEffect(() => {
        if(allRolePermissionsData.isSuccess) {
            setRolePermissions(allRolePermissionsData.data ?? []);
        }
    }, [allRolePermissionsData.fulfilledTimeStamp, allRolePermissionsData.isSuccess])

    const updateRolePermissionsHandler = () => {
        if(oneData) {
            updateRolePermissionsTrigger({
                id: oneData.id,
                permissions: rolePermissions.map(el => el.id)
            })
        }
        updateRolePermissionsModal.close();
    }

    React.useEffect(() => {
        if(!updateRolePermissionsModal.show) {
            setRolePermissions([]);
        }
    }, [updateRolePermissionsModal.show])

    const [rolePermissions, setRolePermissions] = React.useState<Permission[]>([]);

    return (
        <>
            <ManagedTable
                blockPops={{
                    title: t('entities.role.plural'),
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
                    // period: true,
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
                                value={recordFields.value} 
                                onChangeValue={(val: string) => setRecordFields((prev) => ({ ...prev, value: val }))}
                                label={t('entities.role.fields.value')} />
                            <TextField 
                                value={recordFields.description} 
                                onChangeValue={(val: string) => setRecordFields((prev) => ({ ...prev, description: val }))}
                                label={t('entities.role.fields.description')} />
                        </Stack>
                    ),
                    recordData,
                    canSubmitRecord,
                    fillFormWithRecordData,
                    clearFieldsRecordHandler,
                    modalActions: <>{
                        (actionMode === 'edit') && (
                            <Button 
                                variant='secondary' intent='normal' icon='EDIT' 
                                onClick={openUpdateRolePermissionsModalHandler} >
                                    {t('pages.admin.tables.role.editPermissions')}
                            </Button>
                        )
                    }</>
                }} >

            </ManagedTable>

            <Modal 
                title={`${t(`enums.action.edit`)} ${t('entities.permission.pluralCases.genitive').toLocaleLowerCase()}`}
                options={updateRolePermissionsModal}
                footer={
                    <Stack direction='row' gap='sm' justify='flex-end' align='center'>
                        <Button variant='primary' intent='normal' icon='CHECK' onClick={updateRolePermissionsHandler} >{t('actions.confirm')}</Button>
                        <Button variant='secondary' intent='destructive' icon='CLOSE' onClick={() => updateRolePermissionsModal.close()} >{t('actions.cancel')}</Button>
                    </Stack>
                } >
                    {allPermissionsData.isSuccess && (
                        <Select<Permission>
                            multiple dropdownMode='sticky'
                            label={t('entities.role.fields.permissions')}
                            options={allPermissionsData.data.data} value={rolePermissions} onChangeValue={setRolePermissions} 
                            getKey={(T) => T.id} getValue={(T) => T.value} />
                    )}
            </Modal>
        </>
    );
};

export default rolePage;