/* =========================
   HERO SLIDER (tabs + progress + auto + infinite)
========================= */
let autoSlideTimer = null;
const HERO_DELAY = 2000;

document.addEventListener('DOMContentLoaded', () => {
  const track = document.querySelector('.track');
  const prevBtn = document.querySelector('.arrow.prev');
  const nextBtn = document.querySelector('.arrow.next');

  if (!track) return;

  const getSlides = () => Array.from(track.querySelectorAll('.slide'));
  let slides = getSlides();
  if (slides.length === 0) return;

  const total = () => getSlides().length; // clone 포함 총 개수

  let index = 1;      // 첫 진짜
  let isMoving = false;

  function getRealIndex(idx, tot) {
    const realCount = tot - 2;
    if (idx === 0) return realCount;
    if (idx === tot - 1) return 1;
    return idx; // 1..realCount
  }

  function updateTabs() {
    slides = getSlides();
    const tot = slides.length;
    const real = getRealIndex(index, tot);
    const activeTabIdx = real - 1;

    slides.forEach(slide => {
      const tabs = slide.querySelectorAll('.heroTabs li');
      if (!tabs.length) return;
      tabs.forEach((li, i) => li.classList.toggle('active', i === activeTabIdx));
    });
  }

  function restartProgress(onComplete) {
    if (autoSlideTimer) {
      clearTimeout(autoSlideTimer);
      autoSlideTimer = null;
    }

    slides = getSlides();
    slides.forEach(slide => {
      const active = slide.querySelector('.heroTabs li.active');
      if (!active) return;
      active.classList.remove('progress');
      void active.offsetWidth;
      active.classList.add('progress');
    });

    autoSlideTimer = setTimeout(() => {
      if (typeof onComplete === 'function') onComplete();
    }, HERO_DELAY);
  }

  function move() {
    isMoving = true;
    track.style.transition = 'transform 0.6s ease';
    track.style.transform = `translateX(-${index * 100}%)`;
  }

  function goNext() {
    if (isMoving) return;
    index++;
    move();
  }

  function goPrev() {
    if (isMoving) return;
    index--;
    move();
  }

  // 초기 위치
  track.style.transition = 'none';
  track.style.transform = `translateX(-${index * 100}%)`;

  // 시작
  updateTabs();
  restartProgress(goNext);

  if (nextBtn) nextBtn.addEventListener('click', () => {
    goNext();
    restartProgress(goNext);
  });

  if (prevBtn) prevBtn.addEventListener('click', () => {
    goPrev();
    restartProgress(goNext);
  });

  track.addEventListener('transitionend', (e) => {
    if (e.propertyName !== 'transform') return;

    slides = getSlides();
    const tot = slides.length;

    // clone이면 순간이동
    if (slides[index] && slides[index].classList.contains('clone')) {
      track.style.transition = 'none';
      if (index === tot - 1) index = 1;
      if (index === 0) index = tot - 2;
      track.style.transform = `translateX(-${index * 100}%)`;
    }

    updateTabs();
    restartProgress(goNext);
    isMoving = false;
  });
});


document.addEventListener('DOMContentLoaded', () => {
  const track = document.querySelector('.track');
  const slides = document.querySelectorAll('.track .slide');

  // ✅ 달력 prev/next랑 절대 섞이지 않게 "arrow"로만 잡기
  const prevBtn = document.querySelector('.arrow.prev');
  const nextBtn = document.querySelector('.arrow.next');

  if (!track || slides.length === 0) return;

  const total = slides.length; // 5 (clone 포함)
  let index = 1;
  let isMoving = false;

  const move = () => {
    isMoving = true;
    track.style.transition = 'transform 0.6s ease';
    track.style.transform = `translateX(-${index * 100}%)`;
  };

  const goNext = () => {
    if (isMoving) return;
    index++;
    move();
  };

  const goPrev = () => {
    if (isMoving) return;
    index--;
    move();
  };

  // 초기 위치
  track.style.transition = 'none';
  track.style.transform = `translateX(-${index * 100}%)`;

  // 초기 탭/진행바 시작
  updateTabsByIndex(slides, index);
  restartActiveProgress(slides, goNext);

  // 버튼 이벤트 (null 방지)
  if (nextBtn) nextBtn.addEventListener('click', goNext);
  if (prevBtn) prevBtn.addEventListener('click', goPrev);

  track.addEventListener('transitionend', (e) => {
    if (e.propertyName !== 'transform') return;

    // 클론 도착 시 순간이동
    if (slides[index] && slides[index].classList.contains('clone')) {
      track.style.transition = 'none';

      if (index === total - 1) index = 1;
      if (index === 0) index = total - 2;

      track.style.transform = `translateX(-${index * 100}%)`;
    }

    updateTabsByIndex(slides, index);
    restartActiveProgress(slides, goNext);

    isMoving = false;
  });
});


