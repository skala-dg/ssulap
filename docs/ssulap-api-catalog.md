# 써랍 화면별 API 목록

> 설계 v1.0 · 모든 서버 API는 현재 미구현. 기본 기능은 구현 예정이며 추천은 확장 계약입니다.

기본 경로: `http://localhost:8080/api/v1`

| 화면/영역 | 메서드 | 경로 | 기능 | 요청 스키마 | 성공 | 상태 |
|---|---|---|---|---|---|---|
| 사용자 | GET | `/me` | 현재 개발용 사용자 조회 | — | 200 | 구현 예정 |
| 기본 이력 | GET | `/me/resume` | 기본 이력 전체 조회·복사용 | — | 200 | 구현 예정 |
| 기본 이력 | GET | `/me/profile` | 병역·보훈·장애사항 조회 | — | 200 | 구현 예정 |
| 기본 이력 | PUT | `/me/profile` | 병역·보훈·장애사항 전체 저장 | ProfileWrite | 200 | 구현 예정 |
| 학력 | GET | `/educations` | 학력 목록 조회 | — | 200 | 구현 예정 |
| 학력 | POST | `/educations` | 학력 등록 | EducationWrite | 201 | 구현 예정 |
| 학력 | GET | `/educations/{id}` | 학력 상세 조회 | — | 200 | 구현 예정 |
| 학력 | PUT | `/educations/{id}` | 학력 수정 | EducationWrite | 200 | 구현 예정 |
| 학력 | DELETE | `/educations/{id}` | 학력 삭제 | — | 204 | 구현 예정 |
| 자격증 | GET | `/certifications` | 자격증 목록 조회 | — | 200 | 구현 예정 |
| 자격증 | POST | `/certifications` | 자격증 등록 | CertificationWrite | 201 | 구현 예정 |
| 자격증 | GET | `/certifications/{id}` | 자격증 상세 조회 | — | 200 | 구현 예정 |
| 자격증 | PUT | `/certifications/{id}` | 자격증 수정 | CertificationWrite | 200 | 구현 예정 |
| 자격증 | DELETE | `/certifications/{id}` | 자격증 삭제 | — | 204 | 구현 예정 |
| 어학 | GET | `/language-scores` | 어학 목록 조회 | — | 200 | 구현 예정 |
| 어학 | POST | `/language-scores` | 어학 등록 | LanguageScoreWrite | 201 | 구현 예정 |
| 어학 | GET | `/language-scores/{id}` | 어학 상세 조회 | — | 200 | 구현 예정 |
| 어학 | PUT | `/language-scores/{id}` | 어학 수정 | LanguageScoreWrite | 200 | 구현 예정 |
| 어학 | DELETE | `/language-scores/{id}` | 어학 삭제 | — | 204 | 구현 예정 |
| 경력 | GET | `/careers` | 경력 목록 조회 | — | 200 | 구현 예정 |
| 경력 | POST | `/careers` | 경력 등록 | CareerWrite | 201 | 구현 예정 |
| 경력 | GET | `/careers/{id}` | 경력 상세 조회 | — | 200 | 구현 예정 |
| 경력 | PUT | `/careers/{id}` | 경력 수정 | CareerWrite | 200 | 구현 예정 |
| 경력 | DELETE | `/careers/{id}` | 경력 삭제 | — | 204 | 구현 예정 |
| 경험 | GET | `/experiences` | 경험 목록 조회 | — | 200 | 구현 예정 |
| 경험 | POST | `/experiences` | 경험 등록 | ExperienceWrite | 201 | 구현 예정 |
| 경험 | GET | `/experiences/{id}` | 경험 상세 조회 | — | 200 | 구현 예정 |
| 경험 | PUT | `/experiences/{id}` | 경험 수정 | ExperienceWrite | 200 | 구현 예정 |
| 경험 | DELETE | `/experiences/{id}` | 경험 삭제 | — | 204 | 구현 예정 |
| 자소서 | GET | `/applications` | 자소서 목록 조회 | — | 200 | 구현 예정 |
| 자소서 | POST | `/applications` | 자소서 등록 | ApplicationWrite | 201 | 구현 예정 |
| 자소서 | GET | `/applications/{id}` | 자소서 상세 조회 | — | 200 | 구현 예정 |
| 자소서 | PUT | `/applications/{id}` | 자소서 수정 | ApplicationWrite | 200 | 구현 예정 |
| 자소서 | DELETE | `/applications/{id}` | 자소서 삭제 | — | 204 | 구현 예정 |
| 경험 | GET | `/tags` | 경험 태그 목록 조회 | — | 200 | 구현 예정 |
| 문항 | GET | `/applications/{applicationId}/questions` | 자소서 문항 목록 | — | 200 | 구현 예정 |
| 문항 | POST | `/applications/{applicationId}/questions` | 문항 추가 | QuestionWrite | 201 | 구현 예정 |
| 문항 | GET | `/questions/{questionId}` | 문항 상세 조회 | — | 200 | 구현 예정 |
| 문항 | PUT | `/questions/{questionId}` | 문항·답변 저장 | QuestionWrite | 200 | 구현 예정 |
| 문항 | DELETE | `/questions/{questionId}` | 문항 삭제 | — | 204 | 구현 예정 |
| 문항 | PUT | `/questions/{questionId}/experiences/{experienceId}` | 참고 경험 연결 | — | 204 | 구현 예정 |
| 문항 | DELETE | `/questions/{questionId}/experiences/{experienceId}` | 참고 경험 연결 해제 | — | 204 | 구현 예정 |
| 추천 | POST | `/experience-recommendations` | 문항 기반 경험 추천 계약 | RecommendationRequest | 200 | 확장/미구현 |

## 화면 동작과 저장 단위

- 기본 이력: GET /me/resume → 구역별 POST/PUT/DELETE. 전체 저장 버튼은 구역별 저장으로 변경 예정. 하나의 화면 전체를 묶는 저장 트랜잭션은 제공하지 않음.
- 경력: /careers CRUD. 현재 부서·직무 단일 입력을 department/jobTitle 두 필드로 분리 예정.
- 경험: /experiences CRUD, GET /tags. 태그 저장은 경험 저장과 원자적으로 처리.
- 보관함: GET /applications?q=&status=, 새 자소서는 POST /applications.
- 작성: GET /applications/{id} → PUT /questions/{questionId}로 답변 저장. 지원 정보/상태는 PUT /applications/{id}로 별도 저장. 일부 저장 실패는 해당 구역에 표시하고 전체 성공으로 표시하지 않음.
- 참고 경험: PUT/DELETE /questions/{questionId}/experiences/{experienceId}. 글자 수/초과 표시는 응답 계산 필드 사용.
- 추천: POST /experience-recommendations는 설계 계약만 제공. 501이면 추천 미지원 안내 후 직접 경험 찾기 유지. 현재 Vue 태그 시연은 서버 구현과 별개.
- 복사, 팝업 열기, 미저장 이동 경고는 클라이언트 동작으로 별도 API 없음.

## 요청·응답 예시

전체 필드 타입·필수 여부·enum·요청 예시·오류 응답은 `ssulap-API.yml`의 components/schemas와 각 operation 참조. PUT은 모든 쓰기 속성을 요구하며 null 허용 필드도 키를 포함한다.
