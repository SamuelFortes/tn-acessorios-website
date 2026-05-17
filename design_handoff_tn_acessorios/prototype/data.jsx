// Mock catalog data for TN Acessórios.

const CATEGORIES = [
  { id: 'joias', name: 'Joias', subtitle: 'Brincos, colares, anéis', tone: 'rose' },
  { id: 'perfumes', name: 'Perfumes', subtitle: 'Florais, doces e amadeirados', tone: 'wine' },
  { id: 'bolsas', name: 'Bolsas', subtitle: 'Estruturadas e festivas', tone: 'sand' },
  { id: 'kits', name: 'Kits de presente', subtitle: 'Prontos para presentear', tone: 'blush' },
];

const PRODUCTS = [
  // ── Joias ──────────────────────────────────────────────
  { id: 'j-01', cat: 'joias', name: 'Brinco Pérola Cluster',
    price: 79.90, oldPrice: 99.90,
    placeholder: 'earrings-pearl',
    tags: ['Mais vendido'],
    desc: 'Composição de mini pérolas em formato de cacho. Banho de ouro 18k antialérgico, fecho tarraxa de pressão.',
    options: { 'Cor': ['Pérola branca', 'Pérola creme'] } },
  { id: 'j-02', cat: 'joias', name: 'Colar Coração Dourado',
    price: 119.90, placeholder: 'necklace-heart',
    tags: ['Novidade'],
    desc: 'Corrente fina 45 cm com pingente coração vazado. Banho de ouro 18k.',
    options: { 'Tamanho': ['40 cm', '45 cm', '50 cm'] } },
  { id: 'j-03', cat: 'joias', name: 'Brinco Argola Texturizada',
    price: 64.90, placeholder: 'earrings-hoop',
    desc: 'Argola média 2,5 cm com textura martelada. Acabamento dourado fosco.' },
  { id: 'j-04', cat: 'joias', name: 'Anel Solitário Cravejado',
    price: 89.90, placeholder: 'ring-solitaire',
    desc: 'Anel ajustável com zircônia central de 6 mm em garra. Banho de ouro 18k.',
    options: { 'Aro': ['14', '16', '18', '20'] } },
  { id: 'j-05', cat: 'joias', name: 'Brinco Coração Pérola',
    price: 59.90, placeholder: 'earrings-heart',
    tags: ['Queridinho'],
    desc: 'Pequeno coração vazado com pérola central. Ideal para uso diário.' },
  { id: 'j-06', cat: 'joias', name: 'Pulseira Elos Riviera',
    price: 99.90, placeholder: 'bracelet-chain',
    desc: 'Pulseira com elos médios e cravejamento contínuo. Fecho mosquetão reforçado.' },

  // ── Perfumes ───────────────────────────────────────────
  { id: 'p-01', cat: 'perfumes', name: 'Egeo Choc Feminino',
    price: 159.90, placeholder: 'perfume-red',
    tags: ['O Boticário'],
    desc: 'Floral gourmand. Notas de chocolate, jasmim e baunilha. Frasco 90 ml.' },
  { id: 'p-02', cat: 'perfumes', name: 'Lily Essence',
    price: 299.90, placeholder: 'perfume-white',
    tags: ['O Boticário', 'Mais vendido'],
    desc: 'Eau de parfum floral elegante com notas de lírio, bergamota e almíscar. 75 ml.' },
  { id: 'p-03', cat: 'perfumes', name: 'Coffee Woman Seduction',
    price: 119.90, placeholder: 'perfume-amber',
    tags: ['O Boticário'],
    desc: 'Oriental amadeirado, com café tostado, baunilha e patchouli. 100 ml.' },
  { id: 'p-04', cat: 'perfumes', name: 'Floratta Rose Garden',
    price: 99.90, placeholder: 'perfume-rose',
    desc: 'Floral rosado, leve e juvenil. Eau de toilette 75 ml.' },

  // ── Bolsas ─────────────────────────────────────────────
  { id: 'b-01', cat: 'bolsas', name: 'Bolsa Carmim Estruturada',
    price: 249.90, oldPrice: 289.90,
    placeholder: 'bag-red',
    tags: ['Editorial'],
    desc: 'Bolsa transversal em couro sintético texturizado. Alça regulável colorida.',
    options: { 'Cor': ['Carmim', 'Preto', 'Caramelo'] } },
  { id: 'b-02', cat: 'bolsas', name: 'Mini Bolsa Camelo',
    price: 189.90, placeholder: 'bag-tan',
    desc: 'Mini bolsa quadrada com fivela dourada. Espaço para celular e cartões.' },
  { id: 'b-03', cat: 'bolsas', name: 'Clutch Festa Acetinada',
    price: 169.90, placeholder: 'bag-clutch',
    desc: 'Clutch envelope com acabamento acetinado e corrente removível.',
    options: { 'Cor': ['Champagne', 'Bordô', 'Rosé'] } },

  // ── Kits ───────────────────────────────────────────────
  { id: 'k-01', cat: 'kits', name: 'Kit Mãe Querida',
    price: 219.90, placeholder: 'kit-mae',
    tags: ['Best-seller'],
    desc: 'Caixa presenteável com hidratante corporal, mini perfume e cartão personalizado. Embalagem com laço.' },
  { id: 'k-02', cat: 'kits', name: 'Kit Aniversário Rosé',
    price: 179.90, placeholder: 'kit-aniver',
    desc: 'Brinco pérola + colar coração + bombons artesanais em caixa branca com laço rosé.' },
  { id: 'k-03', cat: 'kits', name: 'Kit Surpresa Especial',
    price: 289.90, placeholder: 'kit-especial',
    tags: ['Personalizável'],
    desc: 'Você escolhe 3 produtos: monte do seu jeito. Embalagem premium inclusa.' },
];

const TESTIMONIALS = [
  { name: 'Carla M.', text: 'Comprei o kit pra minha mãe e ela amou. A embalagem chegou perfeita, com bilhete escrito à mão.', rating: 5 },
  { name: 'Juliana R.', text: 'Os brincos são lindos e não escurecem. Já estou no terceiro pedido!', rating: 5 },
  { name: 'Patrícia L.', text: 'Atendimento super atencioso pelo WhatsApp. A Thaís ajuda a montar o presente certinho.', rating: 5 },
];

function formatBRL(v) {
  return v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

function productById(id) { return PRODUCTS.find(p => p.id === id); }
function productsByCat(cat) { return PRODUCTS.filter(p => p.cat === cat); }
function categoryById(id) { return CATEGORIES.find(c => c.id === id); }

Object.assign(window, {
  CATEGORIES, PRODUCTS, TESTIMONIALS,
  formatBRL, productById, productsByCat, categoryById,
});
