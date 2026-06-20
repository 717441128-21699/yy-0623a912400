import React, { useState } from 'react'
import { View, Text } from '@tarojs/components'
import classnames from 'classnames'
import type { StageInfo } from '@/types/coldchain'
import { getStatusColor, formatTemp } from '@/utils/temp'
import StatusBadge from '@/components/StatusBadge'
import styles from './index.module.scss'

interface TimelineStepProps {
  stage: StageInfo
  isLast: boolean
  index: number
}

const TimelineStep: React.FC<TimelineStepProps> = ({ stage, isLast, index }) => {
  const [expanded, setExpanded] = useState(false)
  const color = getStatusColor(stage.status)

  return (
    <View className={styles.container}>
      <View className={styles.connector}>
        <View className={styles.dot} style={{ backgroundColor: color }}>
          <Text className={styles.dotText}>{index + 1}</Text>
        </View>
        {!isLast && <View className={styles.line} style={{ backgroundColor: stage.status === 'normal' ? '#E2E8F0' : color }} />}
      </View>
      <View className={styles.content} onClick={() => setExpanded(!expanded)}>
        <View className={styles.header}>
          <View className={styles.headerLeft}>
            <Text className={styles.stageName}>{stage.stageName}</Text>
            <StatusBadge status={stage.status} size="sm" />
          </View>
          <Text className={styles.expandIcon}>{expanded ? '收起' : '展开'}</Text>
        </View>
        <View className={styles.timeRange}>
          <Text className={styles.timeText}>{stage.startTime}</Text>
          <Text className={styles.timeText}> 至 </Text>
          <Text className={styles.timeText}>{stage.endTime}</Text>
        </View>
        <View className={styles.tempRow}>
          <View className={styles.tempItem}>
            <Text className={styles.tempLabel}>平均温度</Text>
            <Text className={styles.tempValue} style={{ color }}>{formatTemp(stage.avgTemp)}</Text>
          </View>
          <View className={styles.tempItem}>
            <Text className={styles.tempLabel}>最低/最高</Text>
            <Text className={styles.tempValue}>{formatTemp(stage.minTemp)} / {formatTemp(stage.maxTemp)}</Text>
          </View>
        </View>
        {stage.description && (
          <Text className={styles.description}>{stage.description}</Text>
        )}
        {expanded && (
          <View className={styles.details}>
            {stage.anomalyNote && (
              <View className={styles.anomalyBox}>
                <Text className={styles.anomalyLabel}>⚠️ 异常说明</Text>
                <Text className={styles.anomalyText}>{stage.anomalyNote}</Text>
              </View>
            )}
            <Text className={styles.detailLabel}>温度记录</Text>
            <View className={styles.tempList}>
              {stage.tempPoints.map((point, idx) => (
                <View key={idx} className={styles.tempPoint}>
                  <Text className={styles.pointTime}>{point.time}</Text>
                  <Text
                    className={classnames(styles.pointTemp, point.status !== 'normal' && styles.abnormal)}
                    style={{ color: getStatusColor(point.status) }}
                  >
                    {formatTemp(point.temperature)}
                  </Text>
                </View>
              ))}
            </View>
          </View>
        )}
      </View>
    </View>
  )
}

export default TimelineStep
