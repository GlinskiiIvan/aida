import React from 'react';
import { Block, Button, Icon, IconButton, InfoList, ManagedTable, Modal, Page, Select, Stack, TextField, type ColumnTable, type SelectItem } from '../ui/copmonents';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import type { InfoListOption } from '../ui/copmonents/InfoList/InfoList';
import { useDispatch } from 'react-redux';

import { Gender } from '../common/enums';
import { useModal } from '../ui/copmonents/Modal/useModal';
import { formatedDate } from '../utils';
import { ROUTES } from '../routes';

import type { AppDispatch } from '../store/store';
import { addNotice } from '../store/slices/notices';
import { ingestionApi } from '../store/services/ingestion';
import { patientApi, type Patient } from '../store/services/patient';

const PatientCardPage = () => {
    const {t} = useTranslation();
    const navigate = useNavigate();
    const dispatch = useDispatch<AppDispatch>();
    
    const { id } = useParams();

    const {data: patient, refetch, isSuccess: patientIsSuccess, fulfilledTimeStamp: patientFulfilledTimeStamp} = patientApi.useFindOnePatientQuery(Number(id));
    const [remove, {isSuccess: removeIsSuccess, isError: removeIsError, error: removeError, fulfilledTimeStamp: removeFulfilledTimeStamp}] = patientApi.useRemovePatientMutation();
    const [update, {isSuccess: updateIsSuccess, isError: updateIsError, error: updateError, fulfilledTimeStamp: updateFulfilledTimeStamp}] = patientApi.useUpdatePatientMutation();

    const patientInfoList: InfoListOption[] = [
        {key: t('entities.patient.fields.doctor'), value: patient?.doctorId},
        {key: t('entities.patient.fields.fullName'), value: patient?.fullName},
        {key: t('entities.patient.fields.birthDate'), value: patient?.birthDate},
        {key: t('entities.patient.fields.gender'), value: patient?.gender},
        {key: t('entities.patient.fields.email'), value: patient?.email},
        {key: t('entities.patient.fields.phone'), value: patient?.phone},
        {key: t('entities.patient.fields.note'), value: patient?.note},
    ];

    if(patient?.isPublic) patientInfoList.push({key: t('entities.patient.fields.public'), value: <Icon name='CHECK' color='primary' size='lg' />});

    const [reason, setReason] = React.useState('');

    // REMOVE
    // const canRemove = hasPermissions.delete && (id !== undefined);
    const canRemove = true;

    if(removeIsSuccess) {
        dispatch(addNotice({type: 'success', message: t(`notification.success.deleted.default.singular`)}));
    }
    if(removeError) {
        dispatch(addNotice({type: 'error', message: t(`notification.error.default`)}));
    }

    const removeHandler = () => {
        remove({
            id: Number(id),
            reason: reason
        });
    }
    // END REMOVE

    // ACTIONS START /////////////////////////////////////////////////////////////////
    const updateModal = useModal('updateModal');
    const removeModal = useModal('removeModal');

    const gendertOptions = [
        {id: Gender.Male, name: t('enums.gender.male')},
        {id: Gender.Female, name: t('enums.gender.female')},
    ];

    type RecordData = {
        fullName: string;
        birthDate: string;
        gender: typeof gendertOptions[0];
        phone: string;
        email: string;
        note: string;
        isPublic: boolean;
    };

    const initialRecordData: RecordData = {
        fullName: '',
        birthDate: '',
        gender: gendertOptions[0],
        phone: '',
        email: '',
        note: '',
        isPublic: false,
    };

    const [recordFields, setRecordFields] = React.useState<RecordData>(initialRecordData);

    const recordData = {
        ...recordFields,
        gender: recordFields.gender.id,
    };

    const canSubmitRecord = recordFields.fullName.trim() !== '' && recordFields.birthDate.trim() !== '' && recordFields.phone.trim() !== '';
    const canSubmitUpdateRecord = (id !== undefined) && canSubmitRecord;

    const clearFieldsRecordHandler = () => {
        setRecordFields(initialRecordData);
    }

    const actionHandler = () => {
        if(canSubmitUpdateRecord) {
            update({
                ...recordData,
                id: Number(id),
                reason: reason
            });
            updateModal.close();
        }
    }

    React.useEffect(() => {
        if(!updateModal.show) {
            clearFieldsRecordHandler();
        }
        if(updateModal.show) {
            if(patient && patientIsSuccess) {
                setRecordFields({
                    fullName: patient.fullName,
                    birthDate: patient.birthDate,
                    gender: gendertOptions.find(option => option.id === patient.gender) || gendertOptions[0],
                    phone: patient.phone,
                    email: patient.email || '',
                    note: patient.note || '',
                    isPublic: patient.isPublic,
                });
            }
        }
    }, [updateModal.show]);

    if(updateIsSuccess) {
        dispatch(addNotice({type: 'success', message: t(`notification.success.updated.default.singular`)}));
    }
    if(updateError) {
        dispatch(addNotice({type: 'error', message: t(`notification.error.default`)}));
    }

    React.useEffect(() => {
        if(updateIsSuccess) {
            refetch();
        }
    }, [updateFulfilledTimeStamp]);

    React.useEffect(() => {
        if(removeIsSuccess) {
            navigate(ROUTES.Patients);
        }
    }, [removeFulfilledTimeStamp]);

    // ACTIONS END ///////////////////////////////////////////////////////////////////

    // STUDY
    const allStudiesDataQuery = patientApi.useLazyFindAllPatientStudiesQuery();
    const uploadStudyMutation = ingestionApi.useUploadStudyMutation();

    const allStudiesData = allStudiesDataQuery[1]?.data?.data || [];

    const columns: ColumnTable<typeof allStudiesData[number]>[] = [
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

    type studyRecordData = {
        patient?: Patient;
        dicomZip: any | null;        
        note?: string;
    };

    const initialStudyRecordData: studyRecordData = {
        patient,
        dicomZip: null,
        note: undefined,
    };

    const [studyRecordFields, setStudyRecordFields] = React.useState<studyRecordData>(initialStudyRecordData);

    React.useEffect(() => {
        if(patient && patientIsSuccess) {
            setStudyRecordFields((prev) => ({...prev, patient: patient}));
        }
    }, [patientFulfilledTimeStamp]);

    const canSubmitStudyRecord = (studyRecordFields.patient !== undefined) && (studyRecordFields.dicomZip !== null);

    const clearStudyFieldsRecordHandler = () => {
        setStudyRecordFields(initialStudyRecordData);
    }
    // ACTIONS END ///////////////////////////////////////////////////////////////////
    const fileInputRef = React.useRef<HTMLInputElement>(null);
    const handleFileInputClick = () => {
        fileInputRef.current?.click();
    };
    // END STUDY

    return (
        <Page
            decorativeIcon='INFO'
            title={t('pages.patientCard.title')}
            description={t('pages.patientCard.description')} >
                <Block 
                    title={patient?.fullName} 
                    decorativeIcon='INFO'
                    fullWidth
                    style={{maxWidth: '50%'}}
                    actions={
                        <Stack direction='row' gap='xs' justify='center' align='center'>
                            <IconButton icon={{name: 'RELOAD', color: 'tertiary', size: 'lg'}} onClick={refetch} />
                            <IconButton icon={{name: 'EDIT', color: 'tertiary', size: 'lg'}} onClick={updateModal.open} />
                            <IconButton icon={{name: 'REMOVE', color: 'tertiary', size: 'lg'}} onClick={removeModal.open} />
                        </Stack>
                    }
                    // footer={
                    //     <Stack direction='row' gap='md' justify='center' align='center'>
                    //         <Button variant='primary' icon='ADD'>{t('actions.createStudy')}</Button>
                    //     </Stack>
                    // } 
                    >
                    <InfoList oprions={patientInfoList} />
                </Block>

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
                            data: allStudiesData,
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
                        getAllQuery: allStudiesDataQuery,
                        createMutation: uploadStudyMutation,
                        limit: 15,
                        entityId: Number(id),
                    }}
                    record={{
                        body: (
                            <Stack direction='column' gap='md' justify='flex-start' align='stretch'>
                                <TextField 
                                    value={studyRecordFields.note} 
                                    onChangeValue={(val: string) => setStudyRecordFields((prev) => ({ ...prev, note: val }))}
                                    label={t('entities.study.fields.note')} />
                                <Button variant={'secondary'} onClick={handleFileInputClick}>{studyRecordFields.dicomZip?.name || t('common.dicomZip')}</Button>
                                <input
                                    id="dicomZip"
                                    ref={fileInputRef}
                                    type="file"
                                    onChange={e => setStudyRecordFields(prev => ({...prev, dicomZip: e.target.files !== null ? e.target.files[0] : null}))}
                                    style={{display: 'none'}} />
                            </Stack>
                        ),
                        toFormData: () => {
                            const formData = new FormData();
                            studyRecordFields.patient && formData.append('patientId', studyRecordFields.patient.id.toString());
                            studyRecordFields.note && formData.append('note', studyRecordFields.note);
                            studyRecordFields.dicomZip && formData.append('dicomZip', studyRecordFields.dicomZip);
    
                            for (let [key, value] of formData.entries()) {
                                console.log(key, value);
                            }
    
                            return formData;
                        },
                        canSubmitRecord: canSubmitStudyRecord,
                        clearFieldsRecordHandler: clearStudyFieldsRecordHandler,
                    }} >
    
                </ManagedTable>

                <Modal 
                    title={t(`enums.action.edit`)} 
                    decorativeIcon={'EYE'} 
                    options={updateModal}
                    footer={
                        <Stack 
                            direction='row' gap='sm' justify='flex-end' align='center'>
                            <Button
                                variant='primary'
                                icon={'EDIT'} 
                                disabled={!canSubmitRecord} 
                                onClick={actionHandler}>
                                {t('actions.save')}
                            </Button>
                        </Stack>                    
                    }
                >
                    {/* {(auxiliaryData?.isLoading ? auxiliaryData.isLoading : false) && (
                        <Screen type='loading' />
                    )} */}
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
                        <div className='mt-[16px]'>
                            <TextField 
                                value={reason} 
                                onChangeValue={(value: string) => setReason(value)}
                                label={t('common.reason')} />
                        </div>
                    </Stack>
                </Modal>

                <Modal 
                    title={t(`common.confirmation`)}
                    options={removeModal}
                    footer={
                        <Stack direction='row' gap='sm' justify='flex-end' align='center'>
                            <Button variant='primary' intent='destructive' icon='CHECK' onClick={removeHandler} >{t('actions.confirm')}</Button>
                            <Button variant='secondary' icon='CLOSE' onClick={() => removeModal.close()} >{t('actions.cancel')}</Button>
                        </Stack>
                    } >
                    <TextField 
                        value={reason} 
                        onChangeValue={(value: string) => setReason(value)} 
                        label={t('common.reason')} />
                </Modal>
        </Page>
    );
};

export default PatientCardPage;