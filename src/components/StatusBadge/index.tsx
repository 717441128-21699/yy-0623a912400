import React from 'react'
import { View, Text } from '@tarojs/components'
import classnames from 'classnames'
import type { TempStatus } from '@/types/coldchain'
import { getStatusColor, getStatusText } from '@/utils/temp'
import styles from './index.module.scss'

interface StatusBadgeProps {
  status: TempStatus
  text?: string
  size?: 'sm' | 'md'
}

const StatusBadge: React.FC<StatusBadgeProps> = ({ status, text, size = 'md' }) => {
  const color = getStatusColor(status)
  const displayText = text || getStatusText(status)

  return (
    <View
      className={classnames(styles.badge, styles[size], status === 'normal' && styles.normal, status === 'warning' && styles.warning, status === 'danger' && styles.danger)}
      style={{ backgroundColor: `${color}15`, color: color }}
    >
      <View className={styles.dot} style={{ backgroundColor: color }} />
      <Text className={styles.text}>{displayText}</Text>
    </View>
  )
}

export default StatusBadge
