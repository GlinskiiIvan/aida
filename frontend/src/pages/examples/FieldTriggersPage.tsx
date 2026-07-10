import React from 'react';
import { Block, Page, Stack } from '../../ui/copmonents';
import FieldTrigger from '../../ui/copmonents/FieldTrigger';

const pageProps = {
    title: 'Демонстрация вариантов триггера формы' ,
    description: 'На этой странице представлены различные статусы триггера формы' ,
}

const FieldTriggersPage: React.FC = () => {

    return (
        <Page 
            title={pageProps.title} 
            description={pageProps.description} 
            decorativeIcon='INFO' >
            <Block title='Статусы'>
                <Stack direction='row' gap='md' justify='flex-start' align='center'>
                    <FieldTrigger status='default' >
                        Some value in trigger
                    </FieldTrigger>
                    <FieldTrigger status='info' >
                        Some value in trigger
                    </FieldTrigger>
                    <FieldTrigger status='success' >
                        Some value in trigger
                    </FieldTrigger>
                    <FieldTrigger status='warning' >
                        Some value in trigger
                    </FieldTrigger>
                    <FieldTrigger status='danger' >
                        Some value in trigger
                    </FieldTrigger>
                </Stack>
            </Block>
        </Page>
    );
};

export default FieldTriggersPage;