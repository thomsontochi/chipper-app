export const usePosts = defineStore('posts', () => {
  const { $api } = useNuxtApp()

  const list = ref([])
  const pendingNewPosts = ref([])
  const loading = ref(false)
  const initialized = ref(false)
  let checkingForNewPosts = false

  function extractData (payload) {
    if (!payload) return null

    return payload.data ?? payload
  }

  async function fetchPosts ({ background = false } = {}) {
    if (!background) {
      loading.value = true
    }

    try {
      const response = await $api.get('/posts')
      list.value = extractData(response) || []
      initialized.value = true
      pendingNewPosts.value = []
    } finally {
      if (!background) {
        loading.value = false
      }
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

  async function checkForNewPosts () {
    if (checkingForNewPosts || !initialized.value) return

    checkingForNewPosts = true

    try {
      const response = await $api.get('/posts')
      const incoming = extractData(response) || []

      if (!incoming.length) return

      const knownIds = new Set([
        ...list.value,
        ...pendingNewPosts.value
      ].map(post => post.id))

      const fresh = incoming.filter(post => !knownIds.has(post.id))

      if (fresh.length) {
        // keep newest posts at the top of the queue
        pendingNewPosts.value = [...fresh, ...pendingNewPosts.value]
      }
    } catch (error) {
      console.warn('[posts] failed to poll for new posts', error)
    } finally {
      checkingForNewPosts = false
    }
  }

  function loadPendingPosts () {
    if (!pendingNewPosts.value.length) return

    list.value = [...pendingNewPosts.value, ...list.value]
    pendingNewPosts.value = []
  }

  return {
    list,
    pendingNewPosts,
    loading,
    initialized,
    fetchPosts,
    createPost,
    checkForNewPosts,
    loadPendingPosts,
    hasPendingNewPosts: computed(() => pendingNewPosts.value.length > 0)
  }
})
