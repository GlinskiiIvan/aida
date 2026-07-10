import React, { version } from 'react';
import { Block, Button, FullScreenImage, Icon, IconButton, InfoList, ManagedTable, Modal, Page, Select, Stack, Table, TBody, TextField, THead, type ColumnTable, type SelectItem } from '../../ui/copmonents';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';

import type { AppDispatch } from '../../store/store';
import { addNotice } from '../../store/slices/notices';
import { studyApi, type InstanceImage, type UpdateStudyDto } from '../../store/services/study';
import { inferenceApi } from '../../store/services/inference';

import type { InfoListOption } from '../../ui/copmonents/InfoList/InfoList';
import { formatedDate } from '../../utils';
import { useModal } from '../../ui/copmonents/Modal/useModal';
import { ROUTES } from '../../routes';
import { predictionRunApi } from '../../store/services/predictionRun';

import styles from './StudyCardPage.module.scss';
import clsx from 'clsx';
import type { CSSVars } from '../../ui/copmonents/types';
import { useFullScreenImage } from '../../ui/copmonents/FullScreenImage/useFullScreenImage';

const StudyCardPage = () => {
    const {t} = useTranslation();
    const navigate = useNavigate();
    const dispatch = useDispatch<AppDispatch>();
    const { id } = useParams();

    const {data: study, refetch, isSuccess: studyIsSuccess, fulfilledTimeStamp: studyFulfilledTimeStamp} = studyApi.useFindOneStudyQuery(Number(id));
    const [remove, {isSuccess: studyRemoveIsSuccess, isError: studyRemoveIsError, error: studyRemoveError, fulfilledTimeStamp: studyRemoveFulfilledTimeStamp}] = studyApi.useRemoveStudyMutation();
    const [update, {isSuccess: studyUpdateIsSuccess, isError: studyUpdateIsError, error: studyUpdateError, fulfilledTimeStamp: studyUpdateFulfilledTimeStamp}] = studyApi.useUpdateStudyMutation();

    const [studyInfoList, setStudyInfoList] = React.useState<InfoListOption[][]>([]);

    React.useEffect(() => {
        if(studyIsSuccess && study.status === 'completed') {
            setStudyInfoList([
                [
                    {key: t('entities.study.fields.status'), value: study?.status},
                    {key: t('entities.study.fields.studyInstanceUID'), value: study?.studyInstanceUID},
                    {key: t('entities.study.fields.studyId'), value: study?.studyId},
                    {key: t('entities.study.fields.specificCharacterSet'), value: study?.specificCharacterSet},
                    {key: t('entities.study.fields.studyDateTime'), value: formatedDate(study?.studyDateTime || null)},
                    {key: t('entities.study.fields.modality'), value: study?.modality},
                    {key: t('entities.study.fields.institutionName'), value: study?.institutionName},
                ],
                [
                    {key: t('entities.study.fields.manufacturer'), value: study?.manufacturer},
                    {key: t('entities.study.fields.manufacturersModelName'), value: study?.manufacturersModelName},
                    {key: t('entities.study.fields.stationName'), value: study?.stationName},
                    {key: t('entities.study.fields.seriesCount'), value: study?.seriesCount},
                    {key: t('entities.study.fields.imagesCount'), value: study?.imagesCount},
                    {key: t('entities.study.fields.description'), value: study?.description},
                    {key: t('entities.study.fields.note'), value: study?.note},
                ]
            ]);
        }
    }, [studyFulfilledTimeStamp]);

    const navigatePatientHandler = () => {
        if(study?.patientId) {
            navigate(`${ROUTES.Patients}/${study.patientId}`);
        }
    };

    // ACTIONS START /////////////////////////////////////////////////////////////////
    const updateModal = useModal('updateModal');
    const removeModal = useModal('removeModal');

    const initialRecordFields: UpdateStudyDto = {
        id: Number(id),
        reason: undefined,
    };

    const [recordFields, setRecordFields] = React.useState<UpdateStudyDto>(initialRecordFields);

    React.useEffect(() => {
        if(updateModal.show && study && studyIsSuccess) {
            setRecordFields({
                id: Number(id),
                description: study?.description,
                imagesCount: study?.imagesCount,
                institutionName: study?.institutionName,
                manufacturer: study?.manufacturer,
                manufacturersModelName: study?.manufacturersModelName,
                modality: study?.modality,
                note: study?.note,
                referringPhysiciansName: study?.referringPhysiciansName,
                seriesCount: study?.seriesCount,
                specificCharacterSet: study?.specificCharacterSet,
                stationName: study?.stationName,
                studyDateTime: study?.studyDateTime,
                studyId: study?.studyId,
                studyInstanceUID: study?.studyInstanceUID,
                reason: undefined,
            });
        }
        if(!updateModal.show) {
            clearRecordFieldsHandler();
        }
    }, [updateModal.show]);

    const canSubmitUpdateRecord = id !== undefined;
    const canSubmitRemoveRecord = id !== undefined;

    const clearRecordFieldsHandler = () => {
        setRecordFields(initialRecordFields);
    }

    const actionHandler = () => {
        if(canSubmitUpdateRecord) {
            update(recordFields);
            updateModal.close();
        }
    }

    const removeHandler = () => {
        if(canSubmitRemoveRecord) {
            remove({
                id: Number(id),
                reason: recordFields.reason || '',
            });
        }
    }

    React.useEffect(() => {
        if(studyUpdateIsSuccess) {
            dispatch(addNotice({type: 'success', message: t(`notification.success.updated.default.singular`)}));
            refetch();
        }
        if(studyUpdateIsError) {
            dispatch(addNotice({type: 'error', message: t(`notification.error.default`)}));
        }
    }, [studyUpdateFulfilledTimeStamp]);

    React.useEffect(() => {
        if(studyRemoveIsSuccess) {
            dispatch(addNotice({type: 'success', message: t(`notification.success.deleted.default.singular`)}));
            navigate(ROUTES.Studies);
        }
        if(studyRemoveIsError) {
            dispatch(addNotice({type: 'error', message: t(`notification.error.default`)}));
        }
    }, [studyRemoveFulfilledTimeStamp]);
    // ACTIONS END /////////////////////////////////////////////////////////////////

    // PREDICTION RUN START /////////////////////////////////////////////////////////////////
    type ModelsOptions = {
        label: string,
        model: string,
        version: string,
    };

    const modelsOptions: ModelsOptions[] = [
        {
            label: 'YOLOv8x',
            model: 'YOLO',
            version: '8x',
        },
        {
            label: 'YOLOv5su',
            model: 'YOLO',
            version: '5su',
        },
    ];

    const predictionModal = useModal('predictionModal');

    const [predict, {isSuccess: predictIsSuccess, isError: predictIsError, error: predictError, fulfilledTimeStamp: predictFulfilledTimeStamp}] = inferenceApi.usePredictMutation();
    const [model, setModel] = React.useState<ModelsOptions | undefined>(undefined);

    const canSubmitPredictionRun = (study?.status === 'completed') && (model !== undefined) && (id !== undefined);

    const predictionRunHandler = () => {
        if(canSubmitPredictionRun) {
            predict({
                studyId: Number(id),
                model: model.model,
                version: model.version,
            });
            predictionModal.close();
        }
    }

    React.useEffect(() => {
        if(!predictionModal.show) {
            setModel(undefined);
        }
    }, [predictionModal.show]);

    React.useEffect(() => {
        if(predictIsSuccess) {
            dispatch(addNotice({type: 'success', message: t(`notification.success.deleted.default.singular`)}));
        }
        if(predictIsError) {
            dispatch(addNotice({type: 'error', message: t(`notification.error.default`)}));
        }
    }, [predictFulfilledTimeStamp]);

    // PREDICTION RUN END /////////////////////////////////////////////////////////////////

    // PREDICTION RUN TABLE START /////////////////////////////////////////////////////////////////
    const predictionRunsQuery = studyApi.useLazyFindAllStudyRunsQuery();
    const allpredictionRunsData = predictionRunsQuery[1]?.data?.data || [];

    const columns: ColumnTable<typeof allpredictionRunsData[number]>[] = [
      {key: 'model', label: t('entities.predictionRun.fields.model'), sortable: false, width: '100px', },
      {key: 'version', label: t('entities.predictionRun.fields.version'), sortable: false, width: '100px', },
      {key: 'status', label: t('entities.predictionRun.fields.status'), sortable: false, width: '100px', },
      {key: 'createdAt', label: t('entities.predictionRun.fields.runnedAt'), sortable: false, render: (run) => formatedDate(run.createdAt), width: '200px', },
    ];

    const searchFieldOptions: SelectItem[] = [
        {
            title: t('entities.predictionRun.fields.model'),
            value: 'model',
        },
        {
            title: t('entities.predictionRun.fields.version'),
            value: 'version',
        },
        {
            title: t('entities.predictionRun.fields.status'),
            value: 'status',
        },
    ];

    const sortedFieldOptions: SelectItem[] = searchFieldOptions;

    const [selectedRun, setSelectedRun] = React.useState<typeof allpredictionRunsData[number]>();

    const isRunCompleted = selectedRun?.status === 'completed';

    React.useEffect(() => {
        if(predictionRunsQuery[1].isSuccess && allpredictionRunsData) {
            setSelectedRun(allpredictionRunsData[0]);
        }
    }, [predictionRunsQuery[1].fulfilledTimeStamp]);
    
    // PREDICTION RUN TABLE END /////////////////////////////////////////////////////////////////

    // VIEWER START /////////////////////////////////////////////////////////////////

    const [imagesTrigger, imagesData] = studyApi.useLazyFindAllStudyImagesQuery();

    const [activeImage, setActiveImage] = React.useState<InstanceImage>();
    const activeImageSidebarRef = React.useRef<HTMLImageElement>(null);

    const activeImageContentRef = React.useRef<HTMLImageElement>(null);
    const fullScreenImageRef = React.useRef<HTMLImageElement>(null);

    const isActiveImage = (id: number) => id === activeImage?.id;

    React.useEffect(() => {
        if(studyIsSuccess && study.status === 'completed') {
            imagesTrigger({id: Number(id)});
        }
    }, [studyFulfilledTimeStamp]);

    React.useEffect(() => {
        if(imagesData.isSuccess && study?.status === 'completed') {
            setActiveImage(imagesData.data.data[0]);
        }
    }, [imagesData.fulfilledTimeStamp]);

    const prevImage = () => {
        if(imagesData.isSuccess && activeImage !== undefined) {
            const currentImageIdx = imagesData.data.data.findIndex(image => image.id === activeImage?.id);
            if(currentImageIdx > 0) {
                setActiveImage(imagesData.data.data[currentImageIdx-1]);
            } else {
                setActiveImage(imagesData.data.data[imagesData.data.data.length-1]);
            }
        }
    }

    const nextImage = () => {
        if(imagesData.isSuccess && activeImage !== undefined) {
            const currentImageIdx = imagesData.data.data.findIndex(image => image.id === activeImage?.id);
            if(currentImageIdx < imagesData.data.data.length-1) {
                setActiveImage(imagesData.data.data[currentImageIdx+1]);
            } else {
                setActiveImage(imagesData.data.data[0]);
            }
        }
    }

    React.useEffect(() => {
        if(activeImage !== undefined && activeImageSidebarRef.current) {
            activeImageSidebarRef.current.scrollIntoView({
                behavior: 'smooth',
                block: 'start',
            });
        }
    }, [activeImage]);

    // const fullScreenImageModal = useModal('fullScreenImageModal');
    const fullScreenImageModal = useFullScreenImage('fullScreenImageModal');

    const getCurrentImageRef = () => {
        return fullScreenImageModal.show
            ? fullScreenImageRef.current
            : activeImageContentRef.current;
    };

    // VIEWER END /////////////////////////////////////////////////////////////////

    // PREDICTION START /////////////////////////////////////////////////////////////////

    const [predictionsTrigger, predictionsData] = predictionRunApi.useLazyFindAllPredictionsByRunQuery();

    React.useEffect(() => {
        if(selectedRun !== undefined && selectedRun.status === 'completed') {
            predictionsTrigger({runId: selectedRun.id});
        }
    }, [selectedRun]);

    type ResultBbox = {
        class: string;
        confidence: number;
        bbox: [number, number, number, number];
    }

    type ResultBboxOverlay = ResultBbox & {
        inlineStyleOverlay: CSSVars;
    }

    type NormalizedBbox = {
        x1: number;
        y1: number;
        x2: number;
        y2: number;
    }

    type ImageSizes = {
        naturalWidth: number;
        naturalHeight: number;
        clientWidth: number;
        clientHeight: number;
    }

    const getNormalizeBbox = (bbox: number[], naturalWidth: number, naturalHeight: number): NormalizedBbox => {
        return {
            x1: bbox[0] / naturalWidth,
            y1: bbox[1] / naturalHeight,
            x2: bbox[2] / naturalWidth,
            y2: bbox[3] / naturalHeight,
        };
    }

    const getBbox = (bbox: number[], imageSizes: ImageSizes) => {
        const normalized = getNormalizeBbox(bbox, imageSizes.naturalWidth, imageSizes.naturalHeight)

        const position = {
            left: normalized.x1 * imageSizes.clientWidth,
            top: normalized.y1 * imageSizes.clientHeight,
            width: (normalized.x2 * imageSizes.clientWidth) - (normalized.x1 * imageSizes.clientWidth),
            height: (normalized.y2 * imageSizes.clientHeight) - (normalized.y1 * imageSizes.clientHeight),
        }

        return position;
    }

    const [overlays, setOverlays] = React.useState<ResultBboxOverlay[]>([]);

    const buildOverlays = (img: HTMLImageElement, results: ResultBbox[]) => {
        return results.map(item => {
            const overlay = getBbox(item?.bbox || [], {
                naturalWidth: img.naturalWidth,
                naturalHeight: img.naturalHeight,
                clientWidth: img.clientWidth,
                clientHeight: img.clientHeight,
            });
            return {
                ...item, 
                inlineStyleOverlay: {
                    '--top-overlay': `${overlay.top}px`,
                    '--left-overlay': `${overlay.left}px`,
                    '--width-overlay': `${overlay.width}px`,
                    '--height-overlay':`${overlay.height}px`,
                    '--color-overlay': item.class === 'normal' ? 'var(--border-success)' : item.class === 'tear' ? 'var(--border-danger)' : 'var(--border-primary)',
                }
            }
        })
    }

    React.useEffect(() => {
        const img = getCurrentImageRef();
        if(predictionsData.isSuccess && img && activeImage) {
            const results = (predictionsData.data.data
                .find(item => item.imageId === activeImage.id)
                ?.rawOutput) as ResultBbox[] || [];

            setOverlays(buildOverlays(img, results));
        }
    }, [predictionsData.fulfilledTimeStamp, activeImage, fullScreenImageModal.show]);

    // PREDICTION END /////////////////////////////////////////////////////////////////

    if (!studyIsSuccess) {
        return <h1>Загрузка...</h1>
    }

    return (
        <>
            {(studyIsSuccess && study.status === 'pending') && (
                <h1>Исследование загружено, следующий этап обработка...</h1>
            )}
            {(studyIsSuccess && study.status === 'processing') && (
                <h1>Исследование ещё обрабатывается...</h1>
            )}
            {(studyIsSuccess && study.status === 'failed') && (
                <h1>В процессе обработки исследования что то пошло не так...</h1>
            )}
            {(studyIsSuccess && study.status === 'completed') && (
                <Page
                    decorativeIcon='INFO'
                    title={t('pages.studyCard.title')}
                    description={t('pages.studyCard.description')} >
                    <Block 
                        title={study?.studyInstanceUID || ''} 
                        decorativeIcon='INFO'
                        fullWidth
                        actions={
                            <Stack direction='row' gap='xs' justify='center' align='center'>
                                <IconButton icon={{name: 'RELOAD', color: 'tertiary', size: 'lg'}} onClick={refetch} />
                                <IconButton icon={{name: 'EDIT', color: 'tertiary', size: 'lg'}} onClick={updateModal.open} />
                                <IconButton icon={{name: 'REMOVE', color: 'tertiary', size: 'lg'}} onClick={removeModal.open} />
                            </Stack>
                        }
                        footer={
                            <Stack direction='row' gap='md' justify='center' align='center'>
                                <Button variant='primary' icon='ADD' onClick={predictionModal.open}>{t('actions.runPrediction')}</Button>
                                <Button variant='secondary' icon='LINK' onClick={navigatePatientHandler}>{t('actions.goToPatient')}</Button>
                            </Stack>
                        } 
                        >
                        <Stack direction='row' gap='xl' justify='stretch' align='center'>
                            {studyInfoList.map((list, idx) => (
                                <InfoList key={idx} oprions={list} />
                            ))}          
                        </Stack>
                    </Block>

                    <Stack
                        className={styles.predictionWorkspace}
                        direction='row' gap='xl' justify='center' align='flex-start'>
                        <ManagedTable
                            blockPops={{
                                title: t('entities.predictionRun.plural'),
                                fullWidth: true,
                                className: styles.runs
                            }}
                            tableProps={{
                                table: {
                                    maxHeight: 500,
                                    fixedColumnWidth: true,
                                },
                                thead: {
                                    columns,
                                },
                                tbody: {
                                    rowKey: 'id',
                                    columns,
                                    data: allpredictionRunsData,
                                    select: {selectedRow: selectedRun, onChange: setSelectedRun}
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
                                getAllQuery: predictionRunsQuery,
                                limit: 15,
                                entityId: Number(id),
                            }}>
                        </ManagedTable>

                        <Block 
                            fullWidth 
                            className={styles.viewer} >
                            <Stack 
                                className={styles.wrapper}
                                direction='row' gap='md' justify='center' align='flex-start' >
                                <Stack 
                                    className={styles.sidebar}
                                    direction='column' gap='sm' justify='flex-start' align='stretch' >
                                    {imagesData.isSuccess && imagesData.data.data.map(image => (
                                        <button 
                                            key={image.id}
                                            className={styles.imageBtn}
                                            onClick={() => setActiveImage(image)} >
                                            <img
                                                className={clsx(styles.image, {[styles.active]: isActiveImage(image.id)})}
                                                ref={isActiveImage(image.id) ? activeImageSidebarRef : null}
                                                src={`${import.meta.env.VITE_API_URI}/${image.imagePath}`} 
                                                alt={image.imageName || undefined} />
                                        </button>
                                    ))}
                                </Stack>
                                <Stack 
                                    className={styles.content} >
                                    <div className={styles.btnPrev}>
                                        <IconButton 
                                            icon={{name: 'ARROWDOWN', color: 'inverse', size: 'xl'}}
                                            onClick={prevImage} 
                                            className={styles.arrow} />
                                    </div>
                                    {activeImage && (
                                        <img
                                            ref={activeImageContentRef}
                                            role='button'
                                            onClick={fullScreenImageModal.open}
                                            src={`${import.meta.env.VITE_API_URI}/${activeImage.imagePath}`} 
                                            alt={activeImage.imagePath || undefined} />
                                    )}
                                    {(activeImage && selectedRun && selectedRun.status === 'completed') && overlays.map(item => (
                                        <div key={`${item.class}-${item.bbox.join('-')}`} className={styles.overlay} style={item.inlineStyleOverlay}>
                                            <span>{item.class} {item.confidence}</span>
                                        </div>
                                    ))}
                                    <div className={styles.btnNext}>
                                        <IconButton 
                                            icon={{name: 'ARROWDOWN', color: 'inverse', size: 'xl'}}
                                            onClick={nextImage} 
                                            className={styles.arrow} />
                                    </div>
                                </Stack>
                            </Stack>
                        </Block>
                            
                    </Stack>

                    <FullScreenImage
                        title={activeImage?.imageName}
                        options={fullScreenImageModal} >
                            <Stack
                                className={styles.predictionWorkspace}
                                style={{
                                    width: '100%',
                                    height: '100%',
                                    maxHeight: 'none'
                                }}
                                direction='row' gap='xl' justify='center' align='flex-start'>
                                <div 
                                    className={styles.viewer}
                                        style={{
                                            maxHeight: 'none',
                                            maxWidth: 'none'
                                        }} >
                                    <Stack 
                                        className={styles.wrapper}
                                        direction='row' gap='md' justify='center' align='flex-start' >
                                        <Stack 
                                            className={styles.content}
                                                style={{
                                                    maxHeight: 'none',
                                                    maxWidth: 'none'
                                                }} >
                                            <div className={styles.btnPrev}>
                                                <IconButton 
                                                    icon={{name: 'ARROWDOWN', color: 'inverse', size: 'xl'}}
                                                    onClick={prevImage} 
                                                    className={styles.arrow} />
                                            </div>
                                            {activeImage && (
                                                <img
                                                    ref={fullScreenImageRef}
                                                    role='button'
                                                    onClick={fullScreenImageModal.open}
                                                    style={{
                                                        maxWidth: '100%',
                                                        maxHeight: '100%',
                                                        width: '100%',
                                                        height: '100%',
                                                        objectFit: 'contain'
                                                    }}
                                                    src={`${import.meta.env.VITE_API_URI}/${activeImage.imagePath}`} 
                                                    alt={activeImage.imagePath || undefined} />
                                            )}
                                            {(activeImage && selectedRun && selectedRun.status === 'completed') && overlays.map(item => (
                                                <div key={`${item.class}-${item.bbox.join('-')}`} className={styles.overlay} style={item.inlineStyleOverlay}>
                                                    <span>{item.class} {item.confidence}</span>
                                                </div>
                                            ))}
                                            <div className={styles.btnNext}>
                                                <IconButton 
                                                    icon={{name: 'ARROWDOWN', color: 'inverse', size: 'xl'}}
                                                    onClick={nextImage} 
                                                    className={styles.arrow} />
                                            </div>
                                        </Stack>
                                    </Stack>
                                </div>
                                    
                            </Stack>
                    </FullScreenImage>

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
                                    disabled={!canSubmitUpdateRecord} 
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
                                value={recordFields.description || ''} 
                                onChangeValue={(val: string) => setRecordFields((prev) => ({ ...prev, description: val }))}
                                label={t('entities.study.fields.description')} />

                            <TextField 
                                value={recordFields.institutionName || ''} 
                                onChangeValue={(val: string) => setRecordFields((prev) => ({ ...prev, institutionName: val }))}
                                label={t('entities.study.fields.institutionName')} />

                            <TextField 
                                value={recordFields.manufacturer || ''} 
                                onChangeValue={(val: string) => setRecordFields((prev) => ({ ...prev, manufacturer: val }))}
                                label={t('entities.study.fields.manufacturer')} />

                            <TextField 
                                value={recordFields.manufacturersModelName || ''} 
                                onChangeValue={(val: string) => setRecordFields((prev) => ({ ...prev, manufacturersModelName: val }))}
                                label={t('entities.study.fields.manufacturersModelName')} />

                            <TextField 
                                value={recordFields.note || ''} 
                                onChangeValue={(val: string) => setRecordFields((prev) => ({ ...prev, note: val }))}
                                label={t('entities.study.fields.note')} />

                            <TextField 
                                value={recordFields.referringPhysiciansName || ''} 
                                onChangeValue={(val: string) => setRecordFields((prev) => ({ ...prev, referringPhysiciansName: val }))}
                                label={t('entities.study.fields.referringPhysiciansName')} />

                            <TextField 
                                value={recordFields.stationName || ''} 
                                onChangeValue={(val: string) => setRecordFields((prev) => ({ ...prev, stationName: val }))}
                                label={t('entities.study.fields.stationName')} />
                                
                            <TextField 
                                value={recordFields.reason} 
                                onChangeValue={(val: string) => setRecordFields((prev) => ({ ...prev, reason: val }))}
                                label={t('common.reason')} />
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
                            value={recordFields.reason} 
                            onChangeValue={(val: string) => setRecordFields((prev) => ({ ...prev, reason: val }))} 
                            label={t('common.reason')} />
                    </Modal>

                    <Modal 
                        title={t(`common.predictionRunning`)}
                        options={predictionModal}
                        footer={
                            <Stack direction='row' gap='sm' justify='flex-end' align='center'>
                                <Button variant='primary' icon='ADD' onClick={predictionRunHandler}>{t('actions.runPrediction')}</Button>
                            </Stack>
                        } >
                        <Select 
                            value={model} 
                            onChangeValue={(val) => setModel(val)} 
                            options={modelsOptions} 
                            label={t('entities.study.fields.model')}
                            getKey={(item) => item.label}
                            getValue={(item) => item.label} />
                    </Modal>
                </Page>
            )} 
        </>
    );
};

export default StudyCardPage;