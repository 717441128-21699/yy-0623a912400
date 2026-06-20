import type { ReceiptRecord } from '@/types/coldchain'
import { loadReceipts } from '@/utils/storage'

export const mockReceipts: ReceiptRecord[] = [
  {
    id: 'R001',
    batchId: 'B001',
    containerNo: 'MSCU1234567',
    productName: '澳洲和牛M9西冷',
    createTime: '2024-06-20 07:30',
    status: 'pending'
  },
  {
    id: 'R002',
    batchId: 'B002',
    containerNo: 'MAEU9876543',
    productName: '新西兰帝王鲑',
    createTime: '2024-06-18 09:45',
    status: 'completed',
    outerPackageOk: true,
    sealOk: true,
    arrivalTemp: 2.5,
    platformTemp: 2.3,
    tempGap: 0.2,
    photos: ['https://picsum.photos/id/292/300/300', 'https://picsum.photos/id/312/300/300'],
    receiver: '张经理',
    notes: '货物完好，温度正常'
  },
  {
    id: 'R003',
    batchId: 'B003',
    containerNo: 'HLCU5556667',
    productName: '智利蓝莓（礼盒装）',
    createTime: '2024-06-19 15:20',
    status: 'processing',
    outerPackageOk: true,
    sealOk: true,
    arrivalTemp: 6.8,
    platformTemp: 3.5,
    tempGap: 3.3,
    photos: ['https://picsum.photos/id/401/300/300'],
    receiver: '李主管'
  },
  {
    id: 'R004',
    batchId: 'B004',
    containerNo: 'EMCU4443332',
    productName: '波士顿龙虾（活鲜）',
    createTime: '2024-06-21 09:00',
    status: 'pending'
  },
  {
    id: 'R005',
    batchId: 'B005',
    containerNo: 'COSU2221119',
    productName: '阿根廷草饲牛排',
    createTime: '2024-06-22 12:00',
    status: 'pending'
  },
  {
    id: 'R006',
    batchId: 'B006',
    containerNo: 'MSCU8887771',
    productName: '泰国金枕榴莲',
    createTime: '2024-06-21 16:00',
    status: 'pending'
  }
]

const getMergedReceipts = (): ReceiptRecord[] => {
  const saved = loadReceipts()
  if (!saved) return mockReceipts

  const merged = [...mockReceipts]
  saved.forEach(savedR => {
    const idx = merged.findIndex(r => r.id === savedR.id)
    if (idx >= 0) {
      merged[idx] = savedR
    } else {
      merged.push(savedR)
    }
  })
  return merged.sort((a, b) => new Date(b.createTime).getTime() - new Date(a.createTime).getTime())
}

export const getReceiptById = (id: string): ReceiptRecord | undefined => {
  const merged = getMergedReceipts()
  return merged.find(r => r.id === id)
}

export const getReceiptsByStatus = (status?: string): ReceiptRecord[] => {
  const merged = getMergedReceipts()
  if (!status || status === 'all') return merged
  return merged.filter(r => r.status === status)
}
