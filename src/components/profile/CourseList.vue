<script setup>
import { Plus, Trash2 } from 'lucide-vue-next'
import { useWorkspace } from '../../composables/useWorkspace.js'

const { courses, addCourse, removeCourse } = useWorkspace()
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
        <button class="secondary compact" type="button" @click="addCourse">
          <Plus :size="16" />과목 추가
        </button>
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
                <input v-model="course.majorName" :aria-label="`${index + 1}번 전공명`" />
              </td>
              <td>
                <input
                  v-model="course.year"
                  type="number"
                  min="1900"
                  max="2100"
                  :aria-label="`${index + 1}번 수강연도`"
                />
              </td>
              <td>
                <select v-model="course.semester" :aria-label="`${index + 1}번 학기`">
                  <option value="">선택</option>
                  <option>1</option>
                  <option>2</option>
                  <option>여름</option>
                  <option>겨울</option>
                </select>
              </td>
              <td>
                <input v-model="course.subject" :aria-label="`${index + 1}번 과목명`" />
              </td>
              <td>
                <select v-model="course.subjectType" :aria-label="`${index + 1}번 과목유형`">
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
                  :aria-label="`${index + 1}번 취득학점`"
                />
              </td>
              <td>
                <input
                  v-model="course.grade"
                  maxlength="10"
                  :aria-label="`${index + 1}번 성적`"
                />
              </td>
              <td>
                <select v-model="course.retaken" :aria-label="`${index + 1}번 재수강여부`">
                  <option>N</option>
                  <option>Y</option>
                </select>
              </td>
              <td>
                <button
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
