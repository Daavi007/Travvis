export type CategoryId =
  | "camisas-oversized"
  | "camisa-long"
  | "bermudas"
  | "calcados"
  | "relogios"
  | "bones"
  | "roupas";

export type Product = {
  slug: string;
  sku: string;
  name: string;
  category: CategoryId;
  price: number;
  description: string;
  details: string[];
  sizes: string[];
  colors: { name: string; hex: string }[];
  accent: string;
  ink: string;
  art: "tee" | "hoodie" | "pants" | "watch" | "cap";
  image?: string;
  images?: string[];
  stock?: number;
};

export function productImages(product: Product) {
  if (product.images && product.images.length > 0) return product.images;
  return product.image ? [product.image] : [];
}

export const categories: { id: CategoryId; label: string; text: string }[] = [
  {
    id: "camisas-oversized",
    label: "Camisas Oversized",
    text: "Camisetas oversized com caimento solto.",
  },
  {
    id: "camisa-long",
    label: "Camisas Long",
    text: "Camisas longas para o dia a dia.",
  },
  {
    id: "bermudas",
    label: "Bermudas",
    text: "Bermudas leves para o calor.",
  },
  {
    id: "calcados",
    label: "Calçados",
    text: "Calçados para fechar o visual.",
  },
  {
    id: "relogios",
    label: "Relógios",
    text: "Peças de pulso para o dia e para a noite.",
  },
  {
    id: "bones",
    label: "Bonés",
    text: "Aba curva, trucker e dad hat.",
  },
];

export const products: Product[] = [
  {
    slug: "camiseta-oversized-noir",
    sku: "TV-01",
    name: "Camiseta Oversized Noir",
    category: "camisas-oversized",
    price: 139,
    description: "Malha de algodão pesada, ombro caído e gola que segura o formato depois de lavar.",
    details: ["100% algodão", "Caimento oversized", "Gola reforçada"],
    sizes: ["PP", "P", "M", "G", "GG"],
    colors: [
      { name: "Preto", hex: "#161616" },
      { name: "Off-white", hex: "#f3efe6" },
    ],
    accent: "#1c1c1c",
    ink: "#f3efe6",
    art: "tee",
  },
  {
    slug: "moletom-mescla-essential",
    sku: "TV-02",
    name: "Moletom Mescla Essential",
    category: "roupas",
    price: 269,
    description: "Moletom fechado, felpado por dentro, com capuz e punho ajustado.",
    details: ["Felpa macia", "Capuz com cordão", "Punho e barra canelados"],
    sizes: ["P", "M", "G", "GG"],
    colors: [
      { name: "Mescla", hex: "#8d8d8d" },
      { name: "Preto", hex: "#161616" },
    ],
    accent: "#cfc6ba",
    ink: "#2f3338",
    art: "hoodie",
  },
  {
    slug: "calca-cargo-areia",
    sku: "TV-03",
    name: "Calça Cargo Areia",
    category: "roupas",
    price: 319,
    description: "Cargo de sarja leve, bolsos laterais e cós com elástico discreto.",
    details: ["Sarja de algodão", "Bolsos cargo", "Cós confortável"],
    sizes: ["38", "40", "42", "44", "46"],
    colors: [
      { name: "Areia", hex: "#cbb892" },
      { name: "Verde oliva", hex: "#4d5538" },
    ],
    accent: "#d9c7a6",
    ink: "#3a3126",
    art: "pants",
  },
  {
    slug: "relogio-aco-classico",
    sku: "TV-04",
    name: "Relógio Aço Clássico",
    category: "relogios",
    price: 459,
    description: "Caixa de aço, mostrador limpo e pulseira que funciona do trabalho ao fim de semana.",
    details: ["Caixa de aço", "Resistente a respingos", "Pulseira ajustável"],
    sizes: [],
    colors: [{ name: "Aço", hex: "#c5c8cc" }],
    accent: "#e4e7ea",
    ink: "#22262b",
    art: "watch",
  },
  {
    slug: "relogio-minimal-dourado",
    sku: "TV-05",
    name: "Relógio Minimal Dourado",
    category: "relogios",
    price: 549,
    description: "Mostrador enxuto e acabamento dourado para usar com pouca coisa e ainda aparecer.",
    details: ["Acabamento dourado", "Mostrador minimal", "Fecho de segurança"],
    sizes: [],
    colors: [{ name: "Dourado", hex: "#d4c09a" }],
    accent: "#1b1916",
    ink: "#e4d2a8",
    art: "watch",
  },
  {
    slug: "relogio-sport-preto",
    sku: "TV-06",
    name: "Relógio Sport Preto",
    category: "relogios",
    price: 379,
    description: "Visual esportivo, caixa preta e marcação de fácil leitura.",
    details: ["Caixa preta", "Mostrador de alto contraste", "Pulseira em silicone"],
    sizes: [],
    colors: [{ name: "Preto", hex: "#111111" }],
    accent: "#121212",
    ink: "#f4f4f4",
    art: "watch",
  },
  {
    slug: "bone-aba-curva-preto",
    sku: "TV-07",
    name: "Boné Aba Curva Preto",
    category: "bones",
    price: 119,
    description: "Aba curva, copa estruturada e fecho regulável.",
    details: ["Aba curva", "Fecho regulável", "Bordado frontal"],
    sizes: ["Único"],
    colors: [
      { name: "Preto", hex: "#161616" },
      { name: "Marrom", hex: "#5c4030" },
    ],
    accent: "#2b2b2b",
    ink: "#f2f0ea",
    art: "cap",
  },
  {
    slug: "bone-trucker-off",
    sku: "TV-08",
    name: "Boné Trucker Off-white",
    category: "bones",
    price: 129,
    description: "Frente em sarja e tela traseira. Leve para o dia inteiro.",
    details: ["Frente estruturada", "Tela traseira", "Fecho regulável"],
    sizes: ["Único"],
    colors: [{ name: "Off-white", hex: "#f3efe6" }],
    accent: "#f3efe6",
    ink: "#1b1b1b",
    art: "cap",
  },
  {
    slug: "bone-dad-hat-oliva",
    sku: "TV-09",
    name: "Boné Dad Hat Oliva",
    category: "bones",
    price: 109,
    description: "Copa baixa, aba reta e cor oliva que combina com o restante da vitrine.",
    details: ["Copa baixa", "Aba reta", "Ajuste traseiro"],
    sizes: ["Único"],
    colors: [{ name: "Oliva", hex: "#4d5538" }],
    accent: "#3e4a38",
    ink: "#e7ecdf",
    art: "cap",
  },
];

export function getProduct(slug: string) {
  return products.find((product) => product.slug === slug);
}

export function getRelated(slug: string) {
  const product = getProduct(slug);
  if (!product) return [];
  const same = products.filter((item) => item.category === product.category && item.slug !== slug);
  const rest = products.filter((item) => item.slug !== slug && item.category !== product.category);
  return [...same, ...rest].slice(0, 3);
}

export function categoryLabel(id: string) {
  if (id === "roupas") return "Roupas";
  return categories.find((category) => category.id === id)?.label ?? "A vitrine";
}
