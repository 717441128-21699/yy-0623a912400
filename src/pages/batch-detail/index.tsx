import React, { useState, useEffect } from 'react'
import { View, Text, Button } from '@tarojs/components'
import Taro, { useRouter } from '@tarojs/taro'
import { getBatchById } from '@/data/batches'
import { getSpeechesByBatch } from '@/data/services'
import type { BatchInfo } from '@/types/coldchain'
import StatusBadge from '@/components/StatusBadge'
import TempGauge from '@/components/TempGauge'
import TimelineStep from '@/components/TimelineStep'
import { formatTemp } from '@/utils/temp'
import styles from './index.module.scss'

const BatchDetailPage: React.FC = () => {
  const router = useRouter()
  const [batch, setBatch] = useState<BatchInfo | null>(null)

  useEffect(() => {
    const id = router.params.id
    if (id) {
      const data = getBatchById(id)
      setBatch(data || null)
      console.log('[BatchDetail] load batch:', id, data?.productName)
    }
  }, [router.params.id])

  if (!batch) {
    return (
      <View className={styles.page} style={{ padding: 100, textAlign: 'center' }}>
        <Text>批次不存在</Text>
      </View>
    )
  }

  const lastStage = batch.stages[batch.stages.length - 1]
  const avgTemp = batch.stages.reduce((sum, s) => sum + s.avgTemp, 0) / batch.stages.length
  const speeches = getSpeechesByBatch(batch.id)

  const goToReceipt = () => {
    Taro.switchTab({ url: '/pages/receipt/index' })
  }

  const goToService = () => {
    if (speeches.length > 0) {
      Taro.navigateTo({ url: `/pages/service-detail/index?id=${speeches[0].id}` })
    } else {
      Taro.switchTab({ url: '/pages/service/index' })
    }
  }

  return (
    <View className={styles.page}>
      <View className={styles.overview}>
        <Text className={styles.productName}>{batch.productName}</Text>
        <View style={{ display: 'flex', gap: 16, marginBottom: 24 }}>
          <StatusBadge status={batch.overallStatus} />
        </View>
        <View className={styles.infoRow}>
          <View className={styles.infoItem}>
            <Text className={styles.infoLabel}>柜号</Text>
            <Text className={styles.infoValue}>{batch.containerNo}</Text>
          </View>
          <View className={styles.infoItem}>
            <Text className={styles.infoLabel}>供应商批次</Text>
            <Text className={styles.infoValue}>{batch.supplierBatchNo}</Text>
          </View>
        </View>
        <View className={styles.infoRow}>
          <View className={styles.infoItem}>
            <Text className={styles.infoLabel}>原产国</Text>
            <Text className={styles.infoValue}>{batch.origin}</Text>
          </View>
          <View className={styles.infoItem}>
            <Text className={styles.infoLabel}>要求温区</Text>
            <Text className={styles.infoValue}>{batch.tempRequired}</Text>
          </View>
        </View>
        <View className={styles.infoRow}>
          <View className={styles.infoItem}>
            <Text className={styles.infoLabel}>重量</Text>
            <Text className={styles.infoValue}>{(batch.weight / 1000).toFixed(1)} 吨</Text>
          </View>
          <View className={styles.infoItem}>
            <Text className={styles.infoLabel}>实际到货</Text>
            <Text className={styles.infoValue}>{batch.actualArrival || '待到货'}</Text>
          </View>
        </View>
      </View>

      <View className={styles.tempCard}>
        <Text className={styles.cardTitle}>温度概览</Text>
        <TempGauge
          current={lastStage.avgTemp}
          min={batch.tempMin}
          max={batch.tempMax}
          avg={+avgTemp.toFixed(1)}
          status={batch.overallStatus}
        />
        <View style={{ display: 'flex', justifyContent: 'space-around', marginTop: 16, paddingTop: 16, borderTop: '2rpx solid #F1F5F9' }}>
          <View style={{ textAlign: 'center' }}>
            <Text style={{ fontSize: 24, color: '#94A3B8', display: 'block' }}>约定温区</Text>
            <Text style={{ fontSize: 28, fontWeight: 600, color: '#0F172A' }}>{formatTemp(batch.tempMin)} ~ {formatTemp(batch.tempMax)}</Text>
          </View>
          <View style={{ textAlign: 'center' }}>
            <Text style={{ fontSize: 24, color: '#94A3B8', display: 'block' }}>全程平均</Text>
            <Text style={{ fontSize: 28, fontWeight: 600, color: '#0E7C86' }}>{formatTemp(+avgTemp.toFixed(1))}</Text>
          </View>
        </View>
      </View>

      <View className={styles.timeline}>
        <Text className={styles.cardTitle}>全链路温度追溯</Text>
        {batch.stages.map((stage, idx) => (
          <TimelineStep
            key={stage.stage}
            stage={stage}
            isLast={idx === batch.stages.length - 1}
            index={idx}
          />
        ))}
      </View>

      <View className={styles.bottomBar}>
        <Button className={[styles.btn, styles.btnGhost].join(' ')} onClick={goToService}>
          生成话术
        </Button>
        <Button className={[styles.btn, styles.btnPrimary].join(' ')} onClick={goToReceipt}>
          去验收
        </Button>
      </View>
    </View>
  )
}

export default BatchDetailPage
