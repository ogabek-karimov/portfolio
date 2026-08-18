const translations = {
  uz: {
    nav: {
      about: 'Men haqimda',
      skills: "Ko'nikmalar",
      projects: 'Loyihalar',
      contact: 'Aloqa',
      menuToggle: 'Menyuni ochish',
    },
    hero: {
      kicker: 'Salom, men',
      name: "Og'abek Karimov —",
      role: 'Frontend Developer',
      text: "HTML, CSS, JavaScript, React va Node.js yordamida zamonaviy, tez va qulay veb-saytlar yarataman.",
      ctaProjects: "Loyihalarni ko'rish",
      ctaContact: "Bog'lanish",
    },
    about: {
      title: 'Men haqimda',
      p1: "Men frontend dasturchiman, foydalanuvchi uchun qulay va chiroyli interfeyslar yarataman. HTML, CSS va JavaScript asosida boshlab, hozirda React kutubxonasi bilan ishlayman va Node.js yordamida loyihalarni yig'ish (build) va server tomonini ham o'rganib bormoqdaman.",
      p2: "Yangi texnologiyalarni o'rganishni va murakkab muammolarni sodda, tushunarli yechimlar bilan hal qilishni yoqtiraman.",
    },
    skills: {
      title: "Ko'nikmalar",
      subtitle: 'Men ishlatadigan texnologiyalar',
    },
    projects: {
      title: 'Loyihalar',
      subtitle: "Ba'zi ishlarim",
      liveDemo: 'Live demo',
      github: 'GitHub',
      items: [
        {
          title: 'To-Do List',
          desc: "Vazifalarni qo'shish, bajarilganini belgilash va filtrlash imkoniyatiga ega, ma'lumotlar brauzer xotirasida (localStorage) saqlanadi.",
        },
        {
          title: 'Kalkulyator',
          desc: 'Asosiy arifmetik amallarni bajaradigan, klaviatura va sichqoncha bilan boshqariladigan kalkulyator ilovasi.',
        },
        {
          title: 'Ob-havo',
          desc: "Shahar nomi bo'yicha joriy ob-havo ma'lumotlarini bepul ochiq API orqali real vaqtda ko'rsatadigan ilova.",
        },
      ],
    },
    contact: {
      title: 'Aloqa',
      subtitle: "Loyiha bo'yicha taklifingiz bormi? Yozing!",
      nameLabel: 'Ismingiz',
      namePlaceholder: 'Ismingiz',
      phoneLabel: 'Telefon raqam',
      messageLabel: 'Xabar',
      messagePlaceholder: "Xabaringizni shu yerga to'liq va tushunarli yozing...",
      send: 'Yuborish',
      sending: 'Yuborilmoqda...',
      success: 'Xabaringiz yuborildi, rahmat!',
      errorPhone: "Telefon raqamni +998XXXXXXXXX ko'rinishida to'liq kiriting",
      errorGibberish: "Iltimos, tushunarli xabar yozing (kamida 15 ta belgi, ma'noli matn)",
      errorGeneric: "Xatolik yuz berdi, birozdan so'ng qayta urinib ko'ring.",
    },
    footer: {
      rights: 'Barcha huquqlar himoyalangan.',
    },
  },
  ru: {
    nav: {
      about: 'О себе',
      skills: 'Навыки',
      projects: 'Проекты',
      contact: 'Контакты',
      menuToggle: 'Открыть меню',
    },
    hero: {
      kicker: 'Привет, я',
      name: 'Огабек Каримов —',
      role: 'Frontend-разработчик',
      text: 'Создаю современные, быстрые и удобные веб-сайты с помощью HTML, CSS, JavaScript, React и Node.js.',
      ctaProjects: 'Смотреть проекты',
      ctaContact: 'Связаться',
    },
    about: {
      title: 'О себе',
      p1: 'Я frontend-разработчик, создаю удобные и красивые интерфейсы для пользователей. Начав с HTML, CSS и JavaScript, сейчас работаю с библиотекой React, а также изучаю сборку проектов и серверную часть с помощью Node.js.',
      p2: 'Мне нравится изучать новые технологии и решать сложные задачи простыми и понятными способами.',
    },
    skills: {
      title: 'Навыки',
      subtitle: 'Технологии, которые я использую',
    },
    projects: {
      title: 'Проекты',
      subtitle: 'Некоторые мои работы',
      liveDemo: 'Live demo',
      github: 'GitHub',
      items: [
        {
          title: 'To-Do List',
          desc: 'Позволяет добавлять задачи, отмечать выполненные и фильтровать их, данные сохраняются в памяти браузера (localStorage).',
        },
        {
          title: 'Калькулятор',
          desc: 'Приложение-калькулятор для основных арифметических действий, управляется клавиатурой и мышью.',
        },
        {
          title: 'Погода',
          desc: 'Приложение, показывающее текущую погоду по названию города в реальном времени через бесплатный открытый API.',
        },
      ],
    },
    contact: {
      title: 'Контакты',
      subtitle: 'Есть предложение по проекту? Напишите!',
      nameLabel: 'Ваше имя',
      namePlaceholder: 'Ваше имя',
      phoneLabel: 'Номер телефона',
      messageLabel: 'Сообщение',
      messagePlaceholder: 'Напишите ваше сообщение здесь полностью и понятно...',
      send: 'Отправить',
      sending: 'Отправка...',
      success: 'Ваше сообщение отправлено, спасибо!',
      errorPhone: 'Введите номер телефона полностью в формате +998XXXXXXXXX',
      errorGibberish: 'Пожалуйста, напишите понятное сообщение (минимум 15 символов, осмысленный текст)',
      errorGeneric: 'Произошла ошибка, попробуйте ещё раз позже.',
    },
    footer: {
      rights: 'Все права защищены.',
    },
  },
}

export default translations
