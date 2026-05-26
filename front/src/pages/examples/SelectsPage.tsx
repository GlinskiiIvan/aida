import React from 'react';
import { Block, Page, Select, Stack } from '../../ui/copmonents';
import { testMessages } from '../../utils';

const pageProps = {
    title: 'Демонстрация вариантов селекта' ,
    description: 'На этой странице представлены различные варианты селекта, статусы, наличие лейбла и блока сообщений' ,
}

interface Option {id: number, name: string};

const testOptions: Option[] = [{id: 1, name: 'Option 1'}, {id: 2, name: 'Option 2'}, {id: 3, name: 'Option 3'}, {id: 4, name: 'Option 4'},];
// const testOptions2: string[] = ['Option2 1', 'Option2 2', 'Option2 3', 'Option2 4'];


const SelectsPage: React.FC = () => {
    const [option, setOption] = React.useState<Option>();
    // const [option2, setOption2] = React.useState<string>();

    const fullWidth = {flex: '1'};

    return (
        <Page 
            title={pageProps.title} 
            description={pageProps.description} 
            decorativeIcon='INFO' >
            <Block title='Содержимое, иконка, инпут'>
                <Stack direction='row' gap='md' justify='flex-start' align='center'>
                    <Select
                        label='Test select' placeholder='Select value...' decorativeIcon='INFO'
                        options={testOptions} value={option} onChangeValue={setOption} 
                        getKey={(T) => T.id} getValue={(T) => T.name}
                        validation={{status: 'default', messages: []}} />
                    <Select
                        label='Test select' placeholder='Select value...'
                        options={testOptions} value={option} onChangeValue={setOption} 
                        getKey={(T) => T.id} getValue={(T) => T.name}
                        validation={{status: 'default', messages: []}} />
                </Stack>
            </Block>
            <Block title='Заблокированный'>
                <Stack direction='row' gap='md' justify='flex-start' align='center'>
                    <Select
                        disabled style={fullWidth}
                        label='Test select' placeholder='Select value...' decorativeIcon='INFO'
                        options={testOptions} value={option} onChangeValue={setOption} 
                        getKey={(T) => T.id} getValue={(T) => T.name}
                        validation={{status: 'default', messages: []}} />
                </Stack>
            </Block>
            <Block title='Статусы'>
                <Stack direction='column' gap='md' justify='flex-start' align='stretch'>
                    <Stack direction='row' gap='md' justify='flex-start' align='center'>
                        <Select
                            style={fullWidth}
                            label='Test select' placeholder='Select value...' decorativeIcon='INFO'
                            options={testOptions} value={option} onChangeValue={setOption} 
                            getKey={(T) => T.id} getValue={(T) => T.name}
                            validation={{status: 'default', messages: []}} />
                        <Select
                            style={fullWidth}
                            label='Test select' placeholder='Select value...' decorativeIcon='INFO'
                            options={testOptions} value={option} onChangeValue={setOption} 
                            getKey={(T) => T.id} getValue={(T) => T.name}
                            validation={{status: 'info', messages: []}} />
                        <Select
                            style={fullWidth}
                            label='Test select' placeholder='Select value...' decorativeIcon='INFO'
                            options={testOptions} value={option} onChangeValue={setOption} 
                            getKey={(T) => T.id} getValue={(T) => T.name}
                            validation={{status: 'success', messages: []}} />
                        <Select
                            style={fullWidth}
                            label='Test select' placeholder='Select value...' decorativeIcon='INFO'
                            options={testOptions} value={option} onChangeValue={setOption} 
                            getKey={(T) => T.id} getValue={(T) => T.name}
                            validation={{status: 'warning', messages: []}} />
                        <Select
                            style={fullWidth}
                            label='Test select' placeholder='Select value...' decorativeIcon='INFO'
                            options={testOptions} value={option} onChangeValue={setOption} 
                            getKey={(T) => T.id} getValue={(T) => T.name}
                            validation={{status: 'danger', messages: []}} />
                    </Stack>
                    <Stack direction='row' gap='md' justify='flex-start' align='center'>
                        <Select
                            style={fullWidth}
                            label='Test select' placeholder='Select value...' decorativeIcon='INFO'
                            options={testOptions} value={option} onChangeValue={setOption} 
                            getKey={(T) => T.id} getValue={(T) => T.name}
                            validation={{status: 'default', messages: testMessages}} />
                        <Select
                            style={fullWidth}
                            label='Test select' placeholder='Select value...' decorativeIcon='INFO'
                            options={testOptions} value={option} onChangeValue={setOption} 
                            getKey={(T) => T.id} getValue={(T) => T.name}
                            validation={{status: 'info', messages: testMessages}} />
                        <Select
                            style={fullWidth}
                            label='Test select' placeholder='Select value...' decorativeIcon='INFO'
                            options={testOptions} value={option} onChangeValue={setOption} 
                            getKey={(T) => T.id} getValue={(T) => T.name}
                            validation={{status: 'success', messages: testMessages}} />
                        <Select
                            style={fullWidth}
                            label='Test select' placeholder='Select value...' decorativeIcon='INFO'
                            options={testOptions} value={option} onChangeValue={setOption} 
                            getKey={(T) => T.id} getValue={(T) => T.name}
                            validation={{status: 'warning', messages: testMessages}} />
                        <Select
                            style={fullWidth}
                            label='Test select' placeholder='Select value...' decorativeIcon='INFO'
                            options={testOptions} value={option} onChangeValue={setOption} 
                            getKey={(T) => T.id} getValue={(T) => T.name}
                            validation={{status: 'danger', messages: testMessages}} />
                    </Stack>
                </Stack>
            </Block>
        </Page>
    );
};

export default SelectsPage;