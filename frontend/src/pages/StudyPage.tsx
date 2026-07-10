import React from 'react';
import { Button, ManagedTable, Page, Select, Stack, TextField, type ColumnTable, type SelectItem } from '../ui/copmonents';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../routes';

import { patientApi, type Patient } from '../store/services/patient';
import { ingestionApi } from '../store/services/ingestion';
import { studyApi } from '../store/services/study';

import { formatedDate } from '../utils';

const StudyPage = () => {
    const {t} = useTranslation();
    const navigate = useNavigate();
    
    const allDataQuery = studyApi.useLazyFindAllStudiesQuery();
    const [triggerPatients, {data: allPatientsData, isLoading: patientsIsLoading}] = patientApi.useLazyFindAllPatientsQuery();

    const uploadStudyMutation = ingestionApi.useUploadStudyMutation();

    const allData = allDataQuery[1]?.data?.data || [];
    const allPatients = allPatientsData?.data || [];

    const columns: ColumnTable<typeof allData[number]>[] = [
        {key: 'id', label: 'ID', sortable: false}, 
        {key: 'status', label: t('entities.study.fields.status'), sortable: false},
        {key: 'modality', label: t('entities.study.fields.modality'), sortable: false},
        {key: 'studyDateTime', label: t('entities.study.fields.studyDateTime'), sortable: false, render: (item) => formatedDate(item.studyDateTime)},
        {key: 'description', label: t('entities.study.fields.description'), sortable: false},
        {key: 'note', label: t('entities.study.fields.note'), sortable: false},
        {key: 'seriesCount', label: t('entities.study.fields.seriesCount'), sortable: false},
        {key: 'imagesCount', label: t('entities.study.fields.imagesCount'), sortable: false},
    ];

    // FILTERS START //////////////////////////////////////////////////////////////
    const searchFieldOptions: SelectItem[] = [
        {
            title: 'ID',
            value: 'id',
        },
        {
            title: t('entities.study.fields.studyInstanceUID'),
            value: 'studyInstanceUID',
        },
        {
            title: t('entities.study.fields.studyId'),
            value: 'studyId',
        },
        {
            title: t('entities.study.fields.specificCharacterSet'),
            value: 'specificCharacterSet',
        },
        {
            title: t('entities.study.fields.modality'),
            value: 'modality',
        },
        {
            title: t('entities.study.fields.description'),
            value: 'description',
        },
        {
            title: t('entities.study.fields.institutionName'),
            value: 'institutionName',
        },
        {
            title: t('entities.study.fields.manufacturer'),
            value: 'manufacturer',
        },
        {
            title: t('entities.study.fields.manufacturersModelName'),
            value: 'manufacturersModelName',
        },
        {
            title: t('entities.study.fields.stationName'),
            value: 'stationName',
        },
        {
            title: t('entities.study.fields.referringPhysiciansName'),
            value: 'referringPhysiciansName',
        },
        {
            title: t('entities.study.fields.status'),
            value: 'status',
        },
        {
            title: t('entities.study.fields.seriesCount'),
            value: 'seriesCount',
        },
        {
            title: t('entities.study.fields.imagesCount'),
            value: 'imagesCount',
        },
        {
            title: t('entities.study.fields.note'),
            value: 'note',
        },
    ];

    const sortedFieldOptions: SelectItem[] = searchFieldOptions;
    // FILTERS END//////////////////////////////////////////////////////////////////////

    // ACTIONS START /////////////////////////////////////////////////////////////////

    type RecordData = {
        patient?: Patient;
        dicomZip: any | null;        
        note?: string;
    };

    const initialRecordData: RecordData = {
        patient: undefined,
        dicomZip: null,
        note: undefined,
    };

    const [recordFields, setRecordFields] = React.useState<RecordData>(initialRecordData);

    const canSubmitRecord = (recordFields.patient !== undefined) && (recordFields.dicomZip !== null);

    const clearFieldsRecordHandler = () => {
        setRecordFields(initialRecordData);
    }
    // ACTIONS END ///////////////////////////////////////////////////////////////////
    
    const fetchAuxiliaryData = () => {
        triggerPatients({});
    }

    const isLoadingAuxiliaryData = patientsIsLoading;

    const fileInputRef = React.useRef<HTMLInputElement>(null);
    const handleFileInputClick = () => {
        fileInputRef.current?.click();
    };
    
    return (
        <Page
            decorativeIcon='INFO'
            title={t('pages.studies.title')}
            description={t('pages.studies.description')} >
            <ManagedTable
                blockPops={{
                    title: t('entities.study.plural'),
                    fullWidth: true,
                }}
                tableProps={{
                    table: {
                        maxHeight: 500,
                    },
                    thead: {
                        columns,
                    },
                    tbody: {
                        rowKey: 'id',
                        columns,
                        data: allData,
                        rowClick: (row) => navigate(`${ROUTES.Studies}/${row.id}`),
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
                    createMutation: uploadStudyMutation,
                    limit: 6,
                }}
                auxiliaryData={{
                    fetchAuxiliaryData,
                    isLoading: isLoadingAuxiliaryData,
                }}
                record={{
                    body: (
                        <Stack direction='column' gap='md' justify='flex-start' align='stretch'>
                            <Select 
                                value={recordFields.patient} 
                                onChangeValue={(val) => setRecordFields((prev) => ({ ...prev, patient: val }))} 
                                options={allPatients} 
                                label={t('entities.patient.singular')}
                                getKey={(item) => item.id}
                                getValue={(item) => item.fullName} />
                            <TextField 
                                value={recordFields.note} 
                                onChangeValue={(val: string) => setRecordFields((prev) => ({ ...prev, note: val }))}
                                label={t('entities.study.fields.note')} />
                            <Button variant={'secondary'} onClick={handleFileInputClick}>{recordFields.dicomZip?.name || t('common.dicomZip')}</Button>
                            <input
                                id="dicomZip"
                                ref={fileInputRef}
                                type="file"
                                onChange={e => setRecordFields(prev => ({...prev, dicomZip: e.target.files !== null ? e.target.files[0] : null}))}
                                style={{display: 'none'}} />
                        </Stack>
                    ),
                    toFormData: () => {
                        const formData = new FormData();
                        recordFields.patient && formData.append('patientId', recordFields.patient.id.toString());
                        recordFields.note && formData.append('note', recordFields.note);
                        recordFields.dicomZip && formData.append('dicomZip', recordFields.dicomZip);

                        for (let [key, value] of formData.entries()) {
                            console.log(key, value);
                        }

                        return formData;
                    },
                    canSubmitRecord,
                    clearFieldsRecordHandler,
                }} >

            </ManagedTable>
        </Page>
    );
};

export default StudyPage;