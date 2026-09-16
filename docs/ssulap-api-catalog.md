# 써랍 화면별 API 목록

기본 경로: `http://localhost:8080/api/v1`

| 화면/영역 | 메서드 | 경로 | 기능 | 요청 스키마 | 성공 |
|---|---|---|---|---|---|
| 로그인 | POST | `/auth/login` | 등록 계정으로 로그인 | LoginRequest | 200 |
| 로그인 | POST | `/auth/logout` | 현재 사용자 로그아웃 | — | 204 |
| 사용자 | GET | `/me` | 현재 로그인 사용자 조회 | — | 200 |
| 사용자 | GET | `/reviewers` | 선택 가능한 검토자 목록 | — | 200 |
| 기본 이력 | GET | `/me/resume` | 기본 이력 전체 조회 | — | 200 |
| 기본 이력 | GET | `/me/profile` | 병역·보훈·장애사항 조회 | — | 200 |
| 기본 이력 | PUT | `/me/profile` | 병역·보훈·장애사항 전체 저장 | ProfileWrite | 200 |
| 학력 | GET | `/educations` | 학력 목록 조회 | — | 200 |
| 학력 | POST | `/educations` | 학력 등록 | EducationWrite | 201 |
| 학력 | GET | `/educations/{id}` | 학력 상세 조회 | — | 200 |
| 학력 | PUT | `/educations/{id}` | 학력 수정 | EducationWrite | 200 |
| 학력 | DELETE | `/educations/{id}` | 학력 삭제 | — | 204 |
| 수강 과목 | GET | `/educations/{educationId}/courses` | 학력별 수강 과목 목록 | — | 200 |
| 수강 과목 | POST | `/educations/{educationId}/courses` | 수강 과목 등록 | CourseWrite | 201 |
| 수강 과목 | GET | `/courses/{courseId}` | 수강 과목 상세 조회 | — | 200 |
| 수강 과목 | PUT | `/courses/{courseId}` | 수강 과목 수정 | CourseWrite | 200 |
| 수강 과목 | DELETE | `/courses/{courseId}` | 수강 과목 삭제 | — | 204 |
| 자격증 | GET | `/certifications` | 자격증 목록 조회 | — | 200 |
| 자격증 | POST | `/certifications` | 자격증 등록 | CertificationWrite | 201 |
| 자격증 | GET | `/certifications/{id}` | 자격증 상세 조회 | — | 200 |
| 자격증 | PUT | `/certifications/{id}` | 자격증 수정 | CertificationWrite | 200 |
| 자격증 | DELETE | `/certifications/{id}` | 자격증 삭제 | — | 204 |
| 어학 | GET | `/language-scores` | 어학 목록 조회 | — | 200 |
| 어학 | POST | `/language-scores` | 어학 등록 | LanguageScoreWrite | 201 |
| 어학 | GET | `/language-scores/{id}` | 어학 상세 조회 | — | 200 |
| 어학 | PUT | `/language-scores/{id}` | 어학 수정 | LanguageScoreWrite | 200 |
| 어학 | DELETE | `/language-scores/{id}` | 어학 삭제 | — | 204 |
| 경력 | GET | `/careers` | 경력 목록 조회 | — | 200 |
| 경력 | POST | `/careers` | 경력 등록 | CareerWrite | 201 |
| 경력 | GET | `/careers/{id}` | 경력 상세 조회 | — | 200 |
| 경력 | PUT | `/careers/{id}` | 경력 수정 | CareerWrite | 200 |
| 경력 | DELETE | `/careers/{id}` | 경력 삭제 | — | 204 |
| 경험 | GET | `/experiences` | 경험 목록 조회 | — | 200 |
| 경험 | POST | `/experiences` | 경험 등록 | ExperienceWrite | 201 |
| 경험 | GET | `/experiences/{id}` | 경험 상세 조회 | — | 200 |
| 경험 | PUT | `/experiences/{id}` | 경험 수정 | ExperienceWrite | 200 |
| 경험 | DELETE | `/experiences/{id}` | 경험 삭제 | — | 204 |
| 자소서 | GET | `/applications` | 자소서 목록 조회 | — | 200 |
| 자소서 | POST | `/applications` | 자소서 등록 | ApplicationWrite | 201 |
| 자소서 | GET | `/applications/{id}` | 자소서 상세 조회 | — | 200 |
| 자소서 | PUT | `/applications/{id}` | 자소서 수정 | ApplicationWrite | 200 |
| 자소서 | PATCH | `/applications/{id}/status` | 자소서 상태 전환 | ApplicationStatusUpdate | 200 |
| 자소서 | DELETE | `/applications/{id}` | 자소서 삭제 | — | 204 |
| 경험 | GET | `/tags` | 경험 태그 목록 조회 | — | 200 |
| 문항 | GET | `/applications/{applicationId}/questions` | 자소서 문항 목록 | — | 200 |
| 문항 | POST | `/applications/{applicationId}/questions` | 문항 추가 | QuestionWrite | 201 |
| 문항 | GET | `/questions/{questionId}` | 문항 상세 조회 | — | 200 |
| 문항 | PUT | `/questions/{questionId}` | 문항·답변 저장 | QuestionWrite | 200 |
| 문항 | PATCH | `/questions/{questionId}/completion` | 문항 작성 상태 전환 | QuestionCompletionUpdate | 200 |
| 문항 | DELETE | `/questions/{questionId}` | 문항 삭제 | — | 204 |
| 문항 | PUT | `/questions/{questionId}/experiences/{experienceId}` | 참고 경험 연결 | — | 204 |
| 문항 | DELETE | `/questions/{questionId}/experiences/{experienceId}` | 참고 경험 연결 해제 | — | 204 |
| 버전 | GET | `/questions/{questionId}/versions` | 문항 버전 목록 | — | 200 |
| 버전 | POST | `/questions/{questionId}/versions` | 현재 문항 버전 저장 | — | 201 |
| 버전 | GET | `/questions/{questionId}/versions/{versionId}` | 문항 버전 상세 | — | 200 |
| 버전 | DELETE | `/questions/{questionId}/versions/{versionId}` | 직접 저장 버전 삭제 | — | 204 |
| 버전 | POST | `/questions/{questionId}/versions/{versionId}/restore` | 과거 버전 복원 | — | 200 |
| 검토 | GET | `/review-requests?role=received\|sent` | 받은·보낸 검토 요청 목록 | — | 200 |
| 검토 | POST | `/applications/{id}/review-requests` | 작성 완료 자소서 검토 요청 | ReviewRequestCreate | 201 |
| 검토 | GET | `/review-requests/{reviewRequestId}` | 읽기 전용 자소서·메모 상세 | — | 200 |
| 검토 | PUT | `/review-requests/{reviewRequestId}/comments/{questionId}` | 문항별 검토 메모 저장 | ReviewCommentWrite | 200 |
| 검토 | DELETE | `/review-requests/{reviewRequestId}/comments/{questionId}` | 문항별 검토 메모 삭제 | — | 204 |
| 검토 | POST | `/review-requests/{reviewRequestId}/complete` | 검토 완료 | — | 200 |
| 검토 | GET | `/applications/{id}/review-feedback` | 작성 화면용 완료 메모 조회 | — | 200 |
| 추천 | POST | `/experience-recommendations` | 문항 기반 경험 추천 | RecommendationRequest | 200 |

