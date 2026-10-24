(() => {
  'use strict';

  /* ---------- helpers ---------- */
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];
  const root = document.documentElement;
  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const store = {
    get(k, d) { try { const v = localStorage.getItem(k); return v ? JSON.parse(v) : d; } catch { return d; } },
    set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch { /* ignore */ } }
  };
  const motionOff = () => root.dataset.motion === 'off';

  /* внешние ссылки открываем в новой вкладке */
  $$('a[href^="http"]').forEach((a) => { a.target = '_blank'; a.rel = 'noopener noreferrer'; });

  /* битые картинки с внешнего сайта убираем — остаётся градиентная заглушка */
  document.addEventListener('error', (e) => {
    const t = e.target;
    if (t && t.matches && t.matches('img.ph')) t.remove();
  }, true);

  /* видеоплеер: iframe подгружается только по клику */
  document.addEventListener('click', (e) => {
    const btn = e.target.closest('.player__btn');
    if (!btn) return;
    const pl = btn.closest('.player');
    const f = document.createElement('iframe');
    f.src = pl.dataset.src;
    f.title = pl.dataset.title || 'Видео';
    f.allow = 'autoplay; clipboard-write; fullscreen; picture-in-picture';
    f.allowFullscreen = true;
    f.referrerPolicy = 'strict-origin-when-cross-origin';
    pl.replaceChildren(f);
  });

  /* ---------- ДАННЫЕ ---------- */
  const programs = [
    {
      id: 'prog', group: 'it', code: '09.02.07', hue: 160,
      title: 'Информационные системы и программирование', sub: 'Программист',
      desc: 'Разработка программного обеспечения: от алгоритмов и баз данных до готовых приложений. Занятия проходят в компьютерных классах техникума.',
      skills: ['Основы программирования и алгоритмизации', 'Работа с базами данных', 'Разработка и отладка приложений', 'Командная работа над проектами'],
      jobs: ['Программист', 'Тестировщик ПО', 'Специалист по базам данных'],
      url: 'https://www.ntti.ru/abiturientu/inf_sys090207'
    },
    {
      id: 'web', group: 'it', code: '09.02.07', hue: 200,
      title: 'Информационные системы и программирование', sub: 'Разработчик веб',
      desc: 'Создание сайтов и веб-приложений: вёрстка, интерфейсы и серверная часть — всё, что нужно для работы в веб-разработке.',
      skills: ['HTML, CSS и JavaScript', 'Дизайн интерфейсов и адаптивная вёрстка', 'Серверная часть и базы данных', 'Публикация и поддержка сайтов'],
      jobs: ['Веб-разработчик', 'Верстальщик', 'Специалист по поддержке сайтов'],
      url: 'https://www.ntti.ru/abiturientu/inf_sys090207_1'
    },
    {
      id: 'shvey', group: 'design', code: '29.02.04', hue: 330,
      title: 'Конструирование, моделирование и технология швейных изделий', sub: 'Швейное производство',
      desc: 'Проектирование одежды: от эскиза и построения лекал до пошива изделия в учебно-производственных мастерских. Лучшие работы выходят на подиум Театра Мод.',
      skills: ['Эскизирование и моделирование одежды', 'Построение выкроек и конструирование', 'Материаловедение', 'Технология пошива'],
      jobs: ['Конструктор-модельер', 'Технолог швейного производства', 'Мастер ателье'],
      url: 'https://www.ntti.ru/abiturientu/shveynyie-izdeliya'
    },
    {
      id: 'kozha', group: 'design', code: '29.02.01', hue: 25,
      title: 'Конструирование, моделирование и технология изделий из кожи', sub: 'Изделия из кожи',
      desc: 'Дизайн и изготовление сумок, обуви и аксессуаров: от идеи и чертежа до готовой вещи в мастерских техникума.',
      skills: ['Конструирование изделий из кожи', 'Раскрой и подготовка материалов', 'Технология изготовления аксессуаров', 'Работа на специальном оборудовании'],
      jobs: ['Конструктор изделий из кожи', 'Технолог кожгалантерейного производства', 'Мастер по изделиям из кожи'],
      url: 'https://www.ntti.ru/abiturientu/izdeliya-iz-kozhi'
    }
  ];

  const quizData = [
    { q: 'Чем вам интереснее заниматься в свободное время?', a: [
      ['Разбираться, как устроены программы и игры', 'prog'],
      ['Рисовать макеты и придумывать, как должен выглядеть сайт', 'web'],
      ['Придумывать одежду и подбирать ткани', 'shvey'],
      ['Мастерить вещи руками — сумки, ремни, обувь', 'kozha']] },
    { q: 'Какой проект вам хотелось бы сделать?', a: [
      ['Приложение, которое автоматизирует рутину', 'prog'],
      ['Красивый и удобный сайт для себя или друзей', 'web'],
      ['Свою коллекцию одежды для показа', 'shvey'],
      ['Коллекцию аксессуаров ручной работы', 'kozha']] },
    { q: 'Что вам даётся легче всего?', a: [
      ['Логика, задачи и аккуратность в деталях', 'prog'],
      ['Чувство цвета, композиции и стиля', 'web'],
      ['Работа с тканью, глазомер и фантазия', 'shvey'],
      ['Работа с материалом и инструментом', 'kozha']] },
    { q: 'Как вы видите себя через несколько лет?', a: [
      ['Разработчиком в IT-команде', 'prog'],
      ['Веб-мастером или фрилансером', 'web'],
      ['Конструктором-модельером в ателье или на производстве', 'shvey'],
      ['Мастером или технологом в кожевенном деле', 'kozha']] }
  ];

  const docs = [
    ['passport', 'Паспорт и его копия'],
    ['edu', 'Документ об образовании (аттестат)'],
    ['photo', 'Фотографии 3×4'],
    ['med', 'Медицинская справка'],
    ['ipra', 'Документы об инвалидности / ИПРА (при наличии)'],
    ['snils', 'СНИЛС']
  ];

  const life = [
    { id: 'fashion', tab: 'Театр Мод', title: 'Театр Мод', hue: 300, url: 'https://www.ntti.ru/raznoe/theater_fashion',
      text: 'Студенты показывают собственные коллекции на сцене — например, «Золотое Руно. Предания амазонок». Это проверка на практике всего, чему учат в мастерских.' },
    { id: 'music', tab: 'Кавер-группа', title: 'Кавер-группа', hue: 220, url: 'https://www.ntti.ru/raznoe/music',
      text: 'Музыкальный коллектив техникума выступает на праздниках, концертах и фестивалях.' },
    { id: 'sport', tab: 'Спорт', title: 'Клуб «Ермак»', hue: 20, url: 'https://www.ntti.ru/raznoe/sportivno-ozdorovitelnyiy-kompleks',
      text: 'Студенческий спортивный клуб: тренажёрный зал, турниры по настольному теннису, армрестлинг, спартакиады.' },
    { id: 'abil', tab: 'Абилимпикс', title: 'Абилимпикс', hue: 160, url: 'https://www.ntti.ru/studentu/abilimpiks',
      text: 'Чемпионаты профессионального мастерства для людей с инвалидностью — шанс показать навыки и сравнить силы с лучшими.' },
    { id: 'self', tab: 'Самоуправление', title: 'Студенческий совет', hue: 50, url: 'https://www.ntti.ru/studentu/samoupravlenie',
      text: 'Студенческий совет самоуправления организует события и помогает студентам влиять на жизнь техникума.' }
  ];

  const newsImg = (n) => `https://www.ntti.ru/dl_images/udb_photos/udb1-rec${n.n}-field4.${n.e}`;
  const newsData = [
    { n: 625, e: 'png', t: 'Статистический диктант', d: '2026-10-13', c: 'Образование' },
    { n: 624, e: 'png', t: '«ГОЛОСАгро» — регистрация открыта!', d: '2026-10-13', c: 'Образование' },
    { n: 623, e: 'png', t: 'Добро.рф — платформа для неравнодушных', d: '2026-08-18', c: 'Жизнь' },
    { n: 622, e: 'jpg', t: 'Молодёжь. Приоритет-здоровье', c: 'Спорт' },
    { n: 621, e: 'png', t: 'Чернобыль в нашей памяти', c: 'Память' },
    { n: 620, e: 'jpg', t: 'Сильные духом', c: 'Жизнь' },
    { n: 619, e: 'png', t: 'Увидеть, не видя, на «СенсАрт»', c: 'Творчество' },
    { n: 618, e: 'jpeg', t: 'Певец просторов русских', c: 'Творчество' },
    { n: 616, e: 'jpeg', t: '«Отвага, вера, честь, победа»', c: 'Память' },
    { n: 615, e: 'jpeg', t: 'Листая страницы истории', c: 'Память' },
    { n: 614, e: 'jpeg', t: 'Заповедные места малой родины', c: 'Образование' },
    { n: 613, e: 'jpeg', t: 'Выбери Независимость.', c: 'Жизнь' },
    { n: 612, e: 'jpeg', t: 'Международный фестиваль паралимпийского спорта в МЭКИ', c: 'Спорт' },
    { n: 611, e: 'jpg', t: 'ВРЕМЯ ГЕРОЕВ!', c: 'Память' },
    { n: 610, e: 'png', t: 'Дорогами памяти!', c: 'Память' },
    { n: 609, e: 'jpeg', t: 'Технопарк — место, где открываются таланты!', c: 'Образование' },
    { n: 608, e: 'jpg', t: 'Подвиг народа: память и духовный опыт поколений', c: 'Память' },
    { n: 607, e: 'PNG', t: '82 года со дня освобождения Новочеркасска от немецко-фашистских захватчиков', c: 'Память' },
    { n: 606, e: 'jpg', t: 'Я такой же, как и ты!', c: 'Жизнь' },
    { n: 605, e: 'jpg', t: 'Городской турнир по настольному теннису среди учащихся и студенческой молодёжи', c: 'Спорт' },
    { n: 604, e: 'jpeg', t: 'Подвигом славны твои земляки', c: 'Память' },
    { n: 603, e: 'jpeg', t: 'Осень — чудная пора', c: 'Творчество' },
    { n: 602, e: 'jpeg', t: 'Олимпиада по экологии', c: 'Образование' },
    { n: 601, e: 'jpg', t: 'Городские соревнования, посвящённые Всемирному Дню инвалидов', c: 'Спорт' },
    { n: 600, e: 'jpeg', t: 'Областной автовокзал «Центральный» — социальный партнёр!', c: 'Жизнь' },
    { n: 598, e: 'jpeg', t: 'Страницы истории техникума', c: 'Память' },
    { n: 597, e: 'jpg', t: 'День распахнутых сердец', c: 'Жизнь' },
    { n: 596, e: 'jpeg', t: 'Образование — путь к успеху!', c: 'Образование' },
    { n: 593, e: 'jpeg', t: 'Городской турнир по настольному теннису среди людей с ограниченными возможностями', c: 'Спорт' },
    { n: 591, e: 'png', t: 'Полёты во сне и наяву!', c: 'Творчество' },
    { n: 590, e: 'jpg', t: 'Твори, выдумывай, пробуй!!!', c: 'Творчество' },
    { n: 589, e: 'jpeg', t: 'Армрестлинг — спорт сильных и быстрых', c: 'Спорт' },
    { n: 588, e: 'jpeg', t: 'Чтоб по жизни побеждать — надо в теннис всем играть!', c: 'Спорт' },
    { n: 587, e: 'jpeg', t: 'III Спартакиада инвалидов', c: 'Спорт' },
    { n: 586, e: 'jpeg', t: 'Начало новой традиции', c: 'Жизнь' },
    { n: 584, e: 'jpg', t: 'Построй свою карьеру на Дальнем Востоке!', c: 'Образование' },
    { n: 583, e: 'png', t: 'Жить и побеждать', c: 'Жизнь' }
  ];

  /* Фото берутся с ntti.ru. Для портфолио лучше скачать их в папку img/ и заменить адреса. */
  const IMG = (f) => `https://www.ntti.ru/imageCropperGalleryFull.php?ph=${f}`;
  const gallery = [
    { t: 'Добро пожаловать к нам!', img: IMG('grID10-img165.jpg'), album: 'https://www.ntti.ru/photogallery/photoalbum?n=10' },
    { t: 'Специальность КМиТШИ', img: IMG('grID4-img5.JPG'), album: 'https://www.ntti.ru/photogallery/photoalbum?n=4' },
    { t: 'Тренажёрный зал', img: IMG('grID8-img98.jpg'), album: 'https://www.ntti.ru/photogallery/photoalbum?n=8' },
    { t: 'Общежитие', img: IMG('grID7-img92.jpg'), album: 'https://www.ntti.ru/photogallery/photoalbum?n=7' },
    { t: 'Добро пожаловать к нам!', img: IMG('grID10-img168.jpg'), album: 'https://www.ntti.ru/photogallery/photoalbum?n=10' },
    { t: 'Преподаватели НТТИ', img: IMG('grID6-img26.jpg'), album: 'https://www.ntti.ru/photogallery/photoalbum?n=6' },
    { t: 'Специальность КМиТШИ', img: IMG('grID4-img8.JPG'), album: 'https://www.ntti.ru/photogallery/photoalbum?n=4' },
    { t: 'Старые фото НТТИ', img: IMG('grID9-img150.jpg'), album: 'https://www.ntti.ru/photogallery/photoalbum?n=9' },
    { t: 'Общежитие', img: IMG('grID7-img84.jpg'), album: 'https://www.ntti.ru/photogallery/photoalbum?n=7' },
    { t: 'Тренажёрный зал', img: IMG('grID8-img101.jpg'), album: 'https://www.ntti.ru/photogallery/photoalbum?n=8' },
    { t: 'Добро пожаловать к нам!', img: IMG('grID10-img172.jpg'), album: 'https://www.ntti.ru/photogallery/photoalbum?n=10' },
    { t: 'Старые фото НТТИ', img: IMG('grID9-img136.jpg'), album: 'https://www.ntti.ru/photogallery/photoalbum?n=9' }
  ];

  /* ---------- ДОСТУПНОСТЬ И ТЕМА ---------- */
  const defaults = { theme: 'light', fs: 'md', ls: 'normal', motion: 'on' };
  const savedPrefs = store.get('ntti-a11y', null);
  const prefs = { ...defaults, ...(savedPrefs || {}) };
  if (!savedPrefs && matchMedia('(prefers-color-scheme: dark)').matches) prefs.theme = 'dark';
  if (!savedPrefs && matchMedia('(prefers-reduced-motion: reduce)').matches) prefs.motion = 'off';

  function applyPrefs() {
    Object.entries(prefs).forEach(([k, v]) => { root.dataset[k] = v; });
    $$('.seg').forEach((seg) => {
      const k = seg.dataset.key;
      $$('button', seg).forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.v === prefs[k])));
    });
    const tb = $('#themeBtn');
    tb.setAttribute('aria-label', prefs.theme === 'dark' ? 'Включить светлую тему' : 'Включить тёмную тему');
  }
  function setPref(k, v) { prefs[k] = v; store.set('ntti-a11y', prefs); applyPrefs(); }
  applyPrefs();

  const a11yBtn = $('#a11yBtn'), a11yPanel = $('#a11yPanel');
  a11yBtn.addEventListener('click', () => {
    const open = a11yPanel.hidden;
    a11yPanel.hidden = !open;
    a11yBtn.setAttribute('aria-expanded', String(open));
  });
  $$('.seg').forEach((seg) => seg.addEventListener('click', (e) => {
    const b = e.target.closest('button[data-v]');
    if (b) setPref(seg.dataset.key, b.dataset.v);
  }));
  $('#a11yReset').addEventListener('click', () => {
    Object.assign(prefs, defaults);
    store.set('ntti-a11y', prefs);
    applyPrefs();
  });
  $('#themeBtn').addEventListener('click', () => setPref('theme', prefs.theme === 'dark' ? 'light' : 'dark'));

  /* ---------- НАВИГАЦИЯ ---------- */
  const burger = $('#burger'), nav = $('#nav');
  function closeSubs(except) {
    $$('.has-sub').forEach((li) => {
      if (li !== except) { li.classList.remove('open'); $('.nav__b', li).setAttribute('aria-expanded', 'false'); }
    });
  }
  burger.addEventListener('click', () => {
    const open = !document.body.classList.contains('nav-open');
    document.body.classList.toggle('nav-open', open);
    burger.setAttribute('aria-expanded', String(open));
    burger.setAttribute('aria-label', open ? 'Закрыть меню' : 'Открыть меню');
  });
  $$('.has-sub').forEach((li) => {
    const b = $('.nav__b', li);
    b.addEventListener('click', (e) => {
      e.stopPropagation();
      const open = !li.classList.contains('open');
      closeSubs(li);
      li.classList.toggle('open', open);
      b.setAttribute('aria-expanded', String(open));
    });
  });
  document.addEventListener('click', (e) => { if (!e.target.closest('.has-sub')) closeSubs(); });
  nav.addEventListener('click', (e) => {
    if (e.target.closest('a[href^="#"]')) {
      document.body.classList.remove('nav-open');
      burger.setAttribute('aria-expanded', 'false');
      closeSubs();
    }
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeSubs();
      document.body.classList.remove('nav-open');
      burger.setAttribute('aria-expanded', 'false');
    }
  });

  /* прогресс чтения, шапка, кнопка «наверх» */
  const bar = $('#progress'), hdr = $('.hdr'), toTop = $('#toTop');
  let ticking = false;
  function onScroll() {
    const h = document.documentElement.scrollHeight - innerHeight;
    bar.style.transform = `scaleX(${h > 0 ? Math.min(scrollY / h, 1) : 0})`;
    hdr.classList.toggle('is-stuck', scrollY > 10);
    toTop.hidden = scrollY < 700;
    ticking = false;
  }
  addEventListener('scroll', () => { if (!ticking) { ticking = true; requestAnimationFrame(onScroll); } }, { passive: true });
  onScroll();
  toTop.addEventListener('click', () => scrollTo({ top: 0, behavior: motionOff() ? 'auto' : 'smooth' }));

  /* подсветка активного пункта меню */
  const spyLinks = $$('a[data-spy]');
  if ('IntersectionObserver' in window) {
    const map = new Map(spyLinks.map((a) => [a.getAttribute('href').slice(1), a]));
    const spy = new IntersectionObserver((entries) => {
      entries.forEach((en) => {
        if (en.isIntersecting) {
          spyLinks.forEach((a) => a.removeAttribute('aria-current'));
          map.get(en.target.id)?.setAttribute('aria-current', 'true');
        }
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    map.forEach((_, id) => { const el = document.getElementById(id); if (el) spy.observe(el); });
  }

  /* ---------- REVEAL + СЧЁТЧИКИ ---------- */
  function observeReveal(scope = document) {
    const els = $$('.reveal:not(.in)', scope);
    if (!('IntersectionObserver' in window) || motionOff()) { els.forEach((el) => el.classList.add('in')); return; }
    const io = new IntersectionObserver((entries) => {
      entries.forEach((en) => { if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); } });
    }, { threshold: 0.12 });
    els.forEach((el, i) => { el.style.transitionDelay = `${Math.min(i % 4, 3) * 70}ms`; io.observe(el); });
  }

  function runCounters() {
    $$('.count').forEach((el) => {
      const to = +el.dataset.to, plus = el.dataset.plus ? '+' : '';
      const finish = () => { el.textContent = to + plus; };
      if (!('IntersectionObserver' in window) || motionOff()) { finish(); return; }
      const io = new IntersectionObserver(([en]) => {
        if (!en.isIntersecting) return;
        io.disconnect();
        const t0 = performance.now(), dur = 1300;
        (function tick(t) {
          const p = Math.min((t - t0) / dur, 1);
          el.textContent = Math.round(to * (1 - Math.pow(1 - p, 3))) + (p === 1 ? plus : '');
          if (p < 1) requestAnimationFrame(tick);
        })(t0);
      }, { threshold: 0.6 });
      el.textContent = '0';
      io.observe(el);
    });
  }

  /* ---------- ДИАЛОГИ ---------- */
  let openDialogs = 0;
  function openDlg(dlg) {
    if (dlg.open) return;
    dlg.showModal();
    openDialogs++;
    document.body.style.overflow = 'hidden';
  }
  $$('dialog').forEach((dlg) => {
    dlg.addEventListener('close', () => {
      openDialogs = Math.max(0, openDialogs - 1);
      if (!openDialogs) document.body.style.overflow = '';
    });
    dlg.addEventListener('click', (e) => {
      if (e.target === dlg || e.target.closest('[data-close]')) dlg.close();
    });
  });

  /* ---------- СПЕЦИАЛЬНОСТИ ---------- */
  const grid = $('#programGrid');
  function renderPrograms(filter = 'all') {
    const list = programs.filter((p) => filter === 'all' || p.group === filter);
    grid.innerHTML = list.map((p) => `
      <article class="card pcard" style="--h:${p.hue}">
        <div class="pcard__v" aria-hidden="true"><span>${p.code}</span></div>
        <div class="pcard__b">
          <p class="tag">${esc(p.sub)}</p>
          <h3>${esc(p.title)}</h3>
          <p class="muted">${esc(p.desc)}</p>
          <button type="button" class="btn btn-ghost" data-open="${p.id}">Подробнее</button>
        </div>
      </article>`).join('');
  }
  $('#programFilters').addEventListener('click', (e) => {
    const b = e.target.closest('.chip');
    if (!b) return;
    $$('#programFilters .chip').forEach((c) => { c.classList.toggle('is-on', c === b); c.setAttribute('aria-pressed', String(c === b)); });
    renderPrograms(b.dataset.f);
  });

  function openProgram(id) {
    const p = programs.find((x) => x.id === id);
    if (!p) return;
    $('#progBody').innerHTML = `
      <p class="eyebrow">${p.code} · ${esc(p.sub)}</p>
      <h3 id="progTitle">${esc(p.title)}</h3>
      <p class="dlg__lead">${esc(p.desc)}</p>
      <div class="dlg__cols">
        <div><h4>Чему научитесь</h4><ul>${p.skills.map((s) => `<li>${esc(s)}</li>`).join('')}</ul></div>
        <div><h4>Кем можно работать</h4><ul>${p.jobs.map((s) => `<li>${esc(s)}</li>`).join('')}</ul></div>
      </div>
      <p class="note">Описание ориентировочное. Актуальные условия приёма — на официальной странице специальности.</p>
      <div class="dlg__act">
        <a class="btn btn-primary" href="${p.url}" target="_blank" rel="noopener noreferrer">Страница на сайте техникума ↗</a>
        <button type="button" class="btn btn-ghost" data-close>Закрыть</button>
      </div>`;
    openDlg($('#progDlg'));
  }
  document.addEventListener('click', (e) => {
    const o = e.target.closest('[data-open]');
    if (o) { e.preventDefault(); openProgram(o.dataset.open); }
  });

  /* ---------- ТЕСТ ---------- */
  const qBox = $('#quizBox');
  let qi = 0, score = {};
  function renderQuiz() {
    if (qi < quizData.length) {
      const q = quizData[qi];
      qBox.innerHTML = `
        <div class="quiz__top"><span>Вопрос ${qi + 1} из ${quizData.length}</span><div class="bar" aria-hidden="true"><i style="width:${(qi / quizData.length) * 100}%"></i></div></div>
        <h3 id="qq">${esc(q.q)}</h3>
        <div class="quiz__a" role="group" aria-labelledby="qq">
          ${q.a.map((a, i) => `<button type="button" class="opt" data-k="${a[1]}"><span aria-hidden="true">${'АБВГ'[i]}</span>${esc(a[0])}</button>`).join('')}
        </div>`;
    } else {
      const ranked = programs.map((p) => [p, score[p.id] || 0]).sort((a, b) => b[1] - a[1]);
      const [top, topScore] = ranked[0];
      const second = ranked[1];
      qBox.innerHTML = `
        <p class="eyebrow">Ваш результат</p>
        <h3>${esc(top.sub)}</h3>
        <p class="muted">${esc(top.title)} · ${top.code}. Совпадение: <b>${Math.round((topScore / quizData.length) * 100)}%</b>.</p>
        <p class="muted">${esc(top.desc)}</p>
        ${second[1] > 0 ? `<p class="note">Также может подойти: <button type="button" class="link-btn" data-open="${second[0].id}">${esc(second[0].sub)}</button></p>` : ''}
        <div class="quiz__act">
          <button type="button" class="btn btn-primary" data-open="${top.id}">Узнать подробнее</button>
          <button type="button" class="btn btn-ghost" id="quizRestart">Пройти заново</button>
        </div>`;
    }
  }
  qBox.addEventListener('click', (e) => {
    const opt = e.target.closest('.opt');
    if (opt) {
      score[opt.dataset.k] = (score[opt.dataset.k] || 0) + 1;
      qi++;
      renderQuiz();
      $('button', qBox)?.focus({ preventScroll: true });
    }
    if (e.target.closest('#quizRestart')) { qi = 0; score = {}; renderQuiz(); }
  });

  /* ---------- ЧЕК-ЛИСТ ДОКУМЕНТОВ ---------- */
  const docList = $('#docList');
  const docState = store.get('ntti-docs', {});
  function renderDocs() {
    docList.innerHTML = docs.map(([id, label]) => `
      <li><label class="check"><input type="checkbox" data-id="${id}" ${docState[id] ? 'checked' : ''}><span>${esc(label)}</span></label></li>`).join('');
    updateDocs();
  }
  function updateDocs() {
    const done = docs.filter(([id]) => docState[id]).length;
    $('#docCount').textContent = `${done} из ${docs.length}`;
    $('#docBar').style.width = `${(done / docs.length) * 100}%`;
  }
  docList.addEventListener('change', (e) => {
    const cb = e.target.closest('input[data-id]');
    if (!cb) return;
    docState[cb.dataset.id] = cb.checked;
    store.set('ntti-docs', docState);
    updateDocs();
  });

  /* ---------- ЖИЗНЬ НТТИ (вкладки) ---------- */
  const tabs = $('#lifeTabs'), panel = $('#lifePanel');
  let lifeIdx = 0;
  function renderLife() {
    tabs.innerHTML = life.map((l, i) => `<button type="button" role="tab" id="tab-${l.id}" aria-selected="${i === lifeIdx}" aria-controls="lifePanel" tabindex="${i === lifeIdx ? 0 : -1}">${esc(l.tab)}</button>`).join('');
    const l = life[lifeIdx];
    panel.setAttribute('aria-labelledby', `tab-${l.id}`);
    panel.innerHTML = `
      <div class="life__v" style="--h:${l.hue}" aria-hidden="true"><span>${esc(l.tab.slice(0, 1))}</span></div>
      <div class="life__t">
        <h3>${esc(l.title)}</h3>
        <p class="muted">${esc(l.text)}</p>
        <a class="btn btn-ghost" href="${l.url}" target="_blank" rel="noopener noreferrer">Подробнее на ntti.ru ↗</a>
      </div>`;
  }
  tabs.addEventListener('click', (e) => {
    const i = $$('[role=tab]', tabs).indexOf(e.target.closest('[role=tab]'));
    if (i > -1) { lifeIdx = i; renderLife(); }
  });
  tabs.addEventListener('keydown', (e) => {
    if (!['ArrowRight', 'ArrowLeft', 'Home', 'End'].includes(e.key)) return;
    e.preventDefault();
    const n = life.length;
    lifeIdx = e.key === 'ArrowRight' ? (lifeIdx + 1) % n : e.key === 'ArrowLeft' ? (lifeIdx - 1 + n) % n : e.key === 'Home' ? 0 : n - 1;
    renderLife();
    $$('[role=tab]', tabs)[lifeIdx].focus();
  });

  /* ---------- НОВОСТИ ---------- */
  const newsGrid = $('#newsGrid'), newsMore = $('#newsMore'), newsEmpty = $('#newsEmpty');
  const cats = ['Все', ...new Set(newsData.map((n) => n.c))];
  let nCat = 'Все', nQuery = '', nShown = 6;
  const fmtDate = new Intl.DateTimeFormat('ru', { day: 'numeric', month: 'long', year: 'numeric' });
  $('#newsFilters').innerHTML = cats.map((c, i) => `<button type="button" class="chip ${i === 0 ? 'is-on' : ''}" data-c="${esc(c)}" aria-pressed="${i === 0}">${esc(c)}</button>`).join('');

  function renderNews() {
    const q = nQuery.trim().toLowerCase();
    const list = newsData
      .filter((n) => (nCat === 'Все' || n.c === nCat) && (!q || n.t.toLowerCase().includes(q)))
      .sort((a, b) => b.n - a.n);
    newsGrid.innerHTML = list.slice(0, nShown).map((n) => `
      <a class="ncard" href="https://www.ntti.ru/news/newsarticle?n=${n.n}" target="_blank" rel="noopener noreferrer" style="--h:${(n.n * 37) % 360}">
        <span class="ncard__v" aria-hidden="true"><img class="ph" src="${newsImg(n)}" alt="" loading="lazy" decoding="async" referrerpolicy="no-referrer"><i>${esc(n.c)}</i></span>
        <span class="ncard__b">
          <small>${n.d ? fmtDate.format(new Date(n.d + 'T00:00:00')) : 'Из архива'}</small>
          <b>${esc(n.t)}</b>
        </span>
      </a>`).join('');
    newsEmpty.hidden = list.length > 0;
    newsMore.hidden = list.length <= nShown;
  }
  $('#newsFilters').addEventListener('click', (e) => {
    const b = e.target.closest('.chip');
    if (!b) return;
    nCat = b.dataset.c; nShown = 6;
    $$('#newsFilters .chip').forEach((c) => { c.classList.toggle('is-on', c === b); c.setAttribute('aria-pressed', String(c === b)); });
    renderNews();
  });
  $('#newsSearch').addEventListener('input', (e) => { nQuery = e.target.value; nShown = 6; renderNews(); });
  newsMore.addEventListener('click', () => { nShown += 6; renderNews(); });

  /* ---------- ГАЛЕРЕЯ + ЛАЙТБОКС ---------- */
  const gGrid = $('#galleryGrid');
  gGrid.innerHTML = gallery.map((g, i) => `
    <button type="button" class="gtile ${i % 5 === 0 ? 'wide' : i % 4 === 1 ? 'tall' : ''}" data-i="${i}" style="--h:${g.h}" aria-label="Открыть фото: ${esc(g.t)}">
      <img class="ph" src="${esc(g.img)}" alt="" loading="lazy" decoding="async" referrerpolicy="no-referrer">
      <span>${esc(g.t)}</span>
    </button>`).join('');

  let lbIdx = 0;
  const lb = $('#lightbox');
  function showLb(i) {
    lbIdx = (i + gallery.length) % gallery.length;
    const g = gallery[lbIdx];
    const fig = $('#lbFig');
    fig.style.setProperty('--h', g.h);
    fig.innerHTML = `<span aria-hidden="true">${lbIdx + 1}</span><img class="ph" src="${esc(g.img)}" alt="${esc(g.t)}" referrerpolicy="no-referrer">`;
    $('#lbCap').innerHTML = `${esc(g.t)} · ${lbIdx + 1} / ${gallery.length} · <a href="${esc(g.album)}" target="_blank" rel="noopener noreferrer">весь альбом на ntti.ru ↗</a>`;
  }
  gGrid.addEventListener('click', (e) => {
    const t = e.target.closest('.gtile');
    if (t) { showLb(+t.dataset.i); openDlg(lb); }
  });
  $('#lbPrev').addEventListener('click', () => showLb(lbIdx - 1));
  $('#lbNext').addEventListener('click', () => showLb(lbIdx + 1));
  lb.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') showLb(lbIdx - 1);
    if (e.key === 'ArrowRight') showLb(lbIdx + 1);
  });

  /* ---------- ПОИСК (Ctrl+K) ---------- */
  const sDlg = $('#searchDlg'), sInput = $('#sInput'), sList = $('#sList');
  const searchItems = [
    ...[['Специальности', '#programs'], ['Подбор специальности (тест)', '#quiz'], ['Как поступить', '#admission'], ['Жизнь НТТИ', '#life'],
      ['Новости', '#news'], ['Галерея', '#gallery'], ['Видео', '#video'], ['Логотип и фирменный стиль', '#brand'], ['Контакты и обратный звонок', '#contacts']]
      .map(([t, h]) => ({ t, h, k: 'Раздел' })),
    ...programs.map((p) => ({ t: `${p.sub} — ${p.code}`, open: p.id, k: 'Специальность' })),
    ...[['Расписание и звонки', 'https://www.ntti.ru/studentu/raspisanie'], ['Приёмная кампания 2026', 'https://www.ntti.ru/abiturientu/priem_2026'],
      ['Дни открытых дверей', 'https://www.ntti.ru/abiturientu/opendays'], ['Сведения об образовательной организации', 'https://www.ntti.ru/sveden'],
      ['Версия для слабовидящих', 'https://www.ntti.ru/reverse.php?sp=1']].map(([t, h]) => ({ t, h, k: 'ntti.ru' })),
    ...newsData.map((n) => ({ t: n.t, h: `https://www.ntti.ru/news/newsarticle?n=${n.n}`, k: 'Новость' }))
  ];
  let sIdx = 0, sRes = [];
  function renderSearch() {
    const q = sInput.value.trim().toLowerCase();
    sRes = (q ? searchItems.filter((i) => i.t.toLowerCase().includes(q)) : searchItems.slice(0, 8)).slice(0, 9);
    sIdx = 0;
    sList.innerHTML = sRes.length
      ? sRes.map((r, i) => `<li role="option" aria-selected="${i === 0}" data-i="${i}"><span>${esc(r.t)}</span><small>${r.k}</small></li>`).join('')
      : '<li class="sempty">Ничего не найдено</li>';
  }
  function markSearch() {
    $$('li[role=option]', sList).forEach((li, i) => { li.setAttribute('aria-selected', String(i === sIdx)); if (i === sIdx) li.scrollIntoView({ block: 'nearest' }); });
  }
  function goSearch(i) {
    const r = sRes[i];
    if (!r) return;
    sDlg.close();
    if (r.open) openProgram(r.open);
    else if (r.h.startsWith('#')) { document.querySelector(r.h)?.scrollIntoView({ behavior: motionOff() ? 'auto' : 'smooth' }); }
    else window.open(r.h, '_blank', 'noopener');
  }
  function openSearch() { sInput.value = ''; renderSearch(); openDlg(sDlg); sInput.focus(); }
  $('#searchBtn').addEventListener('click', openSearch);
  addEventListener('keydown', (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') { e.preventDefault(); sDlg.open ? sDlg.close() : openSearch(); }
  });
  sInput.addEventListener('input', renderSearch);
  sInput.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowDown') { e.preventDefault(); sIdx = Math.min(sIdx + 1, sRes.length - 1); markSearch(); }
    if (e.key === 'ArrowUp') { e.preventDefault(); sIdx = Math.max(sIdx - 1, 0); markSearch(); }
    if (e.key === 'Enter') { e.preventDefault(); goSearch(sIdx); }
  });
  sList.addEventListener('click', (e) => { const li = e.target.closest('li[data-i]'); if (li) goSearch(+li.dataset.i); });

  /* ---------- ФОРМА ---------- */
  const form = $('#contactForm'), fPhone = $('#fPhone');
  function fmtPhone(v) {
    let d = v.replace(/\D/g, '');
    if (d[0] === '7' || d[0] === '8') d = d.slice(1);
    d = d.slice(0, 10);
    let o = '+7';
    if (d.length) o += ' (' + d.slice(0, 3);
    if (d.length >= 3) o += ')';
    if (d.length > 3) o += ' ' + d.slice(3, 6);
    if (d.length > 6) o += '-' + d.slice(6, 8);
    if (d.length > 8) o += '-' + d.slice(8, 10);
    return o;
  }
  fPhone.addEventListener('input', (e) => {
    if (e.inputType && e.inputType.startsWith('delete')) return;
    fPhone.value = fmtPhone(fPhone.value);
  });
  function setErr(id, inputEl, msg) {
    $('#' + id).textContent = msg;
    if (inputEl) inputEl.setAttribute('aria-invalid', msg ? 'true' : 'false');
  }
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = $('#fName'), ok = $('#fOk');
    const digits = fPhone.value.replace(/\D/g, '');
    let valid = true;
    setErr('eName', name, name.value.trim().length < 2 ? 'Введите имя' : '');
    setErr('ePhone', fPhone, digits.length !== 11 ? 'Введите номер полностью' : '');
    setErr('eOk', ok, ok.checked ? '' : 'Нужно согласие на обработку данных');
    valid = name.value.trim().length >= 2 && digits.length === 11 && ok.checked;
    const msg = $('#formMsg');
    if (!valid) { msg.textContent = ''; $('[aria-invalid="true"]', form)?.focus(); return; }
    msg.textContent = 'Спасибо! Это демо-форма: данные никуда не отправляются, но в реальном проекте заявка ушла бы в приёмную комиссию.';
    form.reset();
  });

  /* ---------- СТАРТ ---------- */
  $('#year').textContent = new Date().getFullYear();
  renderPrograms();
  renderQuiz();
  renderDocs();
  renderLife();
  renderNews();
  observeReveal();
  runCounters();
})();
