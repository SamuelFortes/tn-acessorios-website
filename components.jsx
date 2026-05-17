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

// ── Header ────────────────────────────────────────────────────────────────
function Header({ nav, route, onNavigate, cartCount, onOpenCart }) {
  const [menuOpen, setMenuOpen] = useState(false);

  function go(target) {
    onNavigate(target);
    setMenuOpen(false);
  }

  return (
    <>
      <header style={{
        position: 'sticky', top: 0, zIndex: 50,
        background: 'color-mix(in oklab, var(--bg) 88%, transparent)',
        backdropFilter: 'blur(14px)',
        borderBottom: '1px solid var(--line)',
      }}>
        {/* Top marquee bar */}
        <div style={{
          background: 'var(--text)', color: 'var(--bg)',
          fontSize: 11, letterSpacing: '0.18em', textTransform: 'uppercase',
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

        <div className="container" style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '18px 0',
        }}>
          {/* left: hamburger (mobile) / nav (desktop) */}
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <button className="icon-btn show-mobile" onClick={() => setMenuOpen(true)} aria-label="Abrir menu">
              <Icon name="menu" />
            </button>
            <nav className="hide-mobile" style={{ display: 'flex', gap: 28, fontSize: 13.5, fontWeight: 500, letterSpacing: '0.04em' }}>
              {nav.map(n => (
                <a key={n.id}
                  onClick={(e) => { e.preventDefault(); go(n.target); }}
                  href="#"
                  style={{
                    color: route?.matches?.(n) ? 'var(--accent)' : 'var(--text)',
                    borderBottom: route?.matches?.(n) ? '1.5px solid var(--accent)' : '1.5px solid transparent',
                    paddingBottom: 2,
                  }}>{n.label}</a>
              ))}
            </nav>
          </div>

          {/* center: logo */}
          <a href="#" onClick={(e) => { e.preventDefault(); go({ view: 'home' }); }}
            style={{ display: 'flex' }}>
            <LogoWordmark height={34} />
          </a>

          {/* right: actions */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <button className="icon-btn hide-mobile" aria-label="Favoritos"><Icon name="heart" /></button>
            <button className="icon-btn" onClick={onOpenCart} aria-label="Sacola">
              <Icon name="bag" />
              {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile nav — overlay full-screen */}
      {menuOpen && (
        <div className="mobile-nav" role="dialog" aria-modal="true" aria-label="Menu de navegação">
          <div className="mobile-nav-top">
            <LogoWordmark height={28} />
            <button className="icon-btn" onClick={() => setMenuOpen(false)} aria-label="Fechar menu">
              <Icon name="close" />
            </button>
          </div>
          <nav className="mobile-nav-links">
            {nav.map(n => (
              <a key={n.id}
                href="#"
                className={`mobile-nav-link${route?.matches?.(n) ? ' active' : ''}`}
                onClick={(e) => { e.preventDefault(); go(n.target); }}>
                {n.label}
              </a>
            ))}
          </nav>
          <div className="mobile-nav-bottom">
            <a className="btn btn-whats btn-lg"
              style={{ width: '100%', justifyContent: 'center' }}
              href="https://wa.me/5586988333593"
              target="_blank" rel="noreferrer">
              <Icon name="whats" /> Chamar no WhatsApp
            </a>
          </div>
        </div>
      )}
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
            <p style={{
              fontFamily: "'Instrument Serif', serif", fontSize: 22, fontStyle: 'italic',
              lineHeight: 1.25, marginTop: 24, marginBottom: 24,
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
            { label: 'Trocas e devoluções',   target: { view: 'about' } },
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
            <h4 style={{ ...colTitle, marginTop: 22 }}>Receba novidades</h4>
            <form style={{ display: 'flex', gap: 0, marginTop: 8 }} onSubmit={(e) => e.preventDefault()}>
              <input type="email" placeholder="seu@email.com"
                style={{
                  flex: 1, minWidth: 0, height: 40,
                  padding: '0 12px', border: '1px solid var(--line-2)',
                  borderRight: 'none', background: 'transparent',
                  color: 'var(--text)', fontSize: 13,
                  borderRadius: '999px 0 0 999px',
                }} />
              <button className="btn btn-dark btn-sm" style={{ borderRadius: '0 999px 999px 0', height: 40 }}>OK</button>
            </form>
          </div>
        </div>

        <hr className="divider" style={{ margin: '40px 0 20px' }} />
        <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16, fontSize: 12, color: 'var(--text-2)' }}>
          <span>© 2026 TN Acessórios · Teresina, PI</span>
          <span style={{ fontFamily: "'Instrument Serif', serif", fontStyle: 'italic' }}>Feito com cuidado para presentear.</span>
        </div>
      </div>
    </footer>
  );
}

const colTitle = { fontSize: 11, letterSpacing: '0.22em', textTransform: 'uppercase', fontWeight: 600, marginBottom: 18, color: 'var(--text)' };
const listReset = { listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 10 };
const liStyle = { fontSize: 13.5, color: 'var(--text-2)', display: 'flex', alignItems: 'center' };

function FooterCol({ title, items, onNavigate }) {
  return (
    <div>
      <h4 style={colTitle}>{title}</h4>
      <ul style={listReset}>
        {items.map((it, i) => (
          <li key={i} style={{ fontSize: 13.5 }}>
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
          <Placeholder kind={product.placeholder} />
        </div>
        {product.tags && (
          <div style={{ position: 'absolute', top: 12, left: 12, display: 'flex', gap: 6, flexWrap: 'wrap' }}>
            {product.tags.map(t => (
              <span key={t} style={{
                fontSize: 9.5, letterSpacing: '0.16em', textTransform: 'uppercase',
                fontWeight: 600, padding: '4px 10px',
                background: 'var(--text)', color: 'var(--bg)',
              }}>{t}</span>
            ))}
          </div>
        )}
        <button onClick={(e) => { e.stopPropagation(); onAdd(); }}
          className="add-btn"
          style={{
            position: 'absolute', left: 12, right: 12, bottom: 12,
            height: 40, background: 'var(--text)', color: 'var(--bg)',
            border: 'none', fontSize: 12, letterSpacing: '0.12em',
            textTransform: 'uppercase', fontWeight: 600,
            opacity: 0, transform: 'translateY(8px)',
            transition: 'opacity .2s ease, transform .2s ease',
            cursor: 'pointer',
          }}>+ Adicionar</button>
      </div>
      <div onClick={onClick} style={{ cursor: 'pointer' }}>
        <h3 style={{
          fontFamily: "'Instrument Serif', Georgia, serif",
          fontSize: 19, fontStyle: 'italic',
          margin: 0, fontWeight: 400, letterSpacing: '-0.01em',
          color: 'var(--text)',
        }}>{product.name}</h3>
        <div style={{ display: 'flex', gap: 8, alignItems: 'baseline', marginTop: 4 }}>
          <span className="tabular" style={{ fontSize: 14, fontWeight: 500 }}>{formatBRL(product.price)}</span>
          {product.oldPrice && (
            <span className="tabular" style={{ fontSize: 12, textDecoration: 'line-through', color: 'var(--muted)' }}>
              {formatBRL(product.oldPrice)}
            </span>
          )}
        </div>
      </div>
    </article>
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
          <h3 style={{ margin: 0, fontFamily: "'Instrument Serif', serif", fontSize: 26, fontStyle: 'italic' }}>
            Sua sacola <span style={{ color: 'var(--muted)', fontSize: 18 }}>({itemCount})</span>
          </h3>
          <button className="icon-btn" onClick={onClose}><Icon name="close" /></button>
        </div>

        <div className="tn-scroll" style={{ flex: 1, overflowY: 'auto', padding: '6px 28px' }}>
          {cart.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '64px 12px', color: 'var(--text-2)' }}>
              <div style={{ fontFamily: "'Instrument Serif', serif", fontStyle: 'italic', fontSize: 28, color: 'var(--text)', marginBottom: 8 }}>
                Sua sacola está vazia
              </div>
              <p style={{ fontSize: 14, lineHeight: 1.5 }}>Que tal começar por um kit presenteável?</p>
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
                    <Placeholder kind={p.placeholder} />
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', gap: 8 }}>
                        <h4 style={{ margin: 0, fontFamily: "'Instrument Serif', serif", fontSize: 16, fontStyle: 'italic', fontWeight: 400 }}>{p.name}</h4>
                        <button onClick={() => onRemove(item.id)}
                          style={{ background: 'none', border: 'none', color: 'var(--muted)', cursor: 'pointer', padding: 0 }}>
                          <Icon name="close" size={14} />
                        </button>
                      </div>
                      {item.variant && <div style={{ fontSize: 11, color: 'var(--muted)', marginTop: 2 }}>{item.variant}</div>}
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 8 }}>
                      <div style={{ display: 'flex', alignItems: 'center', border: '1px solid var(--line-2)' }}>
                        <button style={qtyBtn} onClick={() => onUpdate(item.id, Math.max(1, item.qty - 1))}><Icon name="minus" size={12}/></button>
                        <span className="tabular" style={{ width: 28, textAlign: 'center', fontSize: 13 }}>{item.qty}</span>
                        <button style={qtyBtn} onClick={() => onUpdate(item.id, item.qty + 1)}><Icon name="plus" size={12}/></button>
                      </div>
                      <span className="tabular" style={{ fontSize: 14, fontWeight: 500 }}>{formatBRL(p.price * item.qty)}</span>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {cart.length > 0 && (
          <div style={{ padding: 28, borderTop: '1px solid var(--line)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6, fontSize: 13, color: 'var(--text-2)' }}>
              <span>Subtotal</span><span className="tabular">{formatBRL(total)}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 18, fontSize: 13, color: 'var(--text-2)' }}>
              <span>Frete</span><span style={{ fontStyle: 'italic' }}>calculado no WhatsApp</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16, paddingTop: 14, borderTop: '1px solid var(--line)' }}>
              <span style={{ fontSize: 15 }}>Total</span>
              <span className="tabular" style={{ fontFamily: "'Instrument Serif', serif", fontSize: 24, fontStyle: 'italic' }}>{formatBRL(total)}</span>
            </div>
            <button className="btn btn-whats btn-lg" style={{ width: '100%' }} onClick={onCheckout}>
              <Icon name="whats" /> Finalizar no WhatsApp
            </button>
            <p style={{ fontSize: 11, color: 'var(--muted)', textAlign: 'center', marginTop: 12, marginBottom: 0, lineHeight: 1.5 }}>
              Pagamento por Pix ou cartão · embalagem presenteável inclusa
            </p>
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

Object.assign(window, { Icon, Header, Footer, ProductCard, CartDrawer, Toast });
