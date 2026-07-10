import React from 'react';
import { Block, Label, Page, Stack } from '../../ui/copmonents';

const pageProps = {
    title: 'Демонстрация вариантов лейбла' ,
    description: 'На этой странице представлены различные варианты лейблов, размеры и цвета' ,
}

const LabelsPage: React.FC = () => {

    return (
        <Page 
            title={pageProps.title} 
            description={pageProps.description} 
            decorativeIcon='INFO' >
            <Block title='Цвета'>
                <Stack direction='row' gap='md' justify='flex-start' align='center'>
                    <Label color='primary'>Test label</Label>
                    <Label color='secondary'>Test label</Label>
                    <Label color='tertiary'>Test label</Label>
                    <Label color='disabled'>Test label</Label>
                    <Label color='accent'>Test label</Label>
                    <Label color='danger'>Test label</Label>
                    <Label color='success'>Test label</Label>
                    <Label color='warning'>Test label</Label>
                </Stack>
            </Block>
            <Block title='Размеры'>
                <Stack direction='row' gap='md' justify='flex-start' align='center'>
                    <Label size='xl'>Test label xl</Label>
                    <Label size='lg'>Test label lg</Label>
                    <Label size='md'>Test label md</Label>
                    <Label size='sm'>Test label sm</Label>
                    <Label size='xs'>Test label xs</Label>
                </Stack>
            </Block>
        </Page>
    );
};

export default LabelsPage;