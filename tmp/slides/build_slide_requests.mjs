const slideNo = Number(process.argv[2])
const requests = []

const C = {
  bg: '#F5F7F8', navy: '#264E63', teal: '#2F8F83', pale: '#E7EFF3',
  amber: '#D9A441', amberPale: '#FFF4DA', text: '#24323B', sub: '#667780',
  white: '#FFFFFF', line: '#D8E1E5', greenPale: '#E4F2EF', redPale: '#FCEAE7',
}

function rgb(hex) {
  const n = Number.parseInt(hex.slice(1), 16)
  return { red: ((n >> 16) & 255) / 255, green: ((n >> 8) & 255) / 255, blue: (n & 255) / 255 }
}

const oid = (id) => `el_${id}`

function box(slide, id, x, y, w, h, fill = C.white, outline = null, shapeType = 'ROUND_RECTANGLE') {
  const objectId = oid(id)
  requests.push({ createShape: { objectId, shapeType, elementProperties: { pageObjectId: slide, size: { width: { magnitude: w, unit: 'PT' }, height: { magnitude: h, unit: 'PT' } }, transform: { scaleX: 1, scaleY: 1, translateX: x, translateY: y, unit: 'PT' } } } })
  const props = { shapeBackgroundFill: { solidFill: { color: { rgbColor: rgb(fill) }, alpha: 1 } }, outline: outline ? { outlineFill: { solidFill: { color: { rgbColor: rgb(outline) }, alpha: 1 } }, weight: { magnitude: 1, unit: 'PT' } } : { propertyState: 'NOT_RENDERED' } }
  requests.push({ updateShapeProperties: { objectId, shapeProperties: props, fields: outline ? 'shapeBackgroundFill.solidFill.color,outline.outlineFill.solidFill.color,outline.weight' : 'shapeBackgroundFill.solidFill.color,outline.propertyState' } })
}

function textBox(slide, id, x, y, w, h, text, size = 14, color = C.text, bold = false, align = 'START', valign = 'TOP', fill = null) {
  const objectId = oid(id)
  requests.push({ createShape: { objectId, shapeType: 'TEXT_BOX', elementProperties: { pageObjectId: slide, size: { width: { magnitude: w, unit: 'PT' }, height: { magnitude: h, unit: 'PT' } }, transform: { scaleX: 1, scaleY: 1, translateX: x, translateY: y, unit: 'PT' } } } })
  if (fill) {
    requests.push({ updateShapeProperties: { objectId, shapeProperties: { shapeBackgroundFill: { solidFill: { color: { rgbColor: rgb(fill) }, alpha: 1 } }, outline: { propertyState: 'NOT_RENDERED' }, contentAlignment: valign }, fields: 'shapeBackgroundFill.solidFill.color,outline.propertyState,contentAlignment' } })
  } else {
    requests.push({ updateShapeProperties: { objectId, shapeProperties: { shapeBackgroundFill: { propertyState: 'NOT_RENDERED' }, outline: { propertyState: 'NOT_RENDERED' }, contentAlignment: valign }, fields: 'shapeBackgroundFill.propertyState,outline.propertyState,contentAlignment' } })
  }
  requests.push({ insertText: { objectId, text } })
  requests.push({ updateTextStyle: { objectId, textRange: { type: 'ALL' }, style: { fontFamily: 'Noto Sans KR', fontSize: { magnitude: size, unit: 'PT' }, foregroundColor: { opaqueColor: { rgbColor: rgb(color) } }, bold }, fields: 'fontFamily,fontSize,foregroundColor,bold' } })
  requests.push({ updateParagraphStyle: { objectId, textRange: { type: 'ALL' }, style: { alignment: align, lineSpacing: 110, spaceAbove: { magnitude: 0, unit: 'PT' }, spaceBelow: { magnitude: 0, unit: 'PT' } }, fields: 'alignment,lineSpacing,spaceAbove,spaceBelow' } })
}

function pill(slide, id, x, y, w, text, fill, color = C.navy) {
  box(slide, id, x, y, w, 24, fill)
  textBox(slide, `${id}t`, x + 4, y + 3, w - 8, 18, text, 10.5, color, true, 'CENTER', 'MIDDLE')
}

