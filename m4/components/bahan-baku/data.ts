export type BahanBaku = {
  code: string;
  name: string;
  unit: string;
  stock: number;
  minimumStock: number;
  price: number;
  note: string;
};

export const bahanBakuData: BahanBaku[] = [
  {
    code: "BB-001",
    name: "Cabe",
    unit: "kg",
    stock: 250,
    minimumStock: 50,
    price: 76250,
    note: "Cabe untuk bumbu keripik balado.",
  },
  {
    code: "BB-002",
    name: "Gula Pasir",
    unit: "kg",
    stock: 120,
    minimumStock: 30,
    price: 19500,
    note: "",
  },
  {
    code: "BB-003",
    name: "Minyak Goreng",
    unit: "liter",
    stock: 80,
    minimumStock: 20,
    price: 20200,
    note: "",
  },
  {
    code: "BB-004",
    name: "Singkong",
    unit: "kg",
    stock: 45,
    minimumStock: 15,
    price: 5600,
    note: "",
  },
  {
    code: "BB-005",
    name: "Bawang Putih",
    unit: "kg",
    stock: 60,
    minimumStock: 10,
    price: 32750,
    note: "",
  },
  {
    code: "BB-006",
    name: "Garam",
    unit: "kg",
    stock: 25,
    minimumStock: 5,
    price: 3500,
    note: "",
  },
];

export function getBahanBaku(code: string) {
  return bahanBakuData.find(
    (material) => material.code.toLowerCase() === code.toLowerCase(),
  );
}

export function formatRupiah(amount: number) {
  return `Rp${amount.toLocaleString("id-ID")}`;
}
