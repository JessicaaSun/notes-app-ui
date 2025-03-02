import { defineStore } from "pinia";
import axios from "axios";

interface Note {
  id: number;
  title: string;
  content: string;
  createdAt: number;
  updatedAt: number | null;
}

interface NotesState {
  notes: Note[];
}

const API_URL = "http://localhost:5018/api/note";

export const useNotesStore = defineStore("notes", {
  state: (): NotesState => ({
    notes: [],
  }),

  actions: {
    async fetchFilteredNotes(title = "", sortOrder = "newest") {
      try {
        const response = await axios.get<Note[]>(API_URL, {
          params: { title, sortOrder },
        });
        this.notes = response.data;
        this.sortOrder = sortOrder;
        this.sortNotes();
      } catch (error) {
        console.error("Error fetching filtered notes:", error);
      }
    },
    async getNoteById(id: number): Promise<Note | null> {
      try {
        const response = await axios.get<Note>(`${API_URL}/${id}`);
        return response.data;
      } catch (error) {
        console.error(`Error fetching note with ID ${id}:`, error);
        return null;
      }
    },
    sortNotes() {
      this.notes.sort((a: Note, b: Note) => {
        return this.sortOrder === "newest"
          ? b.createdAt - a.createdAt
          : a.createdAt - b.createdAt;
      });
    },
    async addNote(note: Omit<Note, "id" | "createdAt" | "updatedAt">) {
      try {
        const response = await axios.post<Note>(API_URL, note);
        this.notes.push(response.data); 
        this.sortNotes();
      } catch (error) {
        console.error("Error adding note:", error);
      }
    },

    async updateNote(
      id: number,
      updatedNote: Partial<Omit<Note, "id" | "createdAt">>
    ) {
      try {
        const response = await axios.put<Note>(`${API_URL}/${id}`, updatedNote);
        const index = this.notes.findIndex((n: Note) => n.id === id);
        if (index !== -1) this.notes[index] = response.data;
      } catch (error) {
        console.error(`Error updating note with ID ${id}:`, error);
      }
    },

    async deleteNote(id: number) {
      try {
        await axios.delete(`${API_URL}/${id}`);
        this.notes = this.notes.filter((note) => note.id !== id);
      } catch (error) {
        console.error(`Error deleting note with ID ${id}:`, error);
      }
    },
  },
});
