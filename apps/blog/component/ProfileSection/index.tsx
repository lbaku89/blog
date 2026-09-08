const socialLinks = [
  { label: 'GitHub', href: 'https://github.com/lbaku89' },
  { label: 'LinkedIn', href: 'https://www.linkedin.com/in/hyunwoo-kwon-4799b6296/' },
  { label: 'Email', href: 'mailto:khj930410@naver.com' },
]

export const ProfileSection = () => {
  return (
    <section aria-label="블로그 소개" className="mb-10 border-b border-gray-200 pb-8 dark:border-gray-800">
      <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
        <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">Hyunwoo Kwon</h2>
        <span className="text-sm text-gray-500 dark:text-gray-400">Frontend Developer</span>
      </div>
      <p className="mt-3 text-sm leading-relaxed text-gray-600 dark:text-gray-400">
        프론트엔드 개발을 하며 배운 내용과 실무 경험을 기록합니다.
      </p>
      <div className="mt-3 flex flex-wrap gap-x-5 gap-y-2">
        {socialLinks.map(({ label, href }) => (
          <a
            key={label}
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-sm py-1 text-sm text-gray-600 underline-offset-4 transition-colors hover:text-gray-900 hover:underline focus-visible:outline-2 focus-visible:outline-offset-4 dark:text-gray-400 dark:hover:text-gray-100"
          >
            {label}
          </a>
        ))}
      </div>
    </section>
  )
}
