'use client'
import styles from './index.module.css'
import { useEffect, useState } from 'react'

type Props = {
  percentage: number
}

export const ProgressBar = (props: Props) => {
  return (
    <div className={styles.container}>
      <div
        className={styles.bar}
        style={
          {
            '--target-width': props.percentage + '%',
            width: props.percentage + '%',
          } as React.CSSProperties
        }
      ></div>
      <span className={styles.label}>{props.percentage}%</span>
    </div>
  )
}

export const ProgressBar2 = (props: Props) => {
  const dynamicStyle = `
        @keyframes slideIn-${props.percentage} {
            from { width: 0%; }
            to { width: ${props.percentage}%; }
        }
    `

  return (
    <div className={styles.container}>
      <style>{dynamicStyle}</style>
      <div
        className={styles.bar}
        style={{
          animation: `slideIn-${props.percentage} 2s`,
          width: `${props.percentage}%`,
        }}
      ></div>
      <span className={styles.label}>{props.percentage}%</span>
    </div>
  )
}

export const ProgressBar3 = (props: Props) => {
  const [currentWidth, setCurrentWidth] = useState(0)

  useEffect(() => {
    // 컴포넌트 마운트 후 애니메이션 시작
    const timer = setTimeout(() => {
      setCurrentWidth(props.percentage)
    }, 100)

    return () => clearTimeout(timer)
  }, [props.percentage])

  return (
    <div className={styles.container}>
      <div
        className={styles.barTransition}
        style={{
          width: `${currentWidth}%`,
          transition: 'width 2s ease-out',
        }}
      ></div>
      <span className={styles.label}>{props.percentage}%</span>
    </div>
  )
}
