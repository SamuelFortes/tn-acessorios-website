// Main App — routing, state, theme tweaks.

const { useState: useStateApp, useEffect: useEffectApp, useMemo: useMemoApp } = React;

const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "theme": "cremoso",
  "accent": "#6B1E2C",
  "displayFont": "Instrument Serif",
  "bodyFont": "Manrope",
  "showMarquee": true
}/*EDITMODE-END*/;

const THEMES = [
  { id: 'cremoso', label: 'Cremoso', desc: 'Cream + bordô', accents: ['#6B1E2C', '#C9876F', '#B8915A'] },
  { id: 'bordo',   label: 'Bordô',   desc: 'Wine + dourado',  accents: ['#E2B07D', '#E8B4B8', '#9A6470'] },
  { id: 'areia',   label: 'Areia',   desc: 'Sand + terracota', accents: ['#B84B2E', '#D89465', '#C8985B'] },
];

const FONT_PAIRS = {
  'Instrument Serif': { display: 'Instrument Serif', body: 'Manrope' },
  'Italiana':         { display: 'Italiana',         body: 'Manrope' },
  'Cormorant':        { display: 'Cormorant Garamond', body: 'Geist' },
  'DM Serif':         { display: 'DM Serif Display', body: 'DM Sans' },
};

function App() {
  const [t, setTweak] = useTweaks(TWEAK_DEFAULTS);
  const [route, setRoute] = useStateApp({ view: 'home' });
  const [cart, setCart] = useStateApp([]);
  const [cartOpen, setCartOpen] = useStateApp(false);
  const [toast, setToast] = useStateApp({ visible: false, msg: '' });
  const toastTimer = React.useRef();

  // scroll to top on route change
  useEffectApp(() => {
    document.querySelector('.app-shell')?.scrollTo({ top: 0, behavior: 'instant' });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [route]);

  const cartCount = cart.reduce((s, i) => s + i.qty, 0);

  function navigate(target) {
    setRoute(target);
  }

  function addToCart(id, qty = 1, variant) {
    setCart(prev => {
      const existing = prev.find(i => i.id === id && i.variant === variant);
      if (existing) {
        return prev.map(i => i === existing ? { ...i, qty: i.qty + qty } : i);
      }
      return [...prev, { id, qty, variant }];
    });
    showToast(`${productById(id)?.name} adicionado à sacola`);
  }

  function updateCart(id, qty) {
    setCart(prev => prev.map(i => i.id === id ? { ...i, qty } : i));
  }
  function removeFromCart(id) {
    setCart(prev => prev.filter(i => i.id !== id));
  }

  function showToast(msg) {
    setToast({ visible: true, msg });
    clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(t => ({ ...t, visible: false })), 2500);
  }

  function checkout() {
    if (cart.length === 0) return;
    const lines = cart.map(i => {
      const p = productById(i.id);
      const opt = i.variant ? ` (${i.variant})` : '';
      return `• ${i.qty}x ${p.name}${opt} — ${formatBRL(p.price * i.qty)}`;
    });
    const total = cart.reduce((s, i) => s + productById(i.id).price * i.qty, 0);
    const msg = [
      'Olá Thaís! Quero fechar o seguinte pedido pela loja online:',
      '',
      ...lines,
      '',
      `*Total: ${formatBRL(total)}*`,
      '',
      'Como podemos prosseguir com o pagamento e a entrega?',
    ].join('\n');
    const url = `https://wa.me/5586988333593?text=${encodeURIComponent(msg)}`;
    window.open(url, '_blank');
  }

  const nav = [
    { id: 'joias',    label: 'Joias',    target: { view: 'category', cat: 'joias' } },
    { id: 'perfumes', label: 'Perfumes', target: { view: 'category', cat: 'perfumes' } },
    { id: 'bolsas',   label: 'Bolsas',   target: { view: 'category', cat: 'bolsas' } },
    { id: 'kits',     label: 'Kits',     target: { view: 'category', cat: 'kits' } },
    { id: 'about',    label: 'Contato',  target: { view: 'about' } },
  ];

  const routeMatcher = {
    matches: (n) => {
      if (n.target.view === 'category' && route.view === 'category') return n.target.cat === route.cat;
      return n.target.view === route.view;
    }
  };

  // Apply theme + font CSS vars to body
  useEffectApp(() => {
    document.body.className = `theme-${t.theme}`;
    const pair = FONT_PAIRS[t.displayFont] || FONT_PAIRS['Instrument Serif'];
    document.body.style.setProperty('--font-display', `'${pair.display}', serif`);
    document.body.style.setProperty('--font-body', `'${pair.body}', system-ui, sans-serif`);
    if (t.accent) document.body.style.setProperty('--accent', t.accent);
  }, [t.theme, t.displayFont, t.accent]);

  return (
    <div className="app-shell">
      <Header
        nav={nav}
        route={routeMatcher}
        onNavigate={navigate}
        cartCount={cartCount}
        onOpenCart={() => setCartOpen(true)}
        onOpenSearch={() => {}}
      />

      <main key={JSON.stringify(route)}>
        {route.view === 'home' && <HomePage onNavigate={navigate} onAddToCart={addToCart} />}
        {route.view === 'category' && <CategoryPage catId={route.cat} onNavigate={navigate} onAddToCart={addToCart} />}
        {route.view === 'product' && <ProductPage id={route.id} onNavigate={navigate} onAddToCart={addToCart} />}
        {route.view === 'about' && <AboutPage onNavigate={navigate} />}
      </main>

      <Footer onNavigate={navigate} />

      <CartDrawer
        open={cartOpen}
        cart={cart}
        onClose={() => setCartOpen(false)}
        onUpdate={updateCart}
        onRemove={removeFromCart}
        onCheckout={checkout}
      />

      <Toast message={toast.msg} visible={toast.visible} />

      {/* Floating Whats */}
      <a className="float-whats" href="https://wa.me/5586988333593" target="_blank" rel="noreferrer" aria-label="WhatsApp">
        <Icon name="whats" size={22} />
      </a>

      <TweaksPanel>
        <TweakSection label="Direção visual" />
        <TweakColor label="Tema"
          value={THEMES.find(x => x.id === t.theme)?.accents || THEMES[0].accents}
          options={THEMES.map(x => x.accents)}
          onChange={(v) => {
            const found = THEMES.find(x => x.accents.join() === v.join());
            if (found) { setTweak({ theme: found.id, accent: found.accents[0] }); }
          }}
        />
        <TweakRadio label="Acento principal"
          value={t.accent}
          options={(THEMES.find(x => x.id === t.theme)?.accents) || []}
          onChange={(v) => setTweak('accent', v)} />

        <TweakSection label="Tipografia" />
        <TweakSelect label="Display + body"
          value={t.displayFont}
          options={Object.keys(FONT_PAIRS)}
          onChange={(v) => setTweak('displayFont', v)} />

        <TweakSection label="Comportamento" />
        <TweakToggle label="Barra de avisos no topo"
          value={t.showMarquee}
          onChange={(v) => setTweak('showMarquee', v)} />

        <TweakSection label="Ações" />
        <TweakButton label="Sacola de exemplo"
          onClick={() => {
            setCart([
              { id: 'k-01', qty: 1 },
              { id: 'j-01', qty: 2, variant: 'Cor: Pérola branca' },
              { id: 'p-01', qty: 1 },
            ]);
            setCartOpen(true);
          }} />
        <TweakButton label="Esvaziar sacola"
          onClick={() => setCart([])} />
      </TweaksPanel>

      <style>{`
        .float-whats {
          position: fixed; right: 22px; bottom: 22px; z-index: 60;
          width: 56px; height: 56px; border-radius: 50%;
          background: #128C7E; color: #fff;
          display: grid; place-items: center;
          box-shadow: 0 10px 30px rgba(18,140,126,.45);
          transition: transform .2s ease;
        }
        .float-whats:hover { transform: scale(1.08); }
        ${!t.showMarquee ? 'header > div:first-child { display: none !important; }' : ''}
      `}</style>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
