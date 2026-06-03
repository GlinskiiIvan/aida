export default {
  pages: {
    login: {
      title: 'Log in to the system',
      description: 'Please enter your credentials to access the system.',

      fields: {
        email: 'Email',
        password: 'Password',
      },
      placeholders: {
        email: 'Enter email...',
        password: 'Enter password...',
      },
    },
    admin: {
      title: 'Admin panel',
      description: 'This page provides user and role management.',

      tables: {
        role: {
          updatePermissions: 'Update permissions',
        },
      },
    },
    patients: {
      title: 'List of all patients',
      description: 'This page contains all the patients managed by the doctor.',
    },
    patientCard: {
      title: 'Patient card',
      description: "This page contains the patient's data, as well as a list of all his studies. From this page, you can create a new study for this patient, and also go to the study by clicking on it.",
    },
    studies: {
      title: 'List of all studies',
      description: 'This page contains all the patient studies.',
    },
    studyCard: {
      title: 'Study card',
      description: 'This page contains the research data, as well as a list of all predictions. On this page, you can create a new study for this patient, navigate to the patient, run a new prediction, and view the results of the selected prediction.',
    },
  },

  entities: {
    user: {
      singular: 'User',
        plural: 'Users',
        gender: 'male',

        singularCases: {
      nominative: 'User',
          genitive: 'The User',
          dative: 'To the user',
          accusative: 'The user',
          instrumental: 'By the user',
          prepositional: 'User',
      },

        pluralCases: {
      nominative: 'Users',
          genitive: 'Users',
          dative: 'To users',
          accusative: 'Users',
          instrumental: 'By users',
          prepositional: 'Users',
      },

        fields: {
          email: 'Email',
          password: 'Password',
          banned: 'Blocked',
          banReason: 'Reason for blocking',
      },
    },
    patient: {
      singular: 'Patient',
      plural: 'Patients',
      gender: 'male',

      singularCases: {
        nominative: 'Patient',
        genitive: 'The Patient',
        dative: 'To the patient',
        accusative: 'The patient',
        instrumental: 'Patient',
        prepositional: 'Patient',
      },

      pluralCases: {
        nominative: 'Patients',
        genitive: 'Patients',
        dative: 'To Patients',
        accusative: 'Patients',
        instrumental: 'By patients',
        prepositional: 'Patients',
      },

      fields: {
        doctor: 'Doctor',
        public: 'Publicity',
        fullName: 'Full name',
        birthDate: 'Date of birth',
        gender: 'Gender',
        phone: 'Phone',
        email: 'Email',
        note: 'Note',
      },
    },
    study: {
      singular: 'Study',
      plural: 'Research',
      gender: 'neuter',

      singularCases: {
        nominative: 'Research',
        genitive: 'Research',
        dative: 'Research',
        accusative: 'Research',
        instrumental: 'Research',
        prepositional: 'Research',
      },

      pluralCases: {
        nominative: 'Research',
        genitive: 'Research',
        dative: 'Research',
        accusative: 'Research',
        instrumental: 'Research',
        prepositional: 'Research',
      },

      fields: {
        studyInstanceUID: 'UID of the study',
        studyId: 'Study ID',
        specificCharacterSet: 'Character encoding',
        studyDateTime: 'Date and time of the study',
        modality: 'Modality',
        description: 'Description',
        institutionName: 'Name of the institution',
        manufacturer: 'Equipment manufacturer',
        manufacturersModelName: 'The model of the equipment manufacturer',
        stationName: 'Station name',
        referringPhysiciansName: 'Referring physician',
        status: 'Status',
        path: 'The path to the directory with the research series',
        seriesCount: 'Number of episodes',
        imagesCount: 'Number of images',
        note: 'Note',
      },
    },
    predictionRun: {
      singular: 'Prediction run',
      plural: 'Prediction runs',
      gender: 'male',

      singularCases: {
        nominative: 'Prediction run',
        genitive: 'Prediction run',
        dative: 'Prediction run',
        accusative: 'Prediction run',
        instrumental: 'Prediction run',
        prepositional: 'Prediction run',
      },

      pluralCases: {
        nominative: 'Prediction runs',
        genitive: 'Prediction runs',
        dative: 'Prediction runs',
        accusative: 'Prediction runs',
        instrumental: 'Prediction runs',
        prepositional: 'Prediction runs',
      },

      fields: {
        model: 'Model',
        version: 'Version',
        status: 'Status',
        runnedAt: 'Run date',
      },
    },
  },

  notification: {
    type: {
      info: 'Notification',
      error: 'Error',
      warning: 'Warning',
      success: 'Success',
    },
    success: {
      created: {
        male: '{{entity}} successfully created',
        female: '{{entity}} successfully created',
        neuter: '{{entity}} successfully created',
        plural: '{{entity}} successfully created',
        default: {
          singular: 'Record successfully created',
          plural: 'Records successfully created',
        },
      },
      updated: {
        male: '{{entity}} successfully updated',
        female: '{{entity}} successfully updated',
        neuter: '{{entity}} successfully updated',
        plural: '{{entity}} successfully updated',
        default: {
          singular: 'Record successfully updated',
          plural: 'Records successfully updated',
        }
      },
      deleted: {
        male: '{{entity}} successfully deleted',
        female: '{{entity}} successfully deleted',
        neuter: '{{entity}} successfully deleted',
        plural: '{{entity}} successfully deleted',
        default: {
          singular: 'Record successfully deleted',
          plural: 'Records successfully deleted',
        }
      },
      fetched: {
        male: '{{entity}} successfully received',
        female: '{{entity}} successfully received',
        neuter: '{{entity}} successfully received',
        plural: '{{entity}} successfully received',
        default: 'Data successfully received',
      },
      auth: 'You have successfully logged in!',
    },
    error: {
      created: 'Error when creating {{entity}}',
      updated: 'Error updating {{entity}}',
      deleted: 'Error deleting {{entity}}',
      fetched: 'Error receiving {{entity}}',
      default: 'Something went wrong...',
      auth: 'Authorization error. Something went wrong...',
    }
  },

  actions: {
    // CRUD
    create: 'Create',
    add: 'Add',
    edit: 'Edit',
    update: 'Refresh',
    save: 'Save',
    remove: 'Delete',

    // Cancellation/Confirmation
    cancel: 'Cancel',
    confirm: 'Confirm',
    apply: 'Apply',
    reset: 'Reset',

    // Navigation and Search
    open: 'Open',
    close: 'Close',
    clear: 'Clear',
    reload: 'Refresh',

    // Files / upload
    upload: 'Upload',
    download: 'Download',

    // Additional actions for forms and tables
    expand: 'Expand',
    collapse: 'Collapse',

    // Other interactive buttons
    show: 'Show',
    hide: 'Hide',
    select: 'Select',
    deselect: 'Deselect',

    login: 'Login',
    logout: 'Logout',

    createStudy: 'Add study',
    runPrediction: "Run prediction",
    goToPatient: "Go to patient",
  },

  ui: {
    placeholder: {
      select: {
        default: 'Choose a value...',
        entity: 'Choose {{entity}}...',
      },
      textField: {
        default: 'Enter a value...',
        entity: 'Enter {{entity}}...',
        search: 'Search {{entity}}...',
      },
    },

    status: {
      empty: 'No data to display...',
      loading: 'Loading...',
      error: 'Data could not be loaded...',
    },

    filters: {
      fieldSearch: 'Search by...',
      valueSearch: 'Search value',
      fieldSorting: 'Sort by...',
      orderSorting: 'Sort order',
      datePeriods: 'Preset periods',
      dateStart: 'Beginning of the period',
      dateEnd: 'End of the period',
    },
  },

  common: {
    yes: 'Yes',
    no: 'No',
    all: 'Everything',
    none: 'No',
    ok: 'Ok',
    back: 'Back',
    next: 'Next',
    previous: 'Back',
    done: 'Done',
    search: 'Search',
    filters: 'Filters',
    reason: 'Reason',
    confirmation: 'Action confirmation',
    settings: 'Settings',
    file: 'File',
    dicomZip: 'DICOM archive (.zip)',
    predictionRunning: "Starting prediction",
  },

  enums: {
    gender: {
      male: 'Male',
      female: 'Female',
    },

    status: {
      pending: 'Waiting',
      processing: 'In processing',
      completed: 'Completed',
      failed: 'Error',
    },

    modality: {
      MR: 'MRT',
      CT: 'CT',
      XR: 'X-ray',
      US: 'ULTRASOUND',
    },

    orientation: {
      axial: 'Axial',
      coronal: 'Coronal',
      sagittal: 'Sagittal',
      'oblique cut': 'Oblique cut',
    },

    protocol: {
      T1: 'T1',
      T2: 'T2',
      PD: 'PD',
    },

    resultClass: {
      normal: 'Norm',
      tear: "The 'Gap",
    },

    models: {
      YOLO: 'YOLO',
    },

    permission: {
      read: 'Reading',
      create: 'Creation',
      update: 'Update',
      delete: 'Deletion',
    },

    sortOrder: {
      asc: 'Ascending',
      desc: 'Descending order',
    },

    context: {
      create: 'Creation',
      update: 'Editing',
    },

    action: {
      add: 'Adding',
      edit: 'Editing',
      remove: 'Deleting',
    },

    periodTypes: {
      day: 'Day',
      week: 'Week',
      month: 'Month',
      year: 'Year',
    },
  },

  form: {},

  validation: {},

  sidebar: {
    admin: 'Admin panel',
    main: 'Main',
    patients: 'Patients',
    studies: 'Studies',
    examples: 'UI components',
  },

} as const
