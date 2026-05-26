import React from 'react';
import { Block, Button, IconButton, InfoList, Page, Stack } from '../../ui/copmonents';
import { patientInfoList } from '../../utils';

const pageProps = {
    title: 'Демонстрация вариантов списка информации' ,
    description: 'На этой странице представлены различные варианты списка информации' ,
}



const InfoListsPage: React.FC = () => {

    return (
        <Page 
            title={pageProps.title} 
            description={pageProps.description} 
            decorativeIcon='INFO' >
            <Block 
                title='Список с шириной по контенту' decorativeIcon='INFO'
                actions={
                    <Stack direction='row' gap='xs' justify='center' align='center'>
                        <IconButton icon={{name: 'ADD', color: 'tertiary', size: 'lg'}} />
                        <IconButton icon={{name: 'EDIT', color: 'tertiary', size: 'lg'}} />
                        <IconButton icon={{name: 'RELOAD', color: 'tertiary', size: 'lg'}} />
                    </Stack>
                }
                footer={
                    <Stack direction='row' gap='md' justify='center' align='center'>
                        <Button variant='secondary' icon='EDIT'>Перейти к пациенту</Button>
                        <Button variant='primary' icon='ADD'>Обследование</Button>
                    </Stack>
                } >
                <InfoList oprions={patientInfoList} />
            </Block>

            <Block
                fullWidth
                style={{maxWidth: '700px'}} 
                title='Список с шириной 100% и ограниченной максимальной' decorativeIcon='INFO'
                actions={
                    <Stack direction='row' gap='xs' justify='center' align='center'>
                        <IconButton icon={{name: 'ADD', color: 'tertiary', size: 'inherit'}} />
                        <IconButton icon={{name: 'EDIT', color: 'tertiary', size: 'lg'}} />
                        <IconButton icon={{name: 'RELOAD', color: 'tertiary', size: 'lg'}} />
                    </Stack>
                }
                footer={
                    <Stack direction='row' gap='md' justify='center' align='center'>
                        <Button variant='secondary' icon='EDIT'>Перейти к пациенту</Button>
                        <Button variant='primary' icon='ADD'>Обследование</Button>
                    </Stack>
                } >
                <Stack direction='row' gap='md' justify='stretch' align='center'>
                    <InfoList oprions={patientInfoList} />
                    <InfoList oprions={patientInfoList} />
                </Stack>
            </Block>

            <Block 
                fullWidth
                title='Список с шириной 100% без ограничений' decorativeIcon='INFO'
                actions={
                    <Stack direction='row' gap='xs' justify='center' align='center'>
                        <IconButton icon={{name: 'ADD', color: 'tertiary', size: 'inherit'}} />
                        <IconButton icon={{name: 'EDIT', color: 'tertiary', size: 'lg'}} />
                        <IconButton icon={{name: 'RELOAD', color: 'tertiary', size: 'lg'}} />
                    </Stack>
                }
                footer={
                    <Stack direction='row' gap='md' justify='center' align='center'>
                        <Button variant='secondary' icon='EDIT'>Перейти к пациенту</Button>
                        <Button variant='primary' icon='ADD'>Обследование</Button>
                    </Stack>
                } >
                <Stack direction='row' gap='md' justify='stretch' align='center'>
                    <InfoList oprions={patientInfoList} />
                    <InfoList oprions={patientInfoList} />
                    <InfoList oprions={patientInfoList} />
                </Stack>
            </Block>
        </Page>
    );
};

export default InfoListsPage;