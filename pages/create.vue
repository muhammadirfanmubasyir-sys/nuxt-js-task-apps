<script lang="ts" setup>
import type { FetchError } from "ofetch";

const errorMessage = ref("");
const loading = ref(false);
const taskName = ref("");

async function onSubmit() {
	if (!taskName.value.trim()) {
		errorMessage.value = "Task is required.";
		return;
	}
	try {
		loading.value = true;
		errorMessage.value = "";
		const result = await $fetch("/api/tasks", {
			method: "POST",
			body: {
				title: taskName.value,
			},
		});
		// redirect to home after creating
		navigateTo('/');
	}
	catch (e) {
		const error = e as FetchError;
		errorMessage.value = error.statusMessage || "Unknown error occurred";
	}
	loading.value = false;
}
</script>

<template>
	<div>
		<article
			v-if="loading"
			aria-busy
		/>
		<article
			v-else-if="errorMessage"
			class="error"
		>
			{{ errorMessage }}
		</article>
		<form @submit.prevent="onSubmit">
			<label>
				Task
				<input
					v-model="taskName"
					name="title"
				>
			</label>
			<div class="button-container" style="display:flex;gap:8px;align-items:center;">
				<button class="btn btn--primary">Create</button>
				<NuxtLink to="/" class="btn btn--danger">Cancel</NuxtLink>
			</div>
		</form>
	</div>
</template>

<style scoped>
.btn{display:inline-flex;align-items:center;justify-content:center;padding:8px 14px;min-width:96px;border-radius:6px;text-decoration:none;border:0;color:#fff}
.btn--primary{background:#2b6cb0}
.btn--danger{background:#e53e3e}
.btn[disabled]{opacity:0.6;pointer-events:none}
</style>