/* =========================
CURRENT EXHIBITIONS (poster loop)
========================= */

document.addEventListener('DOMContentLoaded', () => {

  function initCurrentPoster() {
    const posters = Array.from(document.querySelectorAll('.current .package .poster'));
    const packageEl = document.querySelector('.current .package');

    // ✅ 처음 로딩에서 아직 DOM이 덜 잡히면 초기화 보류
    if (posters.length !== 5 || !packageEl) return false;

    // 5장 포지션
    const pos = [
      { x: -470, y: 200, s: 0.86, o: 0.65, z: 1, r: -22 },
      { x: -250, y: 100, s: 0.93, o: 0.80, z: 2, r: -12 },
      { x: 0,    y: 0,   s: 1.00, o: 1.00, z: 5, r: 0 },
      { x: 250,  y: 100, s: 0.93, o: 0.80, z: 2, r: 12 },
      { x: 470,  y: 200, s: 0.86, o: 0.65, z: 1, r: 22 }
    ];

    let state = posters.slice();
    let lock = false;

    function setHoverOK(on) {
      posters.forEach(el => el.classList.toggle('hoverOK', on));
    }

    function render() {
      state.forEach((el, i) => {
        const p = pos[i];
        el.classList.toggle('is-center', i === 2);
        el.style.zIndex = p.z;
        el.style.setProperty('--tx', `${p.x}px`);
        el.style.setProperty('--ty', `${p.y}px`);
        el.style.setProperty('--sc', p.s);
        el.style.setProperty('--op', p.o);
        el.style.setProperty('--rz', `${p.r}deg`);
      });
    }

    function nextOne() {
      if (lock) return;
      lock = true;

      setHoverOK(false);
      packageEl.classList.add('moving');

      state.push(state.shift());
      render();

      setTimeout(() => {
        lock = false;
        packageEl.classList.remove('moving');
        setHoverOK(true);
      }, 560);
    }

    function prevOne() {
      if (lock) return;
      lock = true;

      setHoverOK(false);
      packageEl.classList.add('moving');

      state.unshift(state.pop());
      render();

      setTimeout(() => {
        lock = false;
        packageEl.classList.remove('moving');
        setHoverOK(true);
      }, 560);
    }

    // ✅ 자동 슬라이드
    let posterAutoTimer = null;

    function startAutoPoster() {
      stopAutoPoster();
      posterAutoTimer = setInterval(nextOne, 1500);
    }

    function stopAutoPoster() {
      if (!posterAutoTimer) return;
      clearInterval(posterAutoTimer);
      posterAutoTimer = null;
    }

    // ✅ 클릭 동작
    posters.forEach((el) => {
      el.addEventListener('click', (e) => {
        stopAutoPoster();

        const idx = state.indexOf(el);
        if (idx === -1) return;

        if (idx === 2) {
          // 가운데는 링크 이동 허용
          // (링크면 그냥 넘어가고, 자동만 재시작)
          startAutoPoster();
          return;
        }

        e.preventDefault();
        if (idx < 2) prevOne();
        else nextOne();

        startAutoPoster();
      });
    });

    // ✅ hover 시 멈춤
    packageEl.addEventListener('mouseenter', stopAutoPoster);
    packageEl.addEventListener('mouseleave', startAutoPoster);

    // ✅ 최초 실행 (중요: 자동 시작을 살짝 늦춰서 로딩 직후 hover/레이아웃 이슈 방지)
    render();
    setHoverOK(true);
    setTimeout(startAutoPoster, 200);

    return true;
  }

  // ✅ 첫 로딩에서 못 잡으면 재시도(최대 3초)
  if (initCurrentPoster()) return;

  let tries = 0;
  const retry = setInterval(() => {
    tries++;
    if (initCurrentPoster() || tries >= 30) clearInterval(retry);
  }, 100);
});


