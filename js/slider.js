const wrapper = document.querySelector('.slider__wrapper');
const prevBtn = document.querySelector('.slider__btn.prev');
const nextBtn = document.querySelector('.slider__btn.next');

let isAnimating = false;

// Коэффициенты (доли от wrapper)
const C = {
  stepX: 0.33,
  y: {
    slot0: 0,
    slot1: 0.05,
    slot2: 0,
    outLeft: 0.1,
    outRight: -0.1,
  },
};

// ====== Touch/Swipe ======
let touchStartX = 0, touchStartY = 0;
const slider = document.querySelector('.slider');
slider.addEventListener('touchstart', e => {
  touchStartX = e.changedTouches[0].screenX;
  touchStartY = e.changedTouches[0].screenY;
}, { passive: true });
slider.addEventListener('touchend', e => {
  const diffX = e.changedTouches[0].screenX - touchStartX;
  const diffY = e.changedTouches[0].screenY - touchStartY;
  if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > 50) {
    if (isMobile) {
      diffX < 0 ? moveRightMobile() : moveLeftMobile();
    } else {
      diffX < 0 ? moveRight() : moveLeft();
    }
  }
}, { passive: true });

// ====== Утилиты ======
function getSlides() {
  return Array.from(wrapper.children);
}

function toggleButtons(disable) {
  prevBtn.disabled = disable;
  nextBtn.disabled = disable;
}

function updateWrapperVars() {
  const w = wrapper.offsetWidth;
  const h = wrapper.offsetHeight;
  wrapper.style.setProperty('--wrapper-w', `${w}px`);
  wrapper.style.setProperty('--wrapper-h', `${h}px`);
}

function resetCard(card) {
  card.style.transition = 'none';
  card.style.transform = '';
  card.style.opacity = '';
}

let isMobile = window.innerWidth < 450;

// Видимость
function updateVisibility() {
  const slides = getSlides();
  if (slides.length < 4) return;

  isMobile = window.innerWidth < 450;

  slides.forEach((slide, i) => {
    resetCard(slide);
    let shouldHide;
    if (isMobile) {
      shouldHide = i !== 2;                // только центральный (индекс 2)
    } else {
      shouldHide = i < 1 || i > 3;         // видны индексы 1,2,3
    }
    slide.classList.toggle('hide', shouldHide);

    // Центральный слайд (индекс 2) приподнят
    if (i === 2) {
      slide.style.transition = 'none';
      slide.style.transform = 'translateY(-5%)';
    }
  });
  updateWrapperVars();
}

// ================== ДЕСКТОП ==================
// (Ваши оригинальные moveRight и moveLeft без изменений)
function moveRight() {
  if (isAnimating) return;
  const slides = getSlides();
  if (slides.length < 4) return;

  isAnimating = true;
  toggleButtons(true);
  updateWrapperVars();

  const first  = slides[0];
  const second = slides[1];
  const third  = slides[2];
  const fourth = slides[3];
  const fifth  = slides[4];
  const cards  = [first, second, third, fourth, fifth];

  const moveX = (coeff) => `calc(${coeff} * var(--wrapper-w))`;
  const moveY = (coeff) => `calc(${coeff} * var(--wrapper-h))`;

  cards.forEach(card => {
    resetCard(card);
    card.classList.remove('hide');
  });

  first.style.transform = `translateX(${moveX(C.stepX)}) translateY(${moveY(C.y.outLeft)})`;
  first.style.opacity = '0';
  second.style.transform = `translateX(${moveX(0)}) translateY(${moveY(C.y.slot2)})`;
  second.style.opacity = '1';
  third.style.transform = `translateX(${moveX(0)}) translateY(${moveY(-C.y.slot1)})`;
  third.style.opacity = '1';
  fourth.style.transform = `translateX(${moveX(0)}) translateY(${moveY(0)})`;
  fourth.style.opacity = '1';
  fifth.style.transform = `translateX(${moveX(0)}) translateY(${moveY(C.y.outLeft)})`;
  fifth.style.opacity = '0';

  void wrapper.offsetHeight;

  cards.forEach(card => {
    card.style.transition = 'transform 0.5s ease, opacity 0.5s ease';
  });

  first.style.transform = `translateX(${moveX(-C.stepX * 2)}) translateY(${moveY(C.y.outLeft)})`;
  first.style.opacity = '0';
  second.style.transform = `translateX(${moveX(-C.stepX)}) translateY(${moveY(C.y.outLeft)})`;
  second.style.opacity = '0';
  third.style.transform = `translateX(${moveX(-C.stepX)}) translateY(${moveY(C.y.slot2)})`;
  third.style.opacity = '1';
  fourth.style.transform = `translateX(${moveX(-C.stepX)}) translateY(${moveY(-C.y.slot1)})`;
  fourth.style.opacity = '1';
  fifth.style.transform = `translateX(${moveX(-C.stepX)}) translateY(${moveY(0)})`;
  fifth.style.opacity = '1';

  first.addEventListener('transitionend', function handler() {
    first.removeEventListener('transitionend', handler);
    cards.forEach(resetCard);
    wrapper.appendChild(first);
    updateVisibility();
    isAnimating = false;
    toggleButtons(false);
  });
}

