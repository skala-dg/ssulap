# 써랍 필드 사전

DBML은 저장 구조, 아래 스키마는 API 필드를 설명합니다. 타입·nullable·최대 길이는 OpenAPI와 같은 자료에서 생성했습니다.

선택 필드도 PUT에서 키는 필수이며 미입력 값은 null입니다. 소유자 user_id는 요청에 없고 로그인 세션의 현재 사용자로 서버가 결정합니다. 검토자 ID처럼 기능상 선택이 필요한 관계만 요청에 포함합니다. createdAt/updatedAt은 서버 생성 값입니다.

## LoginRequest

| 필드 | 타입 | null | 제약·허용값 |
|---|---|---|---|
| userId | integer int64 | 불가 | 로그인할 등록 사용자 ID |

## ProfileWrite

| 필드 | 타입 | null | 제약·허용값 |
|---|---|---|---|
| militaryStatus | string  | 불가 | enum: ['UNSPECIFIED', 'NOT_APPLICABLE', 'NOT_SERVED', 'SERVING', 'COMPLETED', 'EXEMPT'] |
| militaryBranch | string  | 허용 | maxLength: 50 |
| militaryRank | string  | 허용 | maxLength: 50 |
| militaryStartMonth | string  | 허용 | maxLength: 7; pattern: ^\d{4}-(0[1-9]|1[0-2])$ |
| militaryEndMonth | string  | 허용 | maxLength: 7; pattern: ^\d{4}-(0[1-9]|1[0-2])$ |
| veteranStatus | string  | 불가 | enum: ['UNSPECIFIED', 'YES', 'NO'] |
| disabilityStatus | string  | 불가 | enum: ['UNSPECIFIED', 'YES', 'NO'] |
| additionalInfo | string  | 허용 | maxLength: 1000 |

## EducationWrite

| 필드 | 타입 | null | 제약·허용값 |
|---|---|---|---|
| schoolName | string  | 불가 | minLength: 1; maxLength: 100 |
| major | string  | 허용 | maxLength: 100 |
| educationStatus | string  | 불가 | enum: ['ENROLLED', 'ON_LEAVE', 'EXPECTED_GRADUATION', 'GRADUATED'] |
| startMonth | string  | 허용 | maxLength: 7; pattern: ^\d{4}-(0[1-9]|1[0-2])$ |
| endMonth | string  | 허용 | maxLength: 7; pattern: ^\d{4}-(0[1-9]|1[0-2])$ |
| gpa | number  | 허용 | minimum: 0; maximum: 100 |
| gpaScale | number  | 허용 | enum: [4.0, 4.3, 4.5, 5.0, 100.0, None] |

## CourseWrite

| 필드 | 타입 | null | 제약·허용값 |
|---|---|---|---|
| majorName | string | 허용 | maxLength: 100 |
| studyYear | integer | 허용 | 1900~2100 |
| semester | string | 허용 | enum: ['FIRST_SEMESTER', 'SECOND_SEMESTER', 'SUMMER', 'WINTER'] |
| subjectName | string | 불가 | minLength: 1; maxLength: 150 |
| subjectType | string | 불가 | enum: ['MAJOR', 'GENERAL', 'OTHER'] |
| credits | number | 허용 | 0~30; 0.5 단위 |
| grade | string | 허용 | maxLength: 10 |
| retaken | boolean | 불가 | 재수강 여부 |
| position | integer | 불가 | 1~1000; 같은 학력 내 중복 불가 |

`Course` 응답에는 `id`, `educationId`, `createdAt`, `updatedAt`이 추가됩니다. 수강 과목은 학력별로 position 오름차순, id 오름차순으로 조회합니다.

## CertificationWrite

| 필드 | 타입 | null | 제약·허용값 |
|---|---|---|---|
| name | string  | 불가 | minLength: 1; maxLength: 100 |
| issuer | string  | 허용 | maxLength: 100 |
| acquiredOn | string date | 허용 |  |
| certificateNumber | string  | 허용 | maxLength: 100 |

## LanguageScoreWrite

