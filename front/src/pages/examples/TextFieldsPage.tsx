import React from 'react';
import { Block, Page, Stack, TextField } from '../../ui/copmonents';
import { testMessages } from '../../utils';

const pageProps = {
    title: 'Демонстрация вариантов текстового инпута' ,
    description: 'На этой странице представлены различные варианты текстового инпута, статусы, наличие лейбла и блока сообщений' ,
}

const TextFieldsPage: React.FC = () => {
    const [value, setValue] = React.useState('');

    const testClearTextFieldHandler = () => {
        setValue('');
    };
        

    return (
        <Page 
            title={pageProps.title} 
            description={pageProps.description} 
            decorativeIcon='INFO' >
            <Block title='Содержимое, иконка, инпут, действие'>
                <Stack direction='row' gap='md' justify='flex-start' align='center'>
                    <TextField
                        label='Test text field' placeholder='Enter value...' 
                        validation={{status: 'default', messages: []}}
                        value={value} onChangeValue={setValue} />
                    <TextField
                        label='Test text field' placeholder='Enter value...' 
                        decorativeIcon='INFO'
                        validation={{status: 'default', messages: []}}
                        value={value} onChangeValue={setValue} />
                    <TextField
                        label='Test text field' placeholder='Enter value...' 
                        actionIcon={{name: 'REMOVE', onClick: testClearTextFieldHandler, visible: !!value}}
                        validation={{status: 'default', messages: []}}
                        value={value} onChangeValue={setValue} />
                    <TextField
                        label='Test text field' placeholder='Enter value...' 
                        decorativeIcon='INFO' actionIcon={{name: 'REMOVE', onClick: testClearTextFieldHandler, visible: !!value}}
                        validation={{status: 'default', messages: []}}
                        value={value} onChangeValue={setValue} />
                </Stack>
            </Block>
            <Block title='Статусы'>
                <Stack direction='row' gap='md' justify='flex-start' align='center'>
                    <TextField
                        label='Test text field' placeholder='Enter value...' 
                        validation={{status: 'default', messages: []}}
                        value={value} onChangeValue={setValue} />
                    <TextField
                        label='Test text field' placeholder='Enter value...' 
                        validation={{status: 'info', messages: []}}
                        value={value} onChangeValue={setValue} />
                    <TextField
                        label='Test text field' placeholder='Enter value...' 
                        validation={{status: 'success', messages: []}}
                        value={value} onChangeValue={setValue} />
                    <TextField
                        label='Test text field' placeholder='Enter value...' 
                        validation={{status: 'warning', messages: []}}
                        value={value} onChangeValue={setValue} />
                    <TextField
                        label='Test text field' placeholder='Enter value...' 
                        validation={{status: 'danger', messages: []}}
                        value={value} onChangeValue={setValue} />
                </Stack>
                <Stack direction='row' gap='md' justify='flex-start' align='center'>
                    <TextField
                        label='Test text field' placeholder='Enter value...'
                        decorativeIcon='INFO' actionIcon={{name: 'REMOVE', onClick: testClearTextFieldHandler, visible: !!value}} 
                        validation={{status: 'default', messages: testMessages}}
                        value={value} onChangeValue={setValue} />
                    <TextField
                        label='Test text field' placeholder='Enter value...'
                        decorativeIcon='INFO' actionIcon={{name: 'REMOVE', onClick: testClearTextFieldHandler, visible: !!value}} 
                        validation={{status: 'info', messages: testMessages}}
                        value={value} onChangeValue={setValue} />
                    <TextField
                        label='Test text field' placeholder='Enter value...'
                        decorativeIcon='INFO' actionIcon={{name: 'REMOVE', onClick: testClearTextFieldHandler, visible: !!value}} 
                        validation={{status: 'success', messages: testMessages}}
                        value={value} onChangeValue={setValue} />
                    <TextField
                        label='Test text field' placeholder='Enter value...'
                        decorativeIcon='INFO' actionIcon={{name: 'REMOVE', onClick: testClearTextFieldHandler, visible: !!value}} 
                        validation={{status: 'warning', messages: testMessages}}
                        value={value} onChangeValue={setValue} />
                    <TextField
                        label='Test text field' placeholder='Enter value...'
                        decorativeIcon='INFO' actionIcon={{name: 'REMOVE', onClick: testClearTextFieldHandler, visible: !!value}} 
                        validation={{status: 'danger', messages: testMessages}}
                        value={value} onChangeValue={setValue} />
                </Stack>
            </Block>
            <Block title='Заблокированные. Пустой, заполненный'>
                <Stack direction='row' gap='md' justify='flex-start' align='center'>
                    <TextField
                        disabled
                        label='Test text field' placeholder='Enter value...' 
                        validation={{status: 'default', messages: []}}
                        value={''} onChangeValue={setValue} />
                    <TextField
                        disabled
                        label='Test text field' placeholder='Enter value...' 
                        decorativeIcon='INFO'
                        validation={{status: 'default', messages: []}}
                        value={'Some value'} onChangeValue={setValue} />
                </Stack>
            </Block>
        </Page>
    );
};

export default TextFieldsPage;