<script lang="ts" setup>
import type { FetchError } from "ofetch";
import { nextTick } from 'vue';

const route = useRoute();
const router = useRouter();

const { data: task, error, status } = await useFetch(`/api/tasks/${route.params.id}`, {
  lazy: true,
});

const title = ref("");
const saving = ref(false);
const inputEl = ref<HTMLInputElement | null>(null);

watch(task, async (t) => {
  if (t) {
    title.value = t.title;
    await nextTick();
    // focus input and place caret at end
    const el = inputEl.value;
    if (el) {
      el.focus();
      const len = el.value.length;
      el.setSelectionRange(len, len);
    }
  }
});

async function onSave() {
  try {
    saving.value = true;
    await $fetch(`/api/tasks/${route.params.id}`, {
      method: "PATCH",
      body: { title: title.value },
    });
    await router.push('/');
  }
  catch (e) {
    const err = e as FetchError;
    throw err;
  }
  finally {
    saving.value = false;
  }
}
</script>

<template>
  <div>
    <article v-if="status === 'pending'" aria-busy="true" />
    <article v-else-if="error" class="error">
      {{ error.statusMessage || 'Unknown error occurred' }}
    </article>

    <div v-else-if="task">
      <form @submit.prevent="onSave">
        <label>
          Title
          <input ref="inputEl" v-model="title" name="title" />
        </label>
        <div class="button-container" style="display:flex;gap:8px;align-items:center;">
          <button class="btn btn--primary" :disabled="saving">Save</button>
          <NuxtLink to="/" class="btn btn--danger">Cancel</NuxtLink>
        </div>
      </form>
    </div>
  </div>
</template>

<style scoped>
.btn{display:inline-flex;align-items:center;justify-content:center;padding:8px 14px;min-width:96px;border-radius:6px;text-decoration:none;border:0;color:#fff}
.btn--primary{background:#2b6cb0}
.btn--danger{background:#e53e3e}
.btn[disabled]{opacity:0.6;pointer-events:none}
</style>
