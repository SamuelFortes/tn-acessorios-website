# Supabase + Netlify

## Esquema das tabelas

- `categories`: categorias exibidas na home e nas paginas de colecao.
- `products`: catalogo principal consumido pelo frontend.
- `orders`: cabecalho do pedido salvo pela Netlify Function depois da tentativa de pagamento.
- `order_items`: itens de cada pedido.

O SQL completo esta em [supabase/schema.sql](C:/Users/077114263/Documents/tn-acessorios-website/supabase/schema.sql).

## Arquivos alterados

- [index.html](C:/Users/077114263/Documents/tn-acessorios-website/index.html): carrega `supabase-js` via CDN.
- [data.jsx](C:/Users/077114263/Documents/tn-acessorios-website/data.jsx): fallback local + carregamento remoto do catalogo no Supabase.
- [app.jsx](C:/Users/077114263/Documents/tn-acessorios-website/app.jsx): recarrega a UI quando o catalogo remoto chega.
- [checkout.jsx](C:/Users/077114263/Documents/tn-acessorios-website/checkout.jsx): envia os itens do pedido para a function.
- [netlify/functions/supabase-config.js](C:/Users/077114263/Documents/tn-acessorios-website/netlify/functions/supabase-config.js): entrega a configuracao publica do Supabase ao browser.
- [netlify/functions/process-payment.js](C:/Users/077114263/Documents/tn-acessorios-website/netlify/functions/process-payment.js): processa pagamento e tenta persistir o pedido no Supabase.

## Como conectar

1. Crie um projeto no Supabase.
2. No SQL Editor do Supabase, rode o arquivo [supabase/schema.sql](C:/Users/077114263/Documents/tn-acessorios-website/supabase/schema.sql).
3. No painel da Netlify, abra `Site configuration -> Environment variables`.
4. Cadastre estas variaveis:
   - `SUPABASE_URL`: URL do projeto Supabase.
   - `SUPABASE_ANON_KEY`: chave publica usada pelo frontend para ler catalogo.
   - `SUPABASE_SERVICE_ROLE_KEY`: chave privada usada apenas nas Netlify Functions para gravar pedidos.
   - `MP_ACCESS_TOKEN`: se quiser continuar usando o fluxo de pagamento atual.
5. Faça um novo deploy na Netlify.

## Fluxo implementado

- O site continua funcionando mesmo sem Supabase configurado, usando os dados locais como fallback.
- Quando `SUPABASE_URL` e `SUPABASE_ANON_KEY` existem, o frontend busca `categories` e `products` do Supabase.
- Depois de um pagamento criado pelo Mercado Pago, a Netlify Function tenta salvar `orders` e `order_items` usando `SUPABASE_SERVICE_ROLE_KEY`.

## Observacoes

- O `anon key` pode ser exposto ao browser. O `service_role` nunca deve ir para o frontend.
- A leitura publica do catalogo depende das policies de RLS criadas no SQL.
- Se voce editar os produtos no painel do Supabase, o site passa a refletir isso sem precisar alterar [data.jsx](C:/Users/077114263/Documents/tn-acessorios-website/data.jsx).
