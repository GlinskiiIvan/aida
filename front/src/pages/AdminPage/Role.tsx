import React from 'react';
import { ManagedTable, Page, Select, Stack, TextField, type ColumnTable, type SelectItem } from '../../ui/copmonents';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../../routes';

import { roleApi } from '../../store/services/role';

const rolePage = () => {
    const {t} = useTranslation();
    const navigate = useNavigate();
    
    const allDataQuery = roleApi.useLazyFindAllRolesQuery();
    const oneDataQuery = roleApi.useLazyFindOneRoleQuery();

    const createMutation = roleApi.useCreateRoleMutation();
    const updateMutation = roleApi.useUpdateRoleMutation();
    const removeMutation = roleApi.useRemoveRoleMutation();

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
            setRecordFields({
                value: oneData.value || '',
                description: oneData.description || '',
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
                }} >

            </ManagedTable>
        </>
    );
};

export default rolePage;