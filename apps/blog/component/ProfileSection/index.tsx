import { EnvelopeIcon } from '@heroicons/react/24/solid'
import { TypographyP } from '@common-ui'

export const ProfileSection = () => {
  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
      {/* 소개글 및 링크 */}
      <div className="flex-1 min-w-0">
        <h2 className="text-xl sm:text-2xl font-semibold mb-3 text-gray-900 dark:text-gray-100">
          Hello I&apos;m Hyunwoo, a front-end developer.👋
        </h2>
        <TypographyP className="text-gray-700 dark:text-gray-300 mb-4 leading-relaxed">
          재미있게 학습하고, 학습한 내용을 더 오래 기억하고 나아가 다른 사람들과 공유하기 위해 TECH BLOG를 운영합니다.
          <br />
          잘못된 정보가 있거나, 공유하고 싶은 정보가 있다면 알려주세요. 언제든지 환영입니다!
        </TypographyP>

        {/* 소셜 링크 */}
        <div className="flex flex-wrap gap-3 items-center">
          <a
            href="https://github.com/lbaku89"
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100 transition-all duration-200 hover:scale-105 hover:shadow-md"
            aria-label="GitHub 프로필"
          >
            <svg
              height="20"
              aria-hidden="true"
              viewBox="0 0 24 24"
              version="1.1"
              width="20"
              data-view-component="true"
              className="fill-gray-900 dark:fill-gray-100 group-hover:fill-purple-600 dark:group-hover:fill-purple-400 transition-colors"
            >
              <path d="M12 1C5.923 1 1 5.923 1 12c0 4.867 3.149 8.979 7.521 10.436.55.096.756-.233.756-.522 0-.262-.013-1.128-.013-2.049-2.764.509-3.479-.674-3.699-1.292-.124-.317-.66-1.293-1.127-1.554-.385-.207-.936-.715-.014-.729.866-.014 1.485.797 1.691 1.128.99 1.663 2.571 1.196 3.204.907.096-.715.385-1.196.701-1.471-2.448-.275-5.005-1.224-5.005-5.432 0-1.196.426-2.186 1.128-2.956-.111-.275-.496-1.402.11-2.915 0 0 .921-.288 3.024 1.128a10.193 10.193 0 0 1 2.75-.371c.936 0 1.871.123 2.75.371 2.104-1.43 3.025-1.128 3.025-1.128.605 1.513.221 2.64.111 2.915.701.77 1.127 1.747 1.127 2.956 0 4.222-2.571 5.157-5.019 5.432.399.344.743 1.004.743 2.035 0 1.471-.014 2.654-.014 3.025 0 .289.206.632.756.522C19.851 20.979 23 16.854 23 12c0-6.077-4.922-11-11-11Z"></path>
            </svg>
            <span className="text-sm font-medium">GitHub</span>
          </a>
          <a
            href="https://www.linkedin.com/in/hyunwoo-kwon-4799b6296/"
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-50 dark:bg-blue-900/20 hover:bg-blue-100 dark:hover:bg-blue-900/30 text-blue-700 dark:text-blue-300 hover:text-blue-800 dark:hover:text-blue-200 transition-all duration-200 hover:scale-105 hover:shadow-md"
            aria-label="LinkedIn 프로필"
          >
            <svg
              height="20"
              viewBox="0 0 24 24"
              width="20"
              className="fill-blue-600 dark:fill-blue-400 group-hover:fill-blue-700 dark:group-hover:fill-blue-300 transition-colors"
              aria-hidden="true"
            >
              <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
            </svg>
            <span className="text-sm font-medium">LinkedIn</span>
          </a>
          <a
            href="mailto:khj930410@naver.com"
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-center gap-2 px-4 py-2 rounded-lg bg-orange-50 dark:bg-orange-900/20 hover:bg-orange-100 dark:hover:bg-orange-900/30 text-orange-700 dark:text-orange-300 hover:text-orange-800 dark:hover:text-orange-200 transition-all duration-200 hover:scale-105 hover:shadow-md"
            aria-label="이메일 보내기"
          >
            <EnvelopeIcon className="w-5 h-5 group-hover:scale-110 transition-transform" />
            <span className="text-sm font-medium">Email</span>
          </a>
        </div>
      </div>
    </div>
  )
}
