import React, { useState, useEffect } from 'react'
import { View, Text, Input, Button, Image } from '@tarojs/components'
import Taro, { useRouter } from '@tarojs/taro'
import classnames from 'classnames'
import { getReceiptById } from '@/data/receipts'
import { getBatchById } from '@/data/batches'
import type { ReceiptRecord, BatchInfo } from '@/types/coldchain'
import { tempGapWarning, formatTemp } from '@/utils/temp'
import { updateReceipt } from '@/utils/storage'
import styles from './index.module.scss'

type StepType = 'package' | 'seal' | 'temp' | 'photo' | 'submit'

const ReceiptDetailPage: React.FC = () => {
  const router = useRouter()
  const [receipt, setReceipt] = useState<ReceiptRecord | null>(null)
  const [batch, setBatch] = useState<BatchInfo | null>(null)
  const [currentStep, setCurrentStep] = useState<StepType>('package')
  const [outerPackageOk, setOuterPackageOk] = useState<boolean | null>(null)
  const [sealOk, setSealOk] = useState<boolean | null>(null)
  const [arrivalTemp, setArrivalTemp] = useState<string>('')
  const [photos, setPhotos] = useState<string[]>([])
  const [showResult, setShowResult] = useState(false)
  const [resultType, setResultType] = useState<'success' | 'warn'>('success')

  useEffect(() => {
    const id = router.params.id
    if (id) {
      const r = getReceiptById(id)
      setReceipt(r || null)
      if (r) {
        const b = getBatchById(r.batchId)
        setBatch(b || null)
        if (r.status === 'processing') {
          setOuterPackageOk(r.outerPackageOk ?? null)
          setSealOk(r.sealOk ?? null)
          setArrivalTemp(r.arrivalTemp?.toString() || '')
          setPhotos(r.photos || [])
          if (r.outerPackageOk === undefined) setCurrentStep('package')
          else if (r.sealOk === undefined) setCurrentStep('seal')
          else if (r.arrivalTemp === undefined) setCurrentStep('temp')
          else setCurrentStep('photo')
        }
      }
      console.log('[ReceiptDetail] load:', id, r?.id)
    }
  }, [router.params.id])

  if (!receipt) {
    return (
      <View className={styles.page} style={{ padding: 100, textAlign: 'center' }}>
        <Text>验收单不存在</Text>
      </View>
    )
  }

  const platformTemp = batch?.stages[batch.stages.length - 1]?.avgTemp ?? 0
  const hasTempGap = arrivalTemp && tempGapWarning(parseFloat(arrivalTemp), platformTemp)
  const canSubmit = outerPackageOk !== null && sealOk !== null && arrivalTemp !== '' && photos.length > 0

  const addPhoto = () => {
    const newPhoto = `https://picsum.photos/id/${200 + photos.length}/300/300`
    setPhotos([...photos, newPhoto])
    console.log('[ReceiptDetail] add photo')
  }

  const removePhoto = (idx: number) => {
    setPhotos(photos.filter((_, i) => i !== idx))
  }

  const saveProgress = (status: 'processing' | 'completed') => {
    if (!receipt) return
    const arrivalTempNum = arrivalTemp !== '' ? parseFloat(arrivalTemp) : undefined
    const updatedReceipt: ReceiptRecord = {
      ...receipt,
      status,
      outerPackageOk,
      sealOk,
      arrivalTemp: arrivalTempNum,
      platformTemp,
      tempGap: arrivalTempNum !== undefined ? Math.abs(arrivalTempNum - platformTemp) : undefined,
      photos,
      receiver: '当前用户'
    }
    updateReceipt(updatedReceipt)
    console.log('[ReceiptDetail] save progress:', receipt.id, status, updatedReceipt)
  }

  const nextStep = () => {
    if (currentStep === 'package' && outerPackageOk !== null) {
      saveProgress('processing')
      setCurrentStep('seal')
    } else if (currentStep === 'seal' && sealOk !== null) {
      saveProgress('processing')
      setCurrentStep('temp')
    } else if (currentStep === 'temp' && arrivalTemp !== '') {
      saveProgress('processing')
      setCurrentStep('photo')
    }
  }

  const handleSubmit = () => {
    console.log('[ReceiptDetail] submit receipt')
    saveProgress('completed')
    if (hasTempGap) {
      setResultType('warn')
    } else {
      setResultType('success')
    }
    setShowResult(true)
  }

  const handleReject = () => {
    Taro.showModal({
      title: '确认暂缓入库',
      content: '温度差距超过3°C阈值，建议联系采购经理确认后再入库。',
      confirmText: '联系采购',
      cancelText: '取消',
      success: (res) => {
        if (res.confirm) {
          Taro.showToast({ title: '已通知采购经理', icon: 'success' })
        }
      }
    })
  }

  const goBack = () => {
    Taro.navigateBack()
  }

  if (showResult) {
    return (
      <View className={styles.page}>
        <View className={styles.resultPage}>
          <View className={[styles.resultIcon, resultType === 'success' ? styles.resultSuccess : styles.resultWarn].join(' ')}>
            <Text className={styles.resultEmoji}>{resultType === 'success' ? '✅' : '⚠️'}</Text>
          </View>
          <Text className={styles.resultTitle}>{resultType === 'success' ? '验收完成' : '需进一步确认'}</Text>
          <Text className={styles.resultText}>
            {resultType === 'success'
              ? `已完成 ${receipt.productName} 的到货验收，可正常入库。`
              : `到货温度与平台记录温差 ${(Math.abs(parseFloat(arrivalTemp) - platformTemp)).toFixed(1)}°C，建议联系采购经理确认后再入库。`
            }
          </Text>
          <View className={styles.bottomBar}>
            <Button className={[styles.btn, styles.btnPrimary].join(' ')} onClick={goBack}>
              返回验收列表
            </Button>
          </View>
        </View>
      </View>
    )
  }

  return (
    <View className={styles.page}>
      <View className={styles.infoCard}>
        <Text className={styles.productName}>{receipt.productName}</Text>
        <Text className={styles.containerNo}>柜号：{receipt.containerNo}</Text>
        <Text className={styles.arrivalTime}>到货时间：{receipt.createTime}</Text>
      </View>

      <View className={styles.steps}>
        <View className={styles.stepItem}>
          <View className={styles.stepHeader}>
            <View className={[styles.stepNum, outerPackageOk !== null && styles.stepCompleted].join(' ')}>
              <Text>{outerPackageOk !== null ? '✓' : '1'}</Text>
            </View>
            <Text className={styles.stepTitle}>外包装检查</Text>
          </View>
          {currentStep === 'package' ? (
            <>
              <Text className={styles.stepDesc}>请检查货物外包装是否完好，有无破损、潮湿、变形等异常情况。</Text>
              <View className={styles.options}>
                <Button
                  className={[styles.optionBtn, outerPackageOk === true ? styles.optionActive : styles.optionDefault].join(' ')}
                  onClick={() => setOuterPackageOk(true)}
                >
                  完好正常
                </Button>
                <Button
                  className={[styles.optionBtn, outerPackageOk === false ? styles.optionDanger : styles.optionDefault].join(' ')}
                  onClick={() => setOuterPackageOk(false)}
                >
                  有破损
                </Button>
              </View>
              {outerPackageOk !== null && (
                <View style={{ marginTop: 24 }}>
                  <Button className={[styles.btn, styles.btnPrimary].join(' ')} onClick={nextStep}>
                    下一步：封签检查
                  </Button>
                </View>
              )}
            </>
          ) : (
            <Text className={styles.stepDesc} style={{ color: outerPackageOk ? '#10B981' : '#EF4444' }}>
              {outerPackageOk ? '✓ 外包装完好正常' : '✗ 外包装有破损'}
            </Text>
          )}
        </View>

        {currentStep !== 'package' && (
          <View className={styles.stepItem}>
            <View className={styles.stepHeader}>
              <View className={[styles.stepNum, sealOk !== null && styles.stepCompleted].join(' ')}>
                <Text>{sealOk !== null ? '✓' : '2'}</Text>
              </View>
              <Text className={styles.stepTitle}>封签检查</Text>
            </View>
            {currentStep === 'seal' ? (
              <>
                <Text className={styles.stepDesc}>请核对集装箱封签号是否与单据一致，封签是否完好无损。</Text>
                <View className={styles.options}>
                  <Button
                    className={[styles.optionBtn, sealOk === true ? styles.optionActive : styles.optionDefault].join(' ')}
                    onClick={() => setSealOk(true)}
                  >
                    封签完好
                  </Button>
                  <Button
                    className={[styles.optionBtn, sealOk === false ? styles.optionDanger : styles.optionDefault].join(' ')}
                    onClick={() => setSealOk(false)}
                  >
                    异常
                  </Button>
                </View>
                {sealOk !== null && (
                  <View style={{ marginTop: 24 }}>
                    <Button className={[styles.btn, styles.btnPrimary].join(' ')} onClick={nextStep}>
                      下一步：录入温度
                    </Button>
                  </View>
                )}
              </>
            ) : (
              <Text className={styles.stepDesc} style={{ color: sealOk ? '#10B981' : '#EF4444' }}>
                {sealOk ? '✓ 封签完好一致' : '✗ 封签异常'}
              </Text>
            )}
          </View>
        )}

        {(currentStep === 'temp' || currentStep === 'photo' || currentStep === 'submit') && (
          <View className={styles.stepItem}>
            <View className={styles.stepHeader}>
              <View className={[styles.stepNum, arrivalTemp !== '' && styles.stepCompleted].join(' ')}>
                <Text>{arrivalTemp !== '' ? '✓' : '3'}</Text>
              </View>
              <Text className={styles.stepTitle}>录入到货温度</Text>
            </View>
            {currentStep === 'temp' ? (
              <>
                <Text className={styles.stepDesc}>请使用测温枪测量货物中心温度并录入。</Text>
                <View className={styles.tempInputWrap}>
                  <Input
                    className={styles.tempInput}
                    type='text'
                    placeholder={batch && batch.tempMin < 0 ? '-18.0' : '0.0'}
                    value={arrivalTemp}
                    onInput={(e) => {
                      const val = e.detail.value
                      if (/^-?\d*\.?\d{0,2}$/.test(val) || val === '' || val === '-') {
                        setArrivalTemp(val)
                      }
                    }}
                  />
                  <Text className={styles.tempUnit}>°C</Text>
                </View>
                <View className={styles.tempCompare}>
                  <View className={styles.tempCompareItem}>
                    <Text className={styles.tempCompareLabel}>平台记录温度</Text>
                    <Text className={styles.tempCompareValue}>{formatTemp(platformTemp)}</Text>
                  </View>
                  <View className={styles.tempCompareItem}>
                    <Text className={styles.tempCompareLabel}>要求温区</Text>
                    <Text className={styles.tempCompareValue}>{batch?.tempRequired || '-'}</Text>
                  </View>
                </View>
                {hasTempGap && (
                  <View className={styles.tempAlert}>
                    <Text className={styles.tempAlertTitle}>⚠️ 温差过大预警</Text>
                    <Text className={styles.tempAlertText}>
                      到货温度与平台记录温差 {(Math.abs(parseFloat(arrivalTemp) - platformTemp)).toFixed(1)}°C，
                      已超过 3°C 阈值。建议暂缓入库，立即联系采购经理确认。
                    </Text>
                  </View>
                )}
                {arrivalTemp !== '' && (
                  <View style={{ marginTop: 24 }}>
                    <Button className={[styles.btn, styles.btnPrimary].join(' ')} onClick={nextStep}>
                      下一步：拍照上传
                    </Button>
                  </View>
                )}
              </>
            ) : (
              <Text className={styles.stepDesc}>
                到货温度：{formatTemp(parseFloat(arrivalTemp))}
                {hasTempGap && <Text style={{ color: '#EF4444', marginLeft: 8 }}>（温差过大）</Text>}
              </Text>
            )}
          </View>
        )}

        {(currentStep === 'photo' || currentStep === 'submit') && (
          <View className={styles.stepItem}>
            <View className={styles.stepHeader}>
              <View className={[styles.stepNum, photos.length > 0 && styles.stepCompleted].join(' ')}>
                <Text>{photos.length > 0 ? '✓' : '4'}</Text>
              </View>
              <Text className={styles.stepTitle}>拍照上传</Text>
            </View>
            <Text className={styles.stepDesc}>请拍摄货物照片（至少1张），包括整体外观、温度显示、异常部位（如有）。</Text>
            <View className={styles.photoGrid}>
              {photos.map((p, idx) => (
                <View className={styles.photoItem} key={idx}>
                  <Image className={styles.photoImg} src={p} mode='aspectFill' />
                  <View className={styles.photoRemove} onClick={() => removePhoto(idx)}>✕</View>
                </View>
              ))}
              {photos.length < 6 && (
                <View className={[styles.photoItem, styles.photoAdd].join(' ')} onClick={addPhoto}>
                  <Text className={styles.photoAddIcon}>📷</Text>
                  <Text className={styles.photoAddText}>添加照片</Text>
                </View>
              )}
            </View>
          </View>
        )}
      </View>

      {currentStep === 'photo' && (
        <View className={styles.bottomBar}>
          {hasTempGap ? (
            <>
              <Button className={[styles.btn, styles.btnDanger].join(' ')} onClick={handleReject}>
                暂缓入库
              </Button>
              <Button
                className={[styles.btn, canSubmit ? styles.btnPrimary : styles.btnDisabled].join(' ')}
                disabled={!canSubmit}
                onClick={handleSubmit}
              >
                强制入库
              </Button>
            </>
          ) : (
            <Button
              className={[styles.btn, canSubmit ? styles.btnPrimary : styles.btnDisabled].join(' ')}
              disabled={!canSubmit}
              onClick={handleSubmit}
            >
              提交验收
            </Button>
          )}
        </View>
      )}
    </View>
  )
}

export default ReceiptDetailPage
