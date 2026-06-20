import React, { useState } from 'react'
import { View, Text, Input, Button } from '@tarojs/components'
import Taro from '@tarojs/taro'
import classnames from 'classnames'
import { mockBatches, getBatchByContainer, getBatchBySupplierNo } from '@/data/batches'
import StatusBadge from '@/components/StatusBadge'
import type { BatchInfo } from '@/types/coldchain'
import styles from './index.module.scss'

type SearchType = 'container' | 'supplier'

const HomePage: React.FC = () => {
  const [searchType, setSearchType] = useState<SearchType>('container')
  const [keyword, setKeyword] = useState('')
  const [searchResult, setSearchResult] = useState<BatchInfo | null>(null)
  const [hasSearched, setHasSearched] = useState(false)

  const recentBatches = mockBatches.slice(0, 4)

  const handleSearch = () => {
    if (!keyword.trim()) {
      Taro.showToast({ title: '请输入查询内容', icon: 'none' })
      return
    }

    let result
    if (searchType === 'container') {
      result = getBatchByContainer(keyword)
    } else {
      result = getBatchBySupplierNo(keyword)
    }
    setSearchResult(result || null)
    setHasSearched(true)
    console.log('[HomePage] search:', searchType, keyword, result?.id)
  }

  const goToDetail = (id: string) => {
    Taro.navigateTo({
      url: `/pages/batch-detail/index?id=${id}`
    })
  }

  return (
    <View className={styles.page}>
      <View className={styles.hero}>
        <Text className={styles.heroTitle}>冷链温控查询</Text>
        <Text className={styles.heroSubtitle}>进口生鲜全链路温度追溯</Text>
      </View>

      <View className={styles.searchCard}>
        <View className={styles.searchTabs}>
          <View
            className={classnames(styles.searchTab, searchType === 'container' && styles.searchTabActive)}
            onClick={() => setSearchType('container')}
          >
            柜号查询
          </View>
          <View
            className={classnames(styles.searchTab, searchType === 'supplier' && styles.searchTabActive)}
            onClick={() => setSearchType('supplier')}
          >
            供应商批次号
          </View>
        </View>

        <View className={styles.searchInput}>
          <Text className={styles.searchIcon}>🔍</Text>
          <Input
            className={styles.input}
            placeholder={searchType === 'container' ? '请输入柜号，如 MSCU1234567' : '请输入供应商批次号'}
            value={keyword}
            onInput={(e) => setKeyword(e.detail.value)}
            confirmType='search'
            onConfirm={handleSearch}
          />
          <Button className={styles.searchBtn} onClick={handleSearch}>查询</Button>
        </View>
      </View>

      {hasSearched && (
        <View className={styles.quickSection}>
          {searchResult ? (
            <View className={styles.historyCard} onClick={() => goToDetail(searchResult.id)}>
              <View className={styles.historyHeader}>
                <Text className={styles.historyProduct}>{searchResult.productName}</Text>
                <StatusBadge status={searchResult.overallStatus} />
              </View>
              <Text className={styles.historyMeta}>
                {searchResult.containerNo} · {searchResult.origin}
              </Text>
              <View className={styles.historyInfo}>
                <Text className={styles.historyTime}>{searchResult.tempRequired}</Text>
                <Text className={styles.historyTime}>查看详情 →</Text>
              </View>
            </View>
          ) : (
            <View className={styles.emptyState}>
              <Text className={styles.emptyIcon}>📦</Text>
              <Text className={styles.emptyText}>未找到该批次信息</Text>
            </View>
          )}
        </View>
      )}

      <View className={styles.quickSection}>
        <View className={styles.sectionHeader}>
          <Text className={styles.sectionTitle}>快捷功能</Text>
        </View>
        <View className={styles.quickActions}>
          <View className={styles.quickItem} onClick={() => Taro.switchTab({ url: '/pages/receipt/index' })}>
            <View className={styles.quickIcon} style={{ background: 'rgba(14, 124, 134, 0.1)' }}>
              <Text style={{ color: '#0E7C86', fontSize: 36 }}>📋</Text>
            </View>
            <Text className={styles.quickText}>扫码验收</Text>
          </View>
          <View className={styles.quickItem} onClick={() => Taro.switchTab({ url: '/pages/service/index' })}>
            <View className={styles.quickIcon} style={{ background: 'rgba(59, 130, 246, 0.1)' }}>
              <Text style={{ color: '#3B82F6', fontSize: 36 }}>💬</Text>
            </View>
            <Text className={styles.quickText}>客户话术</Text>
          </View>
        </View>
      </View>

      <View className={styles.historySection}>
        <View className={styles.sectionHeader}>
          <Text className={styles.sectionTitle}>最近批次</Text>
        </View>
        {recentBatches.map(batch => (
          <View
            key={batch.id}
            className={styles.historyCard}
            onClick={() => goToDetail(batch.id)}
          >
            <View className={styles.historyHeader}>
              <Text className={styles.historyProduct}>{batch.productName}</Text>
              <StatusBadge status={batch.overallStatus} size='sm' />
            </View>
            <Text className={styles.historyMeta}>
              {batch.containerNo} · {batch.origin} · {(batch.weight / 1000).toFixed(1)}吨
            </Text>
            <View className={styles.historyInfo}>
              <Text className={styles.historyTime}>{batch.tempRequired}</Text>
              <Text className={styles.historyTime}>查看 →</Text>
            </View>
          </View>
        ))}
      </View>
    </View>
  )
}

export default HomePage
