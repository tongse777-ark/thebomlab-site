# 더봄교육디자인연구소 홈페이지

조직문화 진단 및 맞춤형 기업교육 — [thebomlab.com](https://thebomlab.com)

## 구조

```
thebomlab-site/
├── public/                 ← 버셀이 그대로 공개하는 폴더
│   ├── index.html
│   ├── assets/
│   │   ├── styles.css
│   │   └── app.js
│   └── cards/              ← ★ 인스타 카드뉴스 이미지가 쌓이는 곳
└── vercel.json             outputDirectory = public
```

빌드 도구 없이 동작하는 정적 사이트입니다. `public/` 안의 파일이 그대로 공개됩니다.

## 인스타그램 카드 이미지 저장소 역할

인스타그램 API는 **공개 https 주소로 된 이미지만** 받습니다.
그래서 SNS 자동화 엔진(`C:\sns-auto\tistory`)이 카드뉴스를 만들면
`public/cards/<logNo>/01.jpg` 형태로 이 저장소에 복사하고, 커밋·푸시합니다.

버셀이 자동 배포하면 아래 주소로 열리고, 그 주소를 인스타에 넘깁니다.

```
https://<버셀주소>/cards/<logNo>/01.jpg
```

엔진 쪽 연결 지점은 두 곳입니다.

| 파일 | 설정 |
| --- | --- |
| `tistory/src/cards_build.py` | `SITE_ROOT` (저장소 폴더명) · 카드 공개 URL |
| `tistory/src/site_sync.py` | `SITE_ROOT` |

> 엔진은 `..\thebomlab-site` 를 찾으므로 이 폴더는 반드시
> `C:\sns-auto\tistory` 와 **같은 높이**에 있어야 합니다.

## 로컬에서 확인

```bash
cd C:\sns-auto\thebomlab-site\public
python -m http.server 8080
```

http://localhost:8080 접속.

## assets 를 고칠 때

`public/assets/*` 는 파일명에 내용 해시가 없다.
고친 뒤에는 `index.html` 의 `?v=` 날짜를 올려야 방문자 브라우저가 새 파일을 받는다.

```html
<link rel="stylesheet" href="/assets/styles.css?v=20260822b">
<script src="/assets/app.js?v=20260822b" defer></script>
```

## 배포

`main` 브랜치에 푸시하면 버셀이 자동 배포합니다.
