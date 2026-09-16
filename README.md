# 써랍
Vue 3 + Vite 기반의 자소서·경험 관리 프론트엔드 프로토타입입니다.

## 실행
- `npm install`
- `npm run dev`
- `npm run build`

## 구현
기본 이력 입력·복사, 경력 등록·수정, 경험 등록·수정·삭제·검색, 자소서 생성·문항별 작성, 경험 연결.

## 프론트엔드 구조

- `src/App.vue`: 공통 레이아웃과 현재 화면 선택
- `src/views/`: 기본 이력, 경력, 경험, 자소서 화면
- `src/components/`: 레이아웃, 기본 이력 세부 영역, 공통 다이얼로그
- `src/composables/useWorkspace.js`: 화면에서 공유하는 상태와 동작
- `src/data/demoData.js`: 프론트엔드 시연용 초기 데이터

## 시연 범위
모든 데이터는 Vue 메모리 상태에만 보관됩니다. 새로고침하면 초기화됩니다. 실제 개인정보 대신 예시 데이터를 사용하세요.
AI 추천은 문항과 경험 태그를 비교하는 시연이며 실제 LLM 호출이 아닙니다. 로그인 및 서버 인증은 구현하지 않았습니다.
기본 이력은 영역별 저장 버튼을 제공하며 자격증·어학 성적·수강 과목을 여러 건 입력할 수 있습니다. 학력 여러 건 관리와 저장 API 연결은 후속 범위입니다.
WebMCP 탐색 도구는 지원 브라우저에서만 등록되며 현재 실행 환경에서는 계약 검증하지 않았습니다.

## 데이터·API 설계

로컬 전용으로 진행합니다. 백엔드 및 DB는 아직 구현하지 않았습니다.

- `docs/ssulap-design.md`: 관계, 삭제 규칙, 트랜잭션, 현재 Vue와의 차이
- `docs/ssulap-DB.dbml`: PostgreSQL 기준 12개 테이블
- `docs/ssulap-API.yml`: OpenAPI 3.0.3, 43개 동작의 계약
- `docs/ssulap-api-catalog.md`: 화면별 API 목록
- `docs/ssulap-data-dictionary.md`: 필드 타입·필수 여부·제약
- `docs/ssulap-validation.json`: 검증 결과와 미검증 범위

기존 Sites 삭제는 도구에 삭제 기능이 없고 관리 앱 접근이 제한되어 완료하지 못했습니다. `.openai/hosting.json`은 현재 원격 프로젝트 식별 정보로 남겨두었습니다. 이후 재배포하지 않습니다.
