import React from 'react';
import { useTranslation } from 'react-i18next';

const MainPage = () => {
    const {t} = useTranslation();
    
    return (
        <div
            style={{
                maxWidth: 1000,
                margin: '0 auto',
                padding: '40px 24px',
            }}
        >
            <div
                style={{
                    padding: '32px',
                    borderRadius: '16px',
                    background: '#fff',
                    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
                    marginBottom: '24px',
                }}
            >
                <h1
                    style={{
                        margin: 0,
                        marginBottom: '12px',
                        fontSize: '32px',
                    }}
                >
                    {t('pages.home.title')} 👋
                </h1>

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
            </div>

            <div
                style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                    gap: '24px',
                }}
            >
                <div
                    style={{
                        padding: '24px',
                        borderRadius: '16px',
                        background: '#fff',
                        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
                    }}
                >
                    <h2>📁 {t('pages.home.sections.studies.title')}</h2>

                    <ul style={{ lineHeight: 1.8, listStyle: 'disc' }}>
                        <li>{t('pages.home.sections.studies.items.upload')}</li>
                        <li>{t('pages.home.sections.studies.items.processing')}</li>
                        <li>{t('pages.home.sections.studies.items.storage')}</li>
                        <li>{t('pages.home.sections.studies.items.results')}</li>
                    </ul>
                </div>

                <div
                    style={{
                        padding: '24px',
                        borderRadius: '16px',
                        background: '#fff',
                        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
                    }}
                >
                    <h2>🤖 {t('pages.home.sections.ai.title')}</h2>

                    <ul style={{ lineHeight: 1.8, listStyle: 'disc' }}>
                        <li>{t('pages.home.sections.ai.items.models')}</li>
                        <li>{t('pages.home.sections.ai.items.detection')}</li>
                        <li>{t('pages.home.sections.ai.items.confidence')}</li>
                        <li>{t('pages.home.sections.ai.items.history')}</li>
                    </ul>
                </div>

                <div
                    style={{
                        padding: '24px',
                        borderRadius: '16px',
                        background: '#fff',
                        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
                    }}
                >
                    <h2>👨‍⚕️ {t('pages.home.sections.management.title')}</h2>

                    <ul style={{ lineHeight: 1.8, listStyle: 'disc' }}>
                        <li>{t('pages.home.sections.management.items.patients')}</li>
                        <li>{t('pages.home.sections.management.items.studies')}</li>
                        <li>{t('pages.home.sections.management.items.metadata')}</li>
                        <li>{t('pages.home.sections.management.items.analysis')}</li>
                    </ul>
                </div>
            </div>

            <div
                style={{
                    marginTop: '24px',
                    padding: '24px',
                    borderRadius: '16px',
                    background: '#fff',
                    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
                }}
            >
                <h2>🚀 {t('pages.home.gettingStarted.title')}</h2>

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
            </div>
        </div>
    );
};

export default MainPage;