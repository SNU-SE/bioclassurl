# BioClass URL Shortener

간단한 URL 단축 서비스로, bioclass.kr 도메인을 사용하여 짧은 URL을 생성합니다.

## 기능

- ✅ URL 단축 (bioclass.kr/xxxxx 형태)
- ✅ QR 코드 자동 생성
- ✅ 클릭 수 추적
- ✅ Docker Compose 지원
- ✅ VPS 호스팅 최적화

## 빠른 시작

### 1. Docker Compose로 실행

```bash
# 프로젝트 클론
git clone <repository-url>
cd url-shortener

# Docker Compose로 빌드 및 실행
docker-compose up -d --build
```

### 2. 서비스 확인

- 프론트엔드: http://localhost
- 백엔드 API: http://localhost:3000
- 헬스체크: http://localhost:3000/health

## 수동 설치 (개발용)

### 백엔드 설정

```bash
cd backend
npm install
npm start
```

### 환경 변수

```bash
# .env 파일 생성 (선택사항)
BASE_URL=https://bioclass.kr
PORT=3000
```

## 배포하기

### 1. VPS에 배포

```bash
# 서버에 코드 업로드
scp -r . user@your-vps:/path/to/app

# 서버에서 실행
cd /path/to/app
docker-compose up -d --build
```

### 2. 도메인 설정

Nginx나 Apache에서 리버스 프록시 설정:

```nginx
server {
    listen 80;
    server_name bioclass.kr;

    location / {
        proxy_pass http://localhost:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

### 3. SSL 인증서 설정 (선택사항)

Let's Encrypt를 사용하여 무료 SSL 인증서 발급:

```bash
sudo certbot --nginx -d bioclass.kr
```

## API 사용법

### URL 단축

```bash
curl -X POST http://localhost:3000/api/shorten \
  -H "Content-Type: application/json" \
  -d '{"originalUrl": "https://example.com/very/long/url"}'
```

응답:
```json
{
  "originalUrl": "https://example.com/very/long/url",
  "shortUrl": "https://bioclass.kr/abc123",
  "shortCode": "abc123",
  "qrCode": "data:image/png;base64,..."
}
```

## 프로젝트 구조

```
url-shortener/
├── backend/
│   ├── src/
│   │   ├── app.js          # 메인 서버 파일
│   │   ├── database.js     # SQLite 데이터베이스 관리
│   │   ├── routes/
│   │   │   ├── shorten.js  # URL 단축 API
│   │   │   └── redirect.js # 리다이렉트 처리
│   │   └── utils/
│   │       └── qrcode.js   # QR 코드 생성
│   ├── package.json
│   └── Dockerfile
├── frontend/
│   ├── public/
│   │   ├── index.html      # 메인 페이지
│   │   ├── style.css       # 스타일
│   │   └── script.js       # 클라이언트 사이드 로직
│   └── Dockerfile
├── docker-compose.yml       # Docker Compose 설정
└── README.md
```

## 기술 스택

- **Backend**: Node.js + Express.js
- **Database**: SQLite3
- **Frontend**: HTML5 + CSS3 + JavaScript
- **QR Code**: qrcode 라이브러리
- **Container**: Docker + Docker Compose

## 개발자 정보

- 간단한 URL 단축 서비스
- SQLite를 통한 경량 데이터 저장
- Docker를 통한 쉬운 배포
- QR 코드 자동 생성 기능

## 라이선스

이 프로젝트는 MIT 라이선스를 따릅니다.
