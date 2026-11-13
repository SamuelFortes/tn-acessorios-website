// Páginas: Home, Category, Product, About/Contato.

const { useState: _useState, useMemo: _useMemo } = React;

// ── Revelação palavra a palavra (referência: cyera "Know Your Data…") ─────
// Mesma conta do shader de texto deles: uma "onda" percorre as palavras em
// ordem; cada palavra vai de opacidade 0 → 1 (cubicOut) e de escala 0.8 → 1
// (circularOut) a partir do centro do bloco, então o texto "abre" do meio.
// mode 'words': quebra o texto em palavras · mode 'items': anima cada filho
// direto do elemento (botões, selos) inteiro, sem separar texto de ícone.
function useWordReveal(ref, { duration = 1300, delay = 300, padding = 0.3, fromScale = 0.8, mode = 'words' } = {}) {
  React.useLayoutEffect(() => {
    const root = ref.current;
    if (!root) return;
    if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) return;

    // 1. Quebra cada nó de texto em <span> por palavra (guardando o original)
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
    const textNodes = [];
    if (mode === 'words') while (walker.nextNode()) textNodes.push(walker.currentNode);

    const swaps = [];   // [nó original, nós que o substituíram]
    const words = mode === 'items' ? [...root.children] : [];
    words.forEach(el => {
      el.style.opacity = '0';
      el.style.transition = 'none';   // a transição de hover não pode atrasar os quadros
      el.style.willChange = 'transform, opacity';
    });
    textNodes.forEach(node => {
      const parts = node.textContent.split(/(\s+)/).filter(Boolean);
      if (!parts.some(t => t.trim())) return;
      const added = parts.map(t => {
        if (!t.trim()) return document.createTextNode(t);
        const span = document.createElement('span');
        span.textContent = t;
        span.style.display = 'inline-block';
        span.style.opacity = '0';
        span.style.willChange = 'transform, opacity';
        words.push(span);
        return span;
      });
      const parent = node.parentNode;
      added.forEach(n => parent.insertBefore(n, node));
      parent.removeChild(node);
      swaps.push([node, added]);
    });

    function restore() {
      if (mode === 'items') {
        words.forEach(el => {
          el.style.opacity = '';
          el.style.transform = '';
          el.style.transition = '';
          el.style.willChange = '';
        });
      }
      swaps.forEach(([original, added]) => {
        const parent = added[0].parentNode;
        if (!parent) return;
        parent.insertBefore(original, added[0]);
        added.forEach(n => n.remove());
      });
      swaps.length = 0;
    }

    // 2. Distância de cada palavra até o centro do título
    const box = root.getBoundingClientRect();
    const cx = box.left + box.width / 2;
    const cy = box.top + box.height / 2;
    const offsets = words.map(w => {
      const r = w.getBoundingClientRect();
      return [r.left + r.width / 2 - cx, r.top + r.height / 2 - cy];
    });

    const clamp = (v) => Math.min(1, Math.max(0, v));
    const cubicOut = (t) => { const f = t - 1; return f * f * f + 1; };
    const circularOut = (t) => Math.sqrt((2 - t) * t);

    // 3. Anima: t linear 0 → 1; cada palavra tem sua própria janela de transição
    let raf;
    let start;
    function frame(now) {
      if (start === undefined) start = now;
      const t = clamp((now - start - delay) / duration);
      const sweep = -padding + t * (1 + 2 * padding);
      words.forEach((w, i) => {
        const x = (i + 1) / words.length;
        const wt = clamp(1 - (x - sweep + padding) / (2 * padding));
        const scale = fromScale + (1 - fromScale) * circularOut(wt);
        const [dx, dy] = offsets[i];
        w.style.opacity = String(cubicOut(wt));
        w.style.transform = `translate(${(scale - 1) * dx}px, ${(scale - 1) * dy}px) scale(${scale})`;
      });
      if (t < 1) raf = requestAnimationFrame(frame);
      else restore();   // devolve o texto original intacto ao React
    }
    raf = requestAnimationFrame(frame);

    return () => { cancelAnimationFrame(raf); restore(); };
  }, []);
}

