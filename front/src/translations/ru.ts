export default {
  pages: {
    login: {
      title: 'Авторизация в системе',
      description: 'Пожалуйста, введите свои учетные данные для доступа к системе.',

      fields: {
        email: 'Email',
        password: 'Пароль',
      },
      placeholders: {
        email: 'Введите email...',
        password: 'Введите пароль...',
      },
    },
    admin: {
      title: 'Админ панель',
      description: 'На этой странице ощуществляется управление пользователями и ролями.'
    },
    patients: {
      title: 'Список всех пациентов',
      description: 'На этой странице представлены все пациенты которых ведет доктор.',
    },
    patientCard: {
      title: 'Карточка пациента',
      description: 'На этой странице представленные данные пациента, а также список всех его исследований. С этой странице можно создать новое исследование для данного пациента, а также перейти к исследованию, если нажать на него.',
    },
    studies: {
      title: 'Список всех исследований',
      description: 'На этой странице представлены все исследования пациентов.',
    },
    studyCard: {
      title: 'Карточка исследования',
      description: 'На этой странице представленные данные исследования, а также список всех предсказаний. С этой странице можно создать новое исследование для данного пациента, перейти к пациенту, запустить новое предсказание и просмотреть результаты выбранного предсказания.',

      common: {

      }
    },
  },

  entities: {
    user: {
      singular: 'Пользователь',
      plural: 'Пользователи',
      gender: 'male',

      singularCases: {
        nominative: 'Пользователь',
        genitive: 'Пользователя',
        dative: 'Пользователю',
        accusative: 'Пользователя',
        instrumental: 'Пользователем',
        prepositional: 'Пользователе',
      },

      pluralCases: {
        nominative: 'Пользователи',
        genitive: 'Пользователей',
        dative: 'Пользователям',
        accusative: 'Пользователей',
        instrumental: 'Пользователями',
        prepositional: 'Пользователях',
      },

      fields: {
        email: 'Email',
        password: 'Пароль',
        banned: 'Заблокирован',
        banReason: 'Причина блокировки',
      },
    },
    patient: {
      singular: 'Пациент',
      plural: 'Пациенты',
      gender: 'male',

      singularCases: {
        nominative: 'Пациент',
        genitive: 'Пациента',
        dative: 'Пациенту',
        accusative: 'Пациента',
        instrumental: 'Пациентом',
        prepositional: 'Пациенте',
      },

      pluralCases: {
        nominative: 'Пациенты',
        genitive: 'Пациентов',
        dative: 'Пациентам',
        accusative: 'Пациентов',
        instrumental: 'Пациентами',
        prepositional: 'Пациентах',
      },
      
      fields: {
        doctor: 'Ведущий врач',
        public: 'Публичность',
        fullName: 'ФИО',
        birthDate: 'Дата рождения',
        gender: 'Пол',
        phone: 'Телефон',
        email: 'Email',
        note: 'Примечание',
      },
    },
    study: {
      singular: 'Исследование',
      plural: 'Исследования',
      gender: 'neuter',

      singularCases: {
        nominative: 'Исследование',
        genitive: 'Исследования',
        dative: 'Исследованию',
        accusative: 'Исследование',
        instrumental: 'Исследованием',
        prepositional: 'Исследовании',
      },

      pluralCases: {
        nominative: 'Исследования',
        genitive: 'Исследований',
        dative: 'Исследованиям',
        accusative: 'Исследования',
        instrumental: 'Исследованиями',
        prepositional: 'Исследованиях',
      },

      fields: {
        studyInstanceUID: 'UID исследования',
        studyId: 'ID исследования',
        specificCharacterSet: 'Кодировка символов',
        studyDateTime: 'Дата и время исследования',
        modality: 'Модальность',
        description: 'Описание',
        institutionName: 'Название учреждения',
        manufacturer: 'Производитель оборудования',
        manufacturersModelName: 'Модель производителя оборудования',
        stationName: 'Название станции',
        referringPhysiciansName: 'Направивший врач',
        status: 'Статус',
        path: 'Путь до директории с сериями исследования',
        seriesCount: 'Количество серий',
        imagesCount: 'Количество изображений',
        note: 'Примечание',
      },
    },
    predictionRun: {
      singular: 'Запуск предсказания',
      plural: 'Запуски предсказаний',
      gender: 'male',

      singularCases: {
        nominative: 'Запуск предсказания',
        genitive: 'Запуска предсказания',
        dative: 'Запуску предсказания',
        accusative: 'Запуск предсказания',
        instrumental: 'Запуском предсказания',
        prepositional: 'Запуске предсказания',
      },

      pluralCases: {
        nominative: 'Запуски предсказаний',
        genitive: 'Запусков предсказаний',
        dative: 'Запускам предсказаний',
        accusative: 'Запуски предсказаний',
        instrumental: 'Запусками предсказаний',
        prepositional: 'Запусках предсказаний',
      },

      fields: {
        model: 'Модель',
        version: 'Версия',
        status: 'Статус',
        runnedAt: 'Дата запуска',
      },
    },
  },

  notification: {
    type: {
			info: 'Уведомление',
			error: 'Ошибка',
			warning: 'Предупреждение',
			success: 'Успех',
		},
    success: {
      created: {
        male: '{{entity}} успешно создан',
        female: '{{entity}} успешно создана',
        neuter: '{{entity}} успешно создано',
        plural: '{{entity}} успешно созданы',
        default: {
          singular: 'Запись успешно создана',
          plural: 'Записи успешно созданы',
        },
      },
      updated: {
        male: '{{entity}} успешно обновлен',
        female: '{{entity}} успешно обновлена',
        neuter: '{{entity}} успешно обновлено',
        plural: '{{entity}} успешно обновлены',
        default: {
          singular: 'Запись успешно обновлена',
          plural: 'Записи успешно обновлены',
        }
      },
      deleted: {
        male: '{{entity}} успешно удален',
        female: '{{entity}} успешно удалена',
        neuter: '{{entity}} успешно удалено',
        plural: '{{entity}} успешно удалены',
        default: {
          singular: 'Запись успешно удалена',
          plural: 'Записи успешно удалены',
        }
      },
      fetched: {
        male: '{{entity}} успешно получен',
        female: '{{entity}} успешно получена',
        neuter: '{{entity}} успешно получено',
        plural: '{{entity}} успешно получены',
        default: 'Данные успешно получены',
      },
      auth: 'Вы успешно авторизовались!',
    },
    error: {
      created: 'Ошибка при создании {{entity}}',
      updated: 'Ошибка при обновлении {{entity}}',
      deleted: 'Ошибка при удалении {{entity}}',
      fetched: 'Ошибка при получении {{entity}}',
      default: 'Что то пошло не так...',
      auth: 'Ошибка при авторизации. Что то пошло не так...',
    }
  },

  actions: {
    // CRUD
    create: 'Создать',
    add: 'Добавить',
    edit: 'Редактировать',
    update: 'Обновить',
    save: 'Сохранить',
    remove: 'Удалить',

    // Отмена/подтверждение
    cancel: 'Отмена',
    confirm: 'Подтвердить',
    apply: 'Применить',
    reset: 'Сбросить',

    // Навигация и поиск
    open: 'Открыть',
    close: 'Закрыть',
    clear: 'Очистить',
    reload: 'Обновить',

    // Файлы / загрузка
    upload: 'Загрузить',
    download: 'Скачать',

    // Добавочные действия для форм и таблиц
    expand: 'Развернуть',
    collapse: 'Свернуть',

    // Прочие интерактивные кнопки
    show: 'Показать',
    hide: 'Скрыть',
    select: 'Выбрать',
    deselect: 'Снять выделение',

    login: 'Войти',
    logout: 'Выйти',

    createStudy: 'Добавить исследование',
    runPrediction: "Запустить предсказание",
    goToPatient: "Перейти к пациенту",
  },

  ui: {
    placeholder: {
      select: {
        default: 'Выберите значение...',
        entity: 'Выберите {{entity}}...',
      },
      textField: {
        default: 'Введите значение...',
        entity: 'Введите {{entity}}...',
        search: 'Поиск {{entity}}...',
      },
    },

    status: {
      empty: 'Нет данных для отображения...',
      loading: 'Загрузка...',
      error: 'Не удалось загрузить данные...',
    },

    filters: {
      fieldSearch: 'Поиск по...',
      valueSearch: 'Значение поиска',
      fieldSorting: 'Сортировка по...',
      orderSorting: 'Порядок сортировки',
      datePeriods: 'Предустановленные периоды',
      dateStart: 'Начало периода',
      dateEnd: 'Конец периода',
    },
  },

  form: {},

  validation: {},

  common: {
    yes: 'Да',
    no: 'Нет',
    all: 'Все',
    none: 'Нет',
    ok: 'Ок',
    back: 'Назад',
    next: 'Далее',
    previous: 'Назад',
    done: 'Готово',
    search: 'Поиск',
    filters: 'Фильтры',
    reason: 'Причина',
    confirmation: 'Подтверждение действия',
    settings: 'Настройки',
    file: 'Файл',
    dicomZip: 'DICOM архив (.zip)',
    predictionRunning: "Запуск предсказания",
  },

  enums: {
    gender: {
      male: 'Мужской',
      female: 'Женский',
    },

    status: {
      pending: 'Ожидание',
      processing: 'В обработке',
      completed: 'Завершено',
      failed: 'Ошибка',
    },

    modality: {
      MR: 'МРТ',
      CT: 'КТ',
      XR: 'Рентген',
      US: 'УЗИ',
    },

    orientation: {
      axial: 'Аксиальная',
      coronal: 'Корональная',
      sagittal: 'Сагиттальная',
      'oblique cut': 'Косой срез',
    },

    protocol: {
      T1: 'T1',
      T2: 'T2',
      PD: 'PD',
    },

    resultClass: {
      normal: 'Норма',
      tear: 'Разрыв',
    },

    models: {
      YOLO: 'YOLO',
    },

    permission: {
      read: 'Чтение',
      create: 'Создание',
      update: 'Обновление',
      delete: 'Удаление',
    },

    sortOrder: {
      asc: 'По возрастанию',
      desc: 'По убыванию',
    },

    context: {
      create: 'Создание',
      update: 'Редактирование',
    },

    action: {
      add: 'Добавление',
      edit: 'Редактирование',
      remove: 'Удаление',
    },

    periodTypes: {
      day: 'День',
      week: 'Неделя',
      month: 'Месяц',
      year: 'Год',
    },
  },

  sidebar: {
    admin: 'Админ панель',
    main: 'Главная',
    patients: 'Пациенты',
    studies: 'Исследования',
    examples: 'UI компоненты',
  },

} as const
