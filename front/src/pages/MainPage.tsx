import React from 'react';

const MainPage = () => {
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
                    Добро пожаловать в MRI System 👋
                </h1>

                <p
                    style={{
                        margin: 0,
                        fontSize: '18px',
                        lineHeight: 1.6,
                        color: '#666',
                    }}
                >
                    Система для хранения, обработки и анализа МРТ-исследований коленного
                    сустава с поддержкой алгоритмов искусственного интеллекта.
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
                    <h2>📁 Работа с исследованиями</h2>

                    <ul style={{ lineHeight: 1.8, listStyle: 'disc' }}>
                        <li>Загрузка DICOM-архивов</li>
                        <li>Автоматическая обработка данных</li>
                        <li>Хранение серий и изображений</li>
                        <li>Просмотр результатов</li>
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
                    <h2>🤖 Анализ ИИ</h2>

                    <ul style={{ lineHeight: 1.8, listStyle: 'disc' }}>
                        <li>Запуск обученных моделей</li>
                        <li>Поиск признаков повреждений</li>
                        <li>Оценка достоверности результатов</li>
                        <li>Хранение истории предсказаний</li>
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
                    <h2>👨‍⚕️ Управление данными</h2>

                    <ul style={{ lineHeight: 1.8, listStyle: 'disc' }}>
                        <li>Ведение базы пациентов</li>
                        <li>Управление исследованиями</li>
                        <li>Просмотр метаданных DICOM</li>
                        <li>Контроль результатов анализа</li>
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
                <h2>🚀 Начало работы</h2>

                <ol
                    style={{
                        lineHeight: 1.8,
                        paddingLeft: '20px',
                        listStyle: 'auto'
                    }}
                >
                    <li>Создайте пациента или выберите существующего.</li>
                    <li>Загрузите архив с МРТ-исследованием.</li>
                    <li>Дождитесь завершения обработки данных.</li>
                    <li>Откройте исследование для просмотра снимков.</li>
                    <li>Запустите анализ ИИ при необходимости.</li>
                </ol>
            </div>
        </div>
    );
};

export default MainPage;