import { defineStore } from 'pinia'
import { ref } from 'vue'
import { notesApi } from '../api'

export const useNotesStore = defineStore('notes', () => {
  const notes = ref([])
  const loading = ref(false)

  async function fetchNotes() {
    loading.value = true
    try {
      const res = await notesApi.getAll()
      notes.value = res.data
    } finally {
      loading.value = false
    }
  }

  async function fetchNote(id) {
    const res = await notesApi.getOne(id)
    return res.data
  }

  async function createNote(data) {
    const res = await notesApi.create(data)
    notes.value.unshift(res.data)
    return res.data
  }

  async function updateNote(id, data) {
    const res = await notesApi.update(id, data)
    const index = notes.value.findIndex((n) => n.id === id)
    if (index !== -1) notes.value[index] = res.data
    return res.data
  }

  async function removeNote(id) {
    await notesApi.remove(id)
    notes.value = notes.value.filter((n) => n.id !== id)
  }

  return { notes, loading, fetchNotes, fetchNote, createNote, updateNote, removeNote }
})
