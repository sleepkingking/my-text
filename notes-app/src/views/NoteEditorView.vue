<template>
  <div class="editor-page">
    <header class="editor-header">
      <router-link to="/" class="btn-back">← 返回</router-link>
      <h1>{{ isEdit ? '编辑笔记' : '新建笔记' }}</h1>
    </header>

    <form @submit.prevent="handleSave" class="editor-form">
      <div class="form-group">
        <label>标题</label>
        <input v-model="title" type="text" placeholder="给笔记起个标题" required />
      </div>

      <div class="form-group">
        <label>标签</label>
        <input v-model="tag" type="text" placeholder="比如：学习、工作、生活（用逗号分隔）" />
      </div>

      <div class="form-group">
        <label>内容</label>
        <textarea v-model="content" placeholder="开始写点什么..." rows="12" required></textarea>
      </div>

      <p v-if="error" class="error">{{ error }}</p>

      <div class="form-actions">
        <button type="submit" class="btn-save" :disabled="saving">
          {{ saving ? '保存中...' : '保存' }}
        </button>
        <router-link to="/" class="btn-cancel">取消</router-link>
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useNotesStore } from '../stores/notes'

const route = useRoute()
const router = useRouter()
const notesStore = useNotesStore()
const isEdit = computed(() => !!route.params.id)

const title = ref('')
const content = ref('')
const tag = ref('')
const error = ref('')
const saving = ref(false)

onMounted(async () => {
  if (isEdit.value) {
    try {
      const note = await notesStore.fetchNote(route.params.id)
      title.value = note.title
      content.value = note.content
      tag.value = note.tag || ''
    } catch {
      error.value = '找不到这条笔记'
    }
  }
})

async function handleSave() {
  error.value = ''
  saving.value = true
  try {
    const data = { title: title.value, content: content.value, tag: tag.value }
    if (isEdit.value) {
      await notesStore.updateNote(route.params.id, data)
    } else {
      await notesStore.createNote(data)
    }
    router.push('/')
  } catch (err) {
    error.value = err.response?.data?.error || '保存失败'
  } finally {
    saving.value = false
  }
}
</script>

<style scoped>
.editor-page { max-width: 700px; margin: 0 auto; padding: 20px; }
.editor-header { display: flex; align-items: center; gap: 16px; margin-bottom: 24px; }
.editor-header h1 { margin: 0; font-size: 22px; }
.btn-back { color: #4a90d9; text-decoration: none; font-size: 15px; }
.btn-back:hover { text-decoration: underline; }
.form-group { margin-bottom: 20px; }
.form-group label { display: block; margin-bottom: 6px; font-weight: 500; color: #333; }
.form-group input, .form-group textarea { width: 100%; padding: 10px 12px; border: 1px solid #ddd; border-radius: 8px; font-size: 15px; outline: none; box-sizing: border-box; font-family: inherit; }
.form-group input:focus, .form-group textarea:focus { border-color: #4a90d9; }
.form-group textarea { resize: vertical; min-height: 200px; line-height: 1.6; }
.error { color: #e74c3c; margin-bottom: 16px; }
.form-actions { display: flex; gap: 12px; }
.btn-save { padding: 10px 28px; background: #4a90d9; color: white; border: none; border-radius: 8px; font-size: 15px; cursor: pointer; }
.btn-save:hover { background: #357abd; }
.btn-save:disabled { background: #a0c4e8; cursor: not-allowed; }
.btn-cancel { padding: 10px 28px; border: 1px solid #ddd; border-radius: 8px; font-size: 15px; text-decoration: none; color: #666; display: inline-flex; align-items: center; }
.btn-cancel:hover { border-color: #999; }
</style>
