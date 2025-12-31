<script setup>
const user = useUser()

async function logout () {
  await user.logout()
  window.location.reload()
}
</script>

<template>
  <div class="min-h-screen bg-gradient-to-b from-[#141b3a] via-[#1c2757] to-[#132045] text-slate-50">
    <div class="mx-auto flex w-full max-w-4xl flex-col gap-10 px-6 py-10 md:px-10">
      <header class="flex items-center justify-between rounded-3xl border border-white/15 bg-white/5 px-6 py-5 shadow-lg shadow-indigo-900/30 backdrop-blur-lg">
        <NuxtLink
          to="/"
          class="text-2xl font-black tracking-tight text-white md:text-3xl">
          Chipper
        </NuxtLink>
        <div
          v-if="user.isGuest"
          class="flex items-center gap-3 text-sm font-semibold">
          <NuxtLink
            to="/login"
            class="rounded-full bg-white/10 px-4 py-2 text-slate-100 transition hover:bg-white/20">
            Login
          </NuxtLink>
          <NuxtLink
            to="/register"
            class="rounded-full bg-emerald-400 px-4 py-2 text-slate-900 transition hover:brightness-110">
            Register
          </NuxtLink>
        </div>
        <div
          v-else
          class="flex items-center gap-4 text-sm font-semibold">
          <span class="rounded-full bg-white/10 px-4 py-2 text-slate-100">
            Hello, {{ user.data.name }}!
          </span>
          <button
            class="rounded-full bg-white/15 px-4 py-2 text-white transition hover:bg-white/25"
            @click="logout">
            Logout
          </button>
        </div>
      </header>

      <main class="rounded-[32px] border border-white/10 bg-white/5 p-6 shadow-2xl shadow-indigo-900/40 backdrop-blur-xl md:p-10">
        <slot />
      </main>

      <footer class="pb-4 text-center text-xs text-white/60">
        Built for the VueSchool technical test · {{ new Date().getFullYear() }}
      </footer>
    </div>
  </div>
</template>