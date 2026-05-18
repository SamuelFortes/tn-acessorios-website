// Checkout modal com Mercado Pago Payment Bricks
// MP_PUBLIC_KEY é a chave pública — segura no frontend.
// Substitua pelo valor real após criar a conta no Mercado Pago.
const MP_PUBLIC_KEY = 'COLE_SUA_CHAVE_PUBLICA_AQUI';

const { useState: useStateC, useEffect: useEffectC, useRef: useRefC } = React;

function buildWhatsAppUrl(cart) {
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
    'Prefiro pagar pelo WhatsApp. Como podemos prosseguir?',
  ].join('\n');
  return `https://wa.me/5586988333593?text=${encodeURIComponent(msg)}`;
}

function CheckoutModal({ open, cart, onClose, onSuccess }) {
  const [phase, setPhase] = useStateC('loading'); // loading | form | processing | success | pix | error
  const [pixData, setPixData] = useStateC(null);
  const [errorMsg, setErrorMsg] = useStateC('');
  const [copied, setCopied] = useStateC(false);
  const brickRef = useRefC(null);

  const total = cart.reduce((s, i) => s + (productById(i.id)?.price || 0) * i.qty, 0);

  useEffectC(() => {
    if (!open) return;

    // destroy any previous brick
    if (brickRef.current) {
      try { brickRef.current.unmount(); } catch (_) {}
      brickRef.current = null;
    }
    setPhase('loading');
    setPixData(null);
    setErrorMsg('');

    if (!window.MercadoPago) {
      setPhase('error');
      setErrorMsg('SDK do Mercado Pago não carregou. Verifique a conexão e recarregue a página.');
      return;
    }

    if (MP_PUBLIC_KEY === 'COLE_SUA_CHAVE_PUBLICA_AQUI') {
      setPhase('error');
      setErrorMsg('Chave pública do Mercado Pago não configurada. Entre em contato com a loja.');
      return;
    }

    const timer = setTimeout(() => initBrick(), 100);
    return () => {
      clearTimeout(timer);
      if (brickRef.current) {
        try { brickRef.current.unmount(); } catch (_) {}
        brickRef.current = null;
      }
    };
  }, [open]);

  async function initBrick() {
    try {
      const mp = new window.MercadoPago(MP_PUBLIC_KEY, { locale: 'pt-BR' });
      const bricks = mp.bricks();

      const brick = await bricks.create('payment', 'mp-brick-container', {
        initialization: {
          amount: total,
          preferenceId: null,
        },
        customization: {
          paymentMethods: {
            creditCard: 'all',
            debitCard: 'all',
            bankTransfer: 'all',
          },
          visual: {
            style: {
              theme: 'dark',
              customVariables: {
                baseColor: '#E2B07D',
                formBackgroundColor: '#2E1219',
                inputBackgroundColor: '#1F0B10',
                inputTextColor: '#F4E6DC',
                inputPlaceholderColor: '#8E6E72',
                labelTextColor: '#D6BDB2',
                errorTextColor: '#E8B4B8',
                borderRadiusSmall: '4px',
                borderRadiusMedium: '8px',
                borderRadiusLarge: '12px',
                borderRadiusFull: '999px',
                formInputsTextTransform: 'none',
              },
            },
            hideFormTitle: true,
          },
        },
        callbacks: {
          onReady: () => setPhase('form'),
          onError: (err) => {
            console.error('MP Brick error:', err);
          },
          onSubmit: async ({ formData }) => {
            setPhase('processing');
            try {
              const description = cart.map(i => `${i.qty}x ${productById(i.id).name}`).join(', ');
              const res = await fetch('/.netlify/functions/process-payment', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ formData, total, description }),
              });
              const data = await res.json();

              if (!res.ok) {
                throw new Error(data.error || 'Erro ao processar pagamento.');
              }

              if (data.status === 'approved') {
                setPhase('success');
                setTimeout(() => onSuccess(), 3000);
              } else if (data.status === 'pending' && data.point_of_interaction?.transaction_data) {
                setPixData(data.point_of_interaction.transaction_data);
                setPhase('pix');
              } else {
                throw new Error(`Pagamento retornou status: ${data.status_detail || data.status}`);
              }
            } catch (err) {
              setErrorMsg(err.message || 'Não foi possível processar o pagamento.');
              setPhase('error');
            }
          },
        },
      });

      brickRef.current = brick;
    } catch (err) {
      setPhase('error');
      setErrorMsg('Não foi possível inicializar o pagamento. Tente novamente.');
    }
  }

  function copyPix() {
    if (pixData?.qr_code) {
      navigator.clipboard.writeText(pixData.qr_code).then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2500);
      });
    }
  }

  function retry() {
    if (brickRef.current) {
      try { brickRef.current.unmount(); } catch (_) {}
      brickRef.current = null;
    }
    setPhase('loading');
    setErrorMsg('');
    setTimeout(() => initBrick(), 100);
  }

  if (!open) return null;

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 300,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: '16px',
    }}>
      {/* Backdrop */}
      <div onClick={onClose} style={{
        position: 'absolute', inset: 0,
        background: 'rgba(0,0,0,0.72)',
        backdropFilter: 'blur(4px)',
      }} />

      {/* Modal */}
      <div style={{
        position: 'relative', zIndex: 1,
        width: 'min(520px, 100%)',
        maxHeight: '90vh',
        overflowY: 'auto',
        background: 'var(--surface)',
        border: '1px solid var(--line)',
        borderRadius: 16,
        boxShadow: 'var(--shadow)',
      }}>
        {/* Header */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '22px 28px',
          borderBottom: '1px solid var(--line)',
          position: 'sticky', top: 0,
          background: 'var(--surface)',
          zIndex: 2,
        }}>
          <div>
            <h2 style={{
              margin: 0,
              fontFamily: "'Instrument Serif', serif",
              fontSize: 24, fontStyle: 'italic', fontWeight: 400,
              color: 'var(--text)',
            }}>Pagamento</h2>
            {phase === 'form' && (
              <p style={{ margin: '2px 0 0', fontSize: 13, color: 'var(--text-2)' }}>
                Total: <strong style={{ color: 'var(--accent)' }}>{formatBRL(total)}</strong>
              </p>
            )}
          </div>
          <button className="icon-btn" onClick={onClose} aria-label="Fechar">
            <Icon name="close" />
          </button>
        </div>

        {/* Body */}
        <div style={{ padding: '24px 28px 32px' }}>

          {/* LOADING */}
          {phase === 'loading' && (
            <div style={{ textAlign: 'center', padding: '48px 0' }}>
              <div style={{
                width: 40, height: 40,
                border: '3px solid var(--line-2)',
                borderTopColor: 'var(--accent)',
                borderRadius: '50%',
                animation: 'spin 0.9s linear infinite',
                margin: '0 auto 16px',
              }} />
              <p style={{ color: 'var(--text-2)', margin: 0, fontSize: 14 }}>Preparando o checkout…</p>
              <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
            </div>
          )}

          {/* PROCESSING */}
          {phase === 'processing' && (
            <div style={{ textAlign: 'center', padding: '48px 0' }}>
              <div style={{
                width: 40, height: 40,
                border: '3px solid var(--line-2)',
                borderTopColor: 'var(--accent)',
                borderRadius: '50%',
                animation: 'spin 0.9s linear infinite',
                margin: '0 auto 16px',
              }} />
              <p style={{ color: 'var(--text-2)', margin: 0, fontSize: 14 }}>Processando pagamento…</p>
            </div>
          )}

          {/* MP BRICK CONTAINER — always in DOM during form/processing so brick doesn't detach */}
          <div
            id="mp-brick-container"
            style={{ display: (phase === 'form' || phase === 'processing') ? 'block' : 'none' }}
          />

          {/* SUCCESS */}
          {phase === 'success' && (
            <div style={{ textAlign: 'center', padding: '40px 0' }}>
              <div style={{
                width: 56, height: 56, borderRadius: '50%',
                background: 'color-mix(in oklab, var(--accent) 15%, transparent)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                margin: '0 auto 20px',
                border: '2px solid var(--accent)',
              }}>
                <Icon name="check" size={26} stroke={2} />
              </div>
              <h3 style={{
                fontFamily: "'Instrument Serif', serif",
                fontSize: 28, fontStyle: 'italic', margin: '0 0 8px',
              }}>Pagamento aprovado!</h3>
              <p style={{ color: 'var(--text-2)', margin: 0, fontSize: 14, lineHeight: 1.6 }}>
                Obrigada pela sua compra. A Thaís vai entrar em contato para combinar a entrega.
              </p>
              <p style={{ fontSize: 12, color: 'var(--muted)', marginTop: 16 }}>
                Esta janela fechará em instantes…
              </p>
            </div>
          )}

          {/* PIX */}
          {phase === 'pix' && pixData && (
            <div style={{ textAlign: 'center' }}>
              <div style={{
                display: 'inline-flex', alignItems: 'center', gap: 8,
                background: 'color-mix(in oklab, var(--accent) 12%, transparent)',
                border: '1px solid var(--accent)',
                borderRadius: 8, padding: '8px 16px',
                fontSize: 13, color: 'var(--accent)',
                marginBottom: 20,
              }}>
                <Icon name="check" size={14} stroke={2.5} />
                Pix gerado com sucesso!
              </div>

              <p style={{ color: 'var(--text-2)', fontSize: 14, marginBottom: 20 }}>
                Escaneie o QR Code ou copie a chave Pix copia-e-cola abaixo.
              </p>

              {pixData.qr_code_base64 && (
                <div style={{ display: 'inline-block', padding: 12, background: '#fff', borderRadius: 8, marginBottom: 20 }}>
                  <img
                    src={`data:image/png;base64,${pixData.qr_code_base64}`}
                    alt="QR Code Pix"
                    style={{ width: 200, height: 200, display: 'block' }}
                  />
                </div>
              )}

              <div style={{
                background: 'var(--bg-2)', border: '1px solid var(--line-2)',
                borderRadius: 8, padding: '12px 16px',
                fontSize: 12, color: 'var(--text-2)',
                wordBreak: 'break-all', textAlign: 'left',
                marginBottom: 16, fontFamily: 'monospace',
              }}>
                {pixData.qr_code}
              </div>

              <button className="btn btn-primary" style={{ width: '100%', marginBottom: 12 }} onClick={copyPix}>
                <Icon name="check" size={15} /> {copied ? 'Copiado!' : 'Copiar chave Pix'}
              </button>

              <div style={{
                background: 'color-mix(in oklab, var(--accent) 8%, transparent)',
                border: '1px solid var(--line)',
                borderRadius: 8, padding: '12px 16px',
                fontSize: 12.5, color: 'var(--text-2)', lineHeight: 1.55,
              }}>
                <strong style={{ color: 'var(--text)' }}>Valor a pagar: {formatBRL(total)}</strong><br />
                O pagamento é confirmado automaticamente em poucos minutos. A Thaís entrará em contato para combinar a entrega.
              </div>
            </div>
          )}

          {/* ERROR */}
          {phase === 'error' && (
            <div style={{ textAlign: 'center', padding: '32px 0' }}>
              <div style={{
                width: 52, height: 52, borderRadius: '50%',
                background: 'color-mix(in oklab, #E8B4B8 12%, transparent)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                margin: '0 auto 16px',
                border: '1px solid #E8B4B8',
              }}>
                <Icon name="close" size={22} />
              </div>
              <h3 style={{
                fontFamily: "'Instrument Serif', serif",
                fontSize: 22, fontStyle: 'italic', margin: '0 0 8px',
              }}>Ops, algo deu errado</h3>
              <p style={{ color: 'var(--text-2)', margin: '0 0 24px', fontSize: 13.5, lineHeight: 1.6 }}>
                {errorMsg || 'Não foi possível processar o pagamento.'}
              </p>
              <button className="btn btn-primary" style={{ width: '100%', marginBottom: 12 }} onClick={retry}>
                Tentar novamente
              </button>
              <a
                className="btn btn-whats"
                style={{ width: '100%', display: 'inline-flex', justifyContent: 'center' }}
                href={buildWhatsAppUrl(cart)}
                target="_blank"
                rel="noreferrer"
              >
                <Icon name="whats" /> Finalizar pelo WhatsApp
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

Object.assign(window, { CheckoutModal });
