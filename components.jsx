// Componentes compartilhados: Header, Footer, ProductCard, CartDrawer, Toast, Icons.

const { useState, useEffect, useMemo, useRef } = React;

// ── Icons ─────────────────────────────────────────────────────────────────
function Icon({ name, size = 18, stroke = 1.6 }) {
  const paths = {
    bag:      <><path d="M5 7h14l-1.2 12.2a2 2 0 0 1-2 1.8H8.2a2 2 0 0 1-2-1.8L5 7Z"/><path d="M9 7V5a3 3 0 0 1 6 0v2"/></>,
    heart:    <path d="M12 20s-7-4.6-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.4-7 10-7 10Z"/>,
    search:   <><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></>,
    menu:     <><path d="M4 7h16"/><path d="M4 12h16"/><path d="M4 17h16"/></>,
    user:     <><circle cx="12" cy="8" r="4"/><path d="M4 20c1.5-4 5-6 8-6s6.5 2 8 6"/></>,
    arrow:    <><path d="M5 12h14"/><path d="m13 5 7 7-7 7"/></>,
    arrowLeft:<><path d="M19 12H5"/><path d="m11 19-7-7 7-7"/></>,
    chevronLeft: <path d="m15 4-8 8 8 8"/>,
    chevronRight:<path d="m9 4 8 8-8 8"/>,
    close:    <><path d="m6 6 12 12"/><path d="m18 6-12 12"/></>,
    plus:     <><path d="M12 5v14"/><path d="M5 12h14"/></>,
    minus:    <path d="M5 12h14"/>,
    star:     <path d="M12 3.5l2.7 5.5 6 .8-4.4 4.2 1.1 6L12 17.3l-5.4 2.8 1.1-6L3.3 9.8l6-.8L12 3.5Z"/>,
    check:    <path d="m5 12 4 4 10-10"/>,
    whats:    <path d="M17.6 6.4A8 8 0 0 0 4.2 16l-1 4 4.1-1A8 8 0 1 0 17.6 6.4Zm-1.4 11.7c-.4 1.1-2 2-3 2.1-.7.1-1.7.2-5.2-1.2-3-1.3-5-4.4-5.2-4.6-.1-.2-1.2-1.6-1.2-3.1s.8-2.2 1.1-2.5c.3-.3.6-.3.8-.3h.6c.2 0 .5 0 .7.5l1 2.4c.1.2.2.4 0 .6l-.3.4c-.2.2-.3.3-.4.5-.1.2-.3.4-.1.7.2.3 1 1.6 2.1 2.5 1.4 1.2 2.5 1.6 2.9 1.7.2.1.5.1.7-.1.2-.2.7-.8 1-1.1.2-.3.5-.2.7-.1l2.3 1.1c.4.2.6.3.7.4.2.3 0 1.1-.2 2Z"/>,
    instagram:<><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="0.5" fill="currentColor"/></>,
    gift:     <><rect x="3" y="8" width="18" height="13" rx="1"/><path d="M3 12h18"/><path d="M12 8v13"/><path d="M7.5 8a2.5 2.5 0 1 1 0-5C9 3 11 5 12 8 13 5 15 3 16.5 3a2.5 2.5 0 1 1 0 5"/></>,
    sparkle:  <path d="M12 3v6m0 6v6m-9-9h6m6 0h6M5.6 5.6l4.2 4.2m4.4 4.4 4.2 4.2M5.6 18.4l4.2-4.2m4.4-4.4 4.2-4.2"/>,
    pin:      <><path d="M12 22s7-7 7-12a7 7 0 0 0-14 0c0 5 7 12 7 12Z"/><circle cx="12" cy="10" r="2.5"/></>,
    truck:    <><path d="M3 6h11v10H3z"/><path d="M14 9h4l3 3v4h-7"/><circle cx="7" cy="18" r="2"/><circle cx="17" cy="18" r="2"/></>,
    shield:   <><path d="M12 3 4 6v6c0 5 3.5 8 8 9 4.5-1 8-4 8-9V6l-8-3Z"/><path d="m9 12 2 2 4-4"/></>,
  };
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth={stroke} strokeLinecap="round" strokeLinejoin="round">
      {paths[name] || null}
    </svg>
  );
}