function header(slide, num, kicker, title, desc = '') {
  textBox(slide, `${slide}_num`, 36, 22, 36, 16, String(num).padStart(2, '0'), 10, C.teal, true)
  textBox(slide, `${slide}_kick`, 78, 21, 230, 18, kicker, 10, C.sub, true)
  textBox(slide, `${slide}_title`, 36, 48, 650, 36, title, 27, C.navy, true)
  if (desc) textBox(slide, `${slide}_desc`, 36, 87, 650, 22, desc, 12, C.sub)
}

function arrow(slide, id, x, y, w = 24) {
  textBox(slide, id, x, y, w, 26, '→', 20, C.teal, true, 'CENTER', 'MIDDLE')
}

if (slideNo === 1) {
  const s = 'p'
  box(s, 'c1_band', 0, 0, 18, 405, C.teal, null, 'RECTANGLE')
  pill(s, 'c1_tag', 46, 38, 176, 'WEB SERVICE DESIGN', C.pale, C.navy)
  textBox(s, 'c1_title', 46, 93, 620, 62, '써랍', 40, C.navy, true)
  textBox(s, 'c1_sub', 46, 156, 620, 52, '경험을 정리하고, 자소서를 쓰고,\n검토 메모까지 다시 쓰는 취업 준비 작업공간', 21, C.text, true)
  textBox(s, 'c1_line', 46, 232, 590, 28, '기획 · 화면 · 데이터 · API가 같은 사용자 흐름을 설명합니다.', 14, C.sub)
  pill(s, 'c1_p1', 46, 292, 92, '기본 이력', C.white, C.navy)
  pill(s, 'c1_p2', 146, 292, 72, '경험', C.white, C.navy)
  pill(s, 'c1_p3', 226, 292, 86, '자소서', C.white, C.navy)
  pill(s, 'c1_p4', 320, 292, 100, '검토 메모', C.amberPale, '#946713')
  textBox(s, 'c1_foot', 46, 362, 620, 18, 'AI 웹 서비스 설계 Mini-project · 프로젝트 기술서 초안', 11, C.sub)
}

if (slideNo === 2) {
  const s = 'slide02'
  header(s, 2, '01 · SERVICE OVERVIEW', '흩어진 취업 준비 자료를 한 흐름으로 묶습니다.', '기록을 쌓는 일과 자소서를 완성하는 일이 분리되어 생기는 반복을 줄이는 것이 목표입니다.')
  const probs = [
    ['s02a', 36, '자료가 흩어짐', '학력·경력·경험이 파일과 메모에 나뉘어\n지원할 때마다 다시 찾습니다.'],
    ['s02b', 264, '경험을 꺼내기 어려움', '좋은 경험이 있어도 문항에 맞는 근거와\n표현을 바로 연결하기 어렵습니다.'],
    ['s02c', 492, '검토가 남지 않음', '메신저로 받은 피드백은 문항과 떨어져\n다음 수정 때 다시 활용하기 어렵습니다.'],
  ]
  for (const [id, x, title, body] of probs) {
    box(s, id, x, 126, 192, 112, C.white, C.line)
    textBox(s, `${id}n`, x + 16, 143, 160, 24, title, 15, C.navy, true)
    textBox(s, `${id}b`, x + 16, 175, 160, 46, body, 11.5, C.sub)
  }
  box(s, 's02_goal', 36, 260, 648, 92, C.navy)
  textBox(s, 's02_goal_k', 56, 278, 118, 18, '설계 목표', 11, '#BFD6DF', true)
  textBox(s, 's02_goal_t', 56, 303, 600, 34, '기록 → 작성 → 검토 → 수정이 끊기지 않는 개인 취업 준비 도구', 18, C.white, true)
  textBox(s, 's02_goal_f', 36, 371, 648, 16, '답변 자동 생성이 아니라, 사용자가 자신의 자료와 타인의 메모를 근거로 직접 쓰도록 돕습니다.', 10.5, C.sub, false, 'CENTER')
}

