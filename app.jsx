// App raiz — roteamento, estado do carrinho, tema.

const { useState: useStateApp, useEffect: useEffectApp } = React;

function App() {
  const [route, setRoute]       = useStateApp({ view: 'home' });
  const [cart, setCart]         = useStateApp([]);
  const [cartOpen, setCartOpen] = useStateApp(false);
  const [toast, setToast]       = useStateApp({ visible: false, msg: '' });
  const toastTimer = React.useRef();

  // Scroll to top on navigation
  useEffectApp(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [route]);

  const cartCount = cart.reduce((s, i) => s + i.qty, 0);

  function navigate(target) {
    setRoute(target);
  }

  function addToCart(id, qty = 1, variant) {
    setCart(prev => {
      const existing = prev.find(i => i.id === id && i.variant === variant);
      if (existing) return prev.map(i => i === existing ? { ...i, qty: i.qty + qty } : i);
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
    window.open(`https://wa.me/5586988333593?text=${encodeURIComponent(msg)}`, '_blank');
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

  return (
    <div>
      <Header
        nav={nav}
        route={routeMatcher}
        onNavigate={navigate}
        cartCount={cartCount}
        onOpenCart={() => setCartOpen(true)}
      />

      <main key={JSON.stringify(route)}>
        {route.view === 'home'     && <HomePage     onNavigate={navigate} onAddToCart={addToCart} />}
        {route.view === 'category' && <CategoryPage catId={route.cat} onNavigate={navigate} onAddToCart={addToCart} />}
        {route.view === 'product'  && <ProductPage  id={route.id} onNavigate={navigate} onAddToCart={addToCart} />}
        {route.view === 'about'    && <AboutPage    onNavigate={navigate} />}
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

      <a className="float-whats" href="https://wa.me/5586988333593" target="_blank" rel="noreferrer" aria-label="Abrir WhatsApp">
        <Icon name="whats" size={22}/>
      </a>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
