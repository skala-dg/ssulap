# 써랍 필드 사전

DBML은 저장 구조, 아래 스키마는 API 필드를 설명합니다. 타입·nullable·최대 길이는 OpenAPI와 같은 자료에서 생성했습니다.

선택 필드도 PUT에서 키는 필수이며 미입력 값은 null입니다. user_id는 요청에 없고 서버가 결정합니다. createdAt/updatedAt은 서버 생성 값입니다.

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

## 응답 전용 필드

- 일반 엔터티: id, createdAt, updatedAt. userId는 응답에도 노출하지 않음.
- Profile: updatedAt.
- Experience: tags는 `{id, name}` 배열. DB experience_tags를 조인해 생성.
- ApplicationDetail: questions 배열을 조합.
- Question: applicationId, completionStatus, completedAt, experienceIds, characterCount, overLimit. characterCount와 overLimit는 저장하지 않는 계산값.
- QuestionVersionSummary: id, questionId, versionNumber, versionKind, characterCount, createdAt. 목록 응답에는 답변 본문을 포함하지 않음.
- Resume: profile 및 educations/certifications/languageScores 배열을 조합.
- Error: code, message, fieldErrors, timestamp. 오류 timestamp는 DB 필드가 아님.
