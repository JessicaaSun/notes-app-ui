<template>
  <div class="py-4">
    <div class="flex flex-col sm:flex-row gap-2 sm:gap-3 mb-6">
      <input
        v-model="searchQuery"
        @input="fetchFilteredNotes"
        type="text"
        placeholder="Search notes..."
        class="w-full sm:w-64 px-4 py-2 border border-[#333] focus:ring-0 focus:outline-0 rounded-lg transition-all"
      />
      <div class="relative w-full sm:w-48">
        <button
          @click="toggleDropdown"
          class="w-full px-4 py-2 border border-[#333] rounded-lg flex items-center justify-between text-gray-700 transition"
        >
          <span>{{ selectedOptionLabel }}</span>
          <svg
            class="w-5 h-5 text-gray-500 transition-transform"
            :class="{ 'rotate-180': isDropdownOpen }"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M19 9l-7 7-7-7"
            ></path>
          </svg>
        </button>
        <ul
          v-if="isDropdownOpen"
          class="absolute left-0 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg overflow-hidden animate-fadeIn"
        >
          <li
            v-for="option in options"
            :key="option.value"
            @click="selectOption(option.value)"
            class="px-4 py-2 hover:bg-gray-100 cursor-pointer transition"
          >
            {{ option.label }}
          </li>
        </ul>
      </div>
    </div>
    <ul class="space-y-4">
      <li
        v-if="notes.length === 0"
        class="flex justify-center items-center flex-col gap-4"
      >
        <img
          src="../assets/images/no-note.png"
          class="w-[170px] h-auto"
          alt="no note found"
        />
        <p class="text-center text-xl">No notes found.</p>
      </li>
      <li
        v-for="note in notes"
        :key="note.id"
        class="border border-[#333] rounded-lg hover:shadow-md transition-shadow"
      >
        <button
          @click="selectNote(note.id)"
          class="w-full h-full text-left p-6 cursor-pointer flex items-center justify-between"
        >
          <div>
            <h3 class="text-xl">{{ note.title }}</h3>
            <p class="text-sm mt-3 text-gray-600">
              Created: {{ formatDate(note.createdAt) }}
              <span v-if="formatDate(note.updatedAt) !== formatDate(note.createdAt)" class="text-sm mt-1 text-gray-600">
                | Updated: {{ formatDate(note.updatedAt) }}
              </span>
            </p>
          </div>
          <div class="flex gap-2 items-center">
            <button class="cursor-pointer" @click.stop="editNote(note.id)">
              <img
                src="../assets/images/pencil.png"
                alt="edit"
                class="w-[30px]"
              />
            </button>
            <button class="cursor-pointer" @click.stop="deleteNote(note.id)">
              <img
                src="../assets/images/trashcan.png"
                alt="delete"
                class="w-[22px] h-[22px]"
              />
            </button>
          </div>
        </button>
      </li>
    </ul>

    <transition name="toast">
      <div
        v-if="showToast"
        class="fixed top-5 right-5 z-[99999] bg-white text-black px-4 py-3 rounded-md border border-gray-300 shadow-lg pointer-events-auto"
      >
        Note deleted successfully!
      </div>
    </transition>
  </div>
</template>

<style scoped>
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(-5px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fadeIn {
  animation: fadeIn 0.2s ease-out;
}
</style>

<script setup>
import { computed, ref, onMounted, watch } from "vue";
import { useNotesStore } from "../store/note.ts"; 
import { useRouter } from "vue-router";

const store = useNotesStore();
const router = useRouter();
const showToast = ref(false);
const searchQuery = ref("");
const sortBy = ref("newest");
const isDropdownOpen = ref(false);

onMounted(() => {
  fetchFilteredNotes();
});

const fetchFilteredNotes = async () => {
  await store.fetchFilteredNotes(searchQuery.value, sortBy.value);
};

watch([searchQuery, sortBy], fetchFilteredNotes);

const options = [
  { value: "newest", label: "Newest First" },
  { value: "oldest", label: "Oldest First" },
];

const selectedOptionLabel = computed(() => {
  return options.find((option) => option.value === sortBy.value)?.label || "";
});

const toggleDropdown = () => {
  isDropdownOpen.value = !isDropdownOpen.value;
};

const selectOption = (value) => {
  sortBy.value = value;
  isDropdownOpen.value = false;
};

const notes = computed(() => store.notes);

const selectNote = (id) => {
  if (!id) return;
  router.push(`/note/${id}`);
};

const editNote = (id) => {
  router.push(`/edit/${id}`);
};

const deleteNote = async (id) => {
  await store.deleteNote(id);
  showToast.value = true;
  setTimeout(() => {
    showToast.value = false;
  }, 2000);
};

const formatDate = (timestamp) => {
  return new Date(timestamp).toLocaleString();
};
</script>
