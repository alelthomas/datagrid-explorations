export interface StockData {
  id: string
  symbol: string
  name: string
  price: number
  change: number
  changePercent: number
  volume: number
  range52Week: {
    low: number
    high: number
  }
  history: {
    date: string
    price: number
  }[]
  prediction: {
    date: string
    price: number
  }[]
} 