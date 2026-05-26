import React from 'react';
import { Block, MessageBox, Page, Stack } from '../../ui/copmonents';
import { testMessages } from '../../utils';

const pageProps = {
    title: 'Демонстрация вариантов блока сообщений' ,
    description: 'На этой странице представлены различные варианты лейблов, размеры и цвета' ,
}


const MessageBoxesPage: React.FC = () => {

    return (
        <Page 
            title={pageProps.title} 
            description={pageProps.description} 
            decorativeIcon='INFO' >
            <Block title='Цвета'>
                <Stack direction='row' gap='md' justify='flex-start' align='center'>
                    <MessageBox validation={{status: 'default', messages: testMessages}} />
                    <MessageBox validation={{status: 'success', messages: testMessages}} />
                    <MessageBox validation={{status: 'warning', messages: testMessages}} />
                    <MessageBox validation={{status: 'danger', messages: testMessages}} />
                    <MessageBox validation={{status: 'info', messages: testMessages}} />
                </Stack>
            </Block>
            <Block title='Размеры'>
                <Stack direction='row' gap='md' justify='flex-start' align='center'>
                    <MessageBox validation={{status: 'default', messages: testMessages}} size='xl' />
                    <MessageBox validation={{status: 'default', messages: testMessages}} size='lg' />
                    <MessageBox validation={{status: 'default', messages: testMessages}} size='md' />
                    <MessageBox validation={{status: 'default', messages: testMessages}} size='sm' />
                    <MessageBox validation={{status: 'default', messages: testMessages}} size='xs' />
                </Stack>
            </Block>
        </Page>
    );
};

export default MessageBoxesPage;