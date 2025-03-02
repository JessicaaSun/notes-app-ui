<template>
  <div
    class="w-[92%] mt-3 rounded-lg m-auto shadow-[6px_5px_20px_rgba(0,0,0,0.15)] rounded-b-[10px] overflow-hidden"
  >
    <div
      class="w-full min-h-[85vh] px-[20px] pt-3 pb-[30px] bg-[repeating-linear-gradient(#F7F4F1FF,#F3F1EEFF_31px,#D8CEC7FF_31px,#B8B0A8FF_32px)] leading-[32px] outline-none text-base"
    >
      <div class="w-full mb-10 flex justify-between">
        <p class="text-sm text-gray-500 text-end">
          Written at: {{ formatDate(note?.createdAt) }}
        </p>

        <p
          v-if="formatDate(note?.updatedAt) && formatDate(note?.updatedAt) !== formatDate(note?.createdAt)"
          class="text-sm text-gray-500 text-end"
        >
          Last Updated: {{ formatDate(note?.updatedAt) }}
        </p>
      </div>

      <div class="flex relative justify-between">
        <p class="text-xl">
          {{ note?.title }}
        </p>
        <div class="flex items-center absolute right-0 top-[-4px] gap-2">
          <div class="relative group">
            <button class="cursor-pointer" @click.stop="editNote(note?.id)">
              <img
                src="../assets/images/pencil.png"
                alt="edit"
                class="w-[30px]"
              />
            </button>
            <div
              class="absolute left-1/2 top-[80%] mt-2 w-max -translate-x-1/2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 bg-[#333] text-white text-xs px-3 py-1 rounded-md shadow-lg"
            >
              Edit
              <div
                class="absolute left-1/2 -top-3 -translate-x-1/2 rotate-180 border-8 border-transparent border-t-[#333]"
              ></div>
            </div>
          </div>
          <div class="relative group">
            <button class="cursor-pointer" @click.stop="deleteNote(note?.id)">
              <img
                src="../assets/images/trashcan.png"
                alt="delete"
                class="w-[22px] h-[22px]"
              />
            </button>
            <div
              class="absolute left-1/2 mt-2 w-max -translate-x-1/2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 bg-[#333] text-white text-xs px-3 py-1 rounded-md shadow-lg"
            >
              Delete
              <div
                class="absolute left-1/2 -top-3 -translate-x-1/2 border-8 rotate-180 border-transparent border-t-[#333]"
              ></div>
            </div>
          </div>
        </div>
      </div>

      <p class="mt-9 text-lg leading-[32px]">{{ note?.content }}</p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useNotesStore } from "../store/note";
import { formatDate } from "../utils/formatDate.ts";
const route = useRoute();
const router = useRouter();
const store = useNotesStore();
const note = ref(null);

onMounted(async () => {
  note.value = await store.getNoteById(Number(route.params.id));
});

const deleteNote = async () => {
  await store.deleteNote(Number(route.params.id));
  router.push("/");
};

const editNote = (id) => {
  router.push(`/edit/${id}`);
};
</script>