/* =========================
   CALENDAR (closed/mark + month nav)
========================= */
document.addEventListener("DOMContentLoaded", () => {
  const calendar = document.querySelector(".calendar");
  if (!calendar) return;

  const yearEl = calendar.querySelector(".cal-title .y");
  const monthEl = calendar.querySelector(".cal-title .m");
  const tbody = calendar.querySelector(".cal-body");
  const prevBtn = calendar.querySelector(".cal-btn.prev");
  const nextBtn = calendar.querySelector(".cal-btn.next");

  const holidays = {
    "2025-12-25": "성탄절",
    "2026-01-01": "신정"
  };

  function makeKey(y, m, d) {
    return `${y}-${String(m).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
  }

  function isFirstOrThirdFriday(y, m, d) {
    const date = new Date(y, m - 1, d);
    if (date.getDay() !== 5) return false;
    const nth = Math.floor((d - 1) / 7) + 1;
    return nth === 1 || nth === 3;
  }

  let viewDate = new Date();
  let viewYear = viewDate.getFullYear();
  let viewMonth = viewDate.getMonth();

  function renderCalendar() {
    yearEl.textContent = viewYear;
    monthEl.textContent = viewMonth + 1;

    tbody.innerHTML = "";

    const firstDay = new Date(viewYear, viewMonth, 1).getDay();
    const lastDate = new Date(viewYear, viewMonth + 1, 0).getDate();

    let day = 1;

    for (let row = 0; row < 6; row++) {
      const tr = document.createElement("tr");

      for (let col = 0; col < 7; col++) {
        const td = document.createElement("td");

        if ((row === 0 && col < firstDay) || day > lastDate) {
          td.className = "empty";
          td.textContent = "0";
          tr.appendChild(td);
          continue;
        }

        const y = viewYear;
        const m = viewMonth + 1;
        const dow = new Date(y, m - 1, day).getDay(); // 0=일, 1=월
        const key = makeKey(y, m, day);

        // 기본 숫자
        td.textContent = day;

        // 월요일 휴관 (빨강)
        if (dow === 1) {
          td.classList.add("closed");
          td.innerHTML = `${day}<small>휴관</small>`;
        }

        // 1·3번째 금요일 무료개방 (굵게+밑줄)
        if (isFirstOrThirdFriday(y, m, day)) {
          td.classList.add("mark");
          td.innerHTML = `${day}<small>무료개방</small>`;
        }

        // 공휴일 (굵게+밑줄, 색은 바꾸지 않음)
        if (holidays[key]) {
          td.classList.add("mark");
          td.innerHTML = `${day}<small>${holidays[key]}</small>`;
        }

        tr.appendChild(td);
        day++;
      }

      tbody.appendChild(tr);
      if (day > lastDate) break;
    }
  }

  function moveMonth(diff) {
    viewMonth += diff;

    if (viewMonth < 0) {
      viewMonth = 11;
      viewYear--;
    }
    if (viewMonth > 11) {
      viewMonth = 0;
      viewYear++;
    }

    renderCalendar();
  }

  if (prevBtn) prevBtn.addEventListener("click", () => moveMonth(-1));
  if (nextBtn) nextBtn.addEventListener("click", () => moveMonth(1));

  renderCalendar();
});


document.addEventListener('DOMContentLoaded', () => {
  const root = document.querySelector('.moments');
  if (!root) return;

  const slider = root.querySelector('.moments-slider');
  const track  = root.querySelector('.moments-slider .slides');
  const prev   = root.querySelector('.nav .prev');
  const next   = root.querySelector('.nav .next');
  const currentEl = root.querySelector('#current');

  if (!track) return;

  let slides = Array.from(track.children);
  if (slides.length === 0) return;

  const GAP = 40;      // ✅ 사진 사이 간격(px)
  const IMG_W = 1000;  // ✅ 한 장 너비
  const W = IMG_W + GAP;

  const realCount = slides.length;

  /* ===== clone ===== */
  const firstClone = slides[0].cloneNode(true);
  const lastClone  = slides[realCount - 1].cloneNode(true);

  track.appendChild(firstClone);
  track.insertBefore(lastClone, slides[0]);

  slides = Array.from(track.children); // clone 포함 전체

  let index = 1;     // ✅ 첫 "진짜" 슬라이드
  let lock = false;

  // ✅ 트랙 폭 확정
  track.style.width = `${slides.length * W}px`;

  // ✅ 초기 위치
  track.style.transition = 'none';
  track.style.transform = `translateX(-${index * W}px)`;

  const pad2 = n => String(n).padStart(2, '0');

  function updateCount() {
    if (!currentEl) return;
    let real = index;

    if (index === 0) real = realCount;
    if (index === realCount + 1) real = 1;

    currentEl.textContent = pad2(real);
  }

  function move(animate = true) {
    track.style.transition = animate ? 'transform .55s ease' : 'none';
    track.style.transform = `translateX(-${index * W}px)`;
    updateCount();
  }

  function goNext() {
    if (lock) return;
    lock = true;
    index++;
    move(true);
  }

  function goPrev() {
    if (lock) return;
    lock = true;
    index--;
    move(true);
  }

  // ✅ 버튼 이벤트
  if (next) next.addEventListener('click', (e) => {
    e.preventDefault();
    stopAuto();
    goNext();
    startAuto();
  });

  if (prev) prev.addEventListener('click', (e) => {
    e.preventDefault();
    stopAuto();
    goPrev();
    startAuto();
  });

  // ✅ 끝/처음에서 순간이동(무한)
  track.addEventListener('transitionend', (e) => {
    if (e.propertyName !== 'transform') return;

    // 마지막 클론(맨 끝)에 도착했으면 -> 첫 진짜로 순간이동
    if (index === slides.length - 1) {
      index = 1;
      move(false);
    }

    // 첫 클론(맨 앞)에 도착했으면 -> 마지막 진짜로 순간이동
    if (index === 0) {
      index = realCount;
      move(false);
    }

    lock = false;
  });

  /* ===== auto ===== */
  let autoTimer = null;

  function startAuto() {
    stopAuto();
    autoTimer = setInterval(() => {
      goNext();
    }, 2000);
  }

  function stopAuto() {
    if (!autoTimer) return;
    clearInterval(autoTimer);
    autoTimer = null;
  }

  // ✅ hover 시 멈춤(원하면)
  if (slider) {
    slider.addEventListener('mouseenter', stopAuto);
    slider.addEventListener('mouseleave', startAuto);
  }

  updateCount();
  startAuto();
});


document.addEventListener('DOMContentLoaded', () => {
  const quick = document.querySelector('.quickMenu');
  if(!quick) return;

  const topBtn = quick.querySelector('.qbtn.top');

  // 스크롤 내려가면 top 버튼 노출
  const toggleTop = () => {
    if (window.scrollY > 400) quick.classList.add('showTop');
    else quick.classList.remove('showTop');
  };
  toggleTop();
  window.addEventListener('scroll', toggleTop);

  // 맨 위로
  topBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  // 나머지 버튼(원하는 동작 연결)
  const [chatBtn, gridBtn] = quick.querySelectorAll('.qbtn:not(.top)');

  chatBtn.addEventListener('click', () => {
    // 예: 상담/문의 섹션으로 스크롤
    // document.querySelector('#contact')?.scrollIntoView({behavior:'smooth'});
    console.log('chat click');
  });

  gridBtn.addEventListener('click', () => {
    // 예: 사이트맵/메뉴 열기
    console.log('grid click');
  });
});


document.addEventListener('DOMContentLoaded', () => {
  const btnMenu = document.getElementById('btnMenu');
  const sideMenu = document.getElementById('sideMenu');
  const overlay = document.getElementById('menuOverlay');
  const btnClose = document.getElementById('btnClose');

  if (!btnMenu || !sideMenu || !overlay || !btnClose) return;

  // 스크롤 위치 고정용
  let scrollY = 0;

  const openMenu = () => {
    scrollY = window.scrollY;

    document.body.classList.add('menuOpen');
    btnMenu.setAttribute('aria-expanded', 'true');
    sideMenu.setAttribute('aria-hidden', 'false');

    // ✅ 스크롤 잠금 (점프 방지 포함)
    document.body.style.position = 'fixed';
    document.body.style.top = `-${scrollY}px`;
    document.body.style.left = '0';
    document.body.style.right = '0';
    document.body.style.width = '100%';
  };

  const closeMenu = () => {
    document.body.classList.remove('menuOpen');
    btnMenu.setAttribute('aria-expanded', 'false');
    sideMenu.setAttribute('aria-hidden', 'true');

    // ✅ 스크롤 잠금 해제 + 원래 위치 복구
    document.body.style.position = '';
    document.body.style.top = '';
    document.body.style.left = '';
    document.body.style.right = '';
    document.body.style.width = '';

    window.scrollTo(0, scrollY);
  };

  btnMenu.addEventListener('click', () => {
    const isOpen = document.body.classList.contains('menuOpen');
    isOpen ? closeMenu() : openMenu();
  });

  btnClose.addEventListener('click', closeMenu);
  overlay.addEventListener('click', closeMenu);

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeMenu();
  });
});

