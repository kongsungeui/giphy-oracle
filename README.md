# Giphy Oracle

AI 기반 타로 카드 리딩 웹 애플리케이션입니다. 신비로운 이미지와 함께 과거, 현재, 미래를 점쳐보세요.

## 주요 기능

- 3장의 타로 카드 뽑기 (과거, 현재, 미래)
- Pixabay API를 활용한 신비로운 이미지 제공
- Claude AI가 생성하는 개인화된 타로 해석
- 반응형 디자인과 신비로운 UI

## 기술 스택

- **Frontend**: Next.js 15, React 19, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes (Edge Runtime)
- **AI**: Anthropic Claude API
- **이미지**: Pixabay API
- **배포**: Cloudflare Pages & Workers

## 시작하기

### 1. 의존성 설치

```bash
npm install
```

### 2. 환경 변수 설정

`.env.example`을 참고하여 `.env.local` 파일을 생성하세요:

```bash
PIXABAY_API_KEY=your_pixabay_api_key
ANTHROPIC_API_KEY=your_anthropic_api_key
```

### 3. 개발 서버 실행

```bash
npm run dev
```

브라우저에서 [http://localhost:3000](http://localhost:3000)을 열어 확인하세요.

## 프로젝트 구조

```
src/
└── app/
    ├── layout.tsx      # 루트 레이아웃
    ├── page.tsx        # 메인 페이지
    ├── globals.css     # 전역 스타일
    └── api/
        └── tarot/
            └── route.ts  # 타로 API 엔드포인트
```

## 배포

Cloudflare Pages에 자동 배포됩니다. `main` 브랜치에 push하면 GitHub Actions를 통해 배포가 진행됩니다.

### 수동 배포

```bash
npm run build
npx wrangler pages deploy .vercel/output/static
```

## API

### GET /api/tarot

타로 카드 3장과 AI 해석을 반환합니다.

**응답 예시:**
```json
{
  "images": [
    { "url": "...", "tags": "..." },
    { "url": "...", "tags": "..." },
    { "url": "...", "tags": "..." }
  ],
  "fortune": {
    "past": "과거에 대한 해석...",
    "present": "현재에 대한 해석...",
    "future": "미래에 대한 해석...",
    "summary": "종합 해석..."
  }
}
```

## 라이선스

MIT
