export default {
  pages: {
    login: {
      title: 'Жүйеде авторизациялану',
      description: 'Жүйеге кіру үшін тіркелгі деректерін енгізіңіз.',

      fields: {
        email: 'Email',
        password: 'Құпиясөз',
      },
      placeholders: {
        email: 'Email енгізіңіз...',
        password: 'Құпиясөзді енгізіңіз...',
      },
    },
    admin: {
      title: 'Админ панелі',
      description: 'Бұл бетте пайдаланушылар мен рөлдерді басқару жүзеге асырылады.',

      tables: {
        user: {
          editRoles: 'Рөлдерді баптау',
        },
        role: {
          editPermissions: 'Рұқсаттарды баптау',
        },
      },
    },
    patients: {
      title: 'Барлық пациенттердің тізімі',
      description: 'Бұл бетте дәрігер бақылауындағы барлық пациенттер көрсетілген.',
    },
    patientCard: {
      title: 'Пациент картасы',
      description: 'Бұл бетте пациент туралы мәліметтер және оның барлық зерттеулерінің тізімі көрсетілген. Осы беттен пациент үшін жаңа зерттеу құруға, сондай-ақ зерттеуді басу арқылы оған өтуге болады.',
    },
    studies: {
      title: 'Барлық зерттеулердің тізімі',
      description: 'Бұл бетте пациенттердің барлық зерттеулері көрсетілген.',
    },
    studyCard: {
      title: 'Зерттеу картасы',
      description: 'Бұл бетте зерттеу туралы мәліметтер және барлық болжамдардың тізімі көрсетілген. Осы беттен пациент үшін жаңа зерттеу құруға, пациент картасына өтуге, жаңа болжамды іске қосуға және таңдалған болжамның нәтижелерін көруге болады.',

      common: {

      }
    },
  },

  entities: {
    user: {
      singular: 'Пайдаланушы',
      plural: 'Пайдаланушылар',
      gender: 'male',

      singularCases: {
        nominative: 'Пайдаланушы',
        genitive: 'Пайдаланушының',
        dative: 'Пайдаланушыға',
        accusative: 'Пайдаланушыны',
        instrumental: 'Пайдаланушымен',
        prepositional: 'Пайдаланушы туралы',
      },

      pluralCases: {
        nominative: 'Пайдаланушылар',
        genitive: 'Пайдаланушылардың',
        dative: 'Пайдаланушыларға',
        accusative: 'Пайдаланушыларды',
        instrumental: 'Пайдаланушылармен',
        prepositional: 'Пайдаланушылар туралы',
      },

      fields: {
        email: 'Email',
        password: 'Құпиясөз',
        banned: 'Бұғатталған',
        banReason: 'Бұғаттау себебі',
        roles: 'Рөлдер',
      },
    },
    role: {
      singular: 'Рөл',
      plural: 'Рөлдер',
      gender: 'female',

      singularCases: {
        nominative: 'Рөл',
        genitive: 'Рөлдің',
        dative: 'Рөлге',
        accusative: 'Рөлді',
        instrumental: 'Рөлмен',
        prepositional: 'Рөл туралы',
      },

      pluralCases: {
        nominative: 'Рөлдер',
        genitive: 'Рөлдердің',
        dative: 'Рөлдерге',
        accusative: 'Рөлдерді',
        instrumental: 'Рөлдермен',
        prepositional: 'Рөлдер туралы',
      },

      fields: {
        value: 'Атауы',
        description: 'Сипаттамасы',
        permissions: 'Рұқсаттар',
      },
    },
    permission: {
      singular: 'Рұқсат',
      plural: 'Рұқсаттар',
      gender: 'neuter',

      singularCases: {
        nominative: 'Рұқсат',
        genitive: 'Рұқсаттың',
        dative: 'Рұқсатқа',
        accusative: 'Рұқсатты',
        instrumental: 'Рұқсатпен',
        prepositional: 'Рұқсат туралы',
      },

      pluralCases: {
        nominative: 'Рұқсаттар',
        genitive: 'Рұқсаттардың',
        dative: 'Рұқсаттарға',
        accusative: 'Рұқсаттарды',
        instrumental: 'Рұқсаттармен',
        prepositional: 'Рұқсаттар туралы',
      },

      fields: {
        value: 'Атауы',
        description: 'Сипаттамасы',
      },
    },
    patient: {
      singular: 'Пациент',
      plural: 'Пациенттер',
      gender: 'male',

      singularCases: {
        nominative: 'Пациент',
        genitive: 'Пациенттің',
        dative: 'Пациентке',
        accusative: 'Пациентті',
        instrumental: 'Пациентпен',
        prepositional: 'Пациент туралы',
      },

      pluralCases: {
        nominative: 'Пациенттер',
        genitive: 'Пациенттердің',
        dative: 'Пациенттерге',
        accusative: 'Пациенттерді',
        instrumental: 'Пациенттермен',
        prepositional: 'Пациенттер туралы',
      },
      
      fields: {
        doctor: 'Емдеуші дәрігер',
        public: 'Ашық қолжетімділік',
        fullName: 'Т.А.Ә.',
        birthDate: 'Туған күні',
        gender: 'Жынысы',
        phone: 'Телефон нөмірі',
        email: 'Email',
        note: 'Ескертпе',
      },
    },
    study: {
      singular: 'Зерттеу',
      plural: 'Зерттеулер',
      gender: 'neuter',

      singularCases: {
        nominative: 'Зерттеу',
        genitive: 'Зерттеудің',
        dative: 'Зерттеуге',
        accusative: 'Зерттеуді',
        instrumental: 'Зерттеумен',
        prepositional: 'Зерттеу туралы',
      },

      pluralCases: {
        nominative: 'Зерттеулер',
        genitive: 'Зерттеулердің',
        dative: 'Зерттеулерге',
        accusative: 'Зерттеулерді',
        instrumental: 'Зерттеулермен',
        prepositional: 'Зерттеулер туралы',
      },

      fields: {
        studyInstanceUID: 'Зерттеу UID-і',
        studyId: 'Зерттеу ID-і',
        specificCharacterSet: 'Символдарды кодтау',
        studyDateTime: 'Зерттеу күні мен уақыты',
        modality: 'Модальділік',
        description: 'Сипаттамасы',
        institutionName: 'Мекеме атауы',
        manufacturer: 'Жабдық өндірушісі',
        manufacturersModelName: 'Жабдық моделінің атауы',
        stationName: 'Станция атауы',
        referringPhysiciansName: 'Жолдама берген дәрігер',
        status: 'Күйі',
        path: 'Зерттеу сериялары сақталған директорияға дейінгі жол',
        seriesCount: 'Сериялар саны',
        imagesCount: 'Кескіндер саны',
        note: 'Ескертпе',
        model: 'Үлгі',
      },
    },
    predictionRun: {
      singular: 'Болжамды іске қосу',
      plural: 'Болжамдарды іске қосу',
      gender: 'male',

      singularCases: {
        nominative: 'Болжамды іске қосу',
        genitive: 'Болжамды іске қосудың',
        dative: 'Болжамды іске қосуға',
        accusative: 'Болжамды іске қосуды',
        instrumental: 'Болжамды іске қосумен',
        prepositional: 'Болжамды іске қосу туралы',
      },

      pluralCases: {
        nominative: 'Болжамдарды іске қосу',
        genitive: 'Болжамдарды іске қосудың',
        dative: 'Болжамдарды іске қосуға',
        accusative: 'Болжамдарды іске қосуды',
        instrumental: 'Болжамдарды іске қосумен',
        prepositional: 'Болжамдарды іске қосу туралы',
      },

      fields: {
        model: 'Модель',
        version: 'Нұсқа',
        status: 'Күйі',
        runnedAt: 'Іске қосылған күні',
      },
    },
  },

  notification: {
    type: {
			info: 'Хабарлама',
			error: 'Қате',
			warning: 'Ескерту',
			success: 'Сәтті орындалды',
		},
    success: {
      created: {
        male: '{{entity}} сәтті құрылды',
        female: '{{entity}} сәтті құрылды',
        neuter: '{{entity}} сәтті құрылды',
        plural: '{{entity}} сәтті құрылды',
        default: {
          singular: 'Жазба сәтті құрылды',
          plural: 'Жазбалар сәтті құрылды',
        },
      },
      updated: {
        male: '{{entity}} сәтті жаңартылды',
        female: '{{entity}} сәтті жаңартылды',
        neuter: '{{entity}} сәтті жаңартылды',
        plural: '{{entity}} сәтті жаңартылды',
        default: {
          singular: 'Жазба сәтті жаңартылды',
          plural: 'Жазбалар сәтті жаңартылды',
        }
      },
      deleted: {
        male: '{{entity}} сәтті жойылды',
        female: '{{entity}} сәтті жойылды',
        neuter: '{{entity}} сәтті жойылды',
        plural: '{{entity}} сәтті жойылды',
        default: {
          singular: 'Жазба сәтті жойылды',
          plural: 'Жазбалар сәтті жойылды',
        }
      },
      fetched: {
        male: '{{entity}} сәтті алынды',
        female: '{{entity}} сәтті алынды',
        neuter: '{{entity}} сәтті алынды',
        plural: '{{entity}} сәтті алынды',
        default: 'Деректер сәтті алынды',
      },
      auth: 'Жүйеге сәтті кірдіңіз!',
    },
    error: {
      created: 'Құру кезінде қате орын алды {{entity}}',
      updated: 'Жаңарту кезінде қате орын алды {{entity}}',
      deleted: 'Жою кезінде қате орын алды {{entity}}',
      fetched: 'Алу кезінде қате орын алды {{entity}}',
      default: 'Бірдеңе дұрыс болмады...',
      auth: 'Жүйеге кіру кезінде қате орын алды. Бірдеңе дұрыс болмады...',
    }
  },

  actions: {
    // CRUD
    create: 'Құру',
    add: 'Қосу',
    edit: 'Баптау',
    update: 'Өңдеу',
    save: 'Сақтау',
    remove: 'Жою',

    // Отмена/подтверждение
    cancel: 'Бас тарту',
    confirm: 'Растау',
    apply: 'Қолдану',
    reset: 'Қалпына келтіру',

    // Навигация и поиск
    open: 'Ашу',
    close: 'Жабу',
    clear: 'Тазалау',
    reload: 'Жаңарту',

    // Файлы / загрузка
    upload: 'Жүктеу',
    download: 'Жүктеп алу',

    // Добавочные действия для форм и таблиц
    expand: 'Кеңейту',
    collapse: 'Жию',

    // Прочие интерактивные кнопки
    show: 'Көрсету',
    hide: 'Жасыру',
    select: 'Таңдау',
    deselect: 'Таңдауды алып тастау',

    login: 'Кіру',
    logout: 'Шығу',

    createStudy: 'Зерттеу қосу',
    runPrediction: "Болжамды іске қосу",
    goToPatient: "Пациентке өту",
  },

  ui: {
    placeholder: {
      select: {
        default: 'Мәнді таңдаңыз...',
        entity: 'Таңдаңыз {{entity}}...',
      },
      textField: {
        default: 'Мәнді енгізіңіз...',
        entity: 'Енгізіңіз {{entity}}...',
        search: 'Іздеу {{entity}}...',
      },
    },

    status: {
      empty: 'Көрсететін деректер жоқ...',
      loading: 'Жүктелуде...',
      error: 'Деректерді жүктеу мүмкін болмады...',
    },

    filters: {
      fieldSearch: 'Іздеу өрісі...',
      valueSearch: 'Іздеу мәні',
      fieldSorting: 'Сұрыптау өрісі...',
      orderSorting: 'Сұрыптау реті',
      datePeriods: 'Алдын ала орнатылған кезеңдер',
      dateStart: 'Кезеңнің басталуы',
      dateEnd: 'Кезеңнің аяқталуы',
    },
  },

  form: {},

  validation: {},

  common: {
    yes: 'Иә',
    no: 'Жоқ',
    all: 'Барлығы',
    none: 'Жоқ',
    ok: 'Ок',
    back: 'Артқа',
    next: 'Келесі',
    previous: 'Алдыңғы',
    done: 'Дайын',
    search: 'Іздеу',
    filters: 'Сүзгілер',
    reason: 'Себебі',
    confirmation: 'Әрекетті растау',
    settings: 'Баптаулар',
    file: 'Файл',
    dicomZip: 'DICOM мұрағаты (.zip)',
    predictionRunning: "Болжамды іске қосу",
    language: 'Тіл',
    russian: 'Орыс тілі',
    english: 'Ағылшын тілі',
    kazakh: 'Қазақ тілі',
  },

  enums: {
    gender: {
      male: 'Ер',
      female: 'Әйел',
    },

    status: {
      pending: 'Күтуде',
      processing: 'Өңделуде',
      completed: 'Аяқталды',
      failed: 'Қате',
    },

    modality: {
      MR: 'МРТ',
      CT: 'КТ',
      XR: 'Рентген',
      US: 'УДЗ',
    },

    orientation: {
      axial: 'Аксиальды',
      coronal: 'Корональды',
      sagittal: 'Сагиттальды',
      'oblique cut': 'Қиғаш кесінді',
    },

    protocol: {
      T1: 'T1',
      T2: 'T2',
      PD: 'PD',
    },

    resultClass: {
      normal: 'Қалыпты',
      tear: 'Жыртылу бар',
    },

    models: {
      YOLO: 'YOLO',
    },

    permission: {
      read: 'Оқу',
      create: 'Құру',
      update: 'Өңдеу',
      delete: 'Жою',
    },

    sortOrder: {
      asc: 'Өсу ретімен',
      desc: 'Кему ретімен',
    },

    context: {
      create: 'Құру',
      update: 'Өңдеу',
    },

    action: {
      add: 'Құру',
      edit: 'Баптау',
      remove: 'Жою',
    },

    periodTypes: {
      day: 'Күн',
      week: 'Апта',
      month: 'Ай',
      year: 'Жыл',
    },
  },

  sidebar: {
    admin: 'Админ панелі',
    main: 'Қосымша туралы',
    patients: 'Пациенттер',
    studies: 'Зерттеулер',
    examples: 'UI компоненттері',
  },

} as const
