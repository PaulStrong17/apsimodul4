export type AdminProduct = {
  code: string;
  name: string;
  variation: string;
  stock: number;
  recipe: string;
};

export type Product = {
  code: string;
  name: string;
  variation: string;
  stock: number;
  price: number;
  description: string;
};

export const products: Product[] = [
  {
    code: "PRD-001",
    name: "Keripik Cabe Original",
    variation: "Original",
    stock: 120,
    price: 25000,
    description: "Keripik cabe kemasan",
  },
  {
    code: "PRD-002",
    name: "Keripik Cabe Pedas",
    variation: "Pedas",
    stock: 85,
    price: 27000,
    description: "Keripik cabe dengan rasa pedas.",
  },
  {
    code: "PRD-003",
    name: "Keripik Cabe Extra Pedas",
    variation: "Extra Pedas",
    stock: 60,
    price: 28000,
    description: "Keripik cabe dengan rasa extra pedas.",
  },
  {
    code: "PRD-004",
    name: "Keripik Cabe Balado",
    variation: "Balado",
    stock: 45,
    price: 27000,
    description: "Keripik cabe rasa balado.",
  },
  {
    code: "PRD-005",
    name: "Keripik Cabe Kemasan Besar",
    variation: "Original 500 g",
    stock: 30,
    price: 48000,
    description: "Keripik cabe kemasan besar 500 gram.",
  },
];

export function getProduct(code: string) {
  return products.find((product) => product.code === code);
}

export function formatProductPrice(price: number) {
  return `Rp${price.toLocaleString("id-ID")}`;
}

export function formatProductStock(stock: number) {
  return stock.toLocaleString("id-ID");
}