function moveLeft() {
  if (isAnimating) return;
  const slides = getSlides();
  if (slides.length < 4) return;

  isAnimating = true;
  toggleButtons(true);
  updateWrapperVars();

  const last   = slides[slides.length - 1];
  const first  = slides[0];
  const second = slides[1];
  const third  = slides[2];
  const fourth = slides[3];
  const cards  = [first, second, third, fourth];

  const moveX = (coeff) => `calc(${coeff} * var(--wrapper-w))`;
  const moveY = (coeff) => `calc(${coeff} * var(--wrapper-h))`;

  cards.forEach(card => {
    resetCard(card);
    card.classList.remove('hide');
  });

  first.style.transform = `translateX(${moveX(0)}) translateY(${moveY(C.y.outLeft)})`;
  first.style.opacity = '0';
  second.style.transform = `translateX(0) translateY(${moveY(0)})`;
  second.style.opacity = '1';
  third.style.transform = `translateX(${moveX(0)}) translateY(${moveY(-C.y.slot1)})`;
  third.style.opacity = '1';
  fourth.style.transform = `translateX(${moveX(0)}) translateY(${moveY(0)})`;
  fourth.style.opacity = '1';

  void wrapper.offsetHeight;

  cards.forEach(card => {
    card.style.transition = 'transform 0.5s ease, opacity 0.5s ease';
  });

  first.style.transform = `translateX(${moveX(C.stepX)}) translateY(${moveY(-C.y.slot0)})`;
  first.style.opacity = '1';
  second.style.transform = `translateX(${moveX(C.stepX)}) translateY(${moveY(-C.y.slot1)})`;
  second.style.opacity = '1';
  third.style.transform = `translateX(${moveX(C.stepX)}) translateY(${moveY(C.y.slot2)})`;
  third.style.opacity = '1';
  fourth.style.transform = `translateX(${moveX(C.stepX)}) translateY(${moveY(-C.y.outRight)})`;
  fourth.style.opacity = '0';

  fourth.addEventListener('transitionend', function handler() {
    fourth.removeEventListener('transitionend', handler);
    cards.forEach(resetCard);
    wrapper.insertBefore(last, wrapper.firstChild);
    updateVisibility();
    isAnimating = false;
    toggleButtons(false);
  });
}

