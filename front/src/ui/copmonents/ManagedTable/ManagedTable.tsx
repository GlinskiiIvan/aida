import React from 'react';
import Block, { type BlockProps } from '../Block';
import Table, { TBody, THead, type TableProps, type TBodyProps, type THeadProps } from '../Table';
import Stack from '../Stack';
import IconButton from '../IconButton';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import type { AppDispatch } from '../../../store/store';
import { addNotice } from '../../../store/slices/notices';
import { useModal } from '../Modal/useModal';
import { Action, Context, SortOrder } from '../../../common/enums';
import type { FetchBaseQueryError } from '@reduxjs/toolkit/query';
import type { SerializedError } from '@reduxjs/toolkit';
import Modal from '../Modal';
import Button from '../Button';
import Select from '../Select';
import TextField from '../TextField';

export type SelectItem = { title: string; value: string };

type ManagedTableProps<T> = {
    blockPops?: Omit<BlockProps, 'children' | 'actions'>;
    tableProps: {
        table: TableProps<T>;
        thead: THeadProps<T>;
        tbody: TBodyProps<T>;
    };
    filters?: {
        period?: boolean;
        searchFieldOptions?: SelectItem[];
        sortedFieldOptions?: SelectItem[];
    };
    hasPermissions: {
        create: boolean;
        update: boolean;
        delete: boolean;
        read: boolean;
    };
    crudApiTable: {
        getAllQuery: any;
        getOneQuery?: any;
        createMutation?: any;
        updateMutation?: any;
        removeMutation?: any;
        limit?: number;
        entityId?: number;
    };
    auxiliaryData?: {
        fetchAuxiliaryData: () => void;
        isLoading: boolean;
    };
    record?: {
        canSubmitRecord: boolean;
        clearFieldsRecordHandler: () => void;
        recordData?: Record<string, unknown> | FormData;
        toFormData?: () => FormData;
        body: React.ReactNode;
        fillFormWithRecordData?: () => void;
        modalActions?: React.ReactNode;
    };
}

const toLocalInputFormat = (date: Date) => {
    const offset = date.getTimezoneOffset();
    const local = new Date(date.getTime() - offset * 60000);
    return local.toISOString().slice(0, 16); // "YYYY-MM-DDTHH:mm"
};

