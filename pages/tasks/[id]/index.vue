<script lang="ts" setup>
const route = useRoute();
const { data: task, error, status } = await useFetch(`/api/tasks/${route.params.id}`, {
  lazy: true,
});
</script>

<template>
  <div>
    <article v-if="status === 'pending'" aria-busy="true" />
    <article v-else-if="error" class="error">
      {{ error.statusMessage || 'Unknown error occurred' }}
    </article>
    <div v-else-if="task">
      <div style="display:flex;flex-direction:column;gap:12px;">
        <article>{{ task.title }}</article>
        <div>
          <NuxtLink to="/" class="btn btn--danger">Back</NuxtLink>
        </div>
      </div>
    </div>
  </div>
</template>
