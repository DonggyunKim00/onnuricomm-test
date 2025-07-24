# 시험 및 테스트 가이드

📌 **로컬 서버 실행**

```
# 의존성 설치
npm install

# 서버 실행 (http://localhost:3000)
npm run dev
```

📌 **API 테스트**

- 터미널 API 테스트 방법

  ```bash
  # 자동 분류 요청 POST API

  curl -X POST http://localhost:3000/api/v1/accounting/process \
  -F csv=@bank_transactions.csv \
  -F rule=@rules.json
  ```

  ```bash
  # 사업체별 결과 조회 GET API
  curl "http://localhost:3000/api/v1/accounting/records?companyId=회사id값"
  ```

- postman API 테스트 방법
  - 자동 분류 요청 POST API
    ![postman-POST](/public/postman-post.png)
  - 사업체별 결과 조회 GET API
    ![postman-GET](/public/postman-get.png)
