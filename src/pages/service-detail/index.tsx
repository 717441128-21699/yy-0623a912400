import React, { useState, useEffect } from 'react'
import { View, Text, Button } from '@tarojs/components'
import Taro, { useRouter } from '@tarojs/taro'
import { getSpeechById } from '@/data/services'
import type { ServiceSpeech } from '@/types/coldchain'
import styles from './index.module.scss'

const ServiceDetailPage: React.FC = () => {
  const router = useRouter()
  const [speech, setSpeech] = useState<ServiceSpeech | null>(null)
  const [showCopied, setShowCopied] = useState(false)

  useEffect(() => {
    const id = router.params.id
    if (id) {
      const s = getSpeechById(id)
      setSpeech(s || null)
      console.log('[ServiceDetail] load speech:', id, s?.title)
    }
  }, [router.params.id])

  if (!speech) {
    return (
      <View className={styles.page} style={{ padding: 100, textAlign: 'center' }}>
        <Text>话术不存在</Text>
      </View>
    )
  }

  const copyShort = async () => {
    try {
      Taro.setClipboardData({
        data: speech.shortContent,
        success: () => {
          setShowCopied(true)
          console.log('[ServiceDetail] copy short speech')
          setTimeout(() => setShowCopied(false), 1500)
        }
      })
    } catch (e) {
      console.error('[ServiceDetail] copy error:', e)
    }
  }

  const copyFull = async () => {
    try {
      Taro.setClipboardData({
        data: speech.content,
        success: () => {
          setShowCopied(true)
          console.log('[ServiceDetail] copy full speech')
          setTimeout(() => setShowCopied(false), 1500)
        }
      })
    } catch (e) {
      console.error('[ServiceDetail] copy error:', e)
    }
  }

  return (
    <View className={styles.page}>
      <View className={styles.header}>
        <View className={styles.categoryTag}>{speech.categoryName}</View>
        <Text className={styles.speechTitle}>{speech.title}</Text>
        <Text className={styles.batchInfo}>
          {speech.containerNo} · {speech.productName}
        </Text>
      </View>

      <View className={styles.shortCard}>
        <Text className={styles.cardLabel}>简短话术（建议复制使用）</Text>
        <View className={styles.shortContent}>
          <Text className={styles.shortText}>「{speech.shortContent}」</Text>
        </View>
      </View>

      <View className={styles.statsRow}>
        <View className={styles.statItem}>
          <Text className={styles.statValue}>{speech.usedCount}</Text>
          <Text className={styles.statLabel}>已使用次数</Text>
        </View>
        <View className={styles.statItem}>
          <Text className={styles.statValue}>{speech.createTime.split(' ')[0]}</Text>
          <Text className={styles.statLabel}>生成日期</Text>
        </View>
      </View>

      <View className={styles.detailSection}>
        <Text className={styles.detailTitle}>完整话术详情</Text>
        <View className={styles.detailCard}>
          <Text className={styles.detailText}>{speech.content}</Text>
        </View>
      </View>

      <View className={styles.tipsSection}>
        <Text className={styles.tipsTitle}>客服沟通建议</Text>
        <View className={styles.tipItem}>
          <Text className={styles.tipIcon}>💡</Text>
          <Text className={styles.tipText}>先使用简短话术快速回应客户疑虑，如客户追问再发送完整版本</Text>
        </View>
        <View className={styles.tipItem}>
          <Text className={styles.tipIcon}>📋</Text>
          <Text className={styles.tipText}>可引导客户查看批次温度详情页，展示完整温控数据增加可信度</Text>
        </View>
        <View className={styles.tipItem}>
          <Text className={styles.tipIcon}>📞</Text>
          <Text className={styles.tipText}>如客户情绪激动，建议先表达歉意和理解，再提供专业数据说明</Text>
        </View>
      </View>

      <View className={styles.bottomBar}>
        <Button className={[styles.btn, styles.btnGhost].join(' ')} onClick={copyFull}>
          复制完整话术
        </Button>
        <Button className={[styles.btn, styles.btnPrimary].join(' ')} onClick={copyShort}>
          复制简短话术
        </Button>
      </View>

      {showCopied && (
        <View className={styles.copiedToast}>✓ 已复制到剪贴板</View>
      )}
    </View>
  )
}

export default ServiceDetailPage
