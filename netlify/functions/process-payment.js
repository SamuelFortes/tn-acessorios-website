// Netlify Function — processa pagamento via Mercado Pago
// MP_ACCESS_TOKEN NUNCA deve estar no código-fonte; define-se nas variáveis de ambiente do Netlify.

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

function buildPhone(payer) {
  const area = payer?.phone?.area_code ? String(payer.phone.area_code) : '';
  const number = payer?.phone?.number ? String(payer.phone.number) : '';
  return area || number ? `${area}${number}` : null;
}

async function persistOrder({ orderItems, total, payment, payer }) {
  const supabaseUrl = process.env.SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceRoleKey || !Array.isArray(orderItems) || orderItems.length === 0) {
    return null;
  }

  const orderPayload = {
    status: payment.status === 'approved' ? 'confirmed' : 'pending',
    customer_name: [payer?.first_name, payer?.last_name].filter(Boolean).join(' ') || null,
    customer_email: payer?.email || null,
    customer_phone: buildPhone(payer),
    payment_status: payment.status || null,
    payment_reference: payment.id ? String(payment.id) : null,
    payment_method: payment.payment_method_id || null,
    subtotal: Number(Number(total).toFixed(2)),
    shipping_amount: 0,
    total: Number(Number(total).toFixed(2)),
    notes: payment.status_detail || null,
    source: 'netlify-site',
  };

  const headers = {
    apikey: serviceRoleKey,
    Authorization: `Bearer ${serviceRoleKey}`,
    'Content-Type': 'application/json',
  };

  const orderResponse = await fetch(`${supabaseUrl}/rest/v1/orders?select=id`, {
    method: 'POST',
    headers: {
      ...headers,
      Prefer: 'return=representation',
    },
    body: JSON.stringify(orderPayload),
  });

  const orderRows = await orderResponse.json();
  if (!orderResponse.ok || !Array.isArray(orderRows) || !orderRows[0]?.id) {
    throw new Error('Nao foi possivel salvar o pedido no Supabase.');
  }

  const orderId = orderRows[0].id;
  const itemsPayload = orderItems.map((item) => ({
    order_id: orderId,
    product_id: item.productId,
    product_name: item.productName,
    variant: item.variant || null,
    unit_price: Number(Number(item.unitPrice || 0).toFixed(2)),
    qty: Number(item.qty || 0),
    line_total: Number(Number(item.lineTotal || 0).toFixed(2)),
  }));

  const itemsResponse = await fetch(`${supabaseUrl}/rest/v1/order_items`, {
    method: 'POST',
    headers,
    body: JSON.stringify(itemsPayload),
  });

  if (!itemsResponse.ok) {
    throw new Error('Nao foi possivel salvar os itens do pedido no Supabase.');
  }

  return orderId;
}

exports.handler = async function (event) {
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 204, headers: CORS, body: '' };
  }

  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, headers: CORS, body: JSON.stringify({ error: 'Method not allowed' }) };
  }

  const accessToken = process.env.MP_ACCESS_TOKEN;
  if (!accessToken) {
    return { statusCode: 500, headers: CORS, body: JSON.stringify({ error: 'Chave de acesso não configurada.' }) };
  }

  let body;
  try {
    body = JSON.parse(event.body);
  } catch {
    return { statusCode: 400, headers: CORS, body: JSON.stringify({ error: 'Body inválido.' }) };
  }

  const { formData, total, description, orderItems } = body;
  if (!formData || !total) {
    return { statusCode: 400, headers: CORS, body: JSON.stringify({ error: 'Dados incompletos.' }) };
  }

  const idempotencyKey = `tn-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;

  const payload = {
    ...formData,
    transaction_amount: Number(Number(total).toFixed(2)),
    description: String(description || 'TN Acessórios — pedido online').slice(0, 254),
    statement_descriptor: 'TN ACESSORIOS',
  };

  try {
    const mpRes = await fetch('https://api.mercadopago.com/v1/payments', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
        'X-Idempotency-Key': idempotencyKey,
      },
      body: JSON.stringify(payload),
    });

    const payment = await mpRes.json();

    if (!mpRes.ok) {
      return {
        statusCode: mpRes.status,
        headers: CORS,
        body: JSON.stringify({ error: payment.message || 'Erro no Mercado Pago.', cause: payment.cause }),
      };
    }

    let orderId = null;
    let orderSaveWarning = null;

    try {
      orderId = await persistOrder({
        orderItems,
        total,
        payment,
        payer: formData.payer,
      });
    } catch (orderError) {
      orderSaveWarning = orderError.message || 'Falha ao salvar o pedido no Supabase.';
    }

    return {
      statusCode: 200,
      headers: CORS,
      body: JSON.stringify({
        id: payment.id,
        status: payment.status,
        status_detail: payment.status_detail,
        payment_method_id: payment.payment_method_id,
        point_of_interaction: payment.point_of_interaction ?? null,
        order_id: orderId,
        order_save_warning: orderSaveWarning,
      }),
    };
  } catch (err) {
    return {
      statusCode: 502,
      headers: CORS,
      body: JSON.stringify({ error: 'Falha de comunicação com o Mercado Pago.' }),
    };
  }
};
