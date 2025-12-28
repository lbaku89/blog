# [kwonhyunwoo.dev](https://www.kwonhyunwoo.dev/)

https://khj930410.tistory.com/ 의 게시글을 현재 https://www.kwonhyunwoo.dev/ 으로 이동중 입니다.

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
- **프레임워크**: Next.js 14
- **언어**: TypeScript
- **스타일링**: Tailwind CSS
- **콘텐츠**: MDX
