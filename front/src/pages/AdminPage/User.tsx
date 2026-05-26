import React from 'react';
import { ManagedTable, Page, Select, Stack, TextField, type ColumnTable, type SelectItem } from '../../ui/copmonents';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../../routes';

import { userApi } from '../../store/services/user';

const UserPage = () => {
    const {t} = useTranslation();
    const navigate = useNavigate();
    
    const allDataQuery = userApi.useLazyFindAllUsersQuery();
    const oneDataQuery = userApi.useLazyFindOneUserQuery();

    const createMutation = userApi.useCreateUserMutation();
    const updateMutation = userApi.useUpdateUserMutation();
    const removeMutation = userApi.useRemoveUserMutation();

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
                    limit: 6,
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
                }} >

            </ManagedTable>
        </>
    );
};

export default UserPage;