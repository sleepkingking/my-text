<template>
  <div class="home">
    <header class="topbar">
      <h1>📝 我的笔记</h1>
      <div class="topbar-right">
        <span class="username">{{ authStore.user?.username }}</span>
        <button class="btn-logout" @click="handleLogout">退出</button>
      </div>
    </header>

    <div class="toolbar">
      <input v-model="searchText" type="text" placeholder="🔍 搜索笔记..." class="search-input" />
      <router-link to="/note/new" class="btn-new">+ 新建笔记</router-link>
    </div>

    <div v-if="notesStore.loading" class="loading">加载中...</div>

    <div v-else-if="filteredNotes.length === 0" class="empty">
      <p v-if="searchText">没有找到匹配「{{ searchText }}」的笔记</p>
      <p v-else>还没有笔记，<router-link to="/note/new">写第一篇吧 ✍️</router-link></p>
    </div>

    <div v-else class="notes-grid">
      <NoteCard v-for="note in filteredNotes" :key="note.id" :note="note" @delete="handleDelete" />
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import { useNotesStore } from '../stores/notes'
import NoteCard from '../components/NoteCard.vue'

const router = useRouter()
const authStore = useAuthStore()
const notesStore = useNotesStore()
const searchText = ref('')

const filteredNotes = computed(() => {
  if (!searchText.value) return notesStore.notes
  const keyword = searchText.value.toLowerCase()
  return notesStore.notes.filter(
    (note) => note.title.toLowerCase().includes(keyword) || note.content.toLowerCase().includes(keyword)
  )
})

onMounted(() => { notesStore.fetchNotes() })

function handleLogout() {
  authStore.logout()
  router.push('/login')
}

async function handleDelete(id) {
  if (confirm('确定要删除这条笔记吗？')) {
    await notesStore.removeNote(id)
  }
}
</script>

<style scoped>
.home { max-width: 900px; margin: 0 auto; padding: 20px; }
.topbar { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; }
.topbar h1 { margin: 0; font-size: 24px; }
.topbar-right { display: flex; align-items: center; gap: 12px; }
.username { color: #666; font-size: 14px; }
.btn-logout { padding: 6px 14px; background: none; border: 1px solid #ddd; border-radius: 6px; cursor: pointer; color: #666; font-size: 13px; }
.btn-logout:hover { border-color: #e74c3c; color: #e74c3c; }
.toolbar { display: flex; gap: 12px; margin-bottom: 24px; }
.search-input { flex: 1; padding: 10px 14px; border: 1px solid #ddd; border-radius: 8px; font-size: 15px; outline: none; }
.search-input:focus { border-color: #4a90d9; }
.btn-new { padding: 10px 20px; background: #4a90d9; color: white; border: none; border-radius: 8px; font-size: 15px; text-decoration: none; white-space: nowrap; }
.btn-new:hover { background: #357abd; }
.loading, .empty { text-align: center; padding: 60px 20px; color: #888; font-size: 16px; }
.empty a { color: #4a90d9; }
.notes-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(260px, 1fr)); gap: 16px; }
</style>
