import React from 'react';
import { ManagedTable, Page, Select, Stack, TextField, type ColumnTable, type SelectItem } from '../ui/copmonents';
import { Gender } from '../common/enums';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../routes';

import { patientApi } from '../store/services/patient';

const PatientPage = () => {
    const {t} = useTranslation();
    const navigate = useNavigate();
    
    const allDataQuery = patientApi.useLazyFindAllPatientsQuery();
    const oneDataQuery = patientApi.useLazyFindOnePatientQuery();

    const createMutation = patientApi.useCreatePatientMutation();
    const updateMutation = patientApi.useUpdatePatientMutation();
    const removeMutation = patientApi.useRemovePatientMutation();

    const allData = allDataQuery[1]?.data?.data || [];
    const oneData = oneDataQuery[1]?.data;

    const columns: ColumnTable<typeof allData[number]>[] = [
        {key: 'id', label: 'ID', sortable: false}, 
        {key: 'fullName', label: t('entities.patient.fields.fullName'), sortable: false}, 
        {key: 'gender', label: t('entities.patient.fields.gender'), sortable: false, render: (item) => (item.gender === Gender.Male ? 'Мужской' : 'Женский')}, 
        {key: 'note', label: t('entities.patient.fields.note'), sortable: false}, 
    ];

    // FILTERS START //////////////////////////////////////////////////////////////
    const searchFieldOptions: SelectItem[] = [
        {
            title: 'ID',
            value: 'id',
        },
        {
            title: t('entities.patient.fields.fullName'),
            value: 'fullName',
        },
        {
            title: t('entities.patient.fields.gender'),
            value: 'gender',
        },
        {
            title: t('entities.patient.fields.note'),
            value: 'note',
        },
    ];

    const sortedFieldOptions: SelectItem[] = searchFieldOptions;
    // FILTERS END//////////////////////////////////////////////////////////////////////

    // ACTIONS START /////////////////////////////////////////////////////////////////
    const gendertOptions = [
        {id: Gender.Male, name: t('enums.gender.male')},
        {id: Gender.Female, name: t('enums.gender.female')},
    ];

    type RecordData = {
        doctorId: number;
        fullName: string;
        birthDate: string;
        gender: typeof gendertOptions[0];
        phone: string;
        email: string;
        note: string;
    };

    const initialRecordData: RecordData = {
        doctorId: 1,
        fullName: '',
        birthDate: '',
        gender: gendertOptions[0],
        phone: '',
        email: '',
        note: '',
    };

    const [recordFields, setRecordFields] = React.useState<RecordData>(initialRecordData);

    const recordData = {
        ...recordFields,
        gender: recordFields.gender.id,
    };

    const canSubmitRecord = recordFields.fullName.trim() !== '' && recordFields.birthDate.trim() !== '' && recordFields.phone.trim() !== '';

    const fillFormWithRecordData = () => {
        if(oneData) {
            setRecordFields({
                doctorId: oneData.doctorId,
                fullName: oneData.fullName,
                birthDate: oneData.birthDate,
                gender: gendertOptions.find(option => option.id === oneData.gender) || gendertOptions[0],
                phone: oneData.phone,
                email: oneData.email || '',
                note: oneData.note || '',
            });
        }
    }

    const clearFieldsRecordHandler = () => {
        setRecordFields(initialRecordData);
    }
    // ACTIONS END ///////////////////////////////////////////////////////////////////
    
    return (
        <Page
            decorativeIcon='INFO'
            title={t('pages.patients.title')}
            description={t('pages.patients.description')} >
            <ManagedTable
                blockPops={{
                    title: t('entities.patient.plural'),
                    fullWidth: true,
                }}
                tableProps={{
                    table: {
                        maxHeight: 200,
                    },
                    thead: {
                        columns,
                    },
                    tbody: {
                        rowKey: 'id',
                        columns,
                        data: allData,
                        rowClick: (row) => navigate(`${ROUTES.Patients}/${row.id}`),
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
                                value={recordFields.fullName} 
                                onChangeValue={(val: string) => setRecordFields((prev) => ({ ...prev, fullName: val }))}
                                label={t('entities.patient.fields.fullName')} />
                            <TextField 
                                value={recordFields.birthDate} 
                                onChangeValue={(val: string) => setRecordFields((prev) => ({ ...prev, birthDate: val }))}
                                label={t('entities.patient.fields.birthDate')}
                                type="date" />
                            <Select 
                                value={recordFields.gender} 
                                onChangeValue={(val) => setRecordFields((prev) => ({ ...prev, gender: val || gendertOptions[0] }))} 
                                options={gendertOptions} 
                                label={t('entities.patient.fields.gender')}
                                getKey={(item) => item.id}
                                getValue={(item) => item.name} />
                            <TextField 
                                value={recordFields.phone} 
                                onChangeValue={(val: string) => setRecordFields((prev) => ({ ...prev, phone: val }))}
                                label={t('entities.patient.fields.phone')} />
                            <TextField 
                                value={recordFields.email} 
                                onChangeValue={(val: string) => setRecordFields((prev) => ({ ...prev, email: val }))}
                                label={t('entities.patient.fields.email')} />
                            <TextField 
                                value={recordFields.note} 
                                onChangeValue={(val: string) => setRecordFields((prev) => ({ ...prev, note: val }))}
                                label={t('entities.patient.fields.note')} />
                        </Stack>
                    ),
                    recordData,
                    canSubmitRecord,
                    fillFormWithRecordData,
                    clearFieldsRecordHandler,
                }} >

            </ManagedTable>
        </Page>
    );
};

export default PatientPage;