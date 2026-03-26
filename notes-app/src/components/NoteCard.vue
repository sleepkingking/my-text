<template>
  <div class="note-card" @click="goEdit">
    <div class="note-header">
      <h3 class="note-title">{{ note.title }}</h3>
      <button class="btn-delete" @click.stop="$emit('delete', note.id)" title="删除">🗑️</button>
    </div>
    <p class="note-content">{{ note.content }}</p>
    <div class="note-footer">
      <span v-if="note.tag" class="note-tag">{{ note.tag }}</span>
      <span class="note-date">{{ formatDate(note.created_at) }}</span>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'

const props = defineProps({ note: { type: Object, required: true } })
defineEmits(['delete'])
const router = useRouter()

function goEdit() { router.push(`/note/${props.note.id}`) }

function formatDate(dateStr) {
  if (!dateStr) return ''
  const date = new Date(dateStr)
  const diff = Date.now() - date
  if (diff < 3600000) { const mins = Math.floor(diff / 60000); return mins <= 0 ? '刚刚' : `${mins}分钟前` }
  if (diff < 86400000) return `${Math.floor(diff / 3600000)}小时前`
  return `${date.getMonth() + 1}月${date.getDate()}日`
}
</script>

<style scoped>
.note-card { background: white; border-radius: 10px; padding: 16px; box-shadow: 0 1px 4px rgba(0,0,0,0.08); cursor: pointer; transition: box-shadow 0.2s, transform 0.2s; display: flex; flex-direction: column; }
.note-card:hover { box-shadow: 0 4px 12px rgba(0,0,0,0.12); transform: translateY(-2px); }
.note-header { display: flex; justify-content: space-between; align-items: flex-start; gap: 8px; }
.note-title { margin: 0 0 8px; font-size: 16px; color: #333; word-break: break-word; }
.btn-delete { background: none; border: none; cursor: pointer; font-size: 14px; padding: 2px 4px; opacity: 0.4; transition: opacity 0.2s; flex-shrink: 0; }
.btn-delete:hover { opacity: 1; }
.note-content { margin: 0; font-size: 14px; color: #666; line-height: 1.5; flex: 1; overflow: hidden; display: -webkit-box; -webkit-line-clamp: 4; -webkit-box-orient: vertical; word-break: break-word; }
.note-footer { display: flex; justify-content: space-between; align-items: center; margin-top: 12px; font-size: 12px; }
.note-tag { background: #e8f0fe; color: #4a90d9; padding: 2px 8px; border-radius: 4px; }
.note-date { color: #aaa; }
</style>