// ================== МОБИЛЬНЫЕ ВЕРСИИ ==================
function moveRightMobile() {
  if (isAnimating) return;
  const slides = getSlides();
  if (slides.length < 2) return;

  isAnimating = true;
  toggleButtons(true);
  updateWrapperVars();

  const center = slides[2];                // текущий центральный (индекс 2)
  const next = slides[3] || slides[0];     // следующий (если 3 нет, берём первый – для цикличности)
  const moveX = (coeff) => `calc(${coeff} * var(--wrapper-w))`;

  // Сброс и показ только central и next
  [center, next].forEach(card => {
    resetCard(card);
    card.classList.remove('hide');
  });

  // Начальные позиции: central на месте, next справа и невидим
  center.style.transform = `translateX(0) translateY(-5%)`;
  center.style.opacity = '1';
  next.style.transform = `translateX(0) translateY(0)`;
  next.style.opacity = '0';

  void wrapper.offsetHeight;

  // Анимация: central уходит влево, next встаёт в центр
  center.style.transition = 'transform 0.5s ease, opacity 0.5s ease';
  next.style.transition = 'transform 0.5s ease, opacity 0.5s ease';

  center.style.transform = `translateX(${moveX(-C.stepX)}) translateY(5%)`;
  center.style.opacity = '0';
  next.style.transform = `translateX(${moveX(-C.stepX)}) translateY(-5%)`;
  next.style.opacity = '1';

  // После анимации: переносим первый элемент в конец, чтобы сохранить центральный индекс 2
  center.addEventListener('transitionend', function handler() {
    center.removeEventListener('transitionend', handler);
    resetCard(center);
    resetCard(next);
    // Циклический сдвиг DOM: первый элемент (индекс 0) перемещаем в конец
    wrapper.appendChild(slides[0]);
    updateVisibility();
    isAnimating = false;
    toggleButtons(false);
  });
}

function moveLeftMobile() {
  if (isAnimating) return;
  const slides = getSlides();
  if (slides.length < 2) return;

  isAnimating = true;
  toggleButtons(true);
  updateWrapperVars();

  const center = slides[2];                // текущий центральный (индекс 2)
  const prev = slides[1] || slides[slides.length - 1]; // предыдущий (индекс 1 или последний)
  const moveX = (coeff) => `calc(${coeff} * var(--wrapper-w))`;

  [center, prev].forEach(card => {
    resetCard(card);
    card.classList.remove('hide');
  });

  // Начальные позиции: central на месте, prev слева и невидим
  center.style.transform = `translateX(0) translateY(-5%)`;
  center.style.opacity = '1';
  prev.style.transform = `translateX(0) translateY(0)`;
  prev.style.opacity = '0';

  void wrapper.offsetHeight;

  // Анимация: central уходит вправо, prev встаёт в центр
  center.style.transition = 'transform 0.5s ease, opacity 0.5s ease';
  prev.style.transition = 'transform 0.5s ease, opacity 0.5s ease';

  center.style.transform = `translateX(${moveX(C.stepX)}) translateY(5%)`;
  center.style.opacity = '0';
  prev.style.transform = `translateX(${moveX(C.stepX)}) translateY(-5%)`;
  prev.style.opacity = '1';

  // После анимации: переносим последний элемент в начало, чтобы центральным остался индекс 2
  center.addEventListener('transitionend', function handler() {
    center.removeEventListener('transitionend', handler);
    resetCard(center);
    resetCard(prev);
    const lastSlide = slides[slides.length - 1];
    wrapper.insertBefore(lastSlide, wrapper.firstChild);
    updateVisibility();
    isAnimating = false;
    toggleButtons(false);
  });
}

// ====== Подписка на кнопки с учётом мобилки ======
nextBtn.addEventListener('click', () => {
  if (isMobile) moveRightMobile();
  else moveRight();
});
prevBtn.addEventListener('click', () => {
  if (isMobile) moveLeftMobile();
  else moveLeft();
});

// ====== Инициализация ======
updateVisibility();

// ====== Ресайз ======
let resizeTimeout;
window.addEventListener('resize', () => {
  clearTimeout(resizeTimeout);
  resizeTimeout = setTimeout(() => {
    // При смене режима сбрасываем все стили
    const slides = getSlides();
    slides.forEach(card => {
      card.style.transition = 'none';
      card.style.transform = '';
      card.style.opacity = '';
    });
    updateVisibility();
  }, 200);
});