const ManagedTable = <T extends Record<string, unknown>,>({
    blockPops,
    tableProps: {
        table: {
            maxHeight = 400,
            ...table
        },
        thead,
        tbody: {
            select,
            rowClick,
            ...tbody
        },
    },
    filters,
    hasPermissions,
    crudApiTable: {limit = 20, ...crudApiTable},
    auxiliaryData,
    record
}: ManagedTableProps<T>) => {
    const {t} = useTranslation();
    const dispatch = useDispatch<AppDispatch>();

    const [triggerData, {data: responseData = {}, isFetching: allDataIsFetching, isSuccess: allDataIsSuccess, isError: allDataIsError, error: allDataError}] = crudApiTable.getAllQuery;
    const [recordTrigger, {data: recordData, isLoading: recordIsLoading, isSuccess: recordIsSuccess, isError: recordIsError, error: recordError, fulfilledTimeStamp: recordFulfilledTimeStamp}] = crudApiTable.getOneQuery ?? [() => {}, {}];

    const [create, {isSuccess: createIsSuccess, isError: createIsError, error: createError}] = crudApiTable.createMutation ?? [() => {}, {}];
    const [update, {isSuccess: updateIsSuccess, isError: updateIsError, error: updateError}] = crudApiTable.updateMutation ?? [() => {}, {}];
    const [remove, {isSuccess: removeIsSuccess, isError: removeIsError, error: removeError}] = crudApiTable.removeMutation ?? [() => {}, {}];

    React.useEffect(() => {
        allDataIsSuccess && dispatch(addNotice({type: 'success', message: t('notification.success.fetched.default')}));
    }, [allDataIsSuccess]);

    // FILTERS START //////////////////////////////////////////////////////////////
    const sortedTypeOptions: SelectItem[] = [
        {
            title: t('enums.sortOrder.asc'),
            value: SortOrder.ASC,
        },
        {
            title: t('enums.sortOrder.desc'),
            value: SortOrder.DESC,
        }
    ];

    const periodTypeOptions: SelectItem[] = [
        {
            title: t('enums.periodTypes.day'),
            value: 'day',
        },
        {
            title: t('enums.periodTypes.week'),
            value: 'week',
        },
        {
            title: t('enums.periodTypes.month'),
            value: 'month',
        },
        {
            title: t('enums.periodTypes.year'),
            value: 'year',
        },

    ];

    const filtersModal = useModal('filtersModal');

    const [searchField, setSearchField] = React.useState<SelectItem | undefined>(undefined);

    type FiltersData = {
        searchValue: string;
        dateStart: string;
        dateEnd: string;
    };
    const [filtersInputs, setFiltersInputs] = React.useState<FiltersData>({
        searchValue: '',
        dateStart: '',
        dateEnd: ''
    });

    const [sortedField, setSortedField] = React.useState<SelectItem | undefined>(undefined);
    const [sortedType, setSortedType] = React.useState<SelectItem | undefined>(undefined);
    const [periodType, setPeriodType] = React.useState<SelectItem | undefined>(undefined);

    const [currentPage, setCurrentPage] = React.useState(1);

    const gettriggerDataBodyQuery = () => {
        const result: any = {};
        
        const sorting = {
            by: sortedField?.value,
            order: sortedType?.value
        };
        const search = {
            field: searchField?.value,
            value: filtersInputs.searchValue
        };
        const dateFilter = {
            dateFrom: filtersInputs.dateStart,
            dateTo: filtersInputs.dateEnd
        };
        const pagination = {
            page: 1,
            pageSize: limit
        };

        if(crudApiTable.entityId) result.id = crudApiTable.entityId;
        if(sortedField?.value && sortedType?.value) result.sorting = sorting;
        if(searchField && filtersInputs) result.search = search;
        if(filtersInputs.dateStart && filtersInputs.dateEnd) result.dateFilter = dateFilter;
        result.pagination = pagination;
        
        return result;
    };

    const filterHandler = () => {
        filtersModal.close();

        setCurrentPage(1);

        triggerData(gettriggerDataBodyQuery());
    };

    React.useEffect(() => {
        triggerData({
            ...gettriggerDataBodyQuery(),
            pagination: {
                page: currentPage,
                pageSize: limit
            }
        });
    }, [currentPage]);

    React.useEffect(() => {
        setCurrentPage(1);
    }, [createIsSuccess, updateIsSuccess, removeIsSuccess]);

    const clearFiltersHandler = () => {
        setSearchField(undefined);
        setFiltersInputs({
            searchValue: '',
            dateStart: '',
            dateEnd: ''
        });
        setSortedField(undefined);
        setSortedType(undefined);
        setPeriodType(undefined);

        triggerData({
            pagination: {
                page: 1,
                pageSize: limit
            }
        });
    }

    const filtersIsNotEmpty = () => {
        return (
            (filters?.period && (Boolean(filtersInputs.dateStart) || Boolean(filtersInputs.dateEnd))) || 
            (filters?.searchFieldOptions && (Boolean(searchField) && Boolean(filtersInputs.searchValue))) || 
            (filters?.sortedFieldOptions && (Boolean(sortedField?.value) && Boolean(sortedType?.value)))
        );
    };
    const hasAnyFilters =
        filters?.period === true ||
        (filters?.searchFieldOptions?.length ?? 0) > 0 ||
        (filters?.sortedFieldOptions?.length ?? 0) > 0;

    React.useEffect(() => {
        if(periodType?.value === 'day') {
            const dateStart = new Date();
            dateStart.setHours(0, 0, 0, 0);
            
            const dateEnd = new Date();
            dateEnd.setHours(23, 59, 59, 999);

            setFiltersInputs((prev) => ({ ...prev, dateStart: toLocalInputFormat(dateStart), dateEnd: toLocalInputFormat(dateEnd) }));
        }

        if(periodType?.value === 'week') {
            const now = new Date();

            // Получаем день недели (в JS воскресенье = 0, понедельник = 1, ..., суббота = 6)
            const dayOfWeek = now.getDay();

            // Определяем сдвиг: если воскресенье (0), то это конец недели, иначе отнимаем (dayOfWeek - 1)
            const diffToMonday = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;

            // Начало недели (понедельник)
            const dateStart = new Date(now);
            dateStart.setDate(now.getDate() + diffToMonday);
            dateStart.setHours(0, 0, 0, 0);

            // Конец недели (воскресенье)
            const dateEnd = new Date(dateStart);
            dateEnd.setDate(dateStart.getDate() + 6);
            dateEnd.setHours(23, 59, 59, 999);

            setFiltersInputs((prev) => ({ ...prev, dateStart: toLocalInputFormat(dateStart), dateEnd: toLocalInputFormat(dateEnd) }));
        }

        if(periodType?.value === 'month') {
            const now = new Date();
            const month = now.getMonth();

            const dateStart = new Date(now.getFullYear(), month, 1);
            dateStart.setHours(0, 0, 0, 0);

            const dateEnd = new Date(now.getFullYear(), month + 1, 0);
            dateEnd.setHours(23, 59, 59, 999);

            setFiltersInputs((prev) => ({ ...prev, dateStart: toLocalInputFormat(dateStart), dateEnd: toLocalInputFormat(dateEnd) }));
        }

        if(periodType?.value === 'year') {
            const now = new Date();
            const year = now.getFullYear();

            const dateStart = new Date(year, 0, 1);
            dateStart.setHours(0, 0, 0, 0);

            const dateEnd = new Date(year, 11, 31);
            dateEnd.setHours(23, 59, 59, 999);

            setFiltersInputs((prev) => ({ ...prev, dateStart: toLocalInputFormat(dateStart), dateEnd: toLocalInputFormat(dateEnd) }));
        }
    }, [periodType?.value]);
    // FILTERS END//////////////////////////////////////////////////////////////////////

    // ACTIONS START /////////////////////////////////////////////////////////////////
    type ContextType = (typeof Context)[keyof typeof Context];
    type ActionType = (typeof Action)[keyof typeof Action];
    const [context, setContext] = React.useState<ContextType>(Context.CREATE);
    const [contextAction, setContextAction] = React.useState<ActionType>(Action.ADD);
    
    const actionsModal = useModal('actionsModal');
    const removeModal = useModal('removeModal');

    const [editedItem, setEditedItem] = React.useState<number | undefined>(undefined);
    const [reason, setReason] = React.useState<string>('');

    const canCreateRecord = hasPermissions.create && Boolean(crudApiTable.createMutation);
    const canSubmitCreateRecord = canCreateRecord && record?.canSubmitRecord;
    const canUpdateRecord = hasPermissions.update && Boolean(crudApiTable.updateMutation) && Boolean(crudApiTable.getOneQuery);
    const canSubmitUpdateRecord = canUpdateRecord && (editedItem !== undefined) && record?.canSubmitRecord;
    const canRemoveRecord = hasPermissions.delete && Boolean(crudApiTable.removeMutation) && (editedItem !== undefined);

    React.useEffect(() => {
        if(record?.fillFormWithRecordData) {
            if(!recordIsLoading && recordIsSuccess && recordData) {
                record.fillFormWithRecordData();
            }
        }
    }, [recordIsLoading, recordIsSuccess, recordData, recordFulfilledTimeStamp]);
    
    React.useEffect(() => {
        if(!actionsModal.show) {
            record?.clearFieldsRecordHandler();
            setReason('');
        }
    }, [actionsModal.show]);

    React.useEffect(() => {
        if(!removeModal.show) {
            setReason('');
        }
    }, [removeModal.show]);

    const openAddActionHandler = () => {
        if(canCreateRecord) {
            setContext(Context.CREATE);
            setContextAction(Action.ADD);

            auxiliaryData?.fetchAuxiliaryData();

            actionsModal.open();
        }
    }

    const openEditActionHandler = (id: number) => {
        if(canUpdateRecord) {
            setContext(Context.UPDATE);
            setContextAction(Action.EDIT);

            recordTrigger(id);
            setEditedItem(id);
            auxiliaryData?.fetchAuxiliaryData();

            actionsModal.open();
        }
    }

    const actionHandler = () => {
        if((context === Context.CREATE) && (contextAction === Action.ADD)) {
            if(canSubmitCreateRecord) {
                create(record?.toFormData ? record.toFormData() : record.recordData);
                actionsModal.close();
            }
        }
        if((context === Context.UPDATE) && (contextAction === Action.EDIT)) {
            if(canSubmitUpdateRecord) {
                update(record?.toFormData ? {
                    id: editedItem, 
                    formData: () => {
                        const fd = record.toFormData && record.toFormData();
                        fd && fd.append("reason", reason);
                        return fd;
                    }
                } : {
                    ...record.recordData,
                    id: editedItem,
                    reason: reason
                });
                actionsModal.close();
            }
        }
        
    }

    const removeHandler = () => {
        if(canRemoveRecord) {
            remove({
                id: editedItem,
                reason: reason
            });
            removeModal.close();
            actionsModal.close();
        }
    }
    // ACTIONS END ///////////////////////////////////////////////////////////////////

    // RESPONSE START ////////////////////////////////////////////////////////////////
    type ResponseStatusType = {
        isSuccess: boolean;
        isError: boolean;
        error?: FetchBaseQueryError | SerializedError;
        action: 'created' | 'updated' | 'deleted' | 'fetched';
    };

    const statusDeps = [
        createIsSuccess, createIsError,
        updateIsSuccess, updateIsError,
        removeIsSuccess, removeIsError,
        allDataIsError, recordIsError,
    ];

    React.useEffect(() => {
        const statuses: ResponseStatusType[] = [
            { isSuccess: false, isError: allDataIsError, error: allDataError, action: 'fetched' },
            { isSuccess: false, isError: recordIsError, error: recordError, action: 'fetched' },
            { isSuccess: createIsSuccess, isError: createIsError, error: createError, action: 'created' },
            { isSuccess: updateIsSuccess, isError: updateIsError, error: updateError, action: 'updated' },
            { isSuccess: removeIsSuccess, isError: removeIsError, error: removeError, action: 'deleted' },
        ];

        for (const status of statuses) {
            if (status.isSuccess) {
                if(status.action === 'fetched') {
                    // @ts-ignore
                    dispatch(addNotice({type: 'success', message: t(`notification.success.${status.action}.default`)}));
                } else {
                    // @ts-ignore
                    dispatch(addNotice({type: 'success', message: t(`notification.success.${status.action}.default.singular`)}));
                }
            } else if (status.isError) {
                dispatch(addNotice({type: 'error', message: t(`notification.error.default`)}));
            }
        }
    }, statusDeps);

    // RESPONSE END //////////////////////////////////////////////////////////////////

    return (
        <Block 
            {...blockPops} 
            actions={
                <Stack direction='row' gap='sm' justify='flex-end' align='center' >
                    {hasAnyFilters && (
                        <>
                            <IconButton icon={{name: 'FILTER'}} onClick={filtersModal.open} />
                            {filtersIsNotEmpty() && (
                                <IconButton icon={{name: 'REMOVE'}} onClick={clearFiltersHandler} />
                            )}
                        </>
                    )}
                    {(canCreateRecord) && (
                        <IconButton icon={{name: 'ADD'}} onClick={openAddActionHandler} />
                    )}
                    <IconButton icon={{name: 'RELOAD'}} onClick={filterHandler} />
                </Stack>
            } >
            <Table 
                {...table} 
                maxHeight={maxHeight} 
                response={responseData}
                limit={limit}
                fetching={allDataIsFetching} 
                error={allDataIsError} 
                onChangePage={() => setCurrentPage(prev => prev + 1)} >
                <THead<T> {...thead} />
                <TBody<T> 
                    {...tbody} 
                    data={tbody.data || []} 
                    {...(
                        (!rowClick && select) ? {select} : 
                        (rowClick && !select) ? {rowClick} : 
                        (!rowClick && !select) ? {rowClick: (item) => openEditActionHandler(item.id as number)} : 
                        undefined
                    )}
                     />
            </Table>

            <Modal 
                title={t(`common.filters`)} 
                decorativeIcon={'FILTER'}
                options={filtersModal}
                footer={
                    <Stack direction='row' gap='sm' justify='flex-end' align='center'>
                        <Button variant='primary' icon="FILTER" onClick={filterHandler} disabled={!filtersIsNotEmpty()}>{t('actions.apply')}</Button>
                    </Stack>
                }
            >
                <Stack
                    direction='column' 
                    gap='md' 
                    justify='flex-start' 
                    align='stretch' >
                    {filters?.searchFieldOptions && (
                        <>
                            <Select 
                                value={searchField} 
                                onChangeValue={setSearchField} 
                                options={filters.searchFieldOptions} 
                                label={t('ui.filters.fieldSearch')}
                                getKey={(item) => item.value}
                                getValue={(item) => item.title} />

                            <TextField 
                                value={filtersInputs.searchValue} 
                                onChangeValue={(val: string) => setFiltersInputs((prev) => ({ ...prev, searchValue: val }))}
                                label={t('ui.filters.valueSearch')} />
                            
                            {/* <Devider /> */}
                        </>
                    )}

                    {filters?.sortedFieldOptions && (
                        <>
                            <Select 
                                value={sortedField} 
                                onChangeValue={setSortedField} 
                                options={filters.sortedFieldOptions} 
                                label={t('ui.filters.fieldSorting')} 
                                getKey={(item) => item.value}
                                getValue={(item) => item.title} />
                            
                            <Select 
                                value={sortedType} 
                                onChangeValue={setSortedType} 
                                options={sortedTypeOptions} 
                                label={t('ui.filters.orderSorting')}  
                                getKey={(item) => item.value}
                                getValue={(item) => item.title} />

                            {/* <Devider /> */}
                        </>
                    )}

                    {filters?.period && (
                        <>
                            <Select 
                                value={periodType} 
                                onChangeValue={setPeriodType} 
                                options={periodTypeOptions} 
                                label={t('ui.filters.datePeriods')}  
                                getKey={(item) => item.value}
                                getValue={(item) => item.title} />

                            <TextField 
                                value={filtersInputs.dateStart} 
                                onChangeValue={(val: string) => setFiltersInputs((prev) => ({ ...prev, dateStart: val as string }))} 
                                label={t('ui.filters.dateStart')}  
                                type="datetime-local" />
                            <TextField 
                                value={filtersInputs.dateEnd} 
                                onChangeValue={(val: string) => setFiltersInputs((prev) => ({ ...prev, dateEnd: val as string }))} 
                                label={t('ui.filters.dateEnd')}  
                                type="datetime-local" />
                        </>
                    )}
                </Stack>
            </Modal>

            <Modal 
                title={t(`enums.action.${contextAction}`)} 
                decorativeIcon={'EYE'} 
                options={actionsModal}
                footer={
                    <Stack 
                        style={{flexWrap: 'wrap'}}
                        direction='row' gap='sm' justify='flex-end' align='center'>
                        {record?.modalActions}
                        <Button
                            variant='primary'
                            icon={contextAction === 'add' ? 'ADD' : 'EDIT'} 
                            disabled={!record?.canSubmitRecord} 
                            onClick={actionHandler}>
                            {t('actions.save')}
                        </Button>
                        {((canRemoveRecord) && (context === Context.UPDATE)) && (
                            // <IconButton icon={{name: 'REMOVE'}} onClick={removeModal.open} />
                            <Button
                                variant='secondary'
                                intent='destructive'
                                icon={'REMOVE'} 
                                onClick={removeModal.open}>
                                {t('actions.remove')}
                            </Button>
                        )}
                    </Stack>                    
                }
            >
                {/* {(auxiliaryData?.isLoading ? auxiliaryData.isLoading : false) && (
                    <Screen type='loading' />
                )} */}
                {(auxiliaryData?.isLoading ? !auxiliaryData.isLoading : true) && (
                    <Stack direction='column' gap='2xl' justify='flex-start' align='stretch'>
                        {record?.body}
                        {contextAction === 'edit' && (
                            <div className='mt-[16px]'>
                                <TextField 
                                    value={reason} 
                                    onChangeValue={(value: string) => setReason(value)}
                                    label={t('common.reason')} />
                            </div>
                        )}
                    </Stack>
                )}
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
        </Block>
    );
};

export default ManagedTable;