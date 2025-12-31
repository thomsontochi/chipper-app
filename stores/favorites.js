export const useFavorites = defineStore('favorites', () => {
  const { $api } = useNuxtApp()
  const user = useUser()

  const users = ref(new Set())
  const initialized = ref(false)
  const loading = ref(false)
  const pending = ref(new Set())

  function setClone (target, updater) {
    const next = new Set(target.value)
    updater(next)
    target.value = next
  }

  function reset () {
    users.value = new Set()
    pending.value = new Set()
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

      users.value = new Set(authors)
      initialized.value = true
    } finally {
      loading.value = false
    }
  }

  async function followUser (userId) {
    if (user.isGuest || pending.value.has(userId) || userId === user.data?.id) return

    setClone(pending, set => set.add(userId))

    try {
      await $api.post(`/users/${userId}/favorite`)
      setClone(users, set => set.add(userId))
    } finally {
      setClone(pending, set => set.delete(userId))
    }
  }

  async function unfollowUser (userId) {
    if (user.isGuest || pending.value.has(userId)) return

    setClone(pending, set => set.add(userId))

    try {
      await $api.delete(`/users/${userId}/favorite`)
      setClone(users, set => set.delete(userId))
    } finally {
      setClone(pending, set => set.delete(userId))
    }
  }

  const isFavorite = userId => users.value.has(userId)
  const isPending = userId => pending.value.has(userId)

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
    initialized,
    loading,
    followUser,
    unfollowUser,
    fetchFavorites,
    isFavorite,
    isPending
  }
})
