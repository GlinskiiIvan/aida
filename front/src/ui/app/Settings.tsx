import React from 'react';
import { Button, Modal, Stack } from '../copmonents';
import { useTranslation } from 'react-i18next';
import { useModal } from '../copmonents/Modal/useModal';
import i18n from '../../i18n';
import type { ModalOptions } from '../copmonents/Modal/Modal';

type IProps = {
    options: ModalOptions;
};

const Settings: React.FC<IProps> = ({
    options
}) => {
    const {t} = useTranslation();

    const appLanguages = [
        { code: 'ru', label: t(`common.russian`) },
        { code: 'en', label: t(`common.english`) },
        { code: 'kz', label: t(`common.kazakh`) },
    ];

    const changeLangHandler = (code: string) => {
        i18n.changeLanguage(code);
    }

    return (
        <Modal 
            title={t(`common.settings`)}
            options={options} >
                <Stack
                    direction='column' gap='md'
                    justify='flex-start' align='flex-start' >
                        <p>{t(`common.language`)}</p>
                        <Stack
                            direction='row' gap='md'
                            justify='center' align='stretch' >
                                {appLanguages.map(lang => (
                                    <Button 
                                        variant={i18n.resolvedLanguage === lang.code ? 'primary' : 'secondary'} 
                                        intent='normal' size='md'
                                        onClick={() => changeLangHandler(lang.code)} >
                                            {lang.label}
                                    </Button>
                                ))}
                        </Stack>
                </Stack>
        </Modal>
    );
};

export default Settings;