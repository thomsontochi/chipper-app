<script setup>
const postsStore = usePosts()
const { showToast } = useHelpers()

const title = ref('')
const body = ref('')
const image = ref(null)
const imagePreview = ref(null)
const imageError = ref(null)
const submitting = ref(false)
const error = ref(null)
const fileInput = ref(null)
const blankErrors = () => ({
  title: null,
  body: null,
  image: null
})
const fieldErrors = ref(blankErrors())

const SUPPORTED_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp']
const MAX_IMAGE_BYTES = 5 * 1024 * 1024
let imagePreviewUrl = null

function resetForm () {
  title.value = ''
  body.value = ''
  image.value = null
  clearImagePreview()
  imageError.value = null
  error.value = null
  resetFieldErrors()
  if (fileInput.value) {
    fileInput.value.value = ''
  }
}

function clearImagePreview () {
  if (imagePreviewUrl) {
    URL.revokeObjectURL(imagePreviewUrl)
    imagePreviewUrl = null
  }
  imagePreview.value = null
}

function validateImageFile (file) {
  if (!file) {
    imageError.value = null
    return true
  }

  if (!SUPPORTED_TYPES.includes(file.type)) {
    imageError.value = 'Images must be a JPG, PNG, GIF, or WEBP.'
    return false
  }

  if (file.size > MAX_IMAGE_BYTES) {
    imageError.value = 'Images must be 5MB or smaller.'
    return false
  }

  imageError.value = null
  return true
}

function handleImageChange (event) {
  const file = event.target.files?.[0]
  image.value = file || null

  if (!validateImageFile(image.value)) {
    image.value = null
    clearImagePreview()
    showToast({ title: imageError.value, icon: 'error' })
    event.target.value = ''
    return
  }

  if (image.value) {
    clearImagePreview()
    imagePreviewUrl = URL.createObjectURL(image.value)
    imagePreview.value = imagePreviewUrl
    setFieldError('image', null)
  } else {
    clearImagePreview()
  }
}

function removeImage () {
  image.value = null
  clearImagePreview()
  imageError.value = null
  setFieldError('image', null)
  if (fileInput.value) {
    fileInput.value.value = ''
  }
}

function triggerFilePicker () {
  fileInput.value?.click()
}

function setFieldError (field, message) {
  fieldErrors.value = {
    ...fieldErrors.value,
    [field]: message
  }
}

function resetFieldErrors () {
  fieldErrors.value = blankErrors()
}

async function submit () {
  error.value = null
  resetFieldErrors()

  const newErrors = {}

  if (!title.value.trim()) {
    newErrors.title = 'A post title is required.'
  }

  if (!body.value.trim()) {
    newErrors.body = 'Please write something before posting.'
  }

  if (!validateImageFile(image.value)) {
    newErrors.image = imageError.value
  }

  if (Object.keys(newErrors).length) {
    fieldErrors.value = {
      ...fieldErrors.value,
      ...newErrors
    }
    showToast({ title: Object.values(newErrors)[0], icon: 'error' })
    return
  }

  submitting.value = true

  try {
    await postsStore.createPost({
      title: title.value,
      body: body.value,
      image: image.value
    })

    resetForm()
    showToast({ title: 'Post published successfully!', icon: 'success' })
  } catch (err) {
    const backendImageError = err?.data?.errors?.image?.[0]
    if (backendImageError) {
      setFieldError('image', backendImageError)
      showToast({ title: backendImageError, icon: 'error' })
    }

    const backendTitleError = err?.data?.errors?.title?.[0]
    if (backendTitleError) {
      setFieldError('title', backendTitleError)
    }

    const backendBodyError = err?.data?.errors?.body?.[0]
    if (backendBodyError) {
      setFieldError('body', backendBodyError)
    }

    const fallbackMessage = err?.data?.message || 'Unable to create post.'
    error.value = fallbackMessage
    showToast({ title: fallbackMessage, icon: 'error' })
  } finally {
    submitting.value = false
  }
}

onBeforeUnmount(() => {
  clearImagePreview()
})
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
      <p
        v-if="fieldErrors.title"
        class="text-sm font-semibold text-rose-500">
        {{ fieldErrors.title }}
      </p>
      <textarea
        v-model="body"
        placeholder="What is happening?!"
        rows="4"
        class="w-full rounded-2xl border border-slate-200 bg-white px-5 py-4 text-base text-slate-800 shadow-inner shadow-slate-200 transition focus:border-transparent focus:outline-none focus:ring-2 focus:ring-emerald-300" />
      <p
        v-if="fieldErrors.body"
        class="text-sm font-semibold text-rose-500">
        {{ fieldErrors.body }}
      </p>
      <div class="rounded-2xl border border-dashed border-slate-300 bg-slate-50/80 p-5 shadow-inner shadow-white">
        <div class="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p class="text-sm font-semibold text-slate-700">
              Attach an image (optional)
            </p>
            <p class="text-xs text-slate-500">
              JPG, PNG, GIF, or WEBP up to 5MB.
            </p>
          </div>
          <button
            type="button"
            class="rounded-full border border-emerald-200 bg-white/80 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-emerald-700 transition hover:bg-white"
            @click="triggerFilePicker">
            Choose file
          </button>
        </div>
        <input
          ref="fileInput"
          type="file"
          accept="image/*"
          class="sr-only"
          @change="handleImageChange">

        <div
          v-if="imagePreview"
          class="relative mt-4 overflow-hidden rounded-2xl border border-white shadow-lg shadow-slate-400/20">
          <img
            :src="imagePreview"
            alt="Selected post image preview"
            class="h-60 w-full object-cover" />
          <button
            type="button"
            class="absolute right-3 top-3 rounded-full bg-white/80 px-3 py-1 text-xs font-semibold text-rose-600 shadow-lg transition hover:bg-white"
            @click="removeImage">
            Remove
          </button>
        </div>
        <p
          v-if="imageError"
          class="mt-3 text-sm font-semibold text-rose-500">
          {{ imageError }}
        </p>
      </div>
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