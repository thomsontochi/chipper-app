export const useFavorites = defineStore('favorites', () => {
  const { $api } = useNuxtApp()
  const user = useUser()

  const users = ref(new Set())
  const posts = ref(new Set())
  const initialized = ref(false)
  const loading = ref(false)
  const pendingUsers = ref(new Set())
  const pendingPosts = ref(new Set())

  function setClone (target, updater) {
    const next = new Set(target.value)
    updater(next)
    target.value = next
  }

  function reset () {
    users.value = new Set()
    posts.value = new Set()
    pendingUsers.value = new Set()
    pendingPosts.value = new Set()
    initialized.value = false
  }

  async function fetchFavorites () {
    if (user.isGuest) {
      reset()
      return
    }

    loading.value = true

    try {
      const payload = await $api.get('/favorites')
      const authors = (payload?.data?.users ?? []).map(author => author.id)
      const postIds = (payload?.data?.posts ?? []).map(post => post.id)

      users.value = new Set(authors)
      posts.value = new Set(postIds)
      initialized.value = true
    } finally {
      loading.value = false
    }
  }

  async function followUser (userId) {
    if (user.isGuest || pendingUsers.value.has(userId) || userId === user.data?.id) return

    setClone(pendingUsers, set => set.add(userId))

    try {
      await $api.post(`/users/${userId}/favorite`)
      setClone(users, set => set.add(userId))
    } finally {
      setClone(pendingUsers, set => set.delete(userId))
    }
  }

  async function unfollowUser (userId) {
    if (user.isGuest || pendingUsers.value.has(userId)) return

    setClone(pendingUsers, set => set.add(userId))

    try {
      await $api.delete(`/users/${userId}/favorite`)
      setClone(users, set => set.delete(userId))
    } finally {
      setClone(pendingUsers, set => set.delete(userId))
    }
  }

  async function favoritePost (postId) {
    if (user.isGuest || pendingPosts.value.has(postId)) return

    setClone(pendingPosts, set => set.add(postId))

    try {
      await $api.post(`/posts/${postId}/favorite`)
      setClone(posts, set => set.add(postId))
    } finally {
      setClone(pendingPosts, set => set.delete(postId))
    }
  }

  async function unfavoritePost (postId) {
    if (user.isGuest || pendingPosts.value.has(postId)) return

    setClone(pendingPosts, set => set.add(postId))

    try {
      await $api.delete(`/posts/${postId}/favorite`)
      setClone(posts, set => set.delete(postId))
    } finally {
      setClone(pendingPosts, set => set.delete(postId))
    }
  }

  const isAuthorFavorite = userId => users.value.has(userId)
  const isAuthorPending = userId => pendingUsers.value.has(userId)
  const isPostFavorite = postId => posts.value.has(postId)
  const isPostPending = postId => pendingPosts.value.has(postId)

  watch(
    () => user.isGuest,
    async isGuest => {
      if (isGuest) {
        reset()
      } else {
        await fetchFavorites()
      }
    },
    { immediate: true }
  )

  return {
    users,
    posts,
    initialized,
    loading,
    followUser,
    unfollowUser,
    favoritePost,
    unfavoritePost,
    fetchFavorites,
    isAuthorFavorite,
    isAuthorPending,
    isPostFavorite,
    isPostPending
  }
})
