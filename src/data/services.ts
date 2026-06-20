import type { ServiceSpeech } from '@/types/coldchain'

export const mockSpeeches: ServiceSpeech[] = [
  {
    id: 'S001',
    batchId: 'B001',
    containerNo: 'MSCU1234567',
    productName: '澳洲和牛M9西冷',
    category: 'inspection',
    categoryName: '口岸查验',
    title: '口岸查验开门8分钟',
    content: '尊敬的客户，您好！关于您购买的澳洲和牛M9西冷（批次号AUS-BEEF-20240615），经核查温度记录显示：该批货物在上海洋山港口岸清关时，海关例行查验开箱约8分钟，期间温度短时回升至-15.8°C，但关闭柜门后制冷系统迅速恢复至-20°C左右正常温区。全程除这8分钟的正常查验操作外，其余运输环节均严格控制在-18°C以下冷冻标准。货物品质经过严格检测，完全符合食品安全标准，请您放心食用。',
    shortContent: '口岸查验开门八分钟，复测后恢复正常，不影响品质',
    createTime: '2024-06-20 10:00',
    usedCount: 15
  },
  {
    id: 'S002',
    batchId: 'B003',
    containerNo: 'HLCU5556667',
    productName: '智利蓝莓（礼盒装）',
    category: 'temp',
    categoryName: '温度异常',
    title: '海运途中制冷故障4小时',
    content: '尊敬的客户，您好！关于您购买的智利蓝莓礼盒（批次号CHL-BLUEBERRY-20240610），我们需要向您说明：该批货物在海运途中第3天，冷藏集装箱制冷机组出现临时故障，温度回升至6.5°C，持续约4小时后机组修复，温度迅速回落至正常3°C左右。此异常已在第一时间被我方监控系统记录并报警。到货后我们已对该批蓝莓进行了严格品质抽检，果实硬度、糖度、口感均在正常范围内。如您在食用过程中有任何问题，请随时联系我们，我们将为您负责到底。',
    shortContent: '海运制冷临时故障四小时后修复，到货抽检品质正常',
    createTime: '2024-06-19 18:00',
    usedCount: 23
  },
  {
    id: 'S003',
    batchId: 'B006',
    containerNo: 'MSCU8887771',
    productName: '泰国金枕榴莲',
    category: 'delay',
    categoryName: '运输延迟',
    title: '陆运过境换装温度短时偏高',
    content: '尊敬的客户，您好！关于您购买的泰国金枕榴莲（批次号THA-DURIAN-20240616），该批货物采用中老铁路冷链班列运输，在磨憨口岸过境换装时，因需要衔接不同轨距的列车，货柜临时转入换装站台约45分钟，期间温度短时偏高至15.8°C，但换装完成后立即恢复至12°C左右的正常恒温区间。榴莲属于热带水果，短时间的温度波动不会影响果肉品质，请您放心。如有任何不满意，我们支持无条件退换。',
    shortContent: '陆运过境换装短时升温，热带水果短时间波动不影响品质',
    createTime: '2024-06-21 17:00',
    usedCount: 8
  },
  {
    id: 'S004',
    batchId: 'B002',
    containerNo: 'MAEU9876543',
    productName: '新西兰帝王鲑',
    category: 'customs',
    categoryName: '通关说明',
    title: '全程冷链空运直达',
    content: '尊敬的客户，您好！您购买的新西兰帝王鲑（批次号NZL-SALMON-20240612）采用新西兰航空冷链航班直达上海浦东机场，全程严格控制在0~4°C冷藏温区。从基督城加工厂打包预冷、机场冷库暂存、航班冷链舱、浦东机场货站冷链区、海关监管冷库到冷藏专车配送到店，共经过6个冷链环节，全程温度在1.0°C~3.8°C之间波动，完全符合冰鲜水产标准。所有批次均附有海关检验检疫证明，品质安全有保障。',
    shortContent: '全程冷链空运直达，六环节温控合规，附检验检疫证明',
    createTime: '2024-06-18 11:00',
    usedCount: 31
  },
  {
    id: 'S005',
    batchId: 'B003',
    containerNo: 'HLCU5556667',
    productName: '智利蓝莓（礼盒装）',
    category: 'delay',
    categoryName: '运输延迟',
    title: '市区拥堵配送延迟1小时',
    content: '尊敬的客户，您好！您订购的智利蓝莓因今日市区交通严重拥堵，配送比原定时间延迟了约1小时20分钟。配送车辆全程保持冷链运输，车内温度稳定在3.5°C左右，未超出1~5°C的约定温区范围。延迟期间司机全程未开车门，货物状态良好。我们对此次配送延迟给您带来的不便深表歉意，下次订购我们将为您优先安排早班配送。',
    shortContent: '市区拥堵配送延迟，全程冷链未开门，货物状态良好',
    createTime: '2024-06-19 16:00',
    usedCount: 12
  },
  {
    id: 'S006',
    batchId: 'B004',
    containerNo: 'EMCU4443332',
    productName: '波士顿龙虾（活鲜）',
    category: 'customs',
    categoryName: '通关说明',
    title: '活体动物快速清关通道',
    content: '尊敬的客户，您好！您订购的波士顿龙虾（批次号USA-LOBSTER-20240614）采用美联航冷链直飞，到达首都机场后通过活体动物快速清关通道，仅用8小时即完成报关报检。全程控制在4~8°C冷藏暂养温度，包装采用进口保湿木屑+充氧技术，确保龙虾在运输过程中保持最佳存活状态。到货存活率经检验为100%。',
    shortContent: '活体动物快速清关，木屑保湿充氧包装，存活率100%',
    createTime: '2024-06-21 10:00',
    usedCount: 6
  }
]

export const getSpeechesByBatch = (batchId: string): ServiceSpeech[] => {
  return mockSpeeches.filter(s => s.batchId === batchId)
}

export const getSpeechesByCategory = (category: string): ServiceSpeech[] => {
  if (!category || category === 'all') return mockSpeeches
  return mockSpeeches.filter(s => s.category === category)
}

export const getSpeechById = (id: string): ServiceSpeech | undefined => {
  return mockSpeeches.find(s => s.id === id)
}