// ── HOME ──────────────────────────────────────────────────────────────────
function HomePage({ onNavigate, onAddToCart }) {
  const heroTitleRef   = React.useRef(null);
  const heroTextRef    = React.useRef(null);
  const heroButtonsRef = React.useRef(null);
  const heroPerksRef   = React.useRef(null);
  // cascata: cada bloco começa enquanto o anterior ainda está terminando
  useWordReveal(heroTitleRef);
  useWordReveal(heroTextRef,    { delay: 800,  duration: 1300 });
  useWordReveal(heroButtonsRef, { delay: 1500, duration: 900, mode: 'items' });
  useWordReveal(heroPerksRef,   { delay: 1800, duration: 900, mode: 'items' });
  const tagged   = PRODUCTS.filter(p => p.tags?.length);
  const showcase = [...tagged, ...PRODUCTS.filter(p => !p.tags?.length)].slice(0, 12);
  const kits  = productsByCat('kits');
  const joias = productsByCat('joias').slice(0, 4);

  return (
    <div className="page-enter">

      {/* Hero */}
      <section style={{ position: 'relative', borderBottom: '1px solid var(--line)' }}>
        <div className="container hero-grid" style={{
          display: 'grid', gridTemplateColumns: 'minmax(0, 1.05fr) minmax(0, 1fr)', gap: 48,
          padding: '64px 0 80px', alignItems: 'center',
        }}>
          <div>
            <p className="eyebrow" style={{ marginBottom: 28 }}>✦ Teresina</p>
            <h1 className="t-h1" ref={heroTitleRef}>
              Acessórios{' '}
              <span className="font-display-italic" style={{ color: 'var(--accent)' }}>
                que contam<br/>histórias
              </span>.
            </h1>
            <p className="t-body" ref={heroTextRef} style={{ marginTop: 28, marginBottom: 36, color: 'var(--text-2)', maxWidth: 480 }}>
              Joias delicadas, perfumes marcantes, bolsas e kits presenteáveis montados com cuidado.
              Curadoria de uma mulher para outras mulheres.
            </p>
            <div ref={heroButtonsRef} style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
              <button className="btn btn-primary btn-lg" onClick={() => onNavigate({ view: 'category', cat: 'kits' })}>
                <RollText>Ver kits presenteáveis</RollText> <Icon name="arrow" />
              </button>
              <button className="btn btn-ghost btn-lg" onClick={() => onNavigate({ view: 'category', cat: 'joias' })}>
                <RollText>Explorar joias</RollText>
              </button>
            </div>
            <div ref={heroPerksRef} style={{ display: 'flex', gap: 24, marginTop: 40, paddingTop: 28, borderTop: '1px solid var(--line)', flexWrap: 'wrap' }}>
              {[
                { i: 'gift',   t: 'Embalagem inclusa' },
                { i: 'truck',  t: 'Entrega Teresina' },
                { i: 'shield', t: 'Pagamento seguro' },
              ].map(s => (
                <div key={s.t} className="t-label" style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 11, color: 'var(--text-2)' }}>
                  <Icon name={s.i} size={16} /> {s.t}
                </div>
              ))}
            </div>
          </div>

          {/* Hero collage */}
          <div className="hero-collage" style={{ position: 'relative', minHeight: 540 }}>
            <div className="hero-collage-card hero-collage-bag hero-collage-video" style={{
              position: 'absolute', top: 0, right: 0,
              width: '72%', aspectRatio: '4/5',
              background: 'var(--surface)', border: '1px solid var(--line)', overflow: 'hidden',
            }}>
              <HeroVideo />
            </div>
            <div className="hero-collage-card hero-collage-perfume" style={{
              position: 'absolute', bottom: 0, left: 0,
              width: '50%', aspectRatio: '1',
              background: 'var(--surface)', border: '1px solid var(--line)', overflow: 'hidden',
              boxShadow: 'var(--shadow)',
            }}>
              {/* Foto: frasco âmbar sobre seda — Unsplash (unsplash.com/photos/q7zUMO9sDsw), licença Unsplash */}
              <img src="https://images.unsplash.com/photo-1733660227163-01bc46e0d7d7?w=640&h=640&fit=crop&crop=entropy&auto=format&q=80"
                alt="Frasco de perfume âmbar sobre tecido de seda creme"
                style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
            </div>
            <div className="hero-collage-badge" style={{
              position: 'absolute', bottom: '12%', right: '6%',
              background: 'var(--accent)', color: 'var(--accent-fg)',
              borderRadius: '50%', width: 110, height: 110,
              display: 'grid', placeItems: 'center',
              transform: 'rotate(-12deg)', boxShadow: 'var(--shadow)',
              textAlign: 'center', lineHeight: 1.1,
            }}>
              <div>
                <div style={{ fontSize: 9, letterSpacing: '0.15em', fontWeight: 500 }}>NOVA</div>
                <div className="t-italic" style={{ fontSize: 28, marginTop: 2 }}>coleção</div>
                <div style={{ fontSize: 9, letterSpacing: '0.15em', fontWeight: 500, marginTop: 2 }}>OUTONO '26</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categorias */}
      <section className="container" style={{ padding: '96px 0 24px' }}>
        <SectionHeader
          eyebrow="Categorias"
          title="O que você procura hoje"
          right={<button className="btn btn-ghost btn-sm" onClick={() => onNavigate({ view: 'category', cat: 'joias' })}><RollText>Ver tudo</RollText> <Icon name="arrow" size={14}/></button>}
        />
        <nav className="cat-circles" aria-label="Categorias">
          {CATEGORIES.map(cat => {
            const sample = productsByCat(cat.id)[0];
            return (
              <a key={cat.id} href="#" className="cat-circle"
                onClick={(e) => { e.preventDefault(); onNavigate({ view: 'category', cat: cat.id }); }}>
                <span className="cat-circle-img">
                  {cat.image || sample?.images?.[0]
                    ? <img src={cat.image || sample.images[0]} alt="" loading="lazy" />
                    : sample && <Placeholder kind={sample.placeholder} />}
                </span>
                <span className="cat-circle-name">{cat.name}</span>
              </a>
            );
          })}
        </nav>
      </section>

      {/* Em destaque */}
      <section className="container" style={{ padding: '96px 0 24px' }}>
        <SectionHeader
          eyebrow="Vitrine"
          title={<>Selecionados <span className="font-display-italic" style={{color:'var(--accent)'}}>com carinho</span></>}
          right={<a href="#" onClick={(e) => { e.preventDefault(); onNavigate({ view: 'category', cat: 'joias' }); }}
            className="t-label" style={{ color: 'var(--text-2)', borderBottom: '1px solid var(--text-2)' }}>Ver todos os produtos</a>}
        />
      </section>
      <section className="container-wide" style={{ marginTop: 40 }}>
        <ProductCarousel products={showcase}
          onOpen={(p) => onNavigate({ view: 'product', id: p.id })}
          onAdd={(p) => onAddToCart(p.id)} />
      </section>

      {/* Kit presenteável banner */}
      <section className="container" style={{ padding: '120px 0 24px' }}>
        <div className="kit-banner-grid kit-banner-pad" data-reveal="curtain" style={{
          background: 'var(--text)', color: 'var(--bg)',
          padding: '64px 56px', position: 'relative', overflow: 'hidden',
          display: 'grid', gridTemplateColumns: 'minmax(0, 1.3fr) minmax(0, 1fr)', gap: 56, alignItems: 'center',
        }}>
          <div>
            <p className="eyebrow" style={{ color: 'inherit', opacity: 0.6, marginBottom: 16 }}>✦ Kits presenteáveis</p>
            <h2 className="t-h1">
              O presente <span className="font-display-italic">perfeito</span><br/>já vem montado.
            </h2>
            <p className="t-body" style={{ marginTop: 22, marginBottom: 28, opacity: 0.8, maxWidth: 460 }}>
              Caixas embaladas à mão, cartão personalizado e curadoria pra cada ocasião — mãe, namorada, amiga, você mesma.
            </p>
            <button className="btn btn-primary" onClick={() => onNavigate({ view: 'category', cat: 'kits' })}>
              <RollText>Ver todos os kits</RollText> <Icon name="arrow"/>
            </button>
          </div>
          <div className="kit-banner-imgs" style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: 16 }}>
            {kits.slice(0, 2).map(k => (
              <div key={k.id} onClick={() => onNavigate({ view: 'product', id: k.id })}
                style={{ aspectRatio: '3/4', background: 'var(--surface)', overflow: 'hidden', cursor: 'pointer' }}>
                <Placeholder kind={k.placeholder} />
              </div>
            ))}
          </div>
          <div style={{
            position: 'absolute', right: -60, top: -40,
            fontFamily: 'var(--font-serif)', fontSize: 320, fontStyle: 'italic',
            color: 'rgba(255,255,255,.05)', lineHeight: 0.8, pointerEvents: 'none',
          }}>TN</div>
        </div>
      </section>

      {/* Joias grid */}
      <section className="container" style={{ padding: '96px 0 24px' }}>
        <SectionHeader eyebrow="Brilho diário" title="Joias para todos os dias" />
        <div className="prod-grid-4" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, minmax(0, 1fr))', gap: 28, marginTop: 40 }}>
          {joias.map(p => (
            <ProductCard key={p.id} product={p}
              onClick={() => onNavigate({ view: 'product', id: p.id })}
              onAdd={() => onAddToCart(p.id)} />
          ))}
        </div>
      </section>

      {/* Sobre a marca */}
      <section className="container" style={{ padding: '120px 0 60px' }}>
        <div className="about-grid" style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1.2fr)', gap: 80, alignItems: 'center' }}>
          <div className="about-img" data-reveal="curtain" style={{ position: 'relative', aspectRatio: '4/5', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg, #C9876F, #6B1E2C)' }} />
            <div style={{ position: 'absolute', inset: 0, display: 'grid', placeItems: 'center', color: 'rgba(255,255,255,.85)' }}>
              <div style={{ textAlign: 'center' }}>
                <LogoMark size={140} bg="rgba(255,255,255,.15)" fg="#FBF6EC" />
                <div className="t-italic" style={{ fontSize: 30, marginTop: 18, lineHeight: 1.2 }}>
                  "Para mulheres reais."
                </div>
                <div className="t-label" style={{ fontSize: 11, opacity: 0.8, marginTop: 12 }}>Foto da fundadora</div>
              </div>
            </div>
          </div>
          <div>
            <p className="eyebrow" style={{ marginBottom: 20 }}>✦ Nossa história</p>
            <h2 className="t-h2">
              Começou em casa,<br/><span className="font-display-italic" style={{ color: 'var(--accent)' }}>chegou em vocês</span>.
            </h2>
            <p className="t-body" style={{ color: 'var(--text-2)', marginTop: 22 }}>
              A TN nasceu da paixão por presentes bem montados e pelo poder que um acessório bonito tem de transformar o dia.
              Cada peça é escolhida pessoalmente, cada caixa é embalada à mão, e cada cliente é chamada pelo nome.
            </p>
            <p className="t-body" style={{ color: 'var(--text-2)', marginTop: 16 }}>
              Hoje, do showroom em Nossa Senhora dos Remédios, atendemos Teresina inteira e enviamos para todo o Brasil.
            </p>
            <div style={{ display: 'flex', gap: 40, marginTop: 36, flexWrap: 'wrap' }}>
              {[
                { n: '+500', l: 'clientes apaixonadas' },
                { n: '3 anos', l: 'de boutique' },
                { n: '100%', l: 'embalagem presenteável' },
              ].map(s => (
                <div key={s.l}>
                  <div className="t-italic" style={{ fontSize: 34, lineHeight: 1.1, color: 'var(--accent)' }}>{s.n}</div>
                  <div className="t-label" style={{ fontSize: 11, color: 'var(--text-2)', marginTop: 4 }}>{s.l}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Depoimentos */}
      <section className="container" style={{ padding: '40px 0 60px' }}>
        <SectionHeader eyebrow="Clientes que viraram amigas" title="O que elas dizem" />
        <div className="testimonial-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: 24, marginTop: 40 }}>
          {TESTIMONIALS.map((t, i) => (
            <div key={i} style={{ background: 'var(--surface)', padding: 32, border: '1px solid var(--line)', display: 'flex', flexDirection: 'column', gap: 18 }}>
              <div style={{ display: 'flex', gap: 2, color: 'var(--gold)' }}>
                {Array(5).fill(0).map((_,k) => <Icon key={k} name="star" size={14}/>)}
              </div>
              <p className="t-italic" style={{ fontSize: 22, margin: 0, lineHeight: 1.4 }}>
                "{t.text}"
              </p>
              <div className="t-label" style={{ color: 'var(--text-2)', marginTop: 'auto' }}>
                — {t.name}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA WhatsApp */}
      <section className="container" style={{ padding: '60px 0' }}>
        <div className="cta-bar cta-inner" style={{
          border: '1px solid var(--line-2)', padding: '56px 56px',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 24,
        }}>
          <div>
            <p className="eyebrow" style={{ marginBottom: 10 }}>Atendimento</p>
            <h3 className="t-h2">
              Não achou o que queria? <span className="font-display-italic" style={{ color: 'var(--accent)' }}>Chama no whats.</span>
            </h3>
            <p className="t-body-sm" style={{ color: 'var(--text-2)', marginTop: 8, marginBottom: 0 }}>
              Atendemos de segunda a sábado, 9h às 19h. Resposta em minutos.
            </p>
          </div>
          <a className="btn btn-whats btn-lg" href="https://wa.me/5586988333593" target="_blank" rel="noreferrer">
            <Icon name="whats" /> (86) 9 8833-3593
          </a>
        </div>
      </section>
    </div>
  );
}

// Vídeo da hero: "Person Holding a Gift Box Tied with White Ribbon", cottonbro studio,
// Pexels (pexels.com/video/6848809) — licença Pexels, uso gratuito.
const HERO_VIDEO = {
  src: 'https://videos.pexels.com/video-files/6848809/6848809-hd_1366_720_25fps.mp4',
  // versão mais leve para telas pequenas (economiza dados no celular)
  srcMobile: 'https://videos.pexels.com/video-files/6848809/6848809-sd_960_506_25fps.mp4',
  poster: 'https://images.pexels.com/videos/6848809/pexels-photo-6848809.jpeg?auto=compress&cs=tinysrgb&w=900',
};

function HeroVideo() {
  const ref = React.useRef(null);
  // Respeita "reduzir movimento" do sistema: fica parado no primeiro quadro.
  const reduceMotion = typeof window !== 'undefined'
    && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

  const isSmall = typeof window !== 'undefined'
    && window.matchMedia?.('(max-width: 900px)').matches;

  React.useEffect(() => {
    const v = ref.current;
    if (!v || reduceMotion) return;
    v.play?.().catch(() => {});
  }, [reduceMotion]);

  return (
    <video ref={ref} className="hero-video"
      src={isSmall ? HERO_VIDEO.srcMobile : HERO_VIDEO.src} poster={HERO_VIDEO.poster}
      autoPlay={!reduceMotion} muted loop playsInline preload="metadata"
      aria-label="Mãos segurando uma caixa de presente bordô com laço creme" />
  );
}

function SectionHeader({ eyebrow: eb, title, right }) {
  return (
    <div style={{ display: 'flex', alignItems: 'end', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap' }}>
      <div data-reveal="lines">
        <p className="eyebrow" style={{ marginBottom: 12 }}>
          <span className="rv-mask"><span className="rv-line" style={{ '--i': 0 }}>{eb}</span></span>
        </p>
        <h2 className="t-h2">
          <span className="rv-mask"><span className="rv-line" style={{ '--i': 1 }}>{title}</span></span>
        </h2>
      </div>
      {right}
    </div>
  );
}

// ── CATEGORY ──────────────────────────────────────────────────────────────
function CategoryPage({ catId, onNavigate, onAddToCart }) {
  const cat = categoryById(catId);
  const products = productsByCat(catId);
  const [sort, setSort] = _useState('relevance');
  const [layout, setLayout] = _useState(4);

  const sorted = _useMemo(() => {
    const arr = [...products];
    if (sort === 'price-asc')  arr.sort((a, b) => a.price - b.price);
    if (sort === 'price-desc') arr.sort((a, b) => b.price - a.price);
    if (sort === 'name')       arr.sort((a, b) => a.name.localeCompare(b.name));
    return arr;
  }, [products, sort]);

  if (!cat) return <div className="container" style={{ padding: 80 }}>Categoria não encontrada.</div>;

  return (
    <div className="page-enter">
      <section style={{ borderBottom: '1px solid var(--line)' }}>
        <div className="container" style={{ padding: '48px 0 56px' }}>
          <div className="t-label" style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 11, color: 'var(--text-2)', marginBottom: 24 }}>
            <a href="#" onClick={(e) => { e.preventDefault(); onNavigate({ view: 'home' }); }}
              style={{ borderBottom: '1px solid transparent' }}
              onMouseEnter={(e) => e.currentTarget.style.borderBottomColor = 'var(--text-2)'}
              onMouseLeave={(e) => e.currentTarget.style.borderBottomColor = 'transparent'}
            >Início</a>
            <span>/</span>
            <span style={{ color: 'var(--text)' }}>{cat.name}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'end', flexWrap: 'wrap', gap: 24 }}>
            <div>
              <p className="eyebrow" style={{ marginBottom: 14 }}>Categoria</p>
              <h1 className="t-h1">
                {cat.name.split(' ')[0]}{' '}
                {cat.name.split(' ').slice(1).length > 0 && (
                  <span className="font-display-italic" style={{ color: 'var(--accent)' }}>
                    {cat.name.split(' ').slice(1).join(' ')}
                  </span>
                )}
              </h1>
              <p className="t-body" style={{ color: 'var(--text-2)', marginTop: 16, maxWidth: 520 }}>{cat.subtitle}</p>
            </div>
            <div className="t-label" style={{ color: 'var(--text-2)' }}>
              <span className="tabular">{products.length}</span> produtos
            </div>
          </div>
        </div>
      </section>

      {/* Toolbar */}
      <div className="container" style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        padding: '24px 0', borderBottom: '1px solid var(--line)', flexWrap: 'wrap', gap: 12,
      }}>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          {CATEGORIES.map(c => (
            <button key={c.id}
              onClick={() => onNavigate({ view: 'category', cat: c.id })}
              className="btn btn-sm"
              style={{
                background: c.id === catId ? 'var(--text)' : 'transparent',
                color: c.id === catId ? 'var(--bg)' : 'var(--text)',
                border: c.id === catId ? 'none' : '1px solid var(--line-2)',
              }}>
              {c.name}
            </button>
          ))}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <div className="t-label" style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 11, color: 'var(--text-2)' }}>
            <span>Ordenar:</span>
            <select value={sort} onChange={(e) => setSort(e.target.value)}
              style={{ background: 'transparent', border: 'none', color: 'var(--text)', fontFamily: 'inherit', fontSize: 12, fontWeight: 500, letterSpacing: '0.15em', textTransform: 'uppercase', cursor: 'pointer' }}>
              <option value="relevance">Relevância</option>
              <option value="price-asc">Menor preço</option>
              <option value="price-desc">Maior preço</option>
              <option value="name">A-Z</option>
            </select>
          </div>
          <div style={{ display: 'flex', gap: 4 }}>
            {[3, 4].map(n => (
              <button key={n} onClick={() => setLayout(n)}
                className="icon-btn"
                style={{ width: 32, height: 32, background: n === layout ? 'var(--bg-2)' : 'transparent' }}>
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  {Array(n).fill(0).map((_,i) => (
                    <rect key={i} x={i*(14/n)+1} y="1" width={14/n-2} height="12" stroke="currentColor" strokeWidth="1.4"/>
                  ))}
                </svg>
              </button>
            ))}
          </div>
        </div>
      </div>

      <section className="container" style={{ padding: '48px 0 60px' }}>
        <div className="prod-grid-dynamic" style={{ display: 'grid', gridTemplateColumns: `repeat(${layout}, minmax(0, 1fr))`, gap: 28 }}>
          {sorted.map(p => (
            <ProductCard key={p.id} product={p}
              onClick={() => onNavigate({ view: 'product', id: p.id })}
              onAdd={() => onAddToCart(p.id)} />
          ))}
        </div>
      </section>
    </div>
  );
}

