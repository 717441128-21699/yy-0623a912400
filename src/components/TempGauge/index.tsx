import React from 'react'
import { View, Text } from '@tarojs/components'
import type { TempStatus } from '@/types/coldchain'
import { getStatusColor, formatTemp } from '@/utils/temp'
import styles from './index.module.scss'

interface TempGaugeProps {
  current: number
  min: number
  max: number
  avg?: number
  status: TempStatus
}

const TempGauge: React.FC<TempGaugeProps> = ({ current, min, max, avg, status }) => {
  const color = getStatusColor(status)
  const range = max - min
  const percent = Math.max(0, Math.min(100, ((current - min) / range) * 100))

  return (
    <View className={styles.container}>
      <View className={styles.gaugeWrapper}>
        <View className={styles.gaugeTrack}>
          <View
            className={styles.gaugeFill}
            style={{ width: `${percent}%`, backgroundColor: color }}
          />
        </View>
        <View className={styles.scale}>
          <Text className={styles.scaleText}>{formatTemp(min)}</Text>
          <Text className={styles.scaleText}>{formatTemp(max)}</Text>
        </View>
      </View>
      <View className={styles.tempInfo}>
        <View className={styles.currentTemp} style={{ color }}>
          <Text className={styles.tempValue}>{formatTemp(current)}</Text>
          <Text className={styles.tempLabel}>当前</Text>
        </View>
        {avg !== undefined && (
          <View className={styles.avgTemp}>
            <Text className={styles.avgValue}>{formatTemp(avg)}</Text>
            <Text className={styles.avgLabel}>全程平均</Text>
          </View>
        )}
      </View>
    </View>
  )
}

export default TempGauge