// ── Texto que "rola" no hover do botão (referência: bennos-light.org) ─────
// Cada palavra sai para baixo e a cópia entra por cima, com 0.05s de atraso
// entre palavras. A cópia é só visual (aria-hidden).
function RollText({ children }) {
  const words = String(children).trim().split(/\s+/);
  return (
    <span className="roll">
      {words.map((w, i) => (
        <React.Fragment key={i}>
          {i > 0 && ' '}
          <span className="roll-w" style={{ '--w': i }}>
            <span className="roll-a">{w}</span>
            <span className="roll-b" aria-hidden="true">{w}</span>
          </span>
        </React.Fragment>
      ))}
    </span>
  );
}

// ── Header ────────────────────────────────────────────────────────────────
function Header({ nav, route, onNavigate, cartCount, onOpenCart }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [subMenu, setSubMenu] = useState(null);   // categoria aberta no 2º nível do menu mobile

  // ao fechar o menu, volta para o 1º nível depois que o painel saiu da tela
  useEffect(() => {
    if (menuOpen) return;
    const t = setTimeout(() => setSubMenu(null), 300);
    return () => clearTimeout(t);
  }, [menuOpen]);

  // Esc fecha
  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (e) => { if (e.key === 'Escape') setMenuOpen(false); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [menuOpen]);

  function go(target) {
    onNavigate(target);
    setMenuOpen(false);
  }

  return (
    <>
      <header className="site-header">
        {/* Top marquee bar */}
        <div style={{
          background: 'var(--text)', color: 'var(--bg)',
          fontSize: 11, fontWeight: 500, letterSpacing: '0.15em', textTransform: 'uppercase',
          padding: '7px 0', overflow: 'hidden',
        }}>
          <div className="marquee">
            {[0,1].map(k => (
              <React.Fragment key={k}>
                <span>✦ Frete grátis em Teresina acima de R$ 199</span>
                <span>✦ Embalagem presenteável inclusa</span>
                <span>✦ Atendimento pelo WhatsApp</span>
                <span>✦ Aceitamos cartão e Pix</span>
                <span>✦ Showroom em N.S.R</span>
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* Barra flutuante (referência: Simple Organic) */}
        <div className="nav-float-outer">
          <div className="nav-float">
            <button className="icon-btn show-mobile" onClick={() => setMenuOpen(true)} aria-label="Abrir menu">
              <Icon name="menu" />
            </button>

            <a href="#" className="nav-float-logo" onClick={(e) => { e.preventDefault(); go({ view: 'home' }); }}>
              <LogoWordmark height={34} />
            </a>

            <nav className="nav-float-main hide-mobile" aria-label="Principal">
              <ul>
                {nav.map(n => {
                  const items = n.target.view === 'category' ? productsByCat(n.target.cat) : [];
                  return (
                    <li key={n.id} className={`nav-item${route?.matches?.(n) ? ' is-active' : ''}`}>
                      <a href="#" className="nav-link"
                        aria-haspopup={items.length ? 'true' : undefined}
                        onClick={(e) => { e.preventDefault(); e.currentTarget.blur(); go(n.target); }}>
                        {n.label}
                        <span className="nav-link-line" aria-hidden="true" />
                      </a>
                      {items.length > 0 && (
                        <div className="nav-dropdown">
                          <ul>
                            {items.map(p => (
                              <li key={p.id}>
                                <a href="#" onClick={(e) => { e.preventDefault(); e.currentTarget.blur(); go({ view: 'product', id: p.id }); }}>
                                  {p.name}
                                </a>
                              </li>
                            ))}
                            <li className="nav-dropdown-all">
                              <a href="#" onClick={(e) => { e.preventDefault(); e.currentTarget.blur(); go(n.target); }}>
                                Ver todos <Icon name="chevronRight" size={10} stroke={1.6} />
                              </a>
                            </li>
                          </ul>
                        </div>
                      )}
                    </li>
                  );
                })}
              </ul>
            </nav>

            <div className="nav-float-actions">
              <a href="#" className="nav-pill hide-mobile"
                onClick={(e) => { e.preventDefault(); go({ view: 'product', id: 'k-03' }); }}>
                Monte seu kit
              </a>
              <a className="nav-account hide-mobile" href="https://wa.me/5586988333593" target="_blank" rel="noreferrer">
                <Icon name="whats" size={24} stroke={1.4} />
                <span>
                  <strong>Fale com a gente</strong>
                  <small>Resposta em minutos!</small>
                </span>
              </a>
              <button className="icon-btn" onClick={onOpenCart} aria-label="Sacola">
                <Icon name="bag" />
                {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Menu mobile (referência: menu lateral da Cartier) — painel entra pela
          esquerda, os links chegam 0.2s depois; categorias abrem um 2º nível
          que entra pela direita. Fica sempre montado para animar a saída. */}
      <div className={`mobile-nav${menuOpen ? ' is-open' : ''}`}
        role="dialog" aria-modal="true" aria-label="Menu de navegação"
        aria-hidden={!menuOpen} inert={menuOpen ? undefined : ''}>
        <div className="mobile-nav-top">
          <LogoWordmark height={28} />
          <button className="icon-btn" onClick={() => setMenuOpen(false)} aria-label="Fechar menu">
            <Icon name="close" />
          </button>
        </div>

        <div className="mobile-nav-body">
          <nav className="mobile-nav-links" aria-label="Menu">
            {nav.map(n => {
              const hasSub = n.target.view === 'category' && productsByCat(n.target.cat).length > 0;
              return hasSub ? (
                <button key={n.id} type="button"
                  className={`mobile-nav-link${route?.matches?.(n) ? ' active' : ''}`}
                  aria-expanded={subMenu === n.id}
                  onClick={() => setSubMenu(n.id)}>
                  {n.label} <Icon name="chevronRight" size={14} stroke={1.4} />
                </button>
              ) : (
                <a key={n.id} href="#"
                  className={`mobile-nav-link${route?.matches?.(n) ? ' active' : ''}`}
                  onClick={(e) => { e.preventDefault(); go(n.target); }}>
                  {n.label}
                </a>
              );
            })}
          </nav>

          {nav.filter(n => n.target.view === 'category').map(n => (
            <div key={n.id}
              className={`mobile-nav-sub${subMenu === n.id ? ' is-active' : ''}`}
              aria-hidden={subMenu !== n.id} inert={subMenu === n.id ? undefined : ''}>
              <button type="button" className="mobile-nav-back" onClick={() => setSubMenu(null)}>
                <Icon name="chevronLeft" size={14} stroke={1.4} /> {n.label}
              </button>
              {productsByCat(n.target.cat).map(p => (
                <a key={p.id} href="#" className="mobile-nav-sublink"
                  onClick={(e) => { e.preventDefault(); go({ view: 'product', id: p.id }); }}>
                  {p.name}
                </a>
              ))}
              <a href="#" className="mobile-nav-sublink mobile-nav-sublink--all"
                onClick={(e) => { e.preventDefault(); go(n.target); }}>
                Ver todos <Icon name="chevronRight" size={12} stroke={1.6} />
              </a>
            </div>
          ))}
        </div>

        <div className="mobile-nav-bottom">
          <a className="btn btn-whats btn-lg"
            style={{ width: '100%', justifyContent: 'center' }}
            href="https://wa.me/5586988333593"
            target="_blank" rel="noreferrer">
            <Icon name="whats" /> Chamar no WhatsApp
          </a>
        </div>
      </div>
    </>
  );
}

// ── Footer ────────────────────────────────────────────────────────────────
function Footer({ onNavigate }) {
  return (
    <footer style={{ background: 'var(--bg-2)', borderTop: '1px solid var(--line)', marginTop: 80 }}>
      <div className="container" style={{ padding: '64px 0 28px' }}>
        <div className="footer-grid" style={{
          display: 'grid', gap: 48,
          gridTemplateColumns: 'minmax(0, 1.4fr) repeat(3, minmax(0, 1fr))',
        }}>
          <div>
            <LogoWordmark height={30} />
            <p className="t-italic" style={{
              fontSize: 22, lineHeight: 1.35, marginTop: 24, marginBottom: 24,
              color: 'var(--text-2)', maxWidth: 320,
            }}>
              Acessórios e kits presenteáveis pensados pra mulheres que merecem se sentir especiais todos os dias.
            </p>
            <a className="btn btn-whats" href="https://wa.me/5586988333593" target="_blank" rel="noreferrer">
              <Icon name="whats" /> Chamar no WhatsApp
            </a>
          </div>

          <FooterCol title="Loja" items={[
            { label: 'Joias',             target: { view: 'category', cat: 'joias' } },
            { label: 'Perfumes',          target: { view: 'category', cat: 'perfumes' } },
            { label: 'Bolsas',            target: { view: 'category', cat: 'bolsas' } },
            { label: 'Kits presenteáveis',target: { view: 'category', cat: 'kits' } },
          ]} onNavigate={onNavigate} />

          <FooterCol title="Atendimento" items={[
            { label: 'Como comprar',          target: { view: 'about' } },
            { label: 'Formas de pagamento',   target: { view: 'about' } },
            { label: 'Showroom',              target: { view: 'about' } },
          ]} onNavigate={onNavigate} />

          <div>
            <h4 style={colTitle}>Contato</h4>
            <ul style={listReset}>
              <li style={liStyle}><Icon name="pin" size={14} />&nbsp; Teresina · N.S.R</li>
              <li style={liStyle}><Icon name="whats" size={14} />&nbsp; (86) 9 8833-3593</li>
              <li style={liStyle}><Icon name="instagram" size={14} />&nbsp; @tnacessorios2</li>
            </ul>
          </div>
        </div>

        <hr className="divider" style={{ margin: '40px 0 20px' }} />
        <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16, fontSize: 12, color: 'var(--text-2)' }}>
          <span>© 2026 TN Acessórios · Teresina, PI</span>
          <span className="t-italic" style={{ fontSize: 15 }}>Feito com cuidado para presentear.</span>
        </div>
      </div>
    </footer>
  );
}

