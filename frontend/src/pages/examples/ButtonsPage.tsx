import React from 'react';
import { Block, Button, Page, Stack } from '../../ui/copmonents';
import { testClickHandler } from '../../utils';

const pageProps = {
    title: 'Демонстрация вариантов кнопки' ,
    description: 'На этой странице представлены различные варианты кнопок, их состояния и стили. Используется для демонстрации и проверки компонентов интерфейса.' ,
}

const ButtonsPage: React.FC = () => {
    return (
        <Page 
            title={pageProps.title}
            description={pageProps.description} 
            decorativeIcon='INFO'>
            <Block title='Главная кнока для нейтральных действий'>
                <Stack direction='column' gap='md' justify='center' align='stretch' >
                    <Stack direction='row' gap='md' justify='flex-start' align='center'>
                        <Button onClick={testClickHandler} variant='primary' intent='normal' size='xl'>Test button xl</Button>
                        <Button onClick={testClickHandler} variant='primary' intent='normal' size='lg'>Test button lg</Button>
                        <Button onClick={testClickHandler} variant='primary' intent='normal' size='md'>Test button md</Button>
                        <Button onClick={testClickHandler} variant='primary' intent='normal' size='sm'>Test button sm</Button>
                        <Button onClick={testClickHandler} variant='primary' intent='normal' size='xs'>Test button xs</Button>
                    </Stack>
                    <Stack direction='row' gap='md' justify='flex-start' align='center'>
                        <Button icon='INFO' onClick={testClickHandler} variant='primary' intent='normal' size='xl'>Test button xl</Button>
                        <Button icon='INFO' onClick={testClickHandler} variant='primary' intent='normal' size='lg'>Test button lg</Button>
                        <Button icon='INFO' onClick={testClickHandler} variant='primary' intent='normal' size='md'>Test button md</Button>
                        <Button icon='INFO' onClick={testClickHandler} variant='primary' intent='normal' size='sm'>Test button sm</Button>
                        <Button icon='INFO' onClick={testClickHandler} variant='primary' intent='normal' size='xs'>Test button xs</Button>
                    </Stack>
                    <Stack direction='row' gap='md' justify='flex-start' align='center'>
                        <Button disabled onClick={testClickHandler} variant='primary' intent='normal' size='xl'>Test button xl</Button>
                        <Button disabled onClick={testClickHandler} variant='primary' intent='normal' size='lg'>Test button lg</Button>
                        <Button disabled onClick={testClickHandler} variant='primary' intent='normal' size='md'>Test button md</Button>
                        <Button disabled onClick={testClickHandler} variant='primary' intent='normal' size='sm'>Test button sm</Button>
                        <Button disabled onClick={testClickHandler} variant='primary' intent='normal' size='xs'>Test button xs</Button>
                    </Stack>
                    <Stack direction='row' gap='md' justify='flex-start' align='center'>
                        <Button disabled icon='INFO' onClick={testClickHandler} variant='primary' intent='normal' size='xl'>Test button xl</Button>
                        <Button disabled icon='INFO' onClick={testClickHandler} variant='primary' intent='normal' size='lg'>Test button lg</Button>
                        <Button disabled icon='INFO' onClick={testClickHandler} variant='primary' intent='normal' size='md'>Test button md</Button>
                        <Button disabled icon='INFO' onClick={testClickHandler} variant='primary' intent='normal' size='sm'>Test button sm</Button>
                        <Button disabled icon='INFO' onClick={testClickHandler} variant='primary' intent='normal' size='xs'>Test button xs</Button>
                    </Stack>
                </Stack>
            </Block>
            <Block title='Второстепенная кнока для нейтральных действий'>
                <Stack direction='column' gap='md' justify='center' align='stretch' >
                    <Stack direction='row' gap='md' justify='flex-start' align='center'>
                        <Button onClick={testClickHandler} variant='secondary' intent='normal' size='xl'>Test button xl</Button>
                        <Button onClick={testClickHandler} variant='secondary' intent='normal' size='lg'>Test button lg</Button>
                        <Button onClick={testClickHandler} variant='secondary' intent='normal' size='md'>Test button md</Button>
                        <Button onClick={testClickHandler} variant='secondary' intent='normal' size='sm'>Test button sm</Button>
                        <Button onClick={testClickHandler} variant='secondary' intent='normal' size='xs'>Test button xs</Button>
                    </Stack>
                    <Stack direction='row' gap='md' justify='flex-start' align='center'>
                        <Button icon='INFO' onClick={testClickHandler} variant='secondary' intent='normal' size='xl'>Test button xl</Button>
                        <Button icon='INFO' onClick={testClickHandler} variant='secondary' intent='normal' size='lg'>Test button lg</Button>
                        <Button icon='INFO' onClick={testClickHandler} variant='secondary' intent='normal' size='md'>Test button md</Button>
                        <Button icon='INFO' onClick={testClickHandler} variant='secondary' intent='normal' size='sm'>Test button sm</Button>
                        <Button icon='INFO' onClick={testClickHandler} variant='secondary' intent='normal' size='xs'>Test button xs</Button>
                    </Stack>
                    <Stack direction='row' gap='md' justify='flex-start' align='center'>
                        <Button disabled onClick={testClickHandler} variant='secondary' intent='normal' size='xl'>Test button xl</Button>
                        <Button disabled onClick={testClickHandler} variant='secondary' intent='normal' size='lg'>Test button lg</Button>
                        <Button disabled onClick={testClickHandler} variant='secondary' intent='normal' size='md'>Test button md</Button>
                        <Button disabled onClick={testClickHandler} variant='secondary' intent='normal' size='sm'>Test button sm</Button>
                        <Button disabled onClick={testClickHandler} variant='secondary' intent='normal' size='xs'>Test button xs</Button>
                    </Stack>
                    <Stack direction='row' gap='md' justify='flex-start' align='center'>
                        <Button disabled icon='INFO' onClick={testClickHandler} variant='secondary' intent='normal' size='xl'>Test button xl</Button>
                        <Button disabled icon='INFO' onClick={testClickHandler} variant='secondary' intent='normal' size='lg'>Test button lg</Button>
                        <Button disabled icon='INFO' onClick={testClickHandler} variant='secondary' intent='normal' size='md'>Test button md</Button>
                        <Button disabled icon='INFO' onClick={testClickHandler} variant='secondary' intent='normal' size='sm'>Test button sm</Button>
                        <Button disabled icon='INFO' onClick={testClickHandler} variant='secondary' intent='normal' size='xs'>Test button xs</Button>
                    </Stack>
                </Stack>
            </Block>
            <Block title='Незначительная кнока для нейтральных действий'>
                <Stack direction='column' gap='md' justify='center' align='stretch' >
                    <Stack direction='row' gap='md' justify='flex-start' align='center'>
                        <Button onClick={testClickHandler} variant='ghost' intent='normal' size='xl'>Test button xl</Button>
                        <Button onClick={testClickHandler} variant='ghost' intent='normal' size='lg'>Test button lg</Button>
                        <Button onClick={testClickHandler} variant='ghost' intent='normal' size='md'>Test button md</Button>
                        <Button onClick={testClickHandler} variant='ghost' intent='normal' size='sm'>Test button sm</Button>
                        <Button onClick={testClickHandler} variant='ghost' intent='normal' size='xs'>Test button xs</Button>
                    </Stack>
                    <Stack direction='row' gap='md' justify='flex-start' align='center'>
                        <Button icon='INFO' onClick={testClickHandler} variant='ghost' intent='normal' size='xl'>Test button xl</Button>
                        <Button icon='INFO' onClick={testClickHandler} variant='ghost' intent='normal' size='lg'>Test button lg</Button>
                        <Button icon='INFO' onClick={testClickHandler} variant='ghost' intent='normal' size='md'>Test button md</Button>
                        <Button icon='INFO' onClick={testClickHandler} variant='ghost' intent='normal' size='sm'>Test button sm</Button>
                        <Button icon='INFO' onClick={testClickHandler} variant='ghost' intent='normal' size='xs'>Test button xs</Button>
                    </Stack>
                    <Stack direction='row' gap='md' justify='flex-start' align='center'>
                        <Button disabled onClick={testClickHandler} variant='ghost' intent='normal' size='xl'>Test button xl</Button>
                        <Button disabled onClick={testClickHandler} variant='ghost' intent='normal' size='lg'>Test button lg</Button>
                        <Button disabled onClick={testClickHandler} variant='ghost' intent='normal' size='md'>Test button md</Button>
                        <Button disabled onClick={testClickHandler} variant='ghost' intent='normal' size='sm'>Test button sm</Button>
                        <Button disabled onClick={testClickHandler} variant='ghost' intent='normal' size='xs'>Test button xs</Button>
                    </Stack>
                    <Stack direction='row' gap='md' justify='flex-start' align='center'>
                        <Button disabled icon='INFO' onClick={testClickHandler} variant='ghost' intent='normal' size='xl'>Test button xl</Button>
                        <Button disabled icon='INFO' onClick={testClickHandler} variant='ghost' intent='normal' size='lg'>Test button lg</Button>
                        <Button disabled icon='INFO' onClick={testClickHandler} variant='ghost' intent='normal' size='md'>Test button md</Button>
                        <Button disabled icon='INFO' onClick={testClickHandler} variant='ghost' intent='normal' size='sm'>Test button sm</Button>
                        <Button disabled icon='INFO' onClick={testClickHandler} variant='ghost' intent='normal' size='xs'>Test button xs</Button>
                    </Stack>
                </Stack>
            </Block>

            <Block title='Главная кнока для опасных действий'>
                <Stack direction='column' gap='md' justify='center' align='stretch' >
                    <Stack direction='row' gap='md' justify='flex-start' align='center'>
                        <Button onClick={testClickHandler} variant='primary' intent='destructive' size='xl'>Test button xl</Button>
                        <Button onClick={testClickHandler} variant='primary' intent='destructive' size='lg'>Test button lg</Button>
                        <Button onClick={testClickHandler} variant='primary' intent='destructive' size='md'>Test button md</Button>
                        <Button onClick={testClickHandler} variant='primary' intent='destructive' size='sm'>Test button sm</Button>
                        <Button onClick={testClickHandler} variant='primary' intent='destructive' size='xs'>Test button xs</Button>
                    </Stack>
                    <Stack direction='row' gap='md' justify='flex-start' align='center'>
                        <Button icon='INFO' onClick={testClickHandler} variant='primary' intent='destructive' size='xl'>Test button xl</Button>
                        <Button icon='INFO' onClick={testClickHandler} variant='primary' intent='destructive' size='lg'>Test button lg</Button>
                        <Button icon='INFO' onClick={testClickHandler} variant='primary' intent='destructive' size='md'>Test button md</Button>
                        <Button icon='INFO' onClick={testClickHandler} variant='primary' intent='destructive' size='sm'>Test button sm</Button>
                        <Button icon='INFO' onClick={testClickHandler} variant='primary' intent='destructive' size='xs'>Test button xs</Button>
                    </Stack>
                    <Stack direction='row' gap='md' justify='flex-start' align='center'>
                        <Button disabled onClick={testClickHandler} variant='primary' intent='destructive' size='xl'>Test button xl</Button>
                        <Button disabled onClick={testClickHandler} variant='primary' intent='destructive' size='lg'>Test button lg</Button>
                        <Button disabled onClick={testClickHandler} variant='primary' intent='destructive' size='md'>Test button md</Button>
                        <Button disabled onClick={testClickHandler} variant='primary' intent='destructive' size='sm'>Test button sm</Button>
                        <Button disabled onClick={testClickHandler} variant='primary' intent='destructive' size='xs'>Test button xs</Button>
                    </Stack>
                    <Stack direction='row' gap='md' justify='flex-start' align='center'>
                        <Button disabled icon='INFO' onClick={testClickHandler} variant='primary' intent='destructive' size='xl'>Test button xl</Button>
                        <Button disabled icon='INFO' onClick={testClickHandler} variant='primary' intent='destructive' size='lg'>Test button lg</Button>
                        <Button disabled icon='INFO' onClick={testClickHandler} variant='primary' intent='destructive' size='md'>Test button md</Button>
                        <Button disabled icon='INFO' onClick={testClickHandler} variant='primary' intent='destructive' size='sm'>Test button sm</Button>
                        <Button disabled icon='INFO' onClick={testClickHandler} variant='primary' intent='destructive' size='xs'>Test button xs</Button>
                    </Stack>
                </Stack>
            </Block>
            <Block title='Второстепенная кнока для опасных действий'>
                <Stack direction='column' gap='md' justify='center' align='stretch' >
                    <Stack direction='row' gap='md' justify='flex-start' align='center'>
                        <Button onClick={testClickHandler} variant='secondary' intent='destructive' size='xl'>Test button xl</Button>
                        <Button onClick={testClickHandler} variant='secondary' intent='destructive' size='lg'>Test button lg</Button>
                        <Button onClick={testClickHandler} variant='secondary' intent='destructive' size='md'>Test button md</Button>
                        <Button onClick={testClickHandler} variant='secondary' intent='destructive' size='sm'>Test button sm</Button>
                        <Button onClick={testClickHandler} variant='secondary' intent='destructive' size='xs'>Test button xs</Button>
                    </Stack>
                    <Stack direction='row' gap='md' justify='flex-start' align='center'>
                        <Button icon='INFO' onClick={testClickHandler} variant='secondary' intent='destructive' size='xl'>Test button xl</Button>
                        <Button icon='INFO' onClick={testClickHandler} variant='secondary' intent='destructive' size='lg'>Test button lg</Button>
                        <Button icon='INFO' onClick={testClickHandler} variant='secondary' intent='destructive' size='md'>Test button md</Button>
                        <Button icon='INFO' onClick={testClickHandler} variant='secondary' intent='destructive' size='sm'>Test button sm</Button>
                        <Button icon='INFO' onClick={testClickHandler} variant='secondary' intent='destructive' size='xs'>Test button xs</Button>
                    </Stack>
                    <Stack direction='row' gap='md' justify='flex-start' align='center'>
                        <Button disabled onClick={testClickHandler} variant='secondary' intent='destructive' size='xl'>Test button xl</Button>
                        <Button disabled onClick={testClickHandler} variant='secondary' intent='destructive' size='lg'>Test button lg</Button>
                        <Button disabled onClick={testClickHandler} variant='secondary' intent='destructive' size='md'>Test button md</Button>
                        <Button disabled onClick={testClickHandler} variant='secondary' intent='destructive' size='sm'>Test button sm</Button>
                        <Button disabled onClick={testClickHandler} variant='secondary' intent='destructive' size='xs'>Test button xs</Button>
                    </Stack>
                    <Stack direction='row' gap='md' justify='flex-start' align='center'>
                        <Button disabled icon='INFO' onClick={testClickHandler} variant='secondary' intent='destructive' size='xl'>Test button xl</Button>
                        <Button disabled icon='INFO' onClick={testClickHandler} variant='secondary' intent='destructive' size='lg'>Test button lg</Button>
                        <Button disabled icon='INFO' onClick={testClickHandler} variant='secondary' intent='destructive' size='md'>Test button md</Button>
                        <Button disabled icon='INFO' onClick={testClickHandler} variant='secondary' intent='destructive' size='sm'>Test button sm</Button>
                        <Button disabled icon='INFO' onClick={testClickHandler} variant='secondary' intent='destructive' size='xs'>Test button xs</Button>
                    </Stack>
                </Stack>
            </Block>
            <Block title='Незначительная кнока для опасных действий'>
                <Stack direction='column' gap='md' justify='center' align='stretch' >
                    <Stack direction='row' gap='md' justify='flex-start' align='center'>
                        <Button onClick={testClickHandler} variant='ghost' intent='destructive' size='xl'>Test button xl</Button>
                        <Button onClick={testClickHandler} variant='ghost' intent='destructive' size='lg'>Test button lg</Button>
                        <Button onClick={testClickHandler} variant='ghost' intent='destructive' size='md'>Test button md</Button>
                        <Button onClick={testClickHandler} variant='ghost' intent='destructive' size='sm'>Test button sm</Button>
                        <Button onClick={testClickHandler} variant='ghost' intent='destructive' size='xs'>Test button xs</Button>
                    </Stack>
                    <Stack direction='row' gap='md' justify='flex-start' align='center'>
                        <Button icon='INFO' onClick={testClickHandler} variant='ghost' intent='destructive' size='xl'>Test button xl</Button>
                        <Button icon='INFO' onClick={testClickHandler} variant='ghost' intent='destructive' size='lg'>Test button lg</Button>
                        <Button icon='INFO' onClick={testClickHandler} variant='ghost' intent='destructive' size='md'>Test button md</Button>
                        <Button icon='INFO' onClick={testClickHandler} variant='ghost' intent='destructive' size='sm'>Test button sm</Button>
                        <Button icon='INFO' onClick={testClickHandler} variant='ghost' intent='destructive' size='xs'>Test button xs</Button>
                    </Stack>
                    <Stack direction='row' gap='md' justify='flex-start' align='center'>
                        <Button disabled onClick={testClickHandler} variant='ghost' intent='destructive' size='xl'>Test button xl</Button>
                        <Button disabled onClick={testClickHandler} variant='ghost' intent='destructive' size='lg'>Test button lg</Button>
                        <Button disabled onClick={testClickHandler} variant='ghost' intent='destructive' size='md'>Test button md</Button>
                        <Button disabled onClick={testClickHandler} variant='ghost' intent='destructive' size='sm'>Test button sm</Button>
                        <Button disabled onClick={testClickHandler} variant='ghost' intent='destructive' size='xs'>Test button xs</Button>
                    </Stack>
                    <Stack direction='row' gap='md' justify='flex-start' align='center'>
                        <Button disabled icon='INFO' onClick={testClickHandler} variant='ghost' intent='destructive' size='xl'>Test button xl</Button>
                        <Button disabled icon='INFO' onClick={testClickHandler} variant='ghost' intent='destructive' size='lg'>Test button lg</Button>
                        <Button disabled icon='INFO' onClick={testClickHandler} variant='ghost' intent='destructive' size='md'>Test button md</Button>
                        <Button disabled icon='INFO' onClick={testClickHandler} variant='ghost' intent='destructive' size='sm'>Test button sm</Button>
                        <Button disabled icon='INFO' onClick={testClickHandler} variant='ghost' intent='destructive' size='xs'>Test button xs</Button>
                    </Stack>
                </Stack>
            </Block>

            <Block title='Главная кнока только иконка для нейтральных действий'>
                <Stack direction='column' gap='md' justify='center' align='stretch' >
                    <Stack direction='row' gap='md' justify='flex-start' align='center'>
                        <Button icon='INFO' onClick={testClickHandler} variant='primary' intent='normal' size='xl'></Button>
                        <Button icon='INFO' onClick={testClickHandler} variant='primary' intent='normal' size='lg'></Button>
                        <Button icon='INFO' onClick={testClickHandler} variant='primary' intent='normal' size='md'></Button>
                        <Button icon='INFO' onClick={testClickHandler} variant='primary' intent='normal' size='sm'></Button>
                        <Button icon='INFO' onClick={testClickHandler} variant='primary' intent='normal' size='xs'></Button>
                    </Stack>
                    <Stack direction='row' gap='md' justify='flex-start' align='center'>
                        <Button disabled icon='INFO' onClick={testClickHandler} variant='primary' intent='normal' size='xl'></Button>
                        <Button disabled icon='INFO' onClick={testClickHandler} variant='primary' intent='normal' size='lg'></Button>
                        <Button disabled icon='INFO' onClick={testClickHandler} variant='primary' intent='normal' size='md'></Button>
                        <Button disabled icon='INFO' onClick={testClickHandler} variant='primary' intent='normal' size='sm'></Button>
                        <Button disabled icon='INFO' onClick={testClickHandler} variant='primary' intent='normal' size='xs'></Button>
                    </Stack>
                </Stack>
            </Block>
            <Block title='Второстепенная кнока только иконка для нейтральных действий'>
                <Stack direction='column' gap='md' justify='center' align='stretch' >
                    <Stack direction='row' gap='md' justify='flex-start' align='center'>
                        <Button icon='INFO' onClick={testClickHandler} variant='secondary' intent='normal' size='xl'></Button>
                        <Button icon='INFO' onClick={testClickHandler} variant='secondary' intent='normal' size='lg'></Button>
                        <Button icon='INFO' onClick={testClickHandler} variant='secondary' intent='normal' size='md'></Button>
                        <Button icon='INFO' onClick={testClickHandler} variant='secondary' intent='normal' size='sm'></Button>
                        <Button icon='INFO' onClick={testClickHandler} variant='secondary' intent='normal' size='xs'></Button>
                    </Stack>
                    <Stack direction='row' gap='md' justify='flex-start' align='center'>
                        <Button disabled icon='INFO' onClick={testClickHandler} variant='secondary' intent='normal' size='xl'></Button>
                        <Button disabled icon='INFO' onClick={testClickHandler} variant='secondary' intent='normal' size='lg'></Button>
                        <Button disabled icon='INFO' onClick={testClickHandler} variant='secondary' intent='normal' size='md'></Button>
                        <Button disabled icon='INFO' onClick={testClickHandler} variant='secondary' intent='normal' size='sm'></Button>
                        <Button disabled icon='INFO' onClick={testClickHandler} variant='secondary' intent='normal' size='xs'></Button>
                    </Stack>
                </Stack>
            </Block>
            <Block title='Незначительная кнока только иконка для нейтральных действий'>
                <Stack direction='column' gap='md' justify='center' align='stretch' >
                    <Stack direction='row' gap='md' justify='flex-start' align='center'>
                        <Button icon='INFO' onClick={testClickHandler} variant='ghost' intent='normal' size='xl'></Button>
                        <Button icon='INFO' onClick={testClickHandler} variant='ghost' intent='normal' size='lg'></Button>
                        <Button icon='INFO' onClick={testClickHandler} variant='ghost' intent='normal' size='md'></Button>
                        <Button icon='INFO' onClick={testClickHandler} variant='ghost' intent='normal' size='sm'></Button>
                        <Button icon='INFO' onClick={testClickHandler} variant='ghost' intent='normal' size='xs'></Button>
                    </Stack>
                    <Stack direction='row' gap='md' justify='flex-start' align='center'>
                        <Button disabled icon='INFO' onClick={testClickHandler} variant='ghost' intent='normal' size='xl'></Button>
                        <Button disabled icon='INFO' onClick={testClickHandler} variant='ghost' intent='normal' size='lg'></Button>
                        <Button disabled icon='INFO' onClick={testClickHandler} variant='ghost' intent='normal' size='md'></Button>
                        <Button disabled icon='INFO' onClick={testClickHandler} variant='ghost' intent='normal' size='sm'></Button>
                        <Button disabled icon='INFO' onClick={testClickHandler} variant='ghost' intent='normal' size='xs'></Button>
                    </Stack>
                </Stack>
            </Block>

            <Block title='Главная кнока только иконка для опасных действий'>
                <Stack direction='column' gap='md' justify='center' align='stretch' >
                    <Stack direction='row' gap='md' justify='flex-start' align='center'>
                        <Button icon='INFO' onClick={testClickHandler} variant='primary' intent='destructive' size='xl'></Button>
                        <Button icon='INFO' onClick={testClickHandler} variant='primary' intent='destructive' size='lg'></Button>
                        <Button icon='INFO' onClick={testClickHandler} variant='primary' intent='destructive' size='md'></Button>
                        <Button icon='INFO' onClick={testClickHandler} variant='primary' intent='destructive' size='sm'></Button>
                        <Button icon='INFO' onClick={testClickHandler} variant='primary' intent='destructive' size='xs'></Button>
                    </Stack>
                    <Stack direction='row' gap='md' justify='flex-start' align='center'>
                        <Button disabled icon='INFO' onClick={testClickHandler} variant='primary' intent='destructive' size='xl'></Button>
                        <Button disabled icon='INFO' onClick={testClickHandler} variant='primary' intent='destructive' size='lg'></Button>
                        <Button disabled icon='INFO' onClick={testClickHandler} variant='primary' intent='destructive' size='md'></Button>
                        <Button disabled icon='INFO' onClick={testClickHandler} variant='primary' intent='destructive' size='sm'></Button>
                        <Button disabled icon='INFO' onClick={testClickHandler} variant='primary' intent='destructive' size='xs'></Button>
                    </Stack>
                </Stack>
            </Block>
            <Block title='Второстепенная кнока только иконка для опасных действий'>
                <Stack direction='column' gap='md' justify='center' align='stretch' >
                    <Stack direction='row' gap='md' justify='flex-start' align='center'>
                        <Button icon='INFO' onClick={testClickHandler} variant='secondary' intent='destructive' size='xl'></Button>
                        <Button icon='INFO' onClick={testClickHandler} variant='secondary' intent='destructive' size='lg'></Button>
                        <Button icon='INFO' onClick={testClickHandler} variant='secondary' intent='destructive' size='md'></Button>
                        <Button icon='INFO' onClick={testClickHandler} variant='secondary' intent='destructive' size='sm'></Button>
                        <Button icon='INFO' onClick={testClickHandler} variant='secondary' intent='destructive' size='xs'></Button>
                    </Stack>
                    <Stack direction='row' gap='md' justify='flex-start' align='center'>
                        <Button disabled icon='INFO' onClick={testClickHandler} variant='secondary' intent='destructive' size='xl'></Button>
                        <Button disabled icon='INFO' onClick={testClickHandler} variant='secondary' intent='destructive' size='lg'></Button>
                        <Button disabled icon='INFO' onClick={testClickHandler} variant='secondary' intent='destructive' size='md'></Button>
                        <Button disabled icon='INFO' onClick={testClickHandler} variant='secondary' intent='destructive' size='sm'></Button>
                        <Button disabled icon='INFO' onClick={testClickHandler} variant='secondary' intent='destructive' size='xs'></Button>
                    </Stack>
                </Stack>
            </Block>
            <Block title='Незначительная кнока только иконка для опасных действий'>
                <Stack direction='column' gap='md' justify='center' align='stretch' >
                    <Stack direction='row' gap='md' justify='flex-start' align='center'>
                        <Button icon='INFO' onClick={testClickHandler} variant='ghost' intent='destructive' size='xl'></Button>
                        <Button icon='INFO' onClick={testClickHandler} variant='ghost' intent='destructive' size='lg'></Button>
                        <Button icon='INFO' onClick={testClickHandler} variant='ghost' intent='destructive' size='md'></Button>
                        <Button icon='INFO' onClick={testClickHandler} variant='ghost' intent='destructive' size='sm'></Button>
                        <Button icon='INFO' onClick={testClickHandler} variant='ghost' intent='destructive' size='xs'></Button>
                    </Stack>
                    <Stack direction='row' gap='md' justify='flex-start' align='center'>
                        <Button disabled icon='INFO' onClick={testClickHandler} variant='ghost' intent='destructive' size='xl'></Button>
                        <Button disabled icon='INFO' onClick={testClickHandler} variant='ghost' intent='destructive' size='lg'></Button>
                        <Button disabled icon='INFO' onClick={testClickHandler} variant='ghost' intent='destructive' size='md'></Button>
                        <Button disabled icon='INFO' onClick={testClickHandler} variant='ghost' intent='destructive' size='sm'></Button>
                        <Button disabled icon='INFO' onClick={testClickHandler} variant='ghost' intent='destructive' size='xs'></Button>
                    </Stack>
                </Stack>
            </Block>
        </Page>
    );
};

export default ButtonsPage;