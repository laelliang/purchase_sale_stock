export interface StringKeyObject {
  [key: string]: any;
}

export interface Products {
  id?: number,
  name: string,
  unit: string,
  specification: string,
  weight: number,
  price: number,
  quantity: number
}
