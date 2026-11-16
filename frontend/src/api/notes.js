import { request } from "./client.js";

export const listNotes = () => request("/notes");
export const createNote = (note) =>
  request("/notes", { method: "POST", body: note });
export const updateNote = (id, changes) =>
  request(`/notes/${id}`, { method: "PATCH", body: changes });
export const deleteNote = (id) => request(`/notes/${id}`, { method: "DELETE" });
