import React from 'react';
import { Block, Button, InfoList, Modal, Page, Stack } from '../../ui/copmonents';
import { patientInfoList } from '../../utils';
import { useModal } from '../../ui/copmonents/Modal/useModal';

const pageProps = {
    title: 'Демонстрация вариантов модального окна' ,
    description: 'На этой странице представлены различные варианты модального окна' ,
}

const ModalsPage: React.FC = () => {
    const testModal = useModal('test-modal');

    return (
        <Page 
            title={pageProps.title} 
            description={pageProps.description} 
            decorativeIcon='INFO' >
            <Block>
                <Stack direction='row' gap='md' justify='flex-start' align='center'>
                    <Button variant={'primary'} onClick={() => testModal.open()}>Open modal</Button>
                </Stack>
            </Block>

            <Modal  
                options={testModal} 
                title='Test modal' footer={
                    <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '16px'}}>
                        <Button variant='primary' icon='ADD'>Обследование</Button>
                    </div>
                }>
                <InfoList oprions={patientInfoList} />
                <InfoList oprions={patientInfoList} />
                <InfoList oprions={patientInfoList} />
                <InfoList oprions={patientInfoList} />
            </Modal>
        </Page>
    );
};

export default ModalsPage;