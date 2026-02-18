# [kwonhyunwoo.dev](https://www.kwonhyunwoo.dev/)

학습한 내용을 정리하고, 실무 경험을 바탕으로 공유하는 TECH BLOG입니다.  
부족한 부분이 있다면 지적해주시고, 함께 나누고 싶은 지식, 의견이 있다면 언제든 환영합니다!

## 프로젝트 구조

이 프로젝트는 pnpm을 사용하는 모노레포 구조로 구성되어 있습니다.

```
blog/
├── apps/
│   └── blog/          # Next.js 블로그 애플리케이션
├── packages/           # 공유 패키지 (향후 추가 가능)
├── pnpm-workspace.yaml # pnpm workspace 설정
└── package.json        # 루트 package.json
```

## 시작하기

### 의존성 설치

```bash
pnpm install
```

### 개발 서버 실행

```bash
pnpm dev
# 또는 특정 앱만 실행
pnpm --filter blog dev
```

### 빌드

```bash
pnpm build
# 또는 특정 앱만 빌드
pnpm --filter blog build
```

## 사용 기술

- **패키지 관리**: pnpm
- **프레임워크**: Next.js 16
- **언어**: TypeScript 5
- **스타일링**: Tailwind CSS v5
- **콘텐츠**: MDX
