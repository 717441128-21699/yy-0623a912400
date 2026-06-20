import Taro from '@tarojs/taro'
import type { ReceiptRecord } from '@/types/coldchain'

const RECEIPT_STORAGE_KEY = 'coldchain_receipts'

export const saveReceipts = (receipts: ReceiptRecord[]) => {
  try {
    Taro.setStorageSync(RECEIPT_STORAGE_KEY, JSON.stringify(receipts))
  } catch (e) {
    console.error('[storage] save receipts error:', e)
  }
}

export const loadReceipts = (): ReceiptRecord[] | null => {
  try {
    const data = Taro.getStorageSync(RECEIPT_STORAGE_KEY)
    if (data) {
      return JSON.parse(data)
    }
  } catch (e) {
    console.error('[storage] load receipts error:', e)
  }
  return null
}

export const updateReceipt = (receipt: ReceiptRecord) => {
  const saved = loadReceipts() || []
  const idx = saved.findIndex(r => r.id === receipt.id)
  if (idx >= 0) {
    saved[idx] = receipt
  } else {
    saved.push(receipt)
  }
  saveReceipts(saved)
}

export const getSavedReceiptById = (id: string): ReceiptRecord | undefined => {
  const saved = loadReceipts()
  if (saved) {
    return saved.find(r => r.id === id)
  }
  return undefined
}
