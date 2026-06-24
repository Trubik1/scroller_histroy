# Дворец Румянцевых-Паскевичей · Scrollytelling

Интерактивный сайт в жанре scrollytelling, рассказывающий историю Дворца Румянцевых-Паскевичей в Гомеле через плавную прокрутку и премиальные анимации.

## История

Дворец Румянцевых-Паскевичей — главная достопримечательность Гомеля, памятник архитектуры XVIII–XIX веков. Построен в 1777–1796 годах для фельдмаршала Петра Румянцева-Задунайского, позднее принадлежал фельдмаршалу Ивану Паскевичу-Эриванскому. Сегодня — Гомельский дворцово-парковый ансамбль, один из главных музеев Беларуси.

## Технический стек

- HTML5 (семантическая разметка, ARIA-атрибуты)
- CSS3 (кастомные свойства, Grid, Flexbox, clamp(), mobile-first)
- Vanilla JavaScript (без фреймворков)
- GSAP 3 + ScrollTrigger — анимации и scroll-триггеры
- Lenis — плавный скролл (десктоп)
- Leaflet — интерактивная карта
- Web Audio API — аудио-эмбиент с кроссфейдом

## Структура проекта

```
palace-scrollytelling/
├── index.html                 # Главная страница (все 9 секций)
├── vercel.json                # Конфигурация деплоя
├── css/
│   ├── main.css               # Дизайн-система, адаптив
│   └── animations.css         # GSAP-хуки, keyframes
├── js/
│   ├── main.js                # Инициализация, Lenis, GSAP, модули
│   ├── animations.js          # ScrollTrigger анимации для 9 секций
│   ├── audio.js               # AudioManager (Web Audio API)
│   └── slider.js              # ComparisonSlider (vanilla JS)
├── assets/
│   ├── images/                # Изображения (WebP + placeholder SVG)
│   ├── audio/                 # MP3 треки (3 шт.)
│   └── fonts/                 # WOFF2 шрифты
└── README.md
```

## 9 разделов сайта

1. **Hero** — вступление, архивное фото дворца на весь экран
2. **Эпоха основания** — история строительства (1777–1796)
3. **Портрет героя** — Пётр Румянцев-Задунайский
4. **Драматический поворот** — эпоха Паскевича (1834)
5. **Интерактив «Было/Стало»** — слайдер архив vs современность
6. **Таймлайн** — хронология событий
7. **Голоса прошлого** — цитаты свидетелей эпохи
8. **Дворец сегодня** — информация для посетителей, карта
9. **Финал** — завершение, источники

## Как запустить локально

### Вариант 1: Просто открыть файл

Откройте `index.html` в браузере.

### Вариант 2: Локальный сервер (рекомендуется)

```bash
npx serve palace-scrollytelling
```

или

```bash
cd palace-scrollytelling
python -m http.server 8000
```

Откройте `http://localhost:8000` в браузере.

## Деплой на Vercel

### Автоматический (GitHub + Vercel)

1. Создайте репозиторий на GitHub
2. Запушьте проект
3. Импортируйте репозиторий в Vercel
4. Настройки не требуются — `vercel.json` уже в корне

### CI/CD через GitHub Actions

Проект настроен на автоматический деплой через GitHub Actions (`.github/workflows/deploy.yml`).

**Настройка:**

1. Подключите Vercel к GitHub:
   - Перейдите на [vercel.com/new](https://vercel.com/new)
   - Импортируйте репозиторий
   - Vercel автоматически создаст проект

2. Добавьте секреты в GitHub (Settings → Secrets → Actions):
   ```
   VERCEL_ORG_ID        → из vercel.json или Vercel Dashboard → Settings
   VERCEL_PROJECT_ID    → из Vercel Dashboard → Project Settings
   VERCEL_TOKEN         → из Vercel Dashboard → Settings → Tokens
   ```

3. Push в `main` → автоматический production deploy
4. Pull Request → автоматический preview deploy

### Через CLI

```bash
npm i -g vercel
cd palace-scrollytelling
vercel --prod
```

## Изображения

Для замены placeholder-изображений на реальные:
1. Загрузите изображения в формате WebP в соответствующие папки `assets/images/*/`
2. Обновите пути в `index.html` (атрибуты `srcset` / `src`)

Рекомендуемые источники:
- [Wikimedia Commons](https://commons.wikimedia.org/wiki/Category:Palace_of_Paskievi%C4%8Ds,_Gomel)
- [Гомельский дворцово-парковый ансамбль](https://palacegomel.museum.by)

## Аудио

Для включения фоновой музыки поместите 3 MP3 файла в `assets/audio/`:
- `ambient-1.mp3` — эпоха Екатерины II (секции 1–3)
- `ambient-2.mp3` — драматическая эпоха (секции 4–5)
- `ambient-3.mp3` — современная неоклассика (секции 6–9)

Источники: [Musopen.org](https://musopen.org), [Internet Archive](https://archive.org)

## Источники исторических данных

- Гомельский областной краеведческий музей
- Национальный архив Республики Беларусь ([archives.gov.by](https://archives.gov.by))
- «Дворцово-парковый ансамбль в Гомеле» (монография, 2010)
- Wikipedia: [Gomel Palace](https://en.wikipedia.org/wiki/Gomel_Palace),
  [Pyotr Rumyantsev](https://en.wikipedia.org/wiki/Pyotr_Rumyantsev),
  [Ivan Paskevich](https://en.wikipedia.org/wiki/Ivan_Paskevich)

## Производительность

- WebP + lazy loading для изображений
- Defer для JS-скриптов
- Critical CSS inline в `<head>`
- Кэширование через Vercel headers
- prefers-reduced-motion: full respect

## Доступность

- ARIA-атрибуты на всех интерактивных элементах
- Полная клавиатурная навигация
- Контрастность текста ≥ 4.5:1
- `prefers-reduced-motion` — отключает анимации

## Лицензия

Проект создан для конкурса «Эхо времени». Все исторические изображения — Public Domain / CC BY-SA.
