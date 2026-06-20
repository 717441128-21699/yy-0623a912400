import type { BatchInfo, StageInfo, TemperaturePoint, TempStatus } from '@/types/coldchain'

const genTempPoints = (base: number, variance: number, count: number, min: number, max: number): TemperaturePoint[] => {
  const points: TemperaturePoint[] = []
  for (let i = 0; i < count; i++) {
    const temp = +(base + (Math.random() - 0.5) * variance).toFixed(1)
    let status: TempStatus = 'normal'
    if (temp < min || temp > max) {
      status = Math.abs(temp - (temp < min ? min : max)) > 1 ? 'danger' : 'warning'
    }
    points.push({
      time: `${(i * 2).toString().padStart(2, '0')}:00`,
      temperature: temp,
      status
    })
  }
  return points
}

export const mockBatches: BatchInfo[] = [
  {
    id: 'B001',
    containerNo: 'MSCU1234567',
    supplierBatchNo: 'AUS-BEEF-20240615',
    productName: '澳洲和牛M9西冷',
    productType: '冷冻牛肉',
    origin: '澳大利亚',
    weight: 12500,
    tempRequired: '-18°C以下冷冻',
    tempMin: -25,
    tempMax: -18,
    expectedArrival: '2024-06-20 08:00',
    actualArrival: '2024-06-20 07:30',
    overallStatus: 'warning',
    stages: [
      {
        stage: 'overseas',
        stageName: '境外发运',
        startTime: '2024-06-10 09:00',
        endTime: '2024-06-11 18:00',
        avgTemp: -21.5,
        minTemp: -23.2,
        maxTemp: -19.8,
        tempRange: '-25 ~ -18°C',
        status: 'normal',
        description: '悉尼冷链仓库装箱，预冷48小时后装柜',
        tempPoints: genTempPoints(-21, 2, 10, -25, -18)
      },
      {
        stage: 'shipping',
        stageName: '海运运输',
        startTime: '2024-06-11 20:00',
        endTime: '2024-06-17 14:00',
        avgTemp: -20.8,
        minTemp: -22.6,
        maxTemp: -19.2,
        tempRange: '-25 ~ -18°C',
        status: 'normal',
        description: '冷藏集装箱海运，全程发电机供电制冷',
        tempPoints: genTempPoints(-21, 2, 15, -25, -18)
      },
      {
        stage: 'port',
        stageName: '口岸等待',
        startTime: '2024-06-17 16:00',
        endTime: '2024-06-18 11:00',
        avgTemp: -17.2,
        minTemp: -19.5,
        maxTemp: -15.8,
        tempRange: '-25 ~ -18°C',
        status: 'warning',
        description: '上海洋山港靠港等待清关',
        anomalyNote: '口岸查验开门8分钟，温度短时回升，复测后恢复正常',
        tempPoints: [
          ...genTempPoints(-20, 1.5, 3, -25, -18),
          { time: '06:15', temperature: -15.8, status: 'warning' },
          { time: '06:23', temperature: -17.2, status: 'warning' },
          ...genTempPoints(-20, 1.5, 5, -25, -18)
        ]
      },
      {
        stage: 'warehouse',
        stageName: '监管仓暂存',
        startTime: '2024-06-18 14:00',
        endTime: '2024-06-19 22:00',
        avgTemp: -21.2,
        minTemp: -22.8,
        maxTemp: -19.6,
        tempRange: '-25 ~ -18°C',
        status: 'normal',
        description: '上海外高桥保税冷链监管仓',
        tempPoints: genTempPoints(-21, 1.5, 12, -25, -18)
      },
      {
        stage: 'delivery',
        stageName: '门店配送',
        startTime: '2024-06-20 05:00',
        endTime: '2024-06-20 07:30',
        avgTemp: -19.8,
        minTemp: -21.5,
        maxTemp: -18.2,
        tempRange: '-25 ~ -18°C',
        status: 'normal',
        description: '冷链专车配送，全程温度监控',
        tempPoints: genTempPoints(-20, 1.5, 6, -25, -18)
      }
    ]
  },
  {
    id: 'B002',
    containerNo: 'MAEU9876543',
    supplierBatchNo: 'NZL-SALMON-20240612',
    productName: '新西兰帝王鲑',
    productType: '冰鲜水产',
    origin: '新西兰',
    weight: 8200,
    tempRequired: '0~4°C冷藏',
    tempMin: 0,
    tempMax: 4,
    expectedArrival: '2024-06-18 10:00',
    actualArrival: '2024-06-18 09:45',
    overallStatus: 'normal',
    stages: [
      {
        stage: 'overseas',
        stageName: '境外发运',
        startTime: '2024-06-14 06:00',
        endTime: '2024-06-14 22:00',
        avgTemp: 2.1,
        minTemp: 0.8,
        maxTemp: 3.2,
        tempRange: '0 ~ 4°C',
        status: 'normal',
        description: '基督城机场冷库装箱，冰袋预冷',
        tempPoints: genTempPoints(2, 1.5, 8, 0, 4)
      },
      {
        stage: 'shipping',
        stageName: '空运运输',
        startTime: '2024-06-15 00:00',
        endTime: '2024-06-15 18:00',
        avgTemp: 2.5,
        minTemp: 1.0,
        maxTemp: 3.6,
        tempRange: '0 ~ 4°C',
        status: 'normal',
        description: '新西兰航空冷链航班',
        tempPoints: genTempPoints(2.5, 1.2, 10, 0, 4)
      },
      {
        stage: 'port',
        stageName: '口岸等待',
        startTime: '2024-06-15 20:00',
        endTime: '2024-06-16 12:00',
        avgTemp: 2.8,
        minTemp: 1.2,
        maxTemp: 3.8,
        tempRange: '0 ~ 4°C',
        status: 'normal',
        description: '浦东机场货站冷链区',
        tempPoints: genTempPoints(2.8, 1.2, 8, 0, 4)
      },
      {
        stage: 'warehouse',
        stageName: '监管仓暂存',
        startTime: '2024-06-16 15:00',
        endTime: '2024-06-17 20:00',
        avgTemp: 2.0,
        minTemp: 0.5,
        maxTemp: 3.4,
        tempRange: '0 ~ 4°C',
        status: 'normal',
        description: '浦东机场海关监管冷库',
        tempPoints: genTempPoints(2, 1.5, 12, 0, 4)
      },
      {
        stage: 'delivery',
        stageName: '门店配送',
        startTime: '2024-06-18 06:00',
        endTime: '2024-06-18 09:45',
        avgTemp: 2.3,
        minTemp: 0.9,
        maxTemp: 3.5,
        tempRange: '0 ~ 4°C',
        status: 'normal',
        description: '冷藏专车配送',
        tempPoints: genTempPoints(2.3, 1.2, 6, 0, 4)
      }
    ]
  },
  {
    id: 'B003',
    containerNo: 'HLCU5556667',
    supplierBatchNo: 'CHL-BLUEBERRY-20240610',
    productName: '智利蓝莓（礼盒装）',
    productType: '新鲜水果',
    origin: '智利',
    weight: 5600,
    tempRequired: '1~5°C冷藏',
    tempMin: 1,
    tempMax: 5,
    expectedArrival: '2024-06-19 14:00',
    actualArrival: '2024-06-19 15:20',
    overallStatus: 'danger',
    stages: [
      {
        stage: 'overseas',
        stageName: '境外发运',
        startTime: '2024-06-08 10:00',
        endTime: '2024-06-09 16:00',
        avgTemp: 2.8,
        minTemp: 1.5,
        maxTemp: 4.2,
        tempRange: '1 ~ 5°C',
        status: 'normal',
        description: '圣地亚哥冷链仓库装柜',
        tempPoints: genTempPoints(3, 1.5, 8, 1, 5)
      },
      {
        stage: 'shipping',
        stageName: '海运运输',
        startTime: '2024-06-09 20:00',
        endTime: '2024-06-16 10:00',
        avgTemp: 3.2,
        minTemp: 1.8,
        maxTemp: 6.5,
        tempRange: '1 ~ 5°C',
        status: 'danger',
        description: '冷藏集装箱海运途中制冷故障4小时',
        anomalyNote: '海运第3天制冷机组临时故障，温度回升至6.5°C，持续4小时后修复',
        tempPoints: [
          ...genTempPoints(3, 1.2, 8, 1, 5),
          { time: '第3天 14:00', temperature: 5.8, status: 'warning' },
          { time: '第3天 16:00', temperature: 6.5, status: 'danger' },
          { time: '第3天 18:00', temperature: 6.2, status: 'danger' },
          { time: '第3天 20:00', temperature: 5.2, status: 'warning' },
          ...genTempPoints(3, 1.2, 8, 1, 5)
        ]
      },
      {
        stage: 'port',
        stageName: '口岸等待',
        startTime: '2024-06-16 14:00',
        endTime: '2024-06-17 16:00',
        avgTemp: 3.0,
        minTemp: 1.6,
        maxTemp: 4.5,
        tempRange: '1 ~ 5°C',
        status: 'normal',
        description: '深圳盐田港清关',
        tempPoints: genTempPoints(3, 1.5, 10, 1, 5)
      },
      {
        stage: 'warehouse',
        stageName: '监管仓暂存',
        startTime: '2024-06-17 20:00',
        endTime: '2024-06-18 23:00',
        avgTemp: 2.6,
        minTemp: 1.2,
        maxTemp: 4.0,
        tempRange: '1 ~ 5°C',
        status: 'normal',
        description: '深圳冷链监管仓',
        tempPoints: genTempPoints(2.6, 1.4, 10, 1, 5)
      },
      {
        stage: 'delivery',
        stageName: '门店配送',
        startTime: '2024-06-19 10:00',
        endTime: '2024-06-19 15:20',
        avgTemp: 3.5,
        minTemp: 1.8,
        maxTemp: 4.8,
        tempRange: '1 ~ 5°C',
        status: 'warning',
        description: '配送途中市区拥堵延迟1小时',
        anomalyNote: '配送延迟1小时20分钟，温度接近温区上限',
        tempPoints: genTempPoints(3.5, 1, 5, 1, 5)
      }
    ]
  },
  {
    id: 'B004',
    containerNo: 'EMCU4443332',
    supplierBatchNo: 'USA-LOBSTER-20240614',
    productName: '波士顿龙虾（活鲜）',
    productType: '活鲜水产',
    origin: '美国',
    weight: 3200,
    tempRequired: '4~8°C冷藏暂养',
    tempMin: 4,
    tempMax: 8,
    expectedArrival: '2024-06-21 09:00',
    overallStatus: 'normal',
    stages: [
      {
        stage: 'overseas',
        stageName: '境外发运',
        startTime: '2024-06-19 08:00',
        endTime: '2024-06-19 20:00',
        avgTemp: 5.8,
        minTemp: 4.5,
        maxTemp: 7.2,
        tempRange: '4 ~ 8°C',
        status: 'normal',
        description: '波士顿机场打包，木屑包装保湿',
        tempPoints: genTempPoints(6, 1.5, 8, 4, 8)
      },
      {
        stage: 'shipping',
        stageName: '空运运输',
        startTime: '2024-06-20 00:00',
        endTime: '2024-06-20 16:00',
        avgTemp: 6.2,
        minTemp: 4.8,
        maxTemp: 7.5,
        tempRange: '4 ~ 8°C',
        status: 'normal',
        description: '美联航冷链直飞',
        tempPoints: genTempPoints(6, 1.5, 10, 4, 8)
      },
      {
        stage: 'port',
        stageName: '口岸等待',
        startTime: '2024-06-20 18:00',
        endTime: '2024-06-21 04:00',
        avgTemp: 6.0,
        minTemp: 4.6,
        maxTemp: 7.3,
        tempRange: '4 ~ 8°C',
        status: 'normal',
        description: '首都机场活体动物通关',
        tempPoints: genTempPoints(6, 1.4, 8, 4, 8)
      },
      {
        stage: 'warehouse',
        stageName: '监管仓暂存',
        startTime: '2024-06-21 05:00',
        endTime: '2024-06-21 07:00',
        avgTemp: 5.9,
        minTemp: 4.7,
        maxTemp: 7.1,
        tempRange: '4 ~ 8°C',
        status: 'normal',
        description: '机场监管冷库暂养',
        tempPoints: genTempPoints(6, 1.2, 4, 4, 8)
      },
      {
        stage: 'delivery',
        stageName: '门店配送',
        startTime: '2024-06-21 07:30',
        endTime: '2024-06-21 09:00',
        avgTemp: 6.1,
        minTemp: 4.9,
        maxTemp: 7.4,
        tempRange: '4 ~ 8°C',
        status: 'normal',
        description: '恒温专车配送，全程充氧',
        tempPoints: genTempPoints(6, 1.2, 4, 4, 8)
      }
    ]
  },
  {
    id: 'B005',
    containerNo: 'COSU2221119',
    supplierBatchNo: 'ARG-STEAK-20240608',
    productName: '阿根廷草饲牛排',
    productType: '冷冻牛肉',
    origin: '阿根廷',
    weight: 18500,
    tempRequired: '-18°C以下冷冻',
    tempMin: -25,
    tempMax: -18,
    expectedArrival: '2024-06-22 12:00',
    overallStatus: 'normal',
    stages: [
      {
        stage: 'overseas',
        stageName: '境外发运',
        startTime: '2024-06-05 10:00',
        endTime: '2024-06-06 22:00',
        avgTemp: -22.0,
        minTemp: -23.8,
        maxTemp: -20.2,
        tempRange: '-25 ~ -18°C',
        status: 'normal',
        description: '布宜诺斯艾利斯冷链仓库',
        tempPoints: genTempPoints(-22, 2, 10, -25, -18)
      },
      {
        stage: 'shipping',
        stageName: '海运运输',
        startTime: '2024-06-07 02:00',
        endTime: '2024-06-19 18:00',
        avgTemp: -21.5,
        minTemp: -23.5,
        maxTemp: -19.5,
        tempRange: '-25 ~ -18°C',
        status: 'normal',
        description: '冷藏集装箱35天航程',
        tempPoints: genTempPoints(-21.5, 2, 20, -25, -18)
      },
      {
        stage: 'port',
        stageName: '口岸等待',
        startTime: '2024-06-19 22:00',
        endTime: '2024-06-20 18:00',
        avgTemp: -20.8,
        minTemp: -22.6,
        maxTemp: -19.0,
        tempRange: '-25 ~ -18°C',
        status: 'normal',
        description: '宁波舟山港',
        tempPoints: genTempPoints(-21, 1.8, 10, -25, -18)
      },
      {
        stage: 'warehouse',
        stageName: '监管仓暂存',
        startTime: '2024-06-20 22:00',
        endTime: '2024-06-21 20:00',
        avgTemp: -21.8,
        minTemp: -23.2,
        maxTemp: -20.0,
        tempRange: '-25 ~ -18°C',
        status: 'normal',
        description: '宁波保税冷链仓库',
        tempPoints: genTempPoints(-22, 1.5, 12, -25, -18)
      },
      {
        stage: 'delivery',
        stageName: '门店配送',
        startTime: '2024-06-22 06:00',
        endTime: '2024-06-22 12:00',
        avgTemp: -20.5,
        minTemp: -22.0,
        maxTemp: -18.8,
        tempRange: '-25 ~ -18°C',
        status: 'normal',
        description: '冷链配送',
        tempPoints: genTempPoints(-20.5, 1.5, 6, -25, -18)
      }
    ]
  },
  {
    id: 'B006',
    containerNo: 'MSCU8887771',
    supplierBatchNo: 'THA-DURIAN-20240616',
    productName: '泰国金枕榴莲',
    productType: '热带水果',
    origin: '泰国',
    weight: 9800,
    tempRequired: '10~15°C恒温',
    tempMin: 10,
    tempMax: 15,
    expectedArrival: '2024-06-21 16:00',
    overallStatus: 'warning',
    stages: [
      {
        stage: 'overseas',
        stageName: '境外发运',
        startTime: '2024-06-17 07:00',
        endTime: '2024-06-17 18:00',
        avgTemp: 12.5,
        minTemp: 10.8,
        maxTemp: 14.2,
        tempRange: '10 ~ 15°C',
        status: 'normal',
        description: '曼谷水果加工厂',
        tempPoints: genTempPoints(12.5, 2, 8, 10, 15)
      },
      {
        stage: 'shipping',
        stageName: '陆运运输',
        startTime: '2024-06-17 20:00',
        endTime: '2024-06-19 14:00',
        avgTemp: 13.0,
        minTemp: 10.5,
        maxTemp: 15.8,
        tempRange: '10 ~ 15°C',
        status: 'warning',
        description: '中老铁路冷链班列',
        anomalyNote: '过境换装时温度短时偏高',
        tempPoints: [
          ...genTempPoints(12.5, 1.5, 8, 10, 15),
          { time: '过境 10:30', temperature: 15.5, status: 'warning' },
          { time: '过境 11:15', temperature: 15.8, status: 'warning' },
          ...genTempPoints(12.5, 1.5, 6, 10, 15)
        ]
      },
      {
        stage: 'port',
        stageName: '口岸等待',
        startTime: '2024-06-19 16:00',
        endTime: '2024-06-20 08:00',
        avgTemp: 12.2,
        minTemp: 10.6,
        maxTemp: 14.0,
        tempRange: '10 ~ 15°C',
        status: 'normal',
        description: '磨憨口岸',
        tempPoints: genTempPoints(12, 1.8, 8, 10, 15)
      },
      {
        stage: 'warehouse',
        stageName: '监管仓暂存',
        startTime: '2024-06-20 11:00',
        endTime: '2024-06-21 08:00',
        avgTemp: 12.0,
        minTemp: 10.4,
        maxTemp: 13.8,
        tempRange: '10 ~ 15°C',
        status: 'normal',
        description: '昆明保税监管仓',
        tempPoints: genTempPoints(12, 1.6, 10, 10, 15)
      },
      {
        stage: 'delivery',
        stageName: '门店配送',
        startTime: '2024-06-21 10:00',
        endTime: '2024-06-21 16:00',
        avgTemp: 12.8,
        minTemp: 11.0,
        maxTemp: 14.5,
        tempRange: '10 ~ 15°C',
        status: 'normal',
        description: '恒温车配送',
        tempPoints: genTempPoints(12.8, 1.5, 5, 10, 15)
      }
    ]
  }
]

export const getBatchByContainer = (containerNo: string): BatchInfo | undefined => {
  return mockBatches.find(b => b.containerNo.toLowerCase().includes(containerNo.toLowerCase()))
}

export const getBatchBySupplierNo = (supplierNo: string): BatchInfo | undefined => {
  return mockBatches.find(b => b.supplierBatchNo.toLowerCase().includes(supplierNo.toLowerCase()))
}

export const getBatchById = (id: string): BatchInfo | undefined => {
  return mockBatches.find(b => b.id === id)
}
