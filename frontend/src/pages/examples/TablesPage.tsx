import React from 'react';
import { Badge, Block, IconButton, Page, Stack, Table, TBody, THead, type ColumnTable, type SortedColumn } from '../../ui/copmonents';

const pageProps = {
    title: 'Демонстрация вариантов таблицы' ,
    description: 'На этой странице представлены различные варианты таблицы' ,
}

const companies = [
  {
      id: 1,
      COMPANIES: 'Chakra Vision UI Version',
      MEMBERS: 'Ryan Tompson',
      BUDGET: {test: 23, many: '$14,000'},
      COMPLETION: '60',
  },
  {
      id: 2,
      COMPANIES: 'Add Progress Track',
      MEMBERS: 'Alexander Smith',
      BUDGET: {test: 23, many: '$3,000'},
      COMPLETION: '10',
  },
  {
      id: 3,
      COMPANIES: 'Fix Platform Errors',
      MEMBERS: 'Jessica Doe',
      BUDGET: {test: 23, many: 'Not set'},
      COMPLETION: '100',
  },
  {
      id: 4,
      COMPANIES: 'Launch our Mobile App',
      MEMBERS: 'Romina Hadid',
      BUDGET: {test: 23, many: '$20,500'},
      COMPLETION: '100',
  },
  {
      id: 5,
      COMPANIES: 'Add the New Pricing Page',
      MEMBERS: 'Alexander Smith',
      BUDGET: {test: 23, many: '$500'},
      COMPLETION: '25',
  },
  {
      id: 6,
      COMPANIES: 'Redesign New Online Shop',
      MEMBERS: 'Ryan Tompson',
      BUDGET: {test: 23, many: '$2,000'},
      COMPLETION: '40',
  }
]

const columns: ColumnTable<typeof companies[number]>[] = [
  {key: 'COMPANIES', label: 'Companies', sortable: true}, 
  {key: 'MEMBERS', label: 'Members', sortable: false}, 
  {key: 'BUDGET', label: 'Budget', sortable: true, render: (item) => (<Badge text={String(item.BUDGET.many)} status={'success'} size={'sm'} />)}, 
  {key: 'COMPLETION', label: 'Completion', sortable: true},
];

const columnsFixed: ColumnTable<typeof companies[number]>[] = [
  {key: 'COMPANIES', label: 'Companies', sortable: true, width: '300px'}, 
  {key: 'MEMBERS', label: 'Members', sortable: false, width: '200px'}, 
  {key: 'BUDGET', label: 'Budget', sortable: true, width: '200px', render: (item) => (<Badge text={String(item.BUDGET.many)} status={'success'} size={'sm'} />)}, 
  {key: 'COMPLETION', label: 'Completion', sortable: true, width: '200px'},
];

const TablesPage: React.FC = () => {
    const [sortedColumn, setSortedColumn] = React.useState<SortedColumn<typeof companies[number]>>();
    const [selectedRow, setSelectedRow] = React.useState<typeof companies[number]>();

    return (
        <Page 
            title={pageProps.title} 
            description={pageProps.description} 
            decorativeIcon='INFO' >
            <Block
                title='Таблица с фиксированной шириной колонок, ограниченным контейнером, вертикальной и горизонтальной прокруткой. При нажатии на строку выполняется переданное действие.'
                style={{width: '600px'}} 
                actions={
                    <Stack direction='row' gap='xs' justify='center' align='center'>
                        <IconButton icon={{name: 'ADD', color: 'tertiary', size: 'lg'}} />
                        <IconButton icon={{name: 'EDIT', color: 'tertiary', size: 'lg'}} />
                        <IconButton icon={{name: 'RELOAD', color: 'tertiary', size: 'lg'}} />
                    </Stack>
                }>
                <Table fixedColumnWidth maxHeight={400}>
                    <THead columns={columnsFixed} sorting={{sortedColumn, onchangeSortedColumn: setSortedColumn}} />
                    <TBody rowKey='id' rowClick={(row) => alert(`row: ${row.MEMBERS}`)} columns={columnsFixed} data={[...companies, ...companies, ...companies, ...companies]} />
                </Table>
            </Block>

            <Block title='Таблица с адаптивной шириной колонок, ширина таблицы без ограничений. Выделяемые строки.' fullWidth>
                <Table maxHeight={400}>
                    <THead columns={columns} sorting={{sortedColumn, onchangeSortedColumn: setSortedColumn}} />
                    <TBody rowKey='id' columns={columns} data={companies} select={{selectedRow, onChange: setSelectedRow}} />
                </Table>
            </Block>

            <Block 
                title='Таблица с адаптивной шириной колонок, ширина таблицы без ограничений. Статичные строки.' 
                fullWidth actions={
                    <Stack direction='row' gap='xs' justify='center' align='center'>
                        <IconButton icon={{name: 'ADD', color: 'tertiary', size: 'lg'}} />
                        <IconButton icon={{name: 'EDIT', color: 'tertiary', size: 'lg'}} />
                        <IconButton icon={{name: 'RELOAD', color: 'tertiary', size: 'lg'}} />
                    </Stack>
                }>
                <Table maxHeight={400}>
                    <THead columns={columns} sorting={{sortedColumn, onchangeSortedColumn: setSortedColumn}} />
                    <TBody rowKey='id' columns={columns} data={companies} />
                </Table>
            </Block>
        </Page>
    );
};

export default TablesPage;