// ── PRODUCT ───────────────────────────────────────────────────────────────
function ProductPage({ id, onNavigate, onAddToCart }) {
  const p = productById(id);
  const [qty, setQty] = _useState(1);
  const [variant, setVariant] = _useState({});

  if (!p) return <div className="container" style={{ padding: 80 }}>Produto não encontrado.</div>;

  const related = productsByCat(p.cat).filter(o => o.id !== p.id).slice(0, 4);
  const optionKeys = p.options ? Object.keys(p.options) : [];

  return (
    <div className="page-enter">
      <div className="container t-label" style={{ padding: '24px 0', display: 'flex', alignItems: 'center', gap: 8, fontSize: 11, color: 'var(--text-2)', flexWrap: 'wrap' }}>
        <a href="#" onClick={(e) => { e.preventDefault(); onNavigate({ view: 'home' }); }}>Início</a>
        <span>/</span>
        <a href="#" onClick={(e) => { e.preventDefault(); onNavigate({ view: 'category', cat: p.cat }); }}>{categoryById(p.cat).name}</a>
        <span>/</span>
        <span style={{ color: 'var(--text)' }}>{p.name}</span>
      </div>

      <section className="container product-detail-grid" style={{
        display: 'grid', gridTemplateColumns: 'minmax(0, 1.2fr) minmax(0, 1fr)', gap: 64,
        padding: '8px 0 48px',
      }}>
        {/* Galeria */}
        <div>
          <div style={{ aspectRatio: '4/5', background: 'var(--surface)', overflow: 'hidden', border: '1px solid var(--line)' }}>
            <Placeholder kind={p.placeholder} />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, minmax(0, 1fr))', gap: 8, marginTop: 8 }}>
            {Array(4).fill(0).map((_,i) => (
              <div key={i} style={{
                aspectRatio: '1', background: 'var(--surface)',
                border: `1px solid ${i === 0 ? 'var(--text)' : 'var(--line)'}`,
                overflow: 'hidden', cursor: 'pointer',
              }}>
                <Placeholder kind={p.placeholder} />
              </div>
            ))}
          </div>
        </div>

        {/* Info */}
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          {p.tags && (
            <div style={{ display: 'flex', gap: 6, marginBottom: 16 }}>
              {p.tags.map(t => (
                <span key={t} className="t-label" style={{ fontSize: 10, padding: '5px 10px', background: 'var(--accent)', color: 'var(--accent-fg)' }}>{t}</span>
              ))}
            </div>
          )}
          <h1 className="t-h1">{p.name}</h1>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 12, marginTop: 18 }}>
            <span className="t-price t-price-lg" style={{ color: 'var(--accent)' }}>{formatBRL(p.price)}</span>
            {p.oldPrice && (
              <span className="t-price" style={{ fontSize: 14, textDecoration: 'line-through', color: 'var(--muted)' }}>{formatBRL(p.oldPrice)}</span>
            )}
          </div>
          <p className="t-price" style={{ fontSize: 14, color: 'var(--text-2)', marginTop: 4 }}>
            ou <strong style={{ fontWeight: 500 }}>3x</strong> de {formatBRL(p.price / 3)} sem juros no cartão · <span style={{ color: 'var(--accent)' }}>5% off</span> no Pix
          </p>
          <p className="t-body" style={{ color: 'var(--text-2)', marginTop: 28 }}>{p.desc}</p>

          {optionKeys.map(k => (
            <div key={k} style={{ marginTop: 28 }}>
              <div className="t-label" style={{ color: 'var(--text-2)', marginBottom: 10 }}>
                {k}: <span style={{ color: 'var(--text)' }}>{variant[k] || p.options[k][0]}</span>
              </div>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                {p.options[k].map(v => {
                  const active = (variant[k] || p.options[k][0]) === v;
                  return (
                    <button key={v}
                      onClick={() => setVariant({ ...variant, [k]: v })}
                      style={{
                        padding: '10px 16px',
                        border: `1px solid ${active ? 'var(--text)' : 'var(--line-2)'}`,
                        background: active ? 'var(--text)' : 'transparent',
                        color: active ? 'var(--bg)' : 'var(--text)',
                        fontSize: 14, cursor: 'pointer', fontFamily: 'inherit',
                      }}>{v}</button>
                  );
                })}
              </div>
            </div>
          ))}

          <div style={{ display: 'flex', gap: 12, marginTop: 36, alignItems: 'stretch' }}>
            <div style={{ display: 'flex', alignItems: 'center', border: '1px solid var(--line-2)' }}>
              <button style={qtyBtnLg} onClick={() => setQty(Math.max(1, qty - 1))}><Icon name="minus"/></button>
              <span className="t-price" style={{ width: 40, textAlign: 'center' }}>{qty}</span>
              <button style={qtyBtnLg} onClick={() => setQty(qty + 1)}><Icon name="plus"/></button>
            </div>
            <button className="btn btn-primary btn-lg" style={{ flex: 1 }}
              onClick={() => onAddToCart(p.id, qty, optionKeys.map(k => `${k}: ${variant[k] || p.options[k][0]}`).join(' · '))}>
              <Icon name="bag"/> Adicionar à sacola
            </button>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: 16, marginTop: 32, padding: '20px 0', borderTop: '1px solid var(--line)', borderBottom: '1px solid var(--line)' }}>
            {[
              { i: 'gift',   t: 'Embalagem inclusa' },
              { i: 'truck',  t: 'Frete grátis Teresina' },
              { i: 'shield', t: 'Troca em 7 dias' },
            ].map(s => (
              <div key={s.t} className="t-label" style={{ fontSize: 11, color: 'var(--text-2)', display: 'flex', flexDirection: 'column', gap: 6, alignItems: 'start' }}>
                <Icon name={s.i} size={18}/> {s.t}
              </div>
            ))}
          </div>

          <a className="btn btn-ghost" href="https://wa.me/5586988333593" target="_blank" rel="noreferrer" style={{ marginTop: 24 }}>
            <Icon name="whats"/> Dúvidas? Chama no whats
          </a>
        </div>
      </section>

      {/* Relacionados */}
      {related.length > 0 && (
        <section className="container" style={{ padding: '60px 0' }}>
          <SectionHeader eyebrow="Você também pode gostar" title="Combinações da casa" />
          <div className="prod-grid-4" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, minmax(0, 1fr))', gap: 28, marginTop: 32 }}>
            {related.map(r => (
              <ProductCard key={r.id} product={r}
                onClick={() => onNavigate({ view: 'product', id: r.id })}
                onAdd={() => onAddToCart(r.id)} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

const qtyBtnLg = {
  width: 48, height: 48, background: 'transparent', border: 'none',
  display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
  color: 'var(--text)', cursor: 'pointer',
};

// ── ABOUT / CONTATO ───────────────────────────────────────────────────────
function AboutPage({ onNavigate }) {
  return (
    <div className="page-enter">
      <section className="container" style={{ padding: '64px 0 32px' }}>
        <p className="eyebrow" style={{ marginBottom: 14 }}>Atendimento</p>
        <h1 className="t-h1" style={{ maxWidth: 900 }}>
          A gente <span className="font-display-italic" style={{ color: 'var(--accent)' }}>conversa</span>,<br/>
          você escolhe, a gente embala.
        </h1>
        <p className="t-body" style={{ color: 'var(--text-2)', marginTop: 24, maxWidth: 640 }}>
          Aqui na TN o atendimento é pessoal. Você manda mensagem, recebe sugestões,
          aprova fotos do kit antes do envio, e a Thaís cuida de tudo até a porta.
        </p>
      </section>

      {/* Passos */}
      <section className="container" style={{ padding: '40px 0 60px' }}>
        <div className="steps-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, minmax(0, 1fr))', gap: 16 }}>
          {[
            { n: '01', t: 'Escolha',  d: 'Navegue pelo site ou peça uma sugestão personalizada.' },
            { n: '02', t: 'Chame',    d: 'Clique em finalizar — a lista vai pronta pro nosso WhatsApp.' },
            { n: '03', t: 'Pague',    d: 'Pix com 5% off, cartão em até 3x ou link de pagamento.' },
            { n: '04', t: 'Receba',   d: 'Entrega em Teresina ou envio para todo o Brasil.' },
          ].map(s => (
            <div key={s.n} style={{ padding: '32px 28px', background: 'var(--surface)', border: '1px solid var(--line)' }}>
              <div className="t-italic" style={{ fontSize: 44, color: 'var(--accent)', lineHeight: 1 }}>{s.n}</div>
              <h3 className="t-h2" style={{ margin: '12px 0 8px' }}>{s.t}</h3>
              <p className="t-body-sm" style={{ color: 'var(--text-2)', margin: 0 }}>{s.d}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Contato */}
      <section className="container" style={{ padding: '40px 0 60px' }}>
        <div className="contact-grid contact-pad" style={{
          display: 'grid', gridTemplateColumns: 'minmax(0, 1.1fr) minmax(0, 1fr)', gap: 56,
          background: 'var(--text)', color: 'var(--bg)', padding: 56,
        }}>
          <div>
            <p className="eyebrow" style={{ color: 'inherit', opacity: 0.6, marginBottom: 14 }}>Onde estamos</p>
            <h2 className="t-h2">
              Showroom em <span className="font-display-italic">Nossa Senhora<br/>dos Remédios</span>.
            </h2>
            <p className="t-body" style={{ opacity: 0.75, marginTop: 18 }}>
              Visita com hora marcada. Atendimento individual, café na xícara e tempo pra experimentar com calma.
            </p>
            <div style={{ marginTop: 28, display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}><Icon name="pin"/> Teresina · N.S.R</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}><Icon name="whats"/> (86) 9 8833-3593</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}><Icon name="instagram"/> @tnacessorios2</div>
            </div>
            <div style={{ display: 'flex', gap: 10, marginTop: 28, flexWrap: 'wrap' }}>
              <a className="btn btn-whats" href="https://wa.me/5586988333593" target="_blank" rel="noreferrer">
                <Icon name="whats"/> Agendar visita
              </a>
              <a className="btn btn-ghost" href="https://instagram.com/tnacessorios2" target="_blank" rel="noreferrer"
                style={{ color: 'var(--bg)', borderColor: 'rgba(255,255,255,.3)' }}>
                <Icon name="instagram"/> Instagram
              </a>
            </div>
          </div>
          <div style={{
            background: 'linear-gradient(135deg, var(--accent), var(--accent-2))',
            position: 'relative', overflow: 'hidden',
            display: 'grid', placeItems: 'center', minHeight: 360,
          }}>
            <div style={{ textAlign: 'center', color: 'var(--accent-fg)' }}>
              <LogoMark size={180} bg="rgba(255,255,255,.12)" fg="var(--accent-fg)"/>
              <p className="t-italic" style={{ fontSize: 24, marginTop: 18 }}>
                — Te esperamos.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="container" style={{ padding: '40px 0 60px' }}>
        <SectionHeader eyebrow="Perguntas frequentes" title="Antes de você perguntar" />
        <div className="faq-grid" style={{ marginTop: 28, display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: 0, borderTop: '1px solid var(--line-2)' }}>
          {[
            { q: 'Como funciona o pagamento?',      a: 'Você fecha o pedido pelo WhatsApp e recebe link de pagamento por Pix (5% off) ou cartão em até 3x sem juros.' },
            { q: 'Vocês entregam fora de Teresina?', a: 'Sim, enviamos para todo o Brasil via Correios e transportadora. O frete é calculado no fechamento.' },
            { q: 'Posso montar um kit do meu jeito?', a: 'Pode sim! Escolhe os produtos e a gente monta a caixa do seu jeito, com cartão personalizado.' },
            { q: 'Trocam se não servir?',            a: 'Trocas em até 7 dias após o recebimento, em peças sem uso e na embalagem original.' },
          ].map((f, i) => (
            <details key={i} style={{
              borderBottom: '1px solid var(--line-2)', padding: '24px 24px',
              borderRight: i % 2 === 0 ? '1px solid var(--line-2)' : 'none',
            }}>
              <summary className="t-h3" style={{
                cursor: 'pointer', gap: 16,
                listStyle: 'none', display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              }}>
                {f.q} <Icon name="plus" size={18}/>
              </summary>
              <p className="t-body-sm" style={{ color: 'var(--text-2)', marginTop: 14, marginBottom: 0 }}>{f.a}</p>
            </details>
          ))}
        </div>
      </section>
    </div>
  );
}

Object.assign(window, { HomePage, CategoryPage, ProductPage, AboutPage });
