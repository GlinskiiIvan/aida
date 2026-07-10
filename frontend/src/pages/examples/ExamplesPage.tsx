import React from 'react';

import { BadgesPage, ButtonsPage, CheckBoxesPage, FieldTriggersPage, FormFieldsPage, InfoListsPage, LabelsPage, MessageBoxesPage, ModalsPage, SelectsPage, TablesPage, TextFieldsPage } from './index';
import { Stack } from '../../ui/copmonents';


function ExamplesPage() {
  return (
    <>
      <Stack direction='column' gap='xl' justify='center' align='center'>
          <BadgesPage />
          <ButtonsPage />
          <InfoListsPage />
          <LabelsPage />
          <MessageBoxesPage />
          <FormFieldsPage />
          <FieldTriggersPage />
          <CheckBoxesPage />
          <TextFieldsPage />
          <SelectsPage />
          <ModalsPage />
          <TablesPage />
      </Stack>
    </>
  )
}

export default ExamplesPage
