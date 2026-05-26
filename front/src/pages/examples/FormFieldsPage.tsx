import React from 'react';
import { Block, FormField, Page, Stack } from '../../ui/copmonents';

const pageProps = {
    title: 'Демонстрация вариантов слоя полей' ,
    description: 'На этой странице представлены различные варианты слоев полей, направления' ,
}

const testMessages = ['message 1', 'message 2', 'message 3'];

const FormFieldsPage: React.FC = () => {

    return (
        <Page 
            title={pageProps.title} 
            description={pageProps.description} 
            decorativeIcon='INFO' >
            <Block title='Направления с лейблом'>
                <Stack direction='row' gap='md' justify='flex-start' align='center'>
                    <FormField label={{text: 'Test label', direction: 'column'}} validation={{status: 'default', messages: testMessages}}>
                        <span>some content</span> 
                    </FormField>
                    <FormField label={{text: 'Test label', direction: 'column-reverse'}} validation={{status: 'default', messages: testMessages}}>
                        <span>some content</span> 
                    </FormField>
                    <FormField label={{text: 'Test label', direction: 'row'}} validation={{status: 'default', messages: testMessages}}>
                        <span>some content</span> 
                    </FormField>
                    <FormField label={{text: 'Test label', direction: 'row-reverse'}} validation={{status: 'default', messages: testMessages}}>
                        <span>some content</span> 
                    </FormField>
                </Stack>
                <Stack direction='row' gap='md' justify='flex-start' align='center'>
                    <FormField validation={{status: 'default', messages: testMessages}}>
                        <span>some content, without label</span> 
                    </FormField>
                </Stack>
            </Block>
            <Block title='Без лейбла'>
                <Stack direction='row' gap='md' justify='flex-start' align='center'>
                    <FormField validation={{status: 'default', messages: testMessages}}>
                        <span>some content, without label</span> 
                    </FormField>
                </Stack>
            </Block>
        </Page>
    );
};

export default FormFieldsPage;