const colTitle = { fontSize: 11, letterSpacing: '0.15em', textTransform: 'uppercase', fontWeight: 500, marginBottom: 18, color: 'var(--text)' };
const listReset = { listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 10 };
const liStyle = { fontSize: 14, fontWeight: 300, color: 'var(--text-2)', display: 'flex', alignItems: 'center' };

function FooterCol({ title, items, onNavigate }) {
  return (
    <div>
      <h4 style={colTitle}>{title}</h4>
      <ul style={listReset}>
        {items.map((it, i) => (
          <li key={i} style={{ fontSize: 14, fontWeight: 300 }}>
            <a href="#" onClick={(e) => { e.preventDefault(); onNavigate(it.target); }}
              style={{ color: 'var(--text-2)', borderBottom: '1px solid transparent' }}
              onMouseEnter={(e) => e.currentTarget.style.borderBottomColor = 'var(--text-2)'}
              onMouseLeave={(e) => e.currentTarget.style.borderBottomColor = 'transparent'}
            >{it.label}</a>
          </li>
        ))}
      </ul>
    </div>
  );
}

// ── Product Card ──────────────────────────────────────────────────────────
function ProductCard({ product, onClick, onAdd }) {
  return (
    <article className="product-card" style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <div onClick={onClick} style={{
        position: 'relative', cursor: 'pointer',
        aspectRatio: '1',
        background: 'var(--surface)',
        overflow: 'hidden',
        border: '1px solid var(--line)',
      }}>
        <div className="product-img" style={{ position: 'absolute', inset: 0 }}>
          <ProductImage product={product} />
        </div>
        {product.tags && (
          <div style={{ position: 'absolute', top: 12, left: 12, display: 'flex', gap: 6, flexWrap: 'wrap' }}>
            {product.tags.map(t => (
              <span key={t} className="t-label" style={{
                fontSize: 10, padding: '4px 10px',
                background: 'var(--text)', color: 'var(--bg)',
              }}>{t}</span>
            ))}
          </div>
        )}
        <button onClick={(e) => { e.stopPropagation(); onAdd(); }}
          className="add-btn t-label"
          style={{
            position: 'absolute', left: 12, right: 12, bottom: 12,
            height: 40, background: 'var(--text)', color: 'var(--bg)',
            border: 'none',
            opacity: 0, transform: 'translateY(8px)',
            transition: 'opacity .2s ease, transform .2s ease',
            cursor: 'pointer',
          }}>+ Adicionar</button>
      </div>
      <div onClick={onClick} style={{ cursor: 'pointer' }}>
        <h3 className="t-h3" style={{ color: 'var(--text)' }}>{product.name}</h3>
        <div style={{ display: 'flex', gap: 8, alignItems: 'baseline', marginTop: 4 }}>
          <span className="t-price">{formatBRL(product.price)}</span>
          {product.oldPrice && (
            <span className="t-price" style={{ fontSize: 13, textDecoration: 'line-through', color: 'var(--muted)' }}>
              {formatBRL(product.oldPrice)}
            </span>
          )}
        </div>
      </div>
    </article>
  );
}

