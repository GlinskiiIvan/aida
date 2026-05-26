import React from 'react';
import { Block, CheckBox, Page, Stack } from '../../ui/copmonents';
import { testMessages } from '../../utils';
// import { testMessages } from '../utils';

const pageProps = {
    title: 'Демонстрация вариантов чек-бокса' ,
    description: 'На этой странице представлены различные варианты чек-бокса, статусы, наличие лейбла и блока сообщений' ,
}


const CheckBoxesPage: React.FC = () => {
    const [checked, setChecked] = React.useState(false);

    return (
        <Page 
            title={pageProps.title} 
            description={pageProps.description} 
            decorativeIcon='INFO' >
            <Block title='Статусы'>
                <Stack direction='row' gap='md' justify='flex-start' align='center'>
                    <CheckBox 
                        label='Test full CheckBox'
                        value={checked} changeValue={setChecked}
                        validation={{status: 'default', messages: testMessages}} />
                    <CheckBox 
                        label='Test full CheckBox'
                        value={checked} changeValue={setChecked}
                        validation={{status: 'info', messages: testMessages}} />
                    <CheckBox 
                        label='Test full CheckBox'
                        value={checked} changeValue={setChecked}
                        validation={{status: 'success', messages: testMessages}} />
                    <CheckBox 
                        label='Test full CheckBox'
                        value={checked} changeValue={setChecked}
                        validation={{status: 'warning', messages: testMessages}} />
                    <CheckBox 
                        label='Test full CheckBox'
                        value={checked} changeValue={setChecked}
                        validation={{status: 'danger', messages: testMessages}} />
                </Stack>
            </Block>
            <Block title='Без блока сообщений'>
                <Stack direction='row' gap='md' justify='flex-start' align='center'>
                    <CheckBox 
                        label='Test full CheckBox'
                        value={checked} changeValue={setChecked}
                        validation={{status: 'default', messages: []}} />
                </Stack>
            </Block>
            <Block title='Без лейбла'>
                <Stack direction='row' gap='md' justify='flex-start' align='center'>
                    <CheckBox 
                        value={checked} changeValue={setChecked}
                        validation={{status: 'default', messages: []}} />
                </Stack>
            </Block>
            <Block title='Заблокированные пустые'>
                <Stack direction='row' gap='md' justify='flex-start' align='flex-start'>
                    <CheckBox 
                        disabled label='Test full CheckBox'
                        value={false} changeValue={setChecked}
                        validation={{status: 'default', messages: testMessages}} />
                    <CheckBox 
                        disabled label='Test full CheckBox'
                        value={false} changeValue={setChecked}
                        validation={{status: 'default', messages: []}} />
                    <CheckBox 
                        disabled
                        value={false} changeValue={setChecked}
                        validation={{status: 'default', messages: []}} />
                </Stack>
            </Block>
            <Block title='Заблокированные отмеченные'>
                <Stack direction='row' gap='md' justify='flex-start' align='flex-start'>
                    <CheckBox 
                        disabled label='Test full CheckBox'
                        value={true} changeValue={setChecked}
                        validation={{status: 'default', messages: testMessages}} />
                    <CheckBox 
                        disabled label='Test full CheckBox'
                        value={true} changeValue={setChecked}
                        validation={{status: 'default', messages: []}} />
                    <CheckBox 
                        disabled
                        value={true} changeValue={setChecked}
                        validation={{status: 'default', messages: []}} />
                </Stack>
            </Block>
        </Page>
    );
};

export default CheckBoxesPage;