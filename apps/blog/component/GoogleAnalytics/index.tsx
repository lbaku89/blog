import Script from 'next/script'

export const GoogleAnalytics = () => {
  const measurementId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID?.trim()

  // 개발 중 방문과 측정 ID가 없는 환경은 통계에 포함하지 않는다.
  if (process.env.NODE_ENV !== 'production' || !measurementId || !/^G-[A-Z0-9]+$/.test(measurementId)) {
    return null
  }

  return (
    <>
      <Script src={`https://www.googletagmanager.com/gtag/js?id=${measurementId}`} strategy="afterInteractive" />
      <Script id="ga4-init" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', ${JSON.stringify(measurementId)});
        `}
      </Script>
    </>
  )
}