if (slideNo === 3) {
  const s = 'slide03'
  header(s, 3, '02 · ACTORS & SCOPE', '두 사용자 역할과 권한을 단순하게 고정했습니다.', '등록 사용자 중 계정을 선택하고, 작성 완료 자소서를 지정한 검토자에게 요청합니다.')
  box(s, 's03_writer', 36, 124, 202, 116, C.white, C.line)
  pill(s, 's03_writer_p', 52, 140, 74, '작성자', C.greenPale, C.teal)
  textBox(s, 's03_writer_t', 52, 174, 168, 48, '이력·경험 관리\n자소서 작성·버전 저장\n검토 요청·메모 확인', 12.5, C.text, true)
  box(s, 's03_reviewer', 254, 124, 202, 116, C.white, C.line)
  pill(s, 's03_reviewer_p', 270, 140, 74, '검토자', C.amberPale, '#946713')
  textBox(s, 's03_reviewer_t', 270, 174, 168, 48, '완료 자소서 읽기\n문항별 메모 작성\n검토 완료 처리', 12.5, C.text, true)
  box(s, 's03_rule', 472, 124, 212, 116, C.pale)
  textBox(s, 's03_rule_h', 488, 142, 180, 20, '권한 원칙', 14, C.navy, true)
  textBox(s, 's03_rule_t', 488, 173, 180, 50, '작성자만 본문 수정\n검토자는 메모만 수정\n완료 메모만 작성자에게 공개', 12, C.text)
  box(s, 's03_scope', 36, 264, 314, 84, C.white, C.line)
  textBox(s, 's03_scope_h', 52, 279, 280, 18, '이번 설계에 포함', 13, C.teal, true)
  textBox(s, 's03_scope_t', 52, 306, 280, 32, '계정 선택 · 개인 자료 관리 · 자소서 상태/버전\n지정 검토자 요청 · 문항별 검토 메모', 11.5, C.text)
  box(s, 's03_out', 370, 264, 314, 84, C.white, C.line)
  textBox(s, 's03_out_h', 386, 279, 280, 18, '의도적으로 제외', 13, C.sub, true)
  textBox(s, 's03_out_t', 386, 306, 280, 32, '친구 관계 · 공개 링크 · 외부 알림\n문장 인라인 댓글 · 답글 · 실시간 공동 편집', 11.5, C.text)
  textBox(s, 's03_note', 36, 367, 648, 18, '범위를 줄여 3일 안에 화면·데이터·API를 끝까지 연결할 수 있게 했습니다.', 11, C.sub, false, 'CENTER')
}

if (slideNo === 4) {
  const s = 'slide04'
  header(s, 4, '03 · USER FLOW', '하나의 순환 흐름으로 화면과 기능을 연결했습니다.', '진한 청록은 작성자, 노란색은 검토자 단계입니다.')
  const steps = [
    ['login', '계정 선택', 'POST /auth/login', C.pale, C.navy],
    ['record', '자료 기록', '/me/resume\n/experiences', C.greenPale, C.teal],
    ['write', '자소서 작성', '/applications\n/questions', C.greenPale, C.teal],
    ['request', '검토 요청', '/review-requests', C.amberPale, '#946713'],
    ['memo', '메모 작성', '/comments/{questionId}', C.amberPale, '#946713'],
    ['revise', '메모 참고·수정', '/review-feedback', C.greenPale, C.teal],
  ]
  steps.forEach((item, i) => {
    const x = 31 + i * 112
    box(s, `s04_${item[0]}`, x, 143, 96, 112, C.white, C.line)
    pill(s, `s04_${item[0]}p`, x + 12, 157, 72, String(i + 1).padStart(2, '0'), item[3], item[4])
    textBox(s, `s04_${item[0]}t`, x + 10, 193, 76, 22, item[1], 13, C.text, true, 'CENTER')
    textBox(s, `s04_${item[0]}a`, x + 8, 222, 80, 24, item[2], 9.5, C.sub, false, 'CENTER')
    if (i < steps.length - 1) arrow(s, `s04_ar${i}`, x + 94, 185, 20)
  })
  box(s, 's04_guard', 52, 286, 616, 62, C.white, C.line)
  textBox(s, 's04_guard_t', 70, 302, 580, 30, '작성 완료 자소서만 요청 → 검토 중 본문 잠금 → 메모 1개 이상일 때 완료 → 완료된 메모만 공유', 12, C.navy, true, 'CENTER', 'MIDDLE')
  textBox(s, 's04_foot', 36, 371, 648, 16, '화면 이동과 상태 전이가 API·DB 규칙으로 이어지므로 백엔드가 예외 조건까지 구현할 수 있습니다.', 10.5, C.sub, false, 'CENTER')
}

