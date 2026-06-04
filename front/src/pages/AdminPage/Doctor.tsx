import React from 'react';
import { Button, ManagedTable, Modal, Page, Select, Stack, TextField, type ColumnTable, type SelectItem } from '../../ui/copmonents';
import { useTranslation } from 'react-i18next';

import { doctorApi } from '../../store/services/doctor';
import { userApi } from '../../store/services/user';
import type { User } from '../../store/services/user';
import { Gender } from '../../common/enums';

const doctorPage = () => {
    const {t} = useTranslation();
    
    const allDataQuery = doctorApi.useLazyFindAllDoctorsQuery();
    const oneDataQuery = doctorApi.useLazyFindOneDoctorQuery();

    const createMutation = doctorApi.useCreateDoctorMutation();
    const updateMutation = doctorApi.useUpdateDoctorMutation();
    const removeMutation = doctorApi.useRemoveDoctorMutation();

    const [allUserDataTrigger, allUserData] = userApi.useLazyFindAllUsersQuery();

    const allData = allDataQuery[1]?.data?.data || [];
    const oneData = oneDataQuery[1]?.data;

    const columns: ColumnTable<typeof allData[number]>[] = [
        {key: 'id', label: 'ID', sortable: false}, 
        {key: 'fullName', label: t('entities.doctor.fields.fullName'), sortable: false}, 
        {key: 'birthDate', label: t('entities.doctor.fields.birthDate'), sortable: false}, 
        {key: 'gender', label: t('entities.doctor.fields.gender'), sortable: false}, 
        {key: 'phone', label: t('entities.doctor.fields.phone'), sortable: false}, 
        {key: 'contactEmail', label: t('entities.doctor.fields.contactEmail'), sortable: false}, 
        {key: 'specialization', label: t('entities.doctor.fields.specialization'), sortable: false}, 
        {key: 'department', label: t('entities.doctor.fields.department'), sortable: false}, 
        {key: 'licenseNumber', label: t('entities.doctor.fields.licenseNumber'), sortable: false}, 
        {key: 'note', label: t('entities.doctor.fields.note'), sortable: false}, 
    ];

    // FILTERS START //////////////////////////////////////////////////////////////
    const searchFieldOptions: SelectItem[] = [
        {
            title: t('entities.doctor.fields.fullName'),
            value: 'fullName',
        },
        {
            title: t('entities.doctor.fields.birthDate'),
            value: 'birthDate',
        },
        {
            title: t('entities.doctor.fields.gender'),
            value: 'gender',
        },
        {
            title: t('entities.doctor.fields.phone'),
            value: 'phone',
        },
        {
            title: t('entities.doctor.fields.contactEmail'),
            value: 'contactEmail',
        },
        {
            title: t('entities.doctor.fields.specialization'),
            value: 'specialization',
        },
        {
            title: t('entities.doctor.fields.department'),
            value: 'department',
        },
        {
            title: t('entities.doctor.fields.licenseNumber'),
            value: 'licenseNumber',
        },
        {
            title: t('entities.doctor.fields.note'),
            value: 'note',
        },
    ];

    const sortedFieldOptions: SelectItem[] = searchFieldOptions;
    // FILTERS END//////////////////////////////////////////////////////////////////////

    // ACTIONS START /////////////////////////////////////////////////////////////////
    type RecordData = {
        user?: User;
        fullName: string;
        birthDate: string;
        gender?: typeof gendertOptions[0];
        phone: string;
        contactEmail?: string;
        specialization: string;
        department: string;
        licenseNumber?: string;
        note?: string;
    };

    const initialRecordData: RecordData = {
        user: undefined,
        fullName: '',
        birthDate: '',
        gender: undefined,
        phone: '',
        contactEmail: undefined,
        specialization: '',
        department: '',
        licenseNumber: undefined,
        note: undefined,
    };

    const [recordFields, setRecordFields] = React.useState<RecordData>(initialRecordData);

    const { user, ...restFields } = recordFields;
    const recordData = {
        ...restFields,
        userId: recordFields.user?.id,
        gender: recordFields.gender?.id,
    };

    const canSubmitRecord = 
        recordFields.user !== undefined &&
        recordFields.fullName.trim() !== '' &&
        recordFields.birthDate.trim() !== '' &&
        recordFields.gender !== undefined &&
        recordFields.phone.trim() !== '' &&
        recordFields.specialization.trim() !== '' &&
        recordFields.department.trim() !== '';

    const fillFormWithRecordData = () => {
        if(oneData) {
            setRecordFields({
                user: allUserData.data?.data.find(el => el.id === oneData.id) || undefined,
                fullName: oneData.fullName || '',
                birthDate: oneData.birthDate || '',
                gender: gendertOptions.find(el => el.id === oneData.gender) || undefined,
                phone: oneData.phone || '',
                contactEmail: oneData.contactEmail || undefined,
                specialization: oneData.specialization || '',
                department: oneData.department || '',
                licenseNumber: oneData.licenseNumber || undefined,
                note: oneData.note || undefined,
            });
        }
    }

    const clearFieldsRecordHandler = () => {
        setRecordFields(initialRecordData);
    }
    // ACTIONS END ///////////////////////////////////////////////////////////////////
    const fetchAuxiliaryData = () => {
        allUserDataTrigger({});
    };

    const gendertOptions = [
        {id: Gender.Male, name: t('enums.gender.male')},
        {id: Gender.Female, name: t('enums.gender.female')},
    ];

    return (
        <>
            <ManagedTable
                blockPops={{
                    title: t('entities.doctor.plural'),
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
                auxiliaryData={{
                    fetchAuxiliaryData,
                    isLoading: allUserData.isLoading
                }}
                record={{
                    body: (
                        <Stack direction='column' gap='md' justify='flex-start' align='stretch'>
                            <Select<User>
                                dropdownMode='sticky'
                                label={t('entities.doctor.fields.userId')}
                                options={allUserData.data?.data || []} value={recordFields.user} onChangeValue={(value) => setRecordFields({...recordFields, user: value})} 
                                getKey={(T) => T.id} getValue={(T) => T.email} />
                            <TextField 
                                value={recordFields.fullName} 
                                onChangeValue={(val: string) => setRecordFields((prev) => ({ ...prev, fullName: val }))}
                                label={t('entities.doctor.fields.fullName')} />
                            <TextField 
                                value={recordFields.birthDate} 
                                onChangeValue={(val: string) => setRecordFields((prev) => ({ ...prev, birthDate: val }))}
                                label={t('entities.doctor.fields.birthDate')}
                                type="date" />
                            <Select<typeof gendertOptions[0]>
                                dropdownMode='sticky'
                                label={t('entities.doctor.fields.gender')}
                                options={gendertOptions} value={recordFields.gender} onChangeValue={(value) => setRecordFields({...recordFields, gender: value})} 
                                getKey={(T) => T.id} getValue={(T) => T.name} />
                            <TextField 
                                value={recordFields.phone} 
                                onChangeValue={(val: string) => setRecordFields((prev) => ({ ...prev, phone: val }))}
                                label={t('entities.doctor.fields.phone')} />
                            <TextField 
                                value={recordFields.contactEmail} 
                                onChangeValue={(val: string) => setRecordFields((prev) => ({ ...prev, contactEmail: val }))}
                                label={t('entities.doctor.fields.contactEmail')} />
                            <TextField 
                                value={recordFields.specialization} 
                                onChangeValue={(val: string) => setRecordFields((prev) => ({ ...prev, specialization: val }))}
                                label={t('entities.doctor.fields.specialization')} />
                            <TextField 
                                value={recordFields.department} 
                                onChangeValue={(val: string) => setRecordFields((prev) => ({ ...prev, department: val }))}
                                label={t('entities.doctor.fields.department')} />
                            <TextField 
                                value={recordFields.licenseNumber} 
                                onChangeValue={(val: string) => setRecordFields((prev) => ({ ...prev, licenseNumber: val }))}
                                label={t('entities.doctor.fields.licenseNumber')} />
                            <TextField 
                                value={recordFields.note} 
                                onChangeValue={(val: string) => setRecordFields((prev) => ({ ...prev, note: val }))}
                                label={t('entities.doctor.fields.note')} />
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

export default doctorPage;