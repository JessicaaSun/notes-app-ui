<template>
  <div
    class="w-full pb-5 lg:px-[70px] xl:px-[90px] md:px-[35px] sm:px-[30px] px-[15px]"
  >
    <div
      class="max-md:flex-col md:pt-[30px] pt-[10px] lg:gap-[80px] md:gap-[40px] gap-[20px] flex justify-center items-center"
    >
      <div class="flex flex-col items-center justify-center">
        <img src="../assets/images/hero.png" class="w-[400px]" alt="" />
        <p class="font-doodle text-center text-lg mt-2 text-[#333333]">
          Notes... Because pretending to remember everything is exhausting.
        </p>
      </div>

      <div class="md:w-[40%] w-full">
        <NoteForm
          v-if="note"
          :title="note.title"
          :content="note.content"
          :submitLabel="'Update Note'"
          :onSubmit="updateNote"
        />
      </div>
    </div>
    <transition name="toast">
      <div
        v-if="showToast"
        class="fixed top-5 right-5 z-[99999] bg-[#f0efed] text-black px-4 py-3 rounded-md border border-gray-300 shadow-lg pointer-events-auto"
      >
        Note updated successfully!
      </div>
    </transition>
  </div>
</template>

<script setup>
import { computed, ref, watchEffect } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useNotesStore } from "../store/note";
import NoteForm from "../components/NoteForm.vue";

const route = useRoute();
const router = useRouter();
const store = useNotesStore();
const showToast = ref(false);

const note = computed(() =>
  store.notes.find((n) => n.id === Number(route.params.id))
);

const updateNote = async (title, content) => {
  if (!note.value) {
    console.error("Note not found!");
    return;
  }

  try {
    await store.updateNote(Number(route.params.id), { title, content });
    showToast.value = true;

    setTimeout(() => {
      showToast.value = false;
      router.go(-1);
    }, 1200);
  } catch (error) {
    console.error("Error updating note:", error);
  }
};

watchEffect(() => {
  if (!note.value) {
    router.push("/");
  }
});
</script>