if (slideNo === 5) {
  const s = 'slide05'
  header(s, 5, '04 · UI FLOW — RECORD', '기본 이력과 경험을 구역별로 저장합니다.', '카드를 열지 않아도 핵심 내용을 확인하고, 필요한 정보만 자소서로 가져갑니다.')
  box(s, 's05_img1', 36, 123, 310, 174, C.white, C.line, 'RECTANGLE')
  box(s, 's05_img2', 374, 123, 310, 174, C.white, C.line, 'RECTANGLE')
  pill(s, 's05_lab1', 48, 309, 88, '기본 이력', C.pale, C.navy)
  textBox(s, 's05_txt1', 48, 340, 286, 34, '구역별 저장 후 읽기 전용 전환\n병역 ‘해당 없음’이면 세부 입력 비활성화', 11, C.text)
  pill(s, 's05_lab2', 386, 309, 72, '경험', C.greenPale, C.teal)
  textBox(s, 's05_txt2', 386, 340, 286, 34, '검색·태그 필터와 카드 요약\n상황·행동·결과·배운 점을 구조화', 11, C.text)
  textBox(s, 's05_api1', 154, 311, 192, 18, 'GET /me/resume · PUT /me/profile', 9.5, C.sub, false, 'END')
  textBox(s, 's05_api2', 476, 311, 208, 18, 'GET/POST/PUT /experiences', 9.5, C.sub, false, 'END')
}

if (slideNo === 6) {
  const s = 'slide06'
  header(s, 6, '04 · UI FLOW — WRITE', '자소서 보관함에서 문항 단위 작성으로 이어집니다.', '자료 서랍을 곁에 두되, 답변은 사용자가 직접 작성하고 글자 수와 완료 상태를 관리합니다.')
  box(s, 's06_img1', 36, 123, 310, 174, C.white, C.line, 'RECTANGLE')
  box(s, 's06_img2', 374, 123, 310, 174, C.white, C.line, 'RECTANGLE')
  pill(s, 's06_lab1', 48, 309, 104, '자소서 보관함', C.pale, C.navy)
  textBox(s, 's06_txt1', 48, 340, 286, 34, '회사·직무·지원 시기별 관리\n문항 완료 비율과 최근 수정 시각 표시', 11, C.text)
  pill(s, 's06_lab2', 386, 309, 94, '문항 작성', C.greenPale, C.teal)
  textBox(s, 's06_txt2', 386, 340, 286, 34, '2초 자동 저장과 수동 버전 저장\n경험·경력·검토 메모를 옆에서 조회', 11, C.text)
  textBox(s, 's06_api1', 160, 311, 186, 18, 'GET/POST /applications', 9.5, C.sub, false, 'END')
  textBox(s, 's06_api2', 490, 311, 194, 18, 'PUT /questions/{id}', 9.5, C.sub, false, 'END')
}

