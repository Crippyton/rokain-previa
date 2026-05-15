/* Scrollspy: marca a seção atual no menu lateral */
document.addEventListener('DOMContentLoaded', () => {
  const sections = Array.from(document.querySelectorAll('.docs-section[id]'));
  const links = Array.from(document.querySelectorAll('.sidebar-nav a[href^="#"]'));

  if (sections.length === 0 || links.length === 0) return;

  const header = document.querySelector('header');
  const getHeaderOffset = () => {
    const h = header?.getBoundingClientRect?.().height ?? 0;
    // pequeno respiro para não colar no header
    return Math.round(h + 12);
  };

  const setActive = (id) => {
    links.forEach((l) => {
      const isActive = l.getAttribute('href') === `#${id}`;
      l.classList.toggle('active', isActive);
      if (isActive) l.setAttribute('aria-current', 'true');
      else l.removeAttribute('aria-current');
    });
  };

  // Estado inicial (hash / fallback)
  const initialId = (location.hash || '').replace('#', '');
  if (initialId) setActive(initialId);
  else setActive(sections[0].id);

  const observer = new IntersectionObserver(
    (entries) => {
      const visible = entries.filter((e) => e.isIntersecting);
      if (visible.length === 0) return;

      // Escolhe a seção mais "próxima do topo" entre as visíveis
      visible.sort((a, b) => Math.abs(a.boundingClientRect.top) - Math.abs(b.boundingClientRect.top));
      const topMost = visible[0];
      if (topMost?.target?.id) setActive(topMost.target.id);
    },
    {
      // Compensa o header sticky e privilegia a seção lida no miolo da tela
      rootMargin: '-20% 0px -65% 0px',
      threshold: [0, 0.1, 0.25, 0.5, 1],
    }
  );

  sections.forEach((s) => observer.observe(s));

  // Ao clicar no menu, já marca imediatamente (sem esperar o observer)
  links.forEach((l) => {
    l.addEventListener('click', (e) => {
      const id = (l.getAttribute('href') || '').replace('#', '');
      if (!id) return;

      const target = document.getElementById(id);
      if (!target) {
        setActive(id);
        return;
      }

      // Scroll suave com compensação do header sticky
      e.preventDefault();
      setActive(id);
      const top = window.scrollY + target.getBoundingClientRect().top - getHeaderOffset();
      window.history.replaceState(null, '', `#${id}`);
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });
});