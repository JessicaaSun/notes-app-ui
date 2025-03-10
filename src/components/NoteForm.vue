<template>
  <form @submit.prevent="submitForm">
    <label for="title" class="block mb-2 text-[#333333]">
      Title <span class="text-red-500">*</span>
    </label>
    <input
      id="title"
      v-model="localTitle"
      type="text"
      placeholder="Enter title"
      class="p-2 w-full rounded-md text-[#333333] border-[1.2px] border-gray-600 focus:outline-none"
    />
    <p v-if="errors.title" class="text-red-500 text-sm mt-1">
      {{ errors.title }}
    </p>

    <label for="content" class="block text-[#333333] mt-4"> Content </label>
    <textarea
      id="content"
      v-model="localContent"
      placeholder="Enter content (optional)"
      class="p-2 w-full h-[130px] mt-2 rounded-md text-[#333333] border-[1.2px] border-gray-600 focus:outline-none"
    ></textarea>

    <button
      type="submit"
      class="bg-[#333333] text-lg text-white p-[10px] cursor-pointer mt-4 w-full rounded-md hover:bg-gray-700 transition"
    >
      {{ submitLabel }}
    </button>
  </form>
</template>

<script setup>
import { ref, watch } from "vue";
import * as yup from "yup";

const props = defineProps({
  title: String,
  content: String,
  submitLabel: { type: String, default: "Save Note" },
  onSubmit: Function,
});

const localTitle = ref(props.title || "");
const localContent = ref(props.content || "");
const errors = ref({});

const schema = yup.object({
  title: yup.string().required("Title is required"),
});

const submitForm = async () => {
  try {
    errors.value = {};
    await schema.validate({ title: localTitle.value }, { abortEarly: false });
    props.onSubmit?.(localTitle.value, localContent.value);

    resetForm();
  } catch (err) {
    console.error("Validation Error:", err);
    if (err.inner && Array.isArray(err.inner)) {
      err.inner.forEach((e) => {
        errors.value[e.path] = e.message;
      });
    } else {
      errors.value.general = "An unexpected error occurred.";
    }
  }
};

const resetForm = () => {
  localTitle.value = "";
  localContent.value = "";
};

watch(
  () => props.title,
  (newValue) => (localTitle.value = newValue)
);
watch(
  () => props.content,
  (newValue) => (localContent.value = newValue)
);
</script>
