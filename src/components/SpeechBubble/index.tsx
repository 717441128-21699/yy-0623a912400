import React from 'react'
import { View, Text } from '@tarojs/components'
import type { ServiceSpeech } from '@/types/coldchain'
import styles from './index.module.scss'

interface SpeechBubbleProps {
  speech: ServiceSpeech
  onClick?: () => void
}

const categoryColors: Record<string, { bg: string; text: string }> = {
  temp: { bg: '#FEF3C7', text: '#D97706' },
  delay: { bg: '#DBEAFE', text: '#2563EB' },
  inspection: { bg: '#D1FAE5', text: '#059669' },
  customs: { bg: '#EDE9FE', text: '#7C3AED' }
}

const SpeechBubble: React.FC<SpeechBubbleProps> = ({ speech, onClick }) => {
  const colors = categoryColors[speech.category] || categoryColors.customs

  return (
    <View className={styles.card} onClick={onClick}>
      <View className={styles.header}>
        <View className={styles.category} style={{ backgroundColor: colors.bg, color: colors.text }}>
          <Text>{speech.categoryName}</Text>
        </View>
        <Text className={styles.usedCount}>已使用 {speech.usedCount} 次</Text>
      </View>
      <Text className={styles.title}>{speech.title}</Text>
      <View className={styles.bubble}>
        <Text className={styles.bubbleText}>{speech.shortContent}</Text>
      </View>
      <View className={styles.footer}>
        <Text className={styles.batchInfo}>{speech.containerNo} · {speech.productName}</Text>
        <Text className={styles.copyHint}>点击查看详情</Text>
      </View>
    </View>
  )
}

export default SpeechBubble