// ── Product Carousel (vitrine estilo alta joalheria) ──────────────────────
function ProductCarousel({ products, onOpen, onAdd }) {
  const trackRef = useRef(null);
  const [edges, setEdges] = useState({ start: true, end: false });

  function updateEdges() {
    const el = trackRef.current;
    if (!el) return;
    setEdges({
      start: el.scrollLeft <= 2,
      end: el.scrollLeft + el.clientWidth >= el.scrollWidth - 2,
    });
  }

  useEffect(() => {
    updateEdges();
    window.addEventListener('resize', updateEdges);
    return () => window.removeEventListener('resize', updateEdges);
  }, [products.length]);

  function scrollByPage(dir) {
    const el = trackRef.current;
    if (!el) return;
    el.scrollBy({ left: dir * el.clientWidth, behavior: 'smooth' });
  }

  return (
    <div className="pc-carousel">
      <button className="pc-arrow pc-arrow-prev" onClick={() => scrollByPage(-1)}
        disabled={edges.start} aria-label="Produtos anteriores">
        <Icon name="chevronLeft" size={22} stroke={1.1} />
      </button>

      <div className="pc-track" ref={trackRef} onScroll={updateEdges}>
        {products.map(p => {
          const [mainPhoto, hoverPhoto] = p.images || [];
          return (
          <article key={p.id} className={`pc-card${hoverPhoto ? ' has-secondary' : ''}`} onClick={() => onOpen(p)}>
            <div className="pc-media">
              <div className="pc-img pc-img--primary">
                {mainPhoto
                  ? <img src={mainPhoto} alt={p.name} loading="lazy" />
                  : <Placeholder kind={p.placeholder} />}
              </div>
              {hoverPhoto && (
                <div className="pc-img pc-img--secondary" aria-hidden="true">
                  <img src={hoverPhoto} alt="" loading="lazy" />
                </div>
              )}
              {p.tags?.[0] && <span className="pc-tag">{p.tags[0]}</span>}
            </div>
            <div className="pc-info">
              <h3 className="pc-name">{p.name}</h3>
              {p.desc && <p className="pc-desc">{p.desc}</p>}
              <div className="pc-price">
                {formatBRL(p.price)}
                {p.oldPrice && <s>{formatBRL(p.oldPrice)}</s>}
              </div>
            </div>
            <button className="pc-add" aria-label={`Adicionar ${p.name} à sacola`}
              onClick={(e) => { e.stopPropagation(); onAdd(p); }}>
              Adicionar à sacola
            </button>
          </article>
          );
        })}
      </div>

      <button className="pc-arrow pc-arrow-next" onClick={() => scrollByPage(1)}
        disabled={edges.end} aria-label="Próximos produtos">
        <Icon name="chevronRight" size={22} stroke={1.1} />
      </button>
    </div>
  );
}

