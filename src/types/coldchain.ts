export type TempStatus = 'normal' | 'warning' | 'danger'

export type ColdChainStage =
  | 'overseas'
  | 'shipping'
  | 'port'
  | 'warehouse'
  | 'delivery'

export interface TemperaturePoint {
  time: string
  temperature: number
  status: TempStatus
}

export interface StageInfo {
  stage: ColdChainStage
  stageName: string
  startTime: string
  endTime: string
  avgTemp: number
  minTemp: number
  maxTemp: number
  tempRange: string
  status: TempStatus
  tempPoints: TemperaturePoint[]
  description?: string
  anomalyNote?: string
}

export interface BatchInfo {
  id: string
  containerNo: string
  supplierBatchNo: string
  productName: string
  productType: string
  origin: string
  weight: number
  tempRequired: string
  tempMin: number
  tempMax: number
  expectedArrival: string
  actualArrival?: string
  overallStatus: TempStatus
  stages: StageInfo[]
}

export type ReceiptStatus = 'pending' | 'processing' | 'completed' | 'rejected'

export interface ReceiptRecord {
  id: string
  batchId: string
  containerNo: string
  productName: string
  createTime: string
  status: ReceiptStatus
  outerPackageOk?: boolean
  sealOk?: boolean
  arrivalTemp?: number
  platformTemp?: number
  tempGap?: number
  photos?: string[]
  notes?: string
  receiver?: string
}

export interface ServiceSpeech {
  id: string
  batchId: string
  containerNo: string
  productName: string
  category: 'temp' | 'delay' | 'inspection' | 'customs'
  categoryName: string
  title: string
  content: string
  shortContent: string
  createTime: string
  usedCount: number
}