if (slideNo === 7) {
  const s = 'slide07'
  header(s, 7, '04 · UI FLOW — REVIEW', '본문 수정 권한 없이 문항별 메모만 남깁니다.', '요청함 → 읽기 전용 검토 → 작성 화면의 검토 메모 탭으로 되돌아오는 흐름입니다.')
  const xs = [24, 252, 480]
  const labels = ['받은 요청', '문항별 메모', '작성자에게 공유']
  const descriptions = ['검토 대기 배지와 요청자·지원 정보 확인', '자소서 본문은 읽기 전용, 메모만 저장', '검토 완료 메모를 현재 문항 옆에서 참고']
  for (let i = 0; i < 3; i++) {
    box(s, `s07_img${i}`, xs[i], 126, 216, 122, C.white, C.line, 'RECTANGLE')
    pill(s, `s07_p${i}`, xs[i] + 8, 261, i === 2 ? 116 : 86, labels[i], i === 1 ? C.amberPale : C.pale, i === 1 ? '#946713' : C.navy)
    textBox(s, `s07_d${i}`, xs[i] + 8, 296, 200, 42, descriptions[i], 10.5, C.text)
  }
  arrow(s, 's07_ar1', 232, 173, 20)
  arrow(s, 's07_ar2', 460, 173, 20)
  box(s, 's07_rule', 72, 349, 576, 32, C.navy)
  textBox(s, 's07_rule_t', 84, 356, 552, 18, 'REQUESTED에서만 메모 수정 · 메모 1개 이상이면 COMPLETED · 완료 후 메모 잠금', 10.5, C.white, true, 'CENTER', 'MIDDLE')
}

if (slideNo === 8) {
  const s = 'slide08'
  header(s, 8, '05 · DATA MODEL', '16개 테이블을 다섯 도메인으로 나눴습니다.', '화면에서 독립적으로 관리하거나 관계·보관 정책이 필요한 데이터만 테이블로 분리했습니다.')
  const domains = [
    ['user', '사용자·기본 이력', 'users · profiles\neducations · courses\ncertifications · language_scores', 36, 126, 196, C.pale, C.navy],
    ['record', '경력·경험', 'careers · experiences\ntags · experience_tags', 258, 126, 196, C.greenPale, C.teal],
    ['essay', '자소서', 'applications · essay_questions\nquestion_versions\nquestion_experiences', 480, 126, 204, C.white, C.navy],
    ['review', '검토', 'review_requests\nreview_comments', 147, 272, 196, C.amberPale, '#946713'],
    ['policy', '관계 원칙', '소유자는 user_id로 격리\nN:M은 연결 테이블\n삭제·보관은 트랜잭션', 377, 272, 196, C.white, C.text],
  ]
  for (const d of domains) {
    box(s, `s08_${d[0]}`, d[3], d[4], d[5], 108, d[6], d[6] === C.white ? C.line : null)
    textBox(s, `s08_${d[0]}h`, d[3] + 14, d[4] + 14, d[5] - 28, 20, d[1], 14, d[7], true)
    textBox(s, `s08_${d[0]}t`, d[3] + 14, d[4] + 43, d[5] - 28, 52, d[2], 10.5, C.text)
  }
  arrow(s, 's08_a1', 232, 165, 22)
  arrow(s, 's08_a2', 454, 165, 22)
  textBox(s, 's08_a3', 333, 239, 40, 26, '↘', 19, C.amber, true, 'CENTER')
  textBox(s, 's08_a4', 439, 239, 40, 26, '↙', 19, C.amber, true, 'CENTER')
  textBox(s, 's08_foot', 36, 389, 648, 12, 'PK/FK·타입·enum·null·유일성·삭제 규칙은 DBML과 필드 사전에 상세 정의', 9.5, C.sub, false, 'CENTER')
}