// ── Cart Drawer ───────────────────────────────────────────────────────────
function CartDrawer({ open, cart, onClose, onUpdate, onRemove, onCheckout }) {
  const total = cart.reduce((s, i) => s + (productById(i.id)?.price || 0) * i.qty, 0);
  const itemCount = cart.reduce((s, i) => s + i.qty, 0);

  return (
    <>
      <div onClick={onClose} style={{
        position: 'fixed', inset: 0, zIndex: 100,
        background: 'rgba(0,0,0,0.4)',
        opacity: open ? 1 : 0,
        pointerEvents: open ? 'auto' : 'none',
        transition: 'opacity .25s ease',
      }} />
      <aside style={{
        position: 'fixed', top: 0, right: 0, bottom: 0, zIndex: 101,
        width: 'min(460px, 92vw)',
        background: 'var(--surface)',
        display: 'flex', flexDirection: 'column',
        transform: open ? 'translateX(0)' : 'translateX(105%)',
        transition: 'transform .35s cubic-bezier(.4, .14, .3, 1)',
        boxShadow: '-30px 0 60px rgba(0,0,0,.2)',
      }}>
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '22px 28px', borderBottom: '1px solid var(--line)',
        }}>
          <h3 className="t-h2">
            Sua sacola <span className="t-price" style={{ color: 'var(--muted)' }}>({itemCount})</span>
          </h3>
          <button className="icon-btn" onClick={onClose}><Icon name="close" /></button>
        </div>

        <div className="tn-scroll" style={{ flex: 1, overflowY: 'auto', padding: '6px 28px' }}>
          {cart.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '64px 12px', color: 'var(--text-2)' }}>
              <div className="t-h2" style={{ color: 'var(--text)', marginBottom: 8 }}>
                Sua sacola está vazia
              </div>
              <p className="t-body-sm">Que tal começar por um kit presenteável?</p>
              <button className="btn btn-primary" style={{ marginTop: 16 }} onClick={onClose}>
                Explorar a loja
              </button>
            </div>
          ) : (
            cart.map(item => {
              const p = productById(item.id);
              if (!p) return null;
              return (
                <div key={item.id + (item.variant||'')} style={{
                  display: 'grid', gridTemplateColumns: '88px 1fr', gap: 16,
                  padding: '20px 0', borderBottom: '1px solid var(--line)',
                }}>
                  <div style={{ aspectRatio: '1', background: 'var(--bg-2)', overflow: 'hidden' }}>
                    <ProductImage product={p} />
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', gap: 8 }}>
                        <h4 className="t-h3" style={{ fontSize: 19 }}>{p.name}</h4>
                        <button onClick={() => onRemove(item.id, item.variant)}
                          style={{ background: 'none', border: 'none', color: 'var(--muted)', cursor: 'pointer', padding: 0 }}>
                          <Icon name="close" size={14} />
                        </button>
                      </div>
                      {item.variant && <div style={{ fontSize: 11, color: 'var(--muted)', marginTop: 2 }}>{item.variant}</div>}
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 8 }}>
                      <div style={{ display: 'flex', alignItems: 'center', border: '1px solid var(--line-2)' }}>
                        <button
                          style={qtyBtn}
                          onClick={() => item.qty === 1 ? onRemove(item.id, item.variant) : onUpdate(item.id, item.qty - 1, item.variant)}
                        ><Icon name="minus" size={12}/></button>
                        <span className="t-price" style={{ width: 28, textAlign: 'center', fontSize: 14 }}>{item.qty}</span>
                        <button style={qtyBtn} onClick={() => onUpdate(item.id, item.qty + 1, item.variant)}><Icon name="plus" size={12}/></button>
                      </div>
                      <span className="t-price">{formatBRL(p.price * item.qty)}</span>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {cart.length > 0 && (
          <div style={{ padding: 28, borderTop: '1px solid var(--line)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6, fontSize: 14, color: 'var(--text-2)' }}>
              <span>Subtotal</span><span className="t-price" style={{ fontSize: 14 }}>{formatBRL(total)}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 18, fontSize: 14, color: 'var(--text-2)' }}>
              <span>Frete</span><span>combinado na entrega</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16, paddingTop: 14, borderTop: '1px solid var(--line)' }}>
              <span className="t-label">Total</span>
              <span className="t-price t-price-lg">{formatBRL(total)}</span>
            </div>
            <button className="btn btn-primary btn-lg" style={{ width: '100%' }} onClick={onCheckout}>
              <Icon name="sparkle" size={16} /> Pagar com Pix ou Cartão
            </button>
            <p style={{ fontSize: 11, color: 'var(--muted)', textAlign: 'center', marginTop: 10, marginBottom: 4, lineHeight: 1.5 }}>
              Pagamento seguro via Mercado Pago · embalagem presenteável inclusa
            </p>
            <div style={{ textAlign: 'center' }}>
              <a href="#" style={{ fontSize: 11, color: 'var(--muted)', borderBottom: '1px solid var(--line-2)' }}
                onClick={(e) => {
                  e.preventDefault();
                  const lines = cart.map(i => {
                    const p = productById(i.id);
                    const opt = i.variant ? ` (${i.variant})` : '';
                    return `• ${i.qty}x ${p.name}${opt} — ${formatBRL(p.price * i.qty)}`;
                  });
                  const msg = ['Olá Thaís! Quero fechar pedido:', '', ...lines, '', `*Total: ${formatBRL(total)}*`].join('\n');
                  window.open(`https://wa.me/5586988333593?text=${encodeURIComponent(msg)}`, '_blank');
                }}
              >ou finalizar pelo WhatsApp</a>
            </div>
          </div>
        )}
      </aside>
    </>
  );
}

const qtyBtn = {
  width: 30, height: 30, background: 'transparent', border: 'none',
  display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
  color: 'var(--text)', cursor: 'pointer',
};

// ── Toast ─────────────────────────────────────────────────────────────────
function Toast({ message, visible }) {
  return (
    <div style={{
      position: 'fixed', bottom: 24, left: '50%',
      transform: `translateX(-50%) translateY(${visible ? 0 : 30}px)`,
      opacity: visible ? 1 : 0,
      pointerEvents: 'none',
      transition: 'opacity .25s ease, transform .25s ease',
      background: 'var(--text)', color: 'var(--bg)',
      padding: '12px 22px', borderRadius: 999,
      fontSize: 13, zIndex: 200,
      boxShadow: '0 8px 30px rgba(0,0,0,.2)',
      display: 'flex', alignItems: 'center', gap: 8,
    }}>
      <Icon name="check" size={16} /> {message}
    </div>
  );
}

Object.assign(window, { Icon, RollText, Header, Footer, ProductCard, ProductCarousel, CartDrawer, Toast });
