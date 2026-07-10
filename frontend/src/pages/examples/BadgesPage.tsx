import React from 'react';
import { Badge, Block, Page, Stack } from '../../ui/copmonents';

const pageProps = {
    title: 'Демонстрация вариантов бейджа' ,
    description: 'На этой странице представлены различные варианты бейджей - бейдж только для информации, бейдж с кнопкой действия, статусы. Используется для демонстрации и проверки компонентов интерфейса.' ,
}

const BadgesPage: React.FC = () => {

    const testClickHandler = () => {
        alert('Test click on component!');
    };

    return (
        <Page 
            title={pageProps.title} 
            description={pageProps.description} 
            decorativeIcon='INFO' >
            <Block title='Нейтральный'>
                <Stack
                 direction='column' gap='md'
                 justify='center' align='stretch' >
                    <Stack
                        direction='row' gap='md'
                        justify='flex-start' align='center' >
                        <Badge text='Test badge xl' status='default' size='xl' />
                        <Badge text='Test badge lg' status='default' size='lg' />
                        <Badge text='Test badge md' status='default' size='md' />
                        <Badge text='Test badge sm' status='default' size='sm' />
                        <Badge text='Test badge xs' status='default' size='xs' />
                    </Stack>
                    <Stack
                        direction='row' gap='md'
                        justify='flex-start' align='center' >
                        <Badge icon='INFO' text='Test badge xl' status='default' size='xl' />
                        <Badge icon='INFO' text='Test badge lg' status='default' size='lg' />
                        <Badge icon='INFO' text='Test badge md' status='default' size='md' />
                        <Badge icon='INFO' text='Test badge sm' status='default' size='sm' />
                        <Badge icon='INFO' text='Test badge xs' status='default' size='xs' />
                    </Stack>
                </Stack>
            </Block>

            <Block title='Информационный'>
                <Stack
                 direction='column' gap='md'
                 justify='center' align='stretch' >
                    <Stack
                        direction='row' gap='md'
                        justify='flex-start' align='center' >
                        <Badge text='Test badge xl' status='info' size='xl' />
                        <Badge text='Test badge lg' status='info' size='lg' />
                        <Badge text='Test badge md' status='info' size='md' />
                        <Badge text='Test badge sm' status='info' size='sm' />
                        <Badge text='Test badge xs' status='info' size='xs' />
                    </Stack>
                    <Stack
                        direction='row' gap='md'
                        justify='flex-start' align='center' >
                        <Badge icon='INFO' text='Test badge xl' status='info' size='xl' />
                        <Badge icon='INFO' text='Test badge lg' status='info' size='lg' />
                        <Badge icon='INFO' text='Test badge md' status='info' size='md' />
                        <Badge icon='INFO' text='Test badge sm' status='info' size='sm' />
                        <Badge icon='INFO' text='Test badge xs' status='info' size='xs' />
                    </Stack>
                </Stack>
            </Block>

            <Block title='Статус успеха'>
                <Stack
                 direction='column' gap='md'
                 justify='center' align='stretch' >
                    <Stack
                        direction='row' gap='md'
                        justify='flex-start' align='center' >
                        <Badge text='Test badge xl' status='success' size='xl' />
                        <Badge text='Test badge lg' status='success' size='lg' />
                        <Badge text='Test badge md' status='success' size='md' />
                        <Badge text='Test badge sm' status='success' size='sm' />
                        <Badge text='Test badge xs' status='success' size='xs' />
                    </Stack>
                    <Stack
                        direction='row' gap='md'
                        justify='flex-start' align='center' >
                        <Badge icon='INFO' text='Test badge xl' status='success' size='xl' />
                        <Badge icon='INFO' text='Test badge lg' status='success' size='lg' />
                        <Badge icon='INFO' text='Test badge md' status='success' size='md' />
                        <Badge icon='INFO' text='Test badge sm' status='success' size='sm' />
                        <Badge icon='INFO' text='Test badge xs' status='success' size='xs' />
                    </Stack>
                </Stack>
            </Block>

            <Block title='Статус предупреждения'>
                <Stack
                 direction='column' gap='md'
                 justify='center' align='stretch' >
                    <Stack
                        direction='row' gap='md'
                        justify='flex-start' align='center' >
                        <Badge text='Test badge xl' status='warning' size='xl' />
                        <Badge text='Test badge lg' status='warning' size='lg' />
                        <Badge text='Test badge md' status='warning' size='md' />
                        <Badge text='Test badge sm' status='warning' size='sm' />
                        <Badge text='Test badge xs' status='warning' size='xs' />
                    </Stack>
                    <Stack
                        direction='row' gap='md'
                        justify='flex-start' align='center' >
                        <Badge icon='INFO' text='Test badge xl' status='warning' size='xl' />
                        <Badge icon='INFO' text='Test badge lg' status='warning' size='lg' />
                        <Badge icon='INFO' text='Test badge md' status='warning' size='md' />
                        <Badge icon='INFO' text='Test badge sm' status='warning' size='sm' />
                        <Badge icon='INFO' text='Test badge xs' status='warning' size='xs' />
                    </Stack>
                </Stack>
            </Block>

            <Block title='Статус ошибки'>
                <Stack
                 direction='column' gap='md'
                 justify='center' align='stretch' >
                    <Stack
                        direction='row' gap='md'
                        justify='flex-start' align='center' >
                        <Badge text='Test badge xl' status='danger' size='xl' />
                        <Badge text='Test badge lg' status='danger' size='lg' />
                        <Badge text='Test badge md' status='danger' size='md' />
                        <Badge text='Test badge sm' status='danger' size='sm' />
                        <Badge text='Test badge xs' status='danger' size='xs' />
                    </Stack>
                    <Stack
                        direction='row' gap='md'
                        justify='flex-start' align='center' >
                        <Badge icon='INFO' text='Test badge xl' status='danger' size='xl' />
                        <Badge icon='INFO' text='Test badge lg' status='danger' size='lg' />
                        <Badge icon='INFO' text='Test badge md' status='danger' size='md' />
                        <Badge icon='INFO' text='Test badge sm' status='danger' size='sm' />
                        <Badge icon='INFO' text='Test badge xs' status='danger' size='xs' />
                    </Stack>
                </Stack>
            </Block>

            <Block title='Бейдж с кнопкой действия'>
                <Stack
                    direction='column' gap='md'
                    justify='center' align='stretch' >
                        <Stack
                            direction='row' gap='md'
                            justify='flex-start' align='center' >
                            <Badge text='Test badge xl' status='default' size='xl' action={{icon: 'EDIT', onClick: testClickHandler}} />
                            <Badge text='Test badge lg' status='default' size='lg' action={{icon: 'EDIT', onClick: testClickHandler}} />
                            <Badge text='Test badge md' status='default' size='md' action={{icon: 'EDIT', onClick: testClickHandler}} />
                            <Badge text='Test badge sm' status='default' size='sm' action={{icon: 'EDIT', onClick: testClickHandler}} />
                            <Badge text='Test badge xs' status='default' size='xs' action={{icon: 'EDIT', onClick: testClickHandler}} />
                        </Stack>
                        <Stack
                            direction='row' gap='md'
                            justify='flex-start' align='center' >
                            <Badge icon='INFO' text='Test badge xl' status='default' size='xl' action={{icon: 'EDIT', onClick: testClickHandler}} />
                            <Badge icon='INFO' text='Test badge lg' status='default' size='lg' action={{icon: 'EDIT', onClick: testClickHandler}} />
                            <Badge icon='INFO' text='Test badge md' status='default' size='md' action={{icon: 'EDIT', onClick: testClickHandler}} />
                            <Badge icon='INFO' text='Test badge sm' status='default' size='sm' action={{icon: 'EDIT', onClick: testClickHandler}} />
                            <Badge icon='INFO' text='Test badge xs' status='default' size='xs' action={{icon: 'EDIT', onClick: testClickHandler}} />
                        </Stack>
                </Stack>
            </Block>
        </Page>
    );
};

export default BadgesPage;