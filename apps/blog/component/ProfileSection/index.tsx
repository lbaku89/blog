import { EnvelopeIcon } from '@heroicons/react/24/solid'
import { TypographyP } from '@common-ui'
import Image from 'next/image'

export const ProfileSection = () => {
  return (
    <section className="flex flex-col justify-between h-[280px] relative overflow-hidden p-4 sm:p-5">
      {/* 배경 그라데이션 효과 */}
      <div className="absolute inset-0 bg-gradient-to-br from-green-50 via-blue-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 opacity-50"></div>
      <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-green-200/30 to-blue-200/30 dark:from-green-800/20 dark:to-blue-800/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>

      <div className="relative z-10 flex flex-col justify-between h-full">
        {/* 프로필 헤더 */}
        <div className="flex flex-col items-center mb-3">
          {/* 아바타 */}
          <div className="relative mb-2 group">
            <div className="absolute inset-0 bg-gradient-to-r from-green-400 to-blue-500 rounded-full blur-lg opacity-75 group-hover:opacity-100 transition-opacity"></div>
            <div className="relative bg-white dark:bg-gray-800 p-1 rounded-full">
              <Image src="/avatar.webp" alt="Hyunwoo" width={64} height={64} className="rounded-full" />
            </div>
          </div>

          {/* 이름과 타이틀 */}
          <h2 className="text-lg sm:text-xl font-bold mb-1 text-gray-900 dark:text-gray-100">Hyunwoo Kwon</h2>
          <div className="inline-flex items-center gap-2 px-2.5 py-0.5 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-full border border-gray-200 dark:border-gray-700 mb-2">
            <span className="text-[10px] font-medium text-gray-600 dark:text-gray-400">Frontend Developer</span>
            <span className="text-sm">👋</span>
          </div>
        </div>

        {/* 소개글 */}
        <div className="flex-1 flex flex-col justify-center mb-3 min-h-0">
          <TypographyP className="text-center text-gray-700 dark:text-gray-300 leading-relaxed text-sm">
            학습한 내용을 정리하고, 실무 경험을 바탕으로 공유하는 TECH BLOG입니다.
            <br />
            <span className="text-xs text-gray-600 dark:text-gray-400">
              부족한 부분이 있다면 지적해주시고, 함께 나누고 싶은 지식, 의견이 있다면 언제든 환영합니다!
            </span>
          </TypographyP>
        </div>

        {/* 소셜 링크 */}
        <div className="flex flex-wrap gap-2 items-center justify-center">
          <a
            href="https://github.com/lbaku89"
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm border border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100 transition-all duration-200 hover:scale-105 hover:shadow-lg"
            aria-label="GitHub 프로필"
          >
            <svg
              height="18"
              aria-hidden="true"
              viewBox="0 0 24 24"
              version="1.1"
              width="18"
              data-view-component="true"
              className="fill-gray-900 dark:fill-gray-100 group-hover:fill-purple-600 dark:group-hover:fill-purple-400 transition-colors"
            >
              <path d="M12 1C5.923 1 1 5.923 1 12c0 4.867 3.149 8.979 7.521 10.436.55.096.756-.233.756-.522 0-.262-.013-1.128-.013-2.049-2.764.509-3.479-.674-3.699-1.292-.124-.317-.66-1.293-1.127-1.554-.385-.207-.936-.715-.014-.729.866-.014 1.485.797 1.691 1.128.99 1.663 2.571 1.196 3.204.907.096-.715.385-1.196.701-1.471-2.448-.275-5.005-1.224-5.005-5.432 0-1.196.426-2.186 1.128-2.956-.111-.275-.496-1.402.11-2.915 0 0 .921-.288 3.024 1.128a10.193 10.193 0 0 1 2.75-.371c.936 0 1.871.123 2.75.371 2.104-1.43 3.025-1.128 3.025-1.128.605 1.513.221 2.64.111 2.915.701.77 1.127 1.747 1.127 2.956 0 4.222-2.571 5.157-5.019 5.432.399.344.743 1.004.743 2.035 0 1.471-.014 2.654-.014 3.025 0 .289.206.632.756.522C19.851 20.979 23 16.854 23 12c0-6.077-4.922-11-11-11Z"></path>
            </svg>
            <span className="text-xs font-medium">GitHub</span>
          </a>
          <a
            href="https://www.linkedin.com/in/hyunwoo-kwon-4799b6296/"
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm border border-blue-200 dark:border-blue-800 hover:border-blue-300 dark:hover:border-blue-700 text-blue-700 dark:text-blue-300 hover:text-blue-800 dark:hover:text-blue-200 transition-all duration-200 hover:scale-105 hover:shadow-lg"
            aria-label="LinkedIn 프로필"
          >
            <svg
              height="18"
              viewBox="0 0 24 24"
              width="18"
              className="fill-blue-600 dark:fill-blue-400 group-hover:fill-blue-700 dark:group-hover:fill-blue-300 transition-colors"
              aria-hidden="true"
            >
              <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
            </svg>
            <span className="text-xs font-medium">LinkedIn</span>
          </a>
          <a
            href="mailto:khj930410@naver.com"
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm border border-orange-200 dark:border-orange-800 hover:border-orange-300 dark:hover:border-orange-700 text-orange-700 dark:text-orange-300 hover:text-orange-800 dark:hover:text-orange-200 transition-all duration-200 hover:scale-105 hover:shadow-lg"
            aria-label="이메일 보내기"
          >
            <EnvelopeIcon className="w-4 h-4 group-hover:scale-110 transition-transform" />
            <span className="text-xs font-medium">Email</span>
          </a>
        </div>
      </div>
    </section>
  )
}
