<script setup>
import { HeartIcon } from '@heroicons/vue/24/outline'

defineProps({
  post: {
    type: Object,
    required: true
  }
})
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
      <button class="rounded-full border border-sky-200/60 bg-white/20 px-4 py-2 text-sm font-semibold text-white transition hover:bg-white/40">
        Follow
      </button>
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

    <button class="mt-6 flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-rose-400 via-pink-400 to-orange-400 px-6 py-4 font-semibold text-white shadow-lg shadow-rose-400/30 transition hover:translate-y-[1px]">
      <HeartIcon class="h-5 w-5" />
      <span>Add to my favorites</span>
    </button>
  </article>
</template>