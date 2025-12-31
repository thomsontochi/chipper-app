export const usePosts = defineStore('posts', () => {
  const { $api } = useNuxtApp()

  const list = ref([])
  const loading = ref(false)
  const initialized = ref(false)

  function extractData (payload) {
    if (!payload) return null

    return payload.data ?? payload
  }

  async function fetchPosts () {
    loading.value = true

    try {
      const response = await $api.get('/posts')
      list.value = extractData(response) || []
      initialized.value = true
    } finally {
      loading.value = false
    }
  }

  async function createPost ({ title, body }) {
    const response = await $api.post('/posts', { title, body })
    const post = extractData(response)

    if (post) {
      list.value = [post, ...list.value]
    }

    return post
  }

  return {
    list,
    loading,
    initialized,
    fetchPosts,
    createPost
  }
})
