<script setup>
definePageMeta({
  middleware: ['validate-session']
})

const user = useUser()
const postsStore = usePosts()
const favoritesStore = useFavorites()

if (!postsStore.initialized) {
  await postsStore.fetchPosts()
}

if (!favoritesStore.initialized && !user.isGuest) {
  await favoritesStore.fetchFavorites()
}

const posts = computed(() => postsStore.list)
const loading = computed(() => postsStore.loading)
const pendingNewPostsCount = computed(() => postsStore.pendingNewPosts.length)
const newPostsLabel = computed(() => {
  const count = pendingNewPostsCount.value
  if (count <= 1) return 'Load 1 new post'
  return `Load ${count} new posts`
})

const POLL_INTERVAL_MS = 30_000
let pollTimerId

onMounted(() => {
  pollTimerId = setInterval(() => {
    postsStore.checkForNewPosts()
  }, POLL_INTERVAL_MS)
})

onBeforeUnmount(() => {
  if (pollTimerId) {
    clearInterval(pollTimerId)
    pollTimerId = undefined
  }
})
</script>

<template>
  <PostForm
    v-if="!user.isGuest" />
  <div
    v-if="postsStore.hasPendingNewPosts"
    class="mb-10 flex justify-center">
    <button
      class="inline-flex items-center gap-2 rounded-full border border-sky-200/60 bg-white/20 px-6 py-2 text-sm font-semibold uppercase tracking-[0.2em] text-white shadow-lg shadow-sky-500/30 transition hover:translate-y-[1px]"
      @click="postsStore.loadPendingPosts">
      <span class="h-2 w-2 rounded-full bg-emerald-400" />
      {{ newPostsLabel }}
    </button>
  </div>
  <div class="grid gap-16">
    <div
      v-if="loading"
      class="text-center text-sm text-gray-500">
      Loading posts…
    </div>
    <template v-else>
      <PostItem
        v-for="post in posts"
        :key="post.id"
        v-bind="{ post }" />
      <p
        v-if="!posts.length"
        class="text-center text-sm text-gray-500">
        No posts yet. Be the first to write something!
      </p>
    </template>
  </div>
</template>