| 필드 | 타입 | null | 제약·허용값 |
|---|---|---|---|
| testName | string  | 불가 | minLength: 1; maxLength: 100 |
| scoreOrGrade | string  | 불가 | minLength: 1; maxLength: 50 |
| testedOn | string date | 허용 |  |
| expiresOn | string date | 허용 |  |

## CareerWrite

| 필드 | 타입 | null | 제약·허용값 |
|---|---|---|---|
| companyName | string  | 불가 | minLength: 1; maxLength: 100 |
| employmentType | string  | 불가 | enum: ['INTERN', 'FULL_TIME', 'CONTRACT', 'PART_TIME', 'OTHER'] |
| department | string  | 허용 | maxLength: 100 |
| jobTitle | string  | 허용 | maxLength: 100 |
| startMonth | string  | 허용 | maxLength: 7; pattern: ^\d{4}-(0[1-9]|1[0-2])$ |
| endMonth | string  | 허용 | maxLength: 7; pattern: ^\d{4}-(0[1-9]|1[0-2])$ |
| isCurrent | boolean  | 불가 |  |
| duties | string  | 허용 | maxLength: 5000 |

## ExperienceWrite

| 필드 | 타입 | null | 제약·허용값 |
|---|---|---|---|
| title | string  | 불가 | minLength: 1; maxLength: 150 |
| activityType | string  | 불가 | minLength: 1; maxLength: 50 |
| startMonth | string  | 허용 | maxLength: 7; pattern: ^\d{4}-(0[1-9]|1[0-2])$ |
| endMonth | string  | 허용 | maxLength: 7; pattern: ^\d{4}-(0[1-9]|1[0-2])$ |
| careerId | integer int64 | 허용 | minimum: 1; maximum: 9007199254740991 |
| situation | string  | 허용 | maxLength: 5000 |
| action | string  | 허용 | maxLength: 5000 |
| result | string  | 허용 | maxLength: 5000 |
| lesson | string  | 허용 | maxLength: 5000 |
| collaborationMemo | string  | 허용 | maxLength: 5000 |
| overview | string  | 허용 | maxLength: 5000; 경험의 전체 맥락·사용 기술·진행 방식 |
| tags | array  | 불가 | maxItems: 10 |

## ApplicationWrite

| 필드 | 타입 | null | 제약·허용값 |
|---|---|---|---|
| companyName | string  | 불가 | minLength: 1; maxLength: 100 |
| jobTitle | string  | 불가 | minLength: 1; maxLength: 100 |
| applicationPeriod | string  | 불가 | minLength: 1; maxLength: 100 |

상태는 생성·수정 요청에 포함하지 않고 `ApplicationStatusUpdate` 전용 API로 변경합니다. 신규 자소서는 DRAFT로 생성됩니다.

## ApplicationStatusUpdate

| 필드 | 타입 | null | 제약·허용값 |
|---|---|---|---|
| status | string | 불가 | enum: ['DRAFT', 'COMPLETED', 'SUBMITTED']; 인접 상태로만 전환 |

## QuestionWrite

| 필드 | 타입 | null | 제약·허용값 |
|---|---|---|---|
| prompt | string  | 불가 | maxLength: 2000 |
| answer | string  | 불가 | maxLength: 30000 |
| characterLimit | integer  | 불가 | minimum: 1; maximum: 20000 |
| position | integer  | 불가 | minimum: 1; maximum: 1000 |

## QuestionCompletionUpdate

| 필드 | 타입 | null | 제약·허용값 |
|---|---|---|---|
| completionStatus | string | 불가 | enum: ['DRAFT', 'COMPLETED']; COMPLETED는 문항·답변 필수, 글자 수 제한 이내 |

## QuestionVersion

| 필드 | 타입 | null | 제약·허용값 |
|---|---|---|---|
| id | integer | 불가 | 서버 생성 |
| questionId | integer | 불가 | 본인 소유 문항 |
| versionNumber | integer | 불가 | 문항별 1부터 증가 |
| versionKind | string | 불가 | enum: ['MANUAL', 'COMPLETED', 'SUBMITTED'] |
| prompt | string | 불가 | maxLength: 2000 |
| answer | string | 불가 | maxLength: 30000 |
| characterLimit | integer | 불가 | minimum: 1; maximum: 20000 |
| experienceIds | array | 불가 | 저장 당시 참고 경험 ID 스냅샷 |
| characterCount | integer | 불가 | 응답 계산값 |
| createdAt | date-time | 불가 | 서버 생성 |

## ReviewRequestCreate

| 필드 | 타입 | null | 제약·허용값 |
|---|---|---|---|
| reviewerId | integer int64 | 불가 | 현재 사용자와 달라야 하며 존재하는 등록 사용자 |

## ReviewRequest

| 필드 | 타입 | null | 제약·허용값 |
|---|---|---|---|
| id | integer int64 | 불가 | 서버 생성 |
| applicationId | integer int64 | 불가 | 요청자 소유의 COMPLETED 자소서 |
| requesterId | integer int64 | 불가 | 자소서 소유자 |
| requesterName | string | 불가 | 조회 시 조합, maxLength: 50 |
| reviewerId | integer int64 | 불가 | 지정된 검토자 |
| reviewerName | string | 불가 | 조회 시 조합, maxLength: 50 |
| status | string | 불가 | enum: ['REQUESTED', 'COMPLETED'] |
| requestedAt | date-time | 불가 | 서버 생성 |
| completedAt | date-time | 허용 | COMPLETED일 때 서버 생성 |

## ReviewCommentWrite

| 필드 | 타입 | null | 제약·허용값 |
|---|---|---|---|
| content | string | 불가 | minLength: 1; maxLength: 5000; 양끝 공백 제거 후 빈 값 금지 |

## ReviewComment

| 필드 | 타입 | null | 제약·허용값 |
|---|---|---|---|
| id | integer int64 | 불가 | 서버 생성 |
| reviewRequestId | integer int64 | 불가 | REQUESTED 상태이며 현재 사용자가 지정 검토자여야 함 |
| questionId | integer int64 | 불가 | 검토 요청 자소서에 포함된 문항 |
| authorId | integer int64 | 불가 | 지정 검토자, 서버 결정 |
| authorName | string | 불가 | 조회 시 조합, maxLength: 50 |
| content | string | 불가 | maxLength: 5000 |
| createdAt | date-time | 불가 | 서버 생성 |
| updatedAt | date-time | 불가 | 서버 관리 |

## ReviewFeedback

| 필드 | 타입 | null | 제약·허용값 |
|---|---|---|---|
| reviewRequestId | integer int64 | 불가 | COMPLETED 검토 요청 |
| questionId | integer int64 | 불가 | 메모 대상 문항 |
| reviewerId | integer int64 | 불가 | 검토자 |
| reviewerName | string | 불가 | maxLength: 50 |
| content | string | 불가 | maxLength: 5000 |
| completedAt | date-time | 불가 | 검토 완료 시각 |

## 응답 전용 필드

- 일반 엔터티: id, createdAt, updatedAt. userId는 응답에도 노출하지 않음.
- Profile: updatedAt.
- Experience: tags는 `{id, name}` 배열. DB experience_tags를 조인해 생성.
- ApplicationDetail: questions 배열을 조합.
- Question: applicationId, completionStatus, completedAt, experienceIds, characterCount, overLimit. characterCount와 overLimit는 저장하지 않는 계산값.
- QuestionVersionSummary: id, questionId, versionNumber, versionKind, characterCount, createdAt. 목록 응답에는 답변 본문을 포함하지 않음.
- ReviewDetail: reviewRequest, 읽기 전용 ApplicationDetail, ReviewComment 배열을 조합. 요청자와 지정 검토자만 조회.
- ReviewFeedback: 자소서 소유자에게 COMPLETED 검토 메모만 문항별로 제공. 진행 중 메모는 제외.
- Resume: profile 및 educations/certifications/languageScores 배열을 조합.
- Error: code, message, fieldErrors, timestamp. 오류 timestamp는 DB 필드가 아님.
