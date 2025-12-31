<script setup>
const postsStore = usePosts()

const title = ref('')
const body = ref('')
const submitting = ref(false)
const error = ref(null)

async function submit () {
  error.value = null

  if (!title.value.trim() || !body.value.trim()) {
    error.value = 'Please enter both a title and body.'
    return
  }

  submitting.value = true

  try {
    await postsStore.createPost({
      title: title.value,
      body: body.value
    })

    title.value = ''
    body.value = ''
  } catch (err) {
    error.value = err?.data?.message || 'Unable to create post.'
  } finally {
    submitting.value = false
  }
}
</script>

<template>
  <form
    class="mb-16 rounded-3xl border border-white/40 bg-white/90 p-6 shadow-xl shadow-blue-500/10 backdrop-blur md:p-8"
    @submit.prevent="submit">
    <div class="flex items-start justify-between gap-4">
      <div>
        <p class="text-xs font-semibold uppercase tracking-[0.3em] text-sky-500">
          Share a moment
        </p>
        <h3 class="text-xl font-bold text-slate-900 md:text-2xl">
          Compose a new post
        </h3>
      </div>
      <span class="rounded-full bg-sky-100 px-3 py-1 text-xs font-semibold text-sky-700">
        Live
      </span>
    </div>
    <div class="mt-6 grid gap-4">
      <input
        v-model="title"
        placeholder="Post title"
        class="w-full rounded-2xl border border-slate-200 bg-white px-5 py-4 text-base font-medium text-slate-900 shadow-inner shadow-slate-200 transition focus:border-transparent focus:outline-none focus:ring-2 focus:ring-emerald-300" />
      <textarea
        v-model="body"
        placeholder="What is happening?!"
        rows="4"
        class="w-full rounded-2xl border border-slate-200 bg-white px-5 py-4 text-base text-slate-800 shadow-inner shadow-slate-200 transition focus:border-transparent focus:outline-none focus:ring-2 focus:ring-emerald-300" />
      <p
        v-if="error"
        class="text-sm font-semibold text-rose-500">
        {{ error }}
      </p>
      <button
        class="inline-flex items-center justify-center rounded-2xl bg-gradient-to-r from-emerald-400 via-sky-400 to-indigo-500 px-10 py-4 text-base font-semibold text-white shadow-lg shadow-emerald-400/30 transition hover:translate-y-[1px] hover:brightness-105 disabled:opacity-60 disabled:shadow-none"
        :disabled="submitting">
        <span>{{ submitting ? 'Posting…' : 'Post' }}</span>
      </button>
    </div>
  </form>
</template>