import React, { useState, useCallback } from 'react'
import { View, Text, Button } from '@tarojs/components'
import Taro, { useDidShow } from '@tarojs/taro'
import classnames from 'classnames'
import { mockReceipts, getReceiptsByStatus } from '@/data/receipts'
import type { ReceiptRecord } from '@/types/coldchain'
import { tempGapWarning, formatTemp } from '@/utils/temp'
import styles from './index.module.scss'

type FilterType = 'all' | 'pending' | 'processing' | 'completed'

const ReceiptPage: React.FC = () => {
  const [filter, setFilter] = useState<FilterType>('all')
  const [receipts, setReceipts] = useState<ReceiptRecord[]>([])

  const refreshData = useCallback(() => {
    const data = getReceiptsByStatus(filter)
    setReceipts(data)
    console.log('[ReceiptPage] refresh data, count:', data.length)
  }, [filter])

  useDidShow(() => {
    refreshData()
  })

  React.useEffect(() => {
    refreshData()
  }, [refreshData])

  const handleScan = () => {
    Taro.showToast({ title: '扫码功能模拟', icon: 'none' })
    console.log('[ReceiptPage] start scan')
    setTimeout(() => {
      const pending = mockReceipts.find(r => r.status === 'pending')
      if (pending) {
        Taro.navigateTo({
          url: `/pages/receipt-detail/index?id=${pending.id}`
        })
      }
    }, 500)
  }

  const handleStart = (id: string) => {
    Taro.navigateTo({
      url: `/pages/receipt-detail/index?id=${id}`
    })
  }

  const handleView = (id: string) => {
    Taro.navigateTo({
      url: `/pages/receipt-detail/index?id=${id}`
    })
  }

  const getStatusText = (status: string) => {
    const map = {
      pending: '待验收',
      processing: '验收中',
      completed: '已完成',
      rejected: '已拒收'
    }
    return map[status as keyof typeof map] || status
  }

  return (
    <View className={styles.page}>
      <View className={styles.header}>
        <Text className={styles.headerTitle}>到货验收</Text>
      </View>

      <View className={styles.scanCard}>
        <View className={styles.scanIcon}>
          <Text style={{ color: '#fff', fontSize: 64 }}>📷</Text>
        </View>
        <Text className={styles.scanTitle}>扫码开始验收</Text>
        <Text className={styles.scanSubtitle}>扫描批次条码或二维码，快速进入验收流程</Text>
        <Button className={styles.scanBtn} onClick={handleScan}>扫码验收</Button>
      </View>

      <View className={styles.filterSection}>
        <View className={styles.filterTabs}>
          <View
            className={classnames(styles.filterTab, filter === 'all' && styles.filterTabActive)}
            onClick={() => setFilter('all')}
          >
            全部
          </View>
          <View
            className={classnames(styles.filterTab, filter === 'pending' && styles.filterTabActive)}
            onClick={() => setFilter('pending')}
          >
            待验收
          </View>
          <View
            className={classnames(styles.filterTab, filter === 'processing' && styles.filterTabActive)}
            onClick={() => setFilter('processing')}
          >
            验收中
          </View>
          <View
            className={classnames(styles.filterTab, filter === 'completed' && styles.filterTabActive)}
            onClick={() => setFilter('completed')}
          >
            已完成
          </View>
        </View>
      </View>

      <View className={styles.listSection}>
        {receipts.map((r: ReceiptRecord) => (
          <View key={r.id} className={styles.receiptCard}>
            <View className={styles.cardHeader}>
              <Text className={styles.productName}>{r.productName}</Text>
              <View className={classnames(
                styles.statusBadge,
                r.status === 'pending' && styles.statusPending,
                r.status === 'processing' && styles.statusProcessing,
                r.status === 'completed' && styles.statusCompleted
              )}>
                <Text>{getStatusText(r.status)}</Text>
              </View>
            </View>
            <Text className={styles.cardMeta}>{r.containerNo}</Text>
            <Text className={styles.cardTime}>到货时间：{r.createTime}</Text>

            {r.status === 'processing' && r.tempGap !== undefined && tempGapWarning(r.arrivalTemp!, r.platformTemp!) && (
              <View className={styles.tempGapAlert}>
                <Text className={styles.tempGapText}>
                  ⚠️ 温差 {r.tempGap.toFixed(1)}°C，超出3°C阈值，建议暂缓入库
                </Text>
              </View>
            )}

            <View className={styles.cardFooter}>
              {r.arrivalTemp !== undefined && r.platformTemp !== undefined ? (
                <View className={styles.tempInfo}>
                  <View className={styles.tempRow}>
                    <Text>到货温度：</Text>
                    <Text className={styles.tempValue}>{formatTemp(r.arrivalTemp)}</Text>
                    <Text style={{ color: '#999' }}>|</Text>
                    <Text>平台温度：</Text>
                    <Text className={styles.tempValue}>{formatTemp(r.platformTemp)}</Text>
                  </View>
                  <View className={styles.tempRow}>
                    <Text>温差：</Text>
                    <Text className={tempGapWarning(r.arrivalTemp, r.platformTemp) ? styles.tempGapWarning : styles.tempGapNormal}>
                      {(r.tempGap !== undefined ? r.tempGap : Math.abs(r.arrivalTemp - r.platformTemp)).toFixed(1)}°C
                      {tempGapWarning(r.arrivalTemp, r.platformTemp) ? '（超出阈值）' : '（正常）'}
                    </Text>
                  </View>
                </View>
              ) : (
                <Text className={styles.cardMeta}>
                  {r.status === 'pending' ? '尚未录入温度' : '温度信息不完整'}
                </Text>
              )}
              {r.status !== 'completed' ? (
                <Button
                  className={classnames(styles.actionBtn, styles.actionPrimary)}
                  onClick={() => handleStart(r.id)}
                >
                  {r.status === 'pending' ? '开始验收' : '继续验收'}
                </Button>
              ) : (
                <Button
                  className={classnames(styles.actionBtn, styles.actionGhost)}
                  onClick={() => handleView(r.id)}
                >
                  查看详情
                </Button>
              )}
            </View>
          </View>
        ))}
      </View>
    </View>
  )
}

export default ReceiptPage