if (slideNo === 9) {
  const s = 'slide09'
  header(s, 9, '06 · API DESIGN', '화면 동작을 36개 경로와 65개 작업으로 구체화했습니다.', 'OpenAPI 3.0.3의 요청·응답 스키마가 DB 필드와 같은 제약을 사용합니다.')
  const stats = [['36', 'paths'], ['65', 'operations'], ['36', 'schemas'], ['16', 'tables']]
  stats.forEach((item, i) => {
    const x = 36 + i * 118
    box(s, `s09_stat${i}`, x, 126, 102, 62, i === 0 ? C.navy : C.white, i === 0 ? null : C.line)
    textBox(s, `s09_stat${i}n`, x + 8, 136, 86, 24, item[0], 22, i === 0 ? C.white : C.navy, true, 'CENTER')
    textBox(s, `s09_stat${i}l`, x + 8, 164, 86, 14, item[1], 9.5, i === 0 ? '#D6E5EB' : C.sub, false, 'CENTER')
  })
  box(s, 's09_common', 522, 126, 162, 62, C.greenPale)
  textBox(s, 's09_common_h', 534, 138, 138, 18, '공통 규칙', 12, C.teal, true)
  textBox(s, 's09_common_t', 534, 160, 138, 18, 'camelCase ↔ snake_case', 9.5, C.text)
  const apiRows = [
    ['로그인·이력', '/auth · /me · /educations', 'users · profiles · courses'],
    ['경험 관리', '/careers · /experiences · /tags', 'careers · experiences · tags'],
    ['자소서 작성', '/applications · /questions · /versions', 'applications · essay_questions'],
    ['검토', '/review-requests · /comments · /feedback', 'review_requests · review_comments'],
  ]
  apiRows.forEach((row, i) => {
    const y = 211 + i * 37
    box(s, `s09_r${i}`, 36, y, 648, 30, i % 2 ? C.white : C.pale, i % 2 ? C.line : null)
    textBox(s, `s09_r${i}a`, 48, y + 6, 106, 18, row[0], 11, C.navy, true)
    textBox(s, `s09_r${i}b`, 164, y + 6, 286, 18, row[1], 10.5, C.text)
    textBox(s, `s09_r${i}c`, 460, y + 6, 210, 18, row[2], 9.5, C.sub)
  })
  textBox(s, 's09_foot', 36, 370, 648, 18, '오류 응답은 code · message · fieldErrors · timestamp로 통일하고 400/401/403/404/409를 구분합니다.', 10.5, C.sub, false, 'CENTER')
}

if (slideNo === 10) {
  const s = 'slide10'
  header(s, 10, '07 · BUSINESS RULES', '상태·저장·권한 규칙을 API와 트랜잭션으로 고정했습니다.', '개발자가 화면만 보고 추측하지 않도록 성공 조건과 실패 조건을 함께 정의합니다.')
  const cols = [
    ['state', '상태 전이', 'DRAFT ↔ COMPLETED ↔ SUBMITTED\n인접 단계만 이동\n모든 문항 완료 + 글자 수 이내', 36, C.pale, C.navy],
    ['save', '저장과 버전', '입력 후 2초 자동 저장\n자동 저장은 현재 초안만 갱신\n수동 저장·완료·제출은 스냅샷', 264, C.greenPale, C.teal],
    ['auth', '권한과 검토', '세션 사용자로 소유자 결정\n지정 검토자만 메모 작성\n완료된 메모만 작성자 조회', 492, C.amberPale, '#946713'],
  ]
  for (const c of cols) {
    box(s, `s10_${c[0]}`, c[3], 132, 192, 146, C.white, C.line)
    pill(s, `s10_${c[0]}p`, c[3] + 16, 149, 104, c[1], c[4], c[5])
    textBox(s, `s10_${c[0]}t`, c[3] + 16, 190, 160, 70, c[2], 11.5, C.text)
  }
  box(s, 's10_edge', 36, 302, 648, 58, C.navy)
  textBox(s, 's10_edge_h', 52, 315, 104, 18, '예외 설계', 12, '#BFD6DF', true)
  textBox(s, 's10_edge_t', 156, 312, 510, 34, '병역 ‘해당 없음’ 세부값 전달 400 · 중복 검토 요청 409 · 진행 중 검토가 있으면 상태 변경 제한', 11, C.white)
  textBox(s, 's10_foot', 36, 378, 648, 14, '삭제와 버전 정리는 관련 테이블을 한 트랜잭션으로 처리해 중간 상태를 남기지 않습니다.', 10, C.sub, false, 'CENTER')
}

