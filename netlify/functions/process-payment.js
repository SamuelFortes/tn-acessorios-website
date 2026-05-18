// Netlify Function — processa pagamento via Mercado Pago
// MP_ACCESS_TOKEN NUNCA deve estar no código-fonte; define-se nas variáveis de ambiente do Netlify.

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

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

  const { formData, total, description } = body;
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

    return {
      statusCode: 200,
      headers: CORS,
      body: JSON.stringify({
        id: payment.id,
        status: payment.status,
        status_detail: payment.status_detail,
        payment_method_id: payment.payment_method_id,
        point_of_interaction: payment.point_of_interaction ?? null,
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
