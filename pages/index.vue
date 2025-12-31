<script setup>
definePageMeta({
  middleware: ['validate-session']
})

const user = useUser()
const postsStore = usePosts()

if (!postsStore.initialized) {
  await postsStore.fetchPosts()
}

const posts = computed(() => postsStore.list)
const loading = computed(() => postsStore.loading)
</script>

<template>
  <PostForm
    v-if="!user.isGuest" />
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
