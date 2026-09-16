<script setup>
import { Download, Plus, Trash2 } from 'lucide-vue-next'
import { useWorkspace } from '../../composables/useWorkspace.js'

const { courses, profileSectionLocks, addCourse, removeCourse, notify } = useWorkspace()

function escapeCsv(value) {
  let text = String(value ?? '')
  if (/^[=+\-@]/.test(text)) text = `'${text}`
  return `"${text.replaceAll('"', '""')}"`
}

function downloadCourses() {
  const headers = [
    '전공명',
    '수강연도',
    '학기',
    '과목명',
    '과목유형',
    '취득학점',
    '성적',
    '재수강여부',
  ]
  const rows = courses.value.map((course) => [
    course.majorName,
    course.year,
    course.semester,
    course.subject,
    course.subjectType,
    course.credits,
    course.grade,
    course.retaken,
  ])
  const csv = [headers, ...rows]
    .map((row) => row.map(escapeCsv).join(','))
    .join('\r\n')
  const url = URL.createObjectURL(
    new Blob(['\uFEFF', csv], { type: 'text/csv;charset=utf-8' }),
  )
  const anchor = document.createElement('a')
  anchor.href = url
  anchor.download = '수강과목.csv'
  anchor.click()
  URL.revokeObjectURL(url)
  notify(`${courses.value.length}개의 수강 과목을 다운로드했습니다.`)
}
</script>

<template>
  <details class="course-details">
    <summary>
      <span>수강 과목</span>
      <small>{{ courses.length }}개 등록</small>
    </summary>

    <div class="course-content">
      <div class="course-toolbar">
        <p>지원서에 필요한 과목만 골라 기록할 수 있습니다.</p>
        <div class="course-toolbar-actions">
          <button
            class="secondary compact"
            type="button"
            :disabled="!courses.length"
            @click="downloadCourses"
          >
            <Download :size="16" />엑셀 다운로드
          </button>
          <button
            v-if="!profileSectionLocks.education"
            class="secondary compact"
            type="button"
            @click="addCourse"
          >
            <Plus :size="16" />과목 추가
          </button>
        </div>
      </div>

      <div v-if="courses.length" class="course-table-wrap">
        <table class="course-table">
          <thead>
            <tr>
              <th>NO</th>
              <th>전공명</th>
              <th>수강연도</th>
              <th>학기</th>
              <th>과목명</th>
              <th>과목유형</th>
              <th>취득학점</th>
              <th>성적</th>
              <th>재수강여부</th>
              <th><span class="sr-only">관리</span></th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(course, index) in courses" :key="course.id">
              <td>{{ index + 1 }}</td>
              <td>
                <input v-model="course.majorName" :readonly="profileSectionLocks.education" :aria-label="`${index + 1}번 전공명`" />
              </td>
              <td>
                <input
                  v-model="course.year"
                  type="number"
                  min="1900"
                  max="2100"
                  :readonly="profileSectionLocks.education"
                  :aria-label="`${index + 1}번 수강연도`"
                />
              </td>
              <td>
                <span v-if="profileSectionLocks.education" class="table-readonly">{{ course.semester || '미입력' }}</span>
                <select v-else v-model="course.semester" :aria-label="`${index + 1}번 학기`">
                  <option value="">선택</option>
                  <option>1</option>
                  <option>2</option>
                  <option>여름</option>
                  <option>겨울</option>
                </select>
              </td>
              <td>
                <input v-model="course.subject" :readonly="profileSectionLocks.education" :aria-label="`${index + 1}번 과목명`" />
              </td>
              <td>
                <span v-if="profileSectionLocks.education" class="table-readonly">{{ course.subjectType || '미입력' }}</span>
                <select v-else v-model="course.subjectType" :aria-label="`${index + 1}번 과목유형`">
                  <option>전공</option>
                  <option>교양</option>
                  <option>기타</option>
                </select>
              </td>
              <td>
                <input
                  v-model="course.credits"
                  type="number"
                  min="0"
                  max="30"
                  step="0.5"
                  :readonly="profileSectionLocks.education"
                  :aria-label="`${index + 1}번 취득학점`"
                />
              </td>
              <td>
                <input
                  v-model="course.grade"
                  maxlength="10"
                  :readonly="profileSectionLocks.education"
                  :aria-label="`${index + 1}번 성적`"
                />
              </td>
              <td>
                <span v-if="profileSectionLocks.education" class="table-readonly">{{ course.retaken }}</span>
                <select v-else v-model="course.retaken" :aria-label="`${index + 1}번 재수강여부`">
                  <option>N</option>
                  <option>Y</option>
                </select>
              </td>
              <td>
                <button
                  v-if="!profileSectionLocks.education"
                  class="icon-button danger"
                  type="button"
                  :aria-label="`${index + 1}번 수강 과목 삭제`"
                  @click="removeCourse(course.id)"
                >
                  <Trash2 :size="17" />
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <p v-else class="inline-empty">등록된 수강 과목이 없습니다.</p>
    </div>
  </details>
</template>
