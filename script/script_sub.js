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