'use client'

import { useEffect, useState } from 'react'
import { Tooltip, TooltipContent, TooltipTrigger } from '@common-ui'
import { Skeleton } from '@common-ui'
interface ContributionDay {
  date: string
  contributionCount: number
  color: string
}

interface ContributionWeek {
  contributionDays: ContributionDay[]
}

interface ContributionData {
  weeks: ContributionWeek[]
  totalContributions: number
}

interface GitHubContributionProps {
  username?: string
}

/**
 * GitHub contribution level에 따른 색상 매핑
 */
const getContributionColor = (count: number): string => {
  if (count === 0) return 'bg-gray-100 dark:bg-gray-800'
  if (count <= 3) return 'bg-green-200 dark:bg-green-900'
  if (count <= 6) return 'bg-green-400 dark:bg-green-700'
  if (count <= 9) return 'bg-green-600 dark:bg-green-600'
  return 'bg-green-800 dark:bg-green-500'
}

/**
 * 날짜 포맷팅 (월 표시)
 */
const formatMonthLabel = (dateString: string): string => {
  const date = new Date(dateString)
  return `${date.getMonth() + 1}월`
}

export const GitHubContribution = ({ username = 'lbaku89' }: GitHubContributionProps) => {
  const [contributionData, setContributionData] = useState<ContributionData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchContributions = async () => {
      try {
        setIsLoading(true)
        setError(null)
        const response = await fetch(`/api/github/contributions?username=${username}`)

        const data = await response.json()

        if (!response.ok || data.error) {
          const errorMessage = data.details || data.error || 'Contribution 데이터를 가져올 수 없습니다.'
          setError(errorMessage)
          console.error('GitHub contribution API 오류:', data)
          return
        }

        setContributionData(data)
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : '알 수 없는 오류가 발생했습니다.'
        setError(errorMessage)
        console.error('GitHub contribution 데이터 로딩 오류:', err)
      } finally {
        setIsLoading(false)
      }
    }

    fetchContributions()
  }, [username])

  const contributionContainerClassName = 'w-[274px] h-[280px]'
  if (isLoading) {
    return <Skeleton className={contributionContainerClassName} />
  }

  if (error || !contributionData) {
    return (
      <div className={contributionContainerClassName}>
        <div className="h-full flex flex-col justify-center items-center p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
          <p className="text-sm font-medium text-red-800 dark:text-red-300 mb-1">데이터를 불러올 수 없습니다</p>
          <p className="text-xs text-red-600 dark:text-red-400 break-words">
            {error || 'Contribution 데이터를 불러올 수 없습니다.'}
          </p>
        </div>
      </div>
    )
  }

  // 월 레이블을 위한 데이터 준비 (각 주의 첫 번째 날짜 사용)
  const monthLabels: { weekIndex: number; label: string }[] = []
  contributionData.weeks.forEach((week, weekIndex) => {
    const firstDay = week.contributionDays[0]
    if (firstDay) {
      const date = new Date(firstDay.date)
      const dayOfMonth = date.getDate()

      // 매월 첫 주에만 레이블 추가
      if (dayOfMonth <= 7) {
        const existingLabel = monthLabels.find((label) => label.label === formatMonthLabel(firstDay.date))
        if (!existingLabel) {
          monthLabels.push({ weekIndex, label: formatMonthLabel(firstDay.date) })
        }
      }
    }
  })

  // 요일 레이블 (일요일부터 시작)
  const dayLabels = ['일', '월', '화', '수', '목', '금', '토']

  // 첫 번째 주의 요일 인덱스 찾기 (그리드가 일요일부터 시작하는지 확인)
  const firstWeekFirstDay = contributionData.weeks[0]?.contributionDays[0]
  const firstDayOfWeek = firstWeekFirstDay ? new Date(firstWeekFirstDay.date).getDay() : 0

  return (
    <a
      href={`https://github.com/${username}`}
      target="_blank"
      rel="noopener noreferrer"
      className="block w-full max-w-[280px] p-4 bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md hover:border-green-300 dark:hover:border-green-700 transition-all group cursor-pointer"
    >
      {/* 헤더 */}
      <div className="mb-4">
        <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-1 group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors">
          GitHub Contributions
        </h3>
        <p className="text-xs text-gray-600 dark:text-gray-400 group-hover:text-gray-700 dark:group-hover:text-gray-300 transition-colors">
          최근 90일 · 총 {contributionData.totalContributions.toLocaleString()} contributions
        </p>
      </div>

      {/* 월 레이블 */}
      <div className="flex gap-1 mb-2 ml-5">
        {contributionData.weeks.map((_, weekIndex) => {
          const monthLabel = monthLabels.find((label) => label.weekIndex === weekIndex)
          return (
            <div key={weekIndex} className="w-3 text-[10px] text-gray-500 dark:text-gray-400 text-center">
              {monthLabel ? monthLabel.label : ''}
            </div>
          )
        })}
      </div>

      {/* 그리드 컨테이너 */}
      <div className="flex gap-1">
        {/* 요일 레이블 */}
        <div className="flex flex-col gap-1 mr-1">
          {dayLabels.map((day, index) => {
            // 첫 번째 주의 첫 번째 날짜가 해당 요일인지 확인
            const shouldShow = index === firstDayOfWeek || (firstDayOfWeek === 0 && index === 0)
            return (
              <div
                key={day}
                className={`h-3 text-[10px] text-gray-500 dark:text-gray-400 flex items-center ${
                  shouldShow ? 'opacity-100' : 'opacity-0'
                }`}
              >
                {day}
              </div>
            )
          })}
        </div>

        {/* Contribution 그리드 */}
        <div className="flex gap-1 flex-1">
          {contributionData.weeks.map((week, weekIndex) => (
            <div key={weekIndex} className="flex flex-col gap-1">
              {week.contributionDays.map((day, dayIndex) => {
                const contributionColor = getContributionColor(day.contributionCount)
                const date = new Date(day.date)
                const formattedDate = date.toLocaleDateString('ko-KR', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })

                return (
                  <Tooltip key={`${weekIndex}-${dayIndex}`}>
                    <TooltipTrigger asChild>
                      <div
                        className={`w-3 h-3 ${contributionColor} rounded-sm transition-all hover:scale-110 hover:ring-2 hover:ring-green-400 dark:hover:ring-green-600 cursor-pointer shadow-sm pointer-events-auto`}
                        aria-label={`${formattedDate}: ${day.contributionCount} contributions`}
                      />
                    </TooltipTrigger>
                    <TooltipContent side="right" sideOffset={8} className="text-xs pointer-events-none">
                      <div className="font-semibold mb-1">{formattedDate}</div>
                      <div>
                        {day.contributionCount} contribution{day.contributionCount !== 1 ? 's' : ''}
                      </div>
                    </TooltipContent>
                  </Tooltip>
                )
              })}
            </div>
          ))}
        </div>
      </div>

      {/* 범례 */}
      <div className="flex items-center justify-center gap-2 mt-4 pt-3 border-t border-gray-200 dark:border-gray-700">
        <span className="text-[10px] text-gray-500 dark:text-gray-400">Less</span>
        <div className="flex gap-0.5">
          <div className="w-2.5 h-2.5 bg-gray-100 dark:bg-gray-800 rounded-sm"></div>
          <div className="w-2.5 h-2.5 bg-green-200 dark:bg-green-900 rounded-sm"></div>
          <div className="w-2.5 h-2.5 bg-green-400 dark:bg-green-700 rounded-sm"></div>
          <div className="w-2.5 h-2.5 bg-green-600 dark:bg-green-600 rounded-sm"></div>
          <div className="w-2.5 h-2.5 bg-green-800 dark:bg-green-500 rounded-sm"></div>
        </div>
        <span className="text-[10px] text-gray-500 dark:text-gray-400">More</span>
      </div>
    </a>
  )
}
