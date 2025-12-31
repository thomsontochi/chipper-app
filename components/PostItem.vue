<script setup>
import { HeartIcon } from '@heroicons/vue/24/outline'

const props = defineProps({
  post: {
    type: Object,
    required: true
  }
})

const config = useRuntimeConfig()
const user = useUser()
const favorites = useFavorites()

const isOwnPost = computed(() => user.data?.id === props.post.user.id)
const isFollowing = computed(() => favorites.isAuthorFavorite(props.post.user.id))
const followPending = computed(() => favorites.isAuthorPending(props.post.user.id))

const isPostFavorited = computed(() => favorites.isPostFavorite(props.post.id))
const postPending = computed(() => favorites.isPostPending(props.post.id))
const resolvedImageUrl = computed(() => {
  const rawUrl = props.post.image_url
  if (!rawUrl) return null

  try {
    const parsedUrl = new URL(rawUrl)

    if ((parsedUrl.hostname === 'localhost' || parsedUrl.hostname === '127.0.0.1') && !parsedUrl.port) {
      const apiBase = new URL(config.public.API_URL)
      parsedUrl.protocol = apiBase.protocol
      parsedUrl.hostname = apiBase.hostname
      parsedUrl.port = apiBase.port
    }

    return parsedUrl.toString()
  } catch {
    return rawUrl
  }
})

const followLabel = computed(() => {
  if (isOwnPost.value) return 'Your post'
  return isFollowing.value ? 'Unfollow' : 'Follow'
})

async function toggleFollow () {
  if (user.isGuest) {
    await navigateTo('/login')
    return
  }

  if (isOwnPost.value || followPending.value) return

  if (isFollowing.value) {
    await favorites.unfollowUser(props.post.user.id)
  } else {
    await favorites.followUser(props.post.user.id)
  }
}

async function togglePostFavorite () {
  if (user.isGuest) {
    await navigateTo('/login')
    return
  }

  if (postPending.value) return

  if (isPostFavorited.value) {
    await favorites.unfavoritePost(props.post.id)
  } else {
    await favorites.favoritePost(props.post.id)
  }
}
</script>

<template>
  <article class="rounded-[28px] border border-white/10 bg-white/8 p-6 text-slate-100 shadow-2xl shadow-indigo-900/40 backdrop-blur">
    <div class="flex flex-wrap items-center justify-between gap-4">
      <div>
        <p class="text-xs uppercase tracking-[0.4em] text-sky-300">
          Featured post
        </p>
        <h4 class="text-2xl font-semibold text-white">
          {{ post.title }}
        </h4>
      </div>
      <button
        v-if="!user.isGuest && !isOwnPost"
        class="rounded-full border border-emerald-200/60 bg-white/20 px-4 py-2 text-sm font-semibold text-white transition hover:bg-white/40 disabled:opacity-50"
        :disabled="followPending"
        @click="toggleFollow">
        {{ followPending ? 'Please wait…' : followLabel }}
      </button>
      <span
        v-else-if="isOwnPost"
        class="rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm font-semibold text-white/80">
        {{ followLabel }}
      </span>
      <NuxtLink
        v-else
        to="/login"
        class="rounded-full border border-sky-200/60 bg-white/10 px-4 py-2 text-sm font-semibold text-white transition hover:bg-white/30">
        Login to follow
      </NuxtLink>
    </div>

    <div class="mt-4 flex items-center gap-4 rounded-2xl bg-white/10 px-4 py-3 text-sm text-white/80">
      <span class="text-white/60">
        by
      </span>
      <span class="font-semibold text-white">
        {{ post.user.name }}
      </span>
      <span class="text-xs text-white/50">
        · moments ago
      </span>
    </div>

    <p class="mt-4 text-base leading-relaxed text-white/85">
      {{ post.body }}
    </p>

    <div
      v-if="resolvedImageUrl"
      class="mt-5 overflow-hidden rounded-3xl border border-white/10 bg-white/5 shadow-xl shadow-indigo-900/30">
      <img
        :src="resolvedImageUrl"
        :alt="post.title"
        class="h-72 w-full object-cover" />
    </div>

    <button
      class="mt-6 flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-rose-400 via-pink-400 to-orange-400 px-6 py-4 font-semibold text-white shadow-lg shadow-rose-400/30 transition hover:translate-y-[1px] disabled:opacity-60"
      :class="isPostFavorited ? '!from-emerald-400 !via-sky-400 !to-indigo-400' : ''"
      :disabled="postPending"
      @click="togglePostFavorite">
      <HeartIcon
        class="h-5 w-5"
        :class="isPostFavorited ? 'fill-white' : ''" />
      <span>
        {{ postPending ? 'Working…' : (isPostFavorited ? 'Remove from favorites' : 'Add to my favorites') }}
      </span>
    </button>
  </article>
</template>