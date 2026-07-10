import React from 'react';
import { useTranslation } from 'react-i18next';
import { Block, Page, Stack } from '../ui/copmonents';

const MainPage = () => {
    const {t} = useTranslation();
    
    return (
        <Page>
            <Stack
                direction='column' gap='xl'
                justify='center' align='center' >
                <Block
                    title={`${t('pages.home.title')}  👋`} >
                    <p
                        style={{
                            margin: 0,
                            fontSize: '18px',
                            lineHeight: 1.6,
                            color: '#666',
                        }}
                    >
                        {t('pages.home.description')}
                    </p>
                </Block>

                <Stack
                    direction='row' gap='xl'
                    justify='space-between' align='flex-start' >
                    <Block
                        title={`📁 ${t('pages.home.sections.studies.title')}`} >
                        
                        <ul style={{ lineHeight: 1.8, listStyle: 'disc', marginLeft: 'var(--space-md)', marginRight: 'var(--space-md)' }}>
                            <li>{t('pages.home.sections.studies.items.upload')}</li>
                            <li>{t('pages.home.sections.studies.items.processing')}</li>
                            <li>{t('pages.home.sections.studies.items.storage')}</li>
                            <li>{t('pages.home.sections.studies.items.results')}</li>
                        </ul>
                    </Block>

                    <Block
                        title={`🤖 ${t('pages.home.sections.ai.title')}`} >
                        
                        <ul style={{ lineHeight: 1.8, listStyle: 'disc', marginLeft: 'var(--space-md)', marginRight: 'var(--space-md)' }}>
                            <li>{t('pages.home.sections.ai.items.models')}</li>
                            <li>{t('pages.home.sections.ai.items.detection')}</li>
                            <li>{t('pages.home.sections.ai.items.confidence')}</li>
                            <li>{t('pages.home.sections.ai.items.history')}</li>
                        </ul>
                    </Block>

                    <Block
                        title={`👨‍⚕️ ${t('pages.home.sections.management.title')}`} >

                        <ul style={{ lineHeight: 1.8, listStyle: 'disc', marginLeft: 'var(--space-md)', marginRight: 'var(--space-md)' }}>
                            <li>{t('pages.home.sections.management.items.patients')}</li>
                            <li>{t('pages.home.sections.management.items.studies')}</li>
                            <li>{t('pages.home.sections.management.items.metadata')}</li>
                            <li>{t('pages.home.sections.management.items.analysis')}</li>
                        </ul>
                    </Block>
                </Stack>

                <Block
                    title={`🚀 ${t('pages.home.gettingStarted.title')}`} >

                    <ol
                        style={{
                            lineHeight: 1.8,
                            paddingLeft: '20px',
                            listStyle: 'auto'
                        }}
                    >
                        <li>{t('pages.home.gettingStarted.steps.createPatient')}</li>
                        <li>{t('pages.home.gettingStarted.steps.uploadStudy')}</li>
                        <li>{t('pages.home.gettingStarted.steps.waitProcessing')}</li>
                        <li>{t('pages.home.gettingStarted.steps.openStudy')}</li>
                        <li>{t('pages.home.gettingStarted.steps.runInference')}</li>
                    </ol>
                </Block>
            </Stack>
        </Page>
    );
};

export default MainPage;