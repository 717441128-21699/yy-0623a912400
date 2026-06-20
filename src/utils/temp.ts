import type { TempStatus } from '@/types/coldchain'

export const getTempStatus = (temp: number, min: number, max: number): TempStatus => {
  if (temp >= min && temp <= max) return 'normal'
  const margin = (max - min) * 0.3
  if (temp >= min - margin && temp <= max + margin) return 'warning'
  return 'danger'
}

export const getStatusColor = (status: TempStatus): string => {
  const map = {
    normal: '#10B981',
    warning: '#F59E0B',
    danger: '#EF4444'
  }
  return map[status]
}

export const getStatusText = (status: TempStatus): string => {
  const map = {
    normal: '正常',
    warning: '轻微异常',
    danger: '严重异常'
  }
  return map[status]
}

export const formatTemp = (temp: number): string => {
  return `${temp.toFixed(1)}°C`
}

export const tempGapWarning = (arrival: number, platform: number): boolean => {
  return Math.abs(arrival - platform) > 3
}
