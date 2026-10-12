// Conoce INTEGRA: menú de módulos (celular), módulo activo en el índice y visor de láminas.
(() => {
  const btn = document.querySelector('.menu-btn');
  const toc = document.getElementById('indice');
  const links = [...toc.querySelectorAll('ol a')];

  const setMenu = (open) => {
    toc.classList.toggle('open', open);
    btn.setAttribute('aria-expanded', String(open));
  };
  btn.addEventListener('click', () => setMenu(!toc.classList.contains('open')));
  links.forEach((a) => a.addEventListener('click', () => setMenu(false)));
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && toc.classList.contains('open')) { setMenu(false); btn.focus(); }
  });

  // Módulo activo según la sección visible.
  const byId = new Map(links.map((a) => [a.getAttribute('href').slice(1), a]));
  const io = new IntersectionObserver((entries) => {
    entries.forEach((en) => {
      if (!en.isIntersecting) return;
      links.forEach((a) => a.removeAttribute('aria-current'));
      byId.get(en.target.id)?.setAttribute('aria-current', 'true');
    });
  }, { rootMargin: '-45% 0px -50% 0px' });
  byId.forEach((_, id) => { const s = document.getElementById(id); if (s) io.observe(s); });

  // Visor de la lámina completa.
  const dlg = document.querySelector('dialog.viewer');
  const img = dlg.querySelector('img');
  const zoom = dlg.querySelector('.vzoom');
  let opener = null;
  const setZoom = (on) => {
    dlg.classList.toggle('zoom', on);
    zoom.setAttribute('aria-pressed', String(on));
    zoom.textContent = on ? 'Ajustar' : 'Ampliar';
  };
  // Sin JavaScript, el enlace abre la lámina directamente; con JavaScript se muestra en el visor.
  document.querySelectorAll('.shot a.zoom').forEach((b) => {
    b.addEventListener('click', (e) => {
      e.preventDefault();
      opener = b;
      img.src = b.getAttribute('href');
      img.alt = b.querySelector('img').alt;
      dlg.querySelector('.vtitle').textContent = b.dataset.title;
      setZoom(false);
      dlg.showModal();
    });
  });
  zoom.addEventListener('click', () => setZoom(!dlg.classList.contains('zoom')));
  dlg.querySelector('.vclose').addEventListener('click', () => dlg.close());
  dlg.addEventListener('click', (e) => { if (e.target === dlg.querySelector('.vscroll')) dlg.close(); });
  dlg.addEventListener('close', () => opener?.focus());
})();
