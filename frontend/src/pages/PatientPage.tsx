import React from "react";
import {
  ManagedTable,
  Page,
  Select,
  Stack,
  TextField,
  ActionNotifications,
  type ActionNotification,
  type ColumnTable,
  type SelectItem,
} from "../ui/copmonents";
import { Gender } from "../common/enums";
import { ResponseStatus } from "../common/response/enums";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "../routes";

import { patientApi } from "../store/services/patient";

const PatientPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const allDataQuery = patientApi.useLazyFindAllPatientsQuery();
  const oneDataQuery = patientApi.useLazyFindOnePatientQuery();

  const createMutation = patientApi.useCreatePatientMutation();
  const updateMutation = patientApi.useUpdatePatientMutation();
  const removeMutation = patientApi.useRemovePatientMutation();

  const allData = allDataQuery[1]?.data?.data || [];
  const oneData = oneDataQuery[1]?.data;

  const columns: ColumnTable<(typeof allData)[number]>[] = [
    { key: "id", label: "ID", sortable: false },
    { key: "fullName", label: t("entities.patient.fields.fullName"), sortable: false },
    {
      key: "gender",
      label: t("entities.patient.fields.gender"),
      sortable: false,
      render: (item) => (item.gender === Gender.Male ? "Мужской" : "Женский"),
    },
    { key: "note", label: t("entities.patient.fields.note"), sortable: false },
  ];

  // FILTERS START //////////////////////////////////////////////////////////////
  const searchFieldOptions: SelectItem[] = [
    {
      title: "ID",
      value: "id",
    },
    {
      title: t("entities.patient.fields.fullName"),
      value: "fullName",
    },
    {
      title: t("entities.patient.fields.gender"),
      value: "gender",
    },
    {
      title: t("entities.patient.fields.note"),
      value: "note",
    },
  ];

  const sortedFieldOptions: SelectItem[] = searchFieldOptions;
  // FILTERS END//////////////////////////////////////////////////////////////////////

  // ACTIONS START /////////////////////////////////////////////////////////////////
  const gendertOptions = [
    { id: Gender.Male, name: t("enums.gender.male") },
    { id: Gender.Female, name: t("enums.gender.female") },
  ];

  type RecordData = {
    fullName: string;
    birthDate: string;
    gender: (typeof gendertOptions)[0];
    phone: string;
    email: string;
    note: string;
  };

  const initialRecordData: RecordData = {
    fullName: "",
    birthDate: "",
    gender: gendertOptions[0],
    phone: "",
    email: "",
    note: "",
  };

  const [recordFields, setRecordFields] = React.useState<RecordData>(initialRecordData);

  const recordData = {
    ...recordFields,
    gender: recordFields.gender.id,
  };

  const canSubmitRecord =
    recordFields.fullName.trim() !== "" &&
    recordFields.birthDate.trim() !== "" &&
    recordFields.phone.trim() !== "";

  const fillFormWithRecordData = () => {
    if (oneData) {
      setRecordFields({
        fullName: oneData.fullName,
        birthDate: oneData.birthDate,
        gender: gendertOptions.find((option) => option.id === oneData.gender) || gendertOptions[0],
        phone: oneData.phone,
        email: oneData.email || "",
        note: oneData.note || "",
      });
    }
  };

  const clearFieldsRecordHandler = () => {
    setRecordFields(initialRecordData);
  };
  // ACTIONS END ///////////////////////////////////////////////////////////////////
  const [actionNotifications, setActionNotifications] = React.useState<ActionNotification[]>([]);

  const showActionNotification = (status: "completed" | "failed", message: string) => {
    const id = Date.now() + Math.random();

    setActionNotifications((current) =>
      [
        ...current,
        {
          id,
          status,
          title:
            status === "completed" ? t("notification.type.success") : t("notification.type.error"),
          message,
        },
      ].slice(-5),
    );

    window.setTimeout(() => {
      setActionNotifications((current) => current.filter((item) => item.id !== id));
    }, 5000);
  };

  const dismissActionNotification = (id: number) => {
    setActionNotifications((current) => current.filter((item) => item.id !== id));
  };

  React.useEffect(() => {
    const result = createMutation[1];

    if (result.isError) {
      console.log("Ошибка создания пациента:", result.error);
      showActionNotification("failed", t("pages.patients.notifications.createError"));
      return;
    }

    const response = result.data;
    if (!response) return;

    if (response.status === ResponseStatus.SUCCESS) {
      showActionNotification("completed", t("pages.patients.notifications.createSuccess"));
    } else {
      console.log("Ошибка создания пациента:", response);
      showActionNotification("failed", t("pages.patients.notifications.createError"));
    }
  }, [createMutation[1].data, createMutation[1].isError]);

  React.useEffect(() => {
    const result = updateMutation[1];

    if (result.isError) {
      console.log("Ошибка обновления пациента:", result.error);
      showActionNotification("failed", t("pages.patients.notifications.updateError"));
      return;
    }

    const response = result.data;
    if (!response) return;

    if (response.status === ResponseStatus.SUCCESS) {
      showActionNotification("completed", t("pages.patients.notifications.updateSuccess"));
    } else {
      console.log("Ошибка обновления пациента:", response);
      showActionNotification("failed", t("pages.patients.notifications.updateError"));
    }
  }, [updateMutation[1].data, updateMutation[1].isError]);

  React.useEffect(() => {
    const result = removeMutation[1];

    if (result.isError) {
      console.log("Ошибка удаления пациента:", result.error);
      showActionNotification("failed", t("pages.patients.notifications.deleteError"));
      return;
    }

    const response = result.data;
    if (!response) return;

    if (response.status === ResponseStatus.SUCCESS) {
      showActionNotification("completed", t("pages.patients.notifications.deleteSuccess"));
    } else {
      console.log("Ошибка удаления пациента:", response);
      showActionNotification("failed", t("pages.patients.notifications.deleteError"));
    }
  }, [removeMutation[1].data, removeMutation[1].isError]);

  return (
    <Page
      decorativeIcon="INFO"
      title={t("pages.patients.title")}
      description={t("pages.patients.description")}
    >
      <ActionNotifications
        notifications={actionNotifications}
        onDismiss={dismissActionNotification}
      />
      <ManagedTable
        blockPops={{
          title: t("entities.patient.plural"),
          fullWidth: true,
        }}
        tableProps={{
          table: {
            maxHeight: 500,
          },
          thead: {
            columns,
          },
          tbody: {
            rowKey: "id",
            columns,
            data: allData,
            rowClick: (row) => navigate(`${ROUTES.Patients}/${row.id}`),
          },
        }}
        filters={{
          period: true,
          searchFieldOptions,
          sortedFieldOptions,
        }}
        hasPermissions={{
          read: true,
          create: true,
          update: true,
          delete: true,
        }}
        crudApiTable={{
          getAllQuery: allDataQuery,
          getOneQuery: oneDataQuery,
          createMutation: createMutation,
          updateMutation: updateMutation,
          removeMutation: removeMutation,
          limit: 6,
        }}
        record={{
          body: (
            <Stack direction="column" gap="md" justify="flex-start" align="stretch">
              <TextField
                value={recordFields.fullName}
                onChangeValue={(val: string) =>
                  setRecordFields((prev) => ({ ...prev, fullName: val }))
                }
                label={t("entities.patient.fields.fullName")}
              />
              <TextField
                value={recordFields.birthDate}
                onChangeValue={(val: string) =>
                  setRecordFields((prev) => ({ ...prev, birthDate: val }))
                }
                label={t("entities.patient.fields.birthDate")}
                type="date"
              />
              <Select
                value={recordFields.gender}
                onChangeValue={(val) =>
                  setRecordFields((prev) => ({ ...prev, gender: val || gendertOptions[0] }))
                }
                options={gendertOptions}
                label={t("entities.patient.fields.gender")}
                getKey={(item) => item.id}
                getValue={(item) => item.name}
              />
              <TextField
                value={recordFields.phone}
                onChangeValue={(val: string) =>
                  setRecordFields((prev) => ({ ...prev, phone: val }))
                }
                label={t("entities.patient.fields.phone")}
              />
              <TextField
                value={recordFields.email}
                onChangeValue={(val: string) =>
                  setRecordFields((prev) => ({ ...prev, email: val }))
                }
                label={t("entities.patient.fields.email")}
              />
              <TextField
                value={recordFields.note}
                onChangeValue={(val: string) => setRecordFields((prev) => ({ ...prev, note: val }))}
                label={t("entities.patient.fields.note")}
              />
            </Stack>
          ),
          recordData,
          canSubmitRecord,
          fillFormWithRecordData,
          clearFieldsRecordHandler,
        }}
      ></ManagedTable>
    </Page>
  );
};

export default PatientPage;