## 화면 동작과 저장 단위

- 로그인: POST /auth/login으로 등록 계정을 선택하고 GET /me로 현재 사용자를 조회한다. 소유자 ID는 세션에서 결정하므로 일반 쓰기 요청 본문에 포함하지 않는다.
- 기본 이력: GET /me/resume → 구역별 POST/PUT/DELETE. 각 구역은 저장 API 성공 후 읽기 전용으로 전환하고 `수정`을 누르면 다시 입력 상태로 바꾼다. 하나의 화면 전체를 묶는 저장 트랜잭션은 제공하지 않음.
- 수강 과목: GET/POST /educations/{educationId}/courses와 /courses/{courseId} CRUD를 사용한다. Excel 다운로드는 조회 결과를 브라우저에서 CSV로 변환하므로 별도 다운로드 API를 호출하지 않는다.
- 경력: /careers CRUD. 부서와 직무는 department, jobTitle로 구분한다.
- 경험: /experiences CRUD, GET /tags. 태그 저장은 경험 저장과 원자적으로 처리.
- 보관함: GET /applications?q=&status=, 새 자소서는 POST /applications.
- 작성: GET /applications/{id} → 마지막 입력 후 2초 동안 추가 변경이 없으면 PUT /questions/{questionId}를 호출해 현재 초안을 덮어쓴다. 연속 입력 중에는 타이머를 다시 시작하고 화면 이동 시 즉시 저장한다. 자동 저장은 버전을 생성하지 않는다. 지원 정보는 PUT /applications/{id}, 상태는 PATCH /applications/{id}/status로 분리한다.
- 완료: 문항은 PATCH /questions/{questionId}/completion으로 사용자가 명시적으로 완료한다. 답변이 존재하고 제한 이하여야 COMPLETED가 가능하며, 문항·답변·제한을 수정하면 DRAFT로 돌아간다. 자소서는 모든 문항이 완료된 경우에만 DRAFT → COMPLETED가 가능하다.
- 버전: 사용자가 `버전 저장`을 누르면 POST /questions/{questionId}/versions로 현재 문항 스냅샷을 생성한다. 목록·상세는 오른쪽 비차단 상세 패널에서 확인한다. 복원은 현재 초안을 바로 덮어쓰며 별도 백업을 만들지 않는다. 사용자가 직접 저장한 MANUAL 버전은 목록에서 삭제할 수 있고 완료본·제출본은 삭제하지 않는다.
- 보관: DRAFT는 제출 버전 1개와 최근 작업 버전 20개, COMPLETED는 제출 버전 1개·완료 버전·최근 작업 버전 5개를 보관한다. SUBMITTED 전환 시 최종 제출 버전 1개만 남기며 상태 변경과 버전 정리는 한 트랜잭션으로 처리한다.
- 참고 경험: PUT/DELETE /questions/{questionId}/experiences/{experienceId}. 글자 수/초과 표시는 응답 계산 필드 사용.
- 검토 요청: 작성자는 COMPLETED 자소서에서 GET /reviewers로 검토자를 선택하고 POST /applications/{id}/review-requests를 호출한다. 본인 선택과 같은 검토자에 대한 진행 중 중복 요청은 허용하지 않는다.
- 받은 요청: GET /review-requests?role=received. 검토자는 GET /review-requests/{id}로 읽기 전용 자소서를 열고 문항별 PUT/DELETE comment API로 메모를 관리한다. 자소서 질문·답변 수정 권한은 없다.
- 검토 완료: POST /review-requests/{id}/complete. 메모가 하나 이상 있어야 하며 완료 후 메모는 잠긴다. 작성 완료 자소서는 진행 중인 검토가 끝나기 전까지 상태를 바꾸지 않는다.
- 작성 중 메모 참고: GET /applications/{id}/review-feedback?questionId=. COMPLETED 요청의 메모만 현재 문항의 자료 서랍에 표시하며 진행 중 메모는 노출하지 않는다.
- 추천: POST /experience-recommendations는 문항과 본인 경험의 내용·태그를 비교해 관련 경험을 반환한다. mode 값으로 TAG_MATCH와 AI 추천 방식을 구분한다.
- 경험·경력 자료 서랍, 내용 복사, 팝업 열기, 문항 간 이동, 미저장 이동 경고는 클라이언트 동작이다. 수강 과목 엑셀 다운로드도 이미 조회한 데이터를 브라우저에서 파일로 만드는 클라이언트 동작으로 설계하여 별도 API를 두지 않는다. 검토 메모 탭은 review-feedback API를 사용한다. 문항 삭제와 순서 저장은 기존 문항 API를 사용한다.

## 요청·응답 예시

전체 필드 타입·필수 여부·enum·요청 예시·오류 응답은 `ssulap-API.yml`의 components/schemas와 각 operation 참조. PUT은 모든 쓰기 속성을 요구하며 null 허용 필드도 키를 포함한다.
