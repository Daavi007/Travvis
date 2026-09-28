export type CategoryId =
  | "camisas-oversized"
  | "camisa-long"
  | "camisas-polo"
  | "short"
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
    id: "camisas-polo",
    label: "Camisas Polo",
    text: "Polos para o dia a dia.",
  },
  {
    id: "short",
    label: "Short",
    text: "Shorts leves para o calor.",
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

export const products: Product[] = [];

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
  if (id === "bermudas") return "Short";
  return categories.find((category) => category.id === id)?.label ?? "A vitrine";
}

export function sameCategory(productCategory: string, categoryId: string) {
  if (productCategory === categoryId) return true;
  return categoryId === "short" && productCategory === "bermudas";
}

export const letterSizes = ["PP", "P", "M", "G", "GG"];
export const numberSizes = ["36", "38", "40", "42", "44", "46"];

export function sizeOptions(category: CategoryId) {
  if (category === "relogios") return [];
  if (category === "bones") return ["Único"];
  if (category === "short" || category === "bermudas" || category === "calcados") return numberSizes;
  return letterSizes;
}

export function displaySizes(product: Product) {
  if (product.sizes.length === 0) return [];
  if (product.sizes.length === 1 && /único|unico/i.test(product.sizes[0])) return product.sizes;
  const numeric = product.sizes.every((item) => /^\d+$/.test(item));
  const chart = numeric ? numberSizes : letterSizes;
  const extra = product.sizes.filter((item) => !chart.includes(item));
  return [...chart, ...extra];
}
