import React, { useState } from 'react'
import { View, Text } from '@tarojs/components'
import Taro from '@tarojs/taro'
import classnames from 'classnames'
import { getSpeechesByCategory } from '@/data/services'
import SpeechBubble from '@/components/SpeechBubble'
import type { ServiceSpeech } from '@/types/coldchain'
import styles from './index.module.scss'

const categories = [
  { key: 'all', label: '全部' },
  { key: 'temp', label: '温度异常' },
  { key: 'delay', label: '运输延迟' },
  { key: 'inspection', label: '口岸查验' },
  { key: 'customs', label: '通关说明' }
]

const ServicePage: React.FC = () => {
  const [category, setCategory] = useState('all')

  const speeches = getSpeechesByCategory(category)

  const goToDetail = (id: string) => {
    Taro.navigateTo({
      url: `/pages/service-detail/index?id=${id}`
    })
  }

  return (
    <View className={styles.page}>
      <View className={styles.header}>
        <Text className={styles.headerTitle}>客户说明话术</Text>
        <Text className={styles.headerSubtitle}>专业温控数据转成售后沟通话术</Text>
      </View>

      <View className={styles.filterCard}>
        <View className={styles.filterRow}>
          {categories.map(c => (
            <View
              key={c.key}
              className={classnames(styles.filterItem, category === c.key && styles.filterItemActive)}
              onClick={() => setCategory(c.key)}
            >
              {c.label}
            </View>
          ))}
        </View>
      </View>

      <View className={styles.listSection}>
        <Text className={styles.sectionTitle}>共 {speeches.length} 条话术</Text>
        {speeches.map((s: ServiceSpeech) => (
          <SpeechBubble key={s.id} speech={s} onClick={() => goToDetail(s.id)} />
        ))}
      </View>
    </View>
  )
}

export default ServicePage
