<script lang="ts" setup>
import type { FetchError } from "ofetch";

const { data: tasks, error, status, refresh } = await useFetch("/api/tasks", {
	lazy: true,
});

async function deleteTask(id: number) {
	if (!confirm('Delete this task?')) return;
	try {
		await $fetch(`/api/tasks/${id}`, { method: 'DELETE' });
		// Refresh the list
		await refresh();
	}
	catch (e) {
		const err = e as FetchError;
		// simple alert for errors
		alert(err.statusMessage || 'Delete failed');
	}
}
</script>

<template>
	<div>
		<article v-if="status === 'pending'" aria-busy="true" />
		<article v-else-if="error" class="error">
			{{ error.statusMessage }}
		</article>
		<div v-else>
			<article v-for="task in tasks" :key="task.id" style="display:flex;justify-content:space-between;align-items:center;padding:8px 0;border-bottom:1px solid rgba(0,0,0,0.06);">
				<div class="task-title">{{ task.title }}</div>
				<div class="button-container" style="display:flex;gap:12px;align-items:center;">
					<NuxtLink role="button" :to="{ name: 'tasks-id', params: { id: task.id } }">View</NuxtLink>
					<NuxtLink role="button" :to="{ name: 'tasks-id-edit', params: { id: task.id } }">Update</NuxtLink>
					<NuxtLink role="button" to="#" @click.prevent="deleteTask(task.id)">Delete</NuxtLink>
				</div>
			</article>
		</div>
	</div>
</template>

<style scoped>
/* Hide text caret on task titles to remove blinking cursor on index page */
.task-title, .task-title:focus {
	caret-color: transparent;
	outline: none;
}
</style>