if (slideNo === 11) {
  const s = 'slide11'
  header(s, 11, '08 · CONSISTENCY CHECK', '기획·화면·API·DB가 같은 기능을 같은 단위로 설명합니다.', '평가자가 한 행만 따라가도 백엔드 구현 범위와 데이터 소유권을 확인할 수 있습니다.')
  const xs = [36, 132, 290, 462]
  const widths = [96, 158, 172, 222]
  ;['기능', '화면', 'API', 'DB'].forEach((title, i) => {
    box(s, `s11_h${i}`, xs[i], 125, widths[i], 30, C.navy, null, i === 0 ? 'ROUND_RECTANGLE' : 'RECTANGLE')
    textBox(s, `s11_ht${i}`, xs[i] + 4, 132, widths[i] - 8, 16, title, 11, C.white, true, 'CENTER')
  })
  const matrix = [
    ['기본 이력', '구역별 저장·수정', '/me/profile · /educations', 'profiles · educations · courses'],
    ['경험 재사용', '카드·태그·자료 서랍', '/experiences · /tags', 'experiences · tags · experience_tags'],
    ['자소서 작성', '문항·글자 수·버전', '/questions · /versions', 'essay_questions · question_versions'],
    ['친구 검토', '요청함·메모 탭', '/review-requests · /feedback', 'review_requests · review_comments'],
  ]
  matrix.forEach((row, ri) => {
    const y = 155 + ri * 45
    row.forEach((value, ci) => {
      box(s, `s11_${ri}_${ci}`, xs[ci], y, widths[ci], 39, ri % 2 ? C.white : C.pale, C.line, 'RECTANGLE')
      textBox(s, `s11_${ri}_${ci}t`, xs[ci] + 7, y + 8, widths[ci] - 14, 23, value, ci === 0 ? 10.5 : 9.5, ci === 0 ? C.navy : C.text, ci === 0, 'CENTER', 'MIDDLE')
    })
  })
  box(s, 's11_concl', 36, 351, 648, 30, C.greenPale)
  textBox(s, 's11_concl_t', 48, 358, 624, 17, '화면의 저장 단위 = API의 요청 단위 = DB의 관계·제약 단위', 11.5, C.teal, true, 'CENTER', 'MIDDLE')
}

if (slideNo === 12) {
  const s = 'slide12'
  header(s, 12, '09 · DELIVERY PLAN', '3일 안에 백엔드 구현을 시작할 수 있는 수준으로 정리합니다.', '산출물은 서로를 보완하되 같은 규칙을 중복해서 다르게 설명하지 않습니다.')
  const days = [
    ['DAY 1', '서비스·화면', '사용자 흐름 확정\n화면별 입력·버튼·예외 정리\n프론트 흐름 검증', 36, C.pale, C.navy],
    ['DAY 2', '데이터·API', 'ERD·제약·삭제 규칙 확정\nOpenAPI 요청/응답 작성\n화면–API 매핑 점검', 258, C.greenPale, C.teal],
    ['DAY 3', '정합성·발표', '상태·권한 시나리오 검증\n문서 간 용어와 필드 정리\n5분 발표 흐름 완성', 480, C.amberPale, '#946713'],
  ]
  for (const d of days) {
    const id = d[0].replace(' ', '')
    box(s, `s12_${id}`, d[3], 130, 204, 132, C.white, C.line)
    pill(s, `s12_${id}p`, d[3] + 16, 146, 68, d[0], d[4], d[5])
    textBox(s, `s12_${id}h`, d[3] + 16, 184, 172, 20, d[1], 14, C.navy, true)
    textBox(s, `s12_${id}t`, d[3] + 16, 214, 172, 42, d[2], 10.5, C.text)
  }
  box(s, 's12_deliv', 36, 289, 648, 66, C.navy)
  textBox(s, 's12_deliv_h', 52, 304, 112, 18, '개발 인계물', 12, '#BFD6DF', true)
  textBox(s, 's12_deliv_t', 156, 300, 510, 38, '프론트 화면 · DBML 16 tables · OpenAPI 36 paths / 65 operations\n화면별 API 목록 · 필드 사전 · 상태/삭제/트랜잭션 정책', 11, C.white)
  textBox(s, 's12_final', 36, 374, 648, 18, '써랍은 기능을 많이 늘리기보다, 한 번 정의한 흐름을 끝까지 일치시키는 설계를 선택했습니다.', 11, C.teal, true, 'CENTER')
}

process.stdout.write(JSON.stringify(requests))
