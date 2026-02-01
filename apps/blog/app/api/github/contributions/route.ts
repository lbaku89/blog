import { NextResponse } from 'next/server'

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

interface FetchResult {
  data: ContributionData | null
  error: string | null
}

/**
 * GitHub GraphQL API를 사용하여 contribution 데이터를 가져옵니다.
 */
async function fetchGitHubContributions(username: string, githubToken?: string): Promise<FetchResult> {
  const endDate = new Date()
  const startDate = new Date()
  startDate.setDate(endDate.getDate() - 89) // 최근 90일치 데이터

  const query = `
    query($username: String!, $from: DateTime!, $to: DateTime!) {
      user(login: $username) {
        contributionsCollection(from: $from, to: $to) {
          contributionCalendar {
            totalContributions
            weeks {
              contributionDays {
                date
                contributionCount
                color
              }
            }
          }
        }
      }
    }
  `

  const variables = {
    username,
    from: startDate.toISOString(),
    to: endDate.toISOString(),
  }

  try {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    }

    // GitHub 토큰이 있으면 인증 헤더 추가
    if (githubToken) {
      headers['Authorization'] = `Bearer ${githubToken}`
    }

    const response = await fetch('https://api.github.com/graphql', {
      method: 'POST',
      headers,
      body: JSON.stringify({ query, variables }),
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error('GitHub API 응답 오류:', response.status, response.statusText, errorText)
      return {
        data: null,
        error: `GitHub API 오류 (${response.status}): ${response.statusText}. ${errorText.substring(0, 200)}`,
      }
    }

    const data = await response.json()

    if (data.errors) {
      const errorMessages = data.errors.map((err: any) => err.message || JSON.stringify(err)).join(', ')
      console.error('GitHub GraphQL 오류:', JSON.stringify(data.errors, null, 2))
      return {
        data: null,
        error: `GraphQL 오류: ${errorMessages}`,
      }
    }

    if (!data.data || !data.data.user) {
      return {
        data: null,
        error: `사용자 "${username}"를 찾을 수 없습니다.`,
      }
    }

    const contributionsCollection = data.data.user.contributionsCollection

    if (!contributionsCollection) {
      return {
        data: null,
        error: 'Contribution 데이터가 없습니다.',
      }
    }

    const contributionCalendar = contributionsCollection.contributionCalendar

    // 최근 90일치 데이터만 필터링
    const cutoffDate = new Date()
    cutoffDate.setDate(cutoffDate.getDate() - 90)
    cutoffDate.setHours(0, 0, 0, 0)

    const filteredWeeks = contributionCalendar.weeks
      .map((week: ContributionWeek) => ({
        ...week,
        contributionDays: week.contributionDays.filter((day: ContributionDay) => {
          const dayDate = new Date(day.date)
          dayDate.setHours(0, 0, 0, 0)
          return dayDate >= cutoffDate
        }),
      }))
      .filter((week: ContributionWeek) => week.contributionDays.length > 0) // 빈 주 제거

    // totalContributions를 필터링된 데이터에서 계산
    const totalContributions = filteredWeeks.reduce(
      (total: number, week: ContributionWeek) =>
        total +
        week.contributionDays.reduce((dayTotal: number, day: ContributionDay) => dayTotal + day.contributionCount, 0),
      0
    )

    return {
      data: {
        weeks: filteredWeeks,
        totalContributions,
      },
      error: null,
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : '알 수 없는 오류'
    console.error('GitHub API 호출 중 오류:', error)
    return {
      data: null,
      error: `네트워크 오류: ${errorMessage}`,
    }
  }
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const username = searchParams.get('username') || 'lbaku89'
  const githubToken = process.env.GITHUB_TOKEN

  const result = await fetchGitHubContributions(username, githubToken)

  if (result.error || !result.data) {
    return NextResponse.json(
      {
        error: result.error || 'Contribution 데이터를 가져올 수 없습니다.',
        details: result.error,
      },
      { status: 500 }
    )
  }

  return NextResponse.json(result.data)
}
