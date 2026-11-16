import { isValidObjectId } from "mongoose";
import { Note } from "../models/note.model.js";
import { httpError } from "../utils/http-error.js";

function toPublicNote(note) {
  return {
    id: note.id,
    title: note.title,
    content: note.content,
    createdAt: note.createdAt,
    updatedAt: note.updatedAt,
  };
}

// Someone else's note and a missing note get the same 404,
// so ids of other users' notes cannot be probed
function notFound() {
  return httpError(404, "Note not found");
}

export async function listNotes(userId) {
  const notes = await Note.find({ owner: userId }).sort({ updatedAt: -1 });
  return notes.map(toPublicNote);
}

export async function createNote(userId, { title, content }) {
  const note = await Note.create({ owner: userId, title, content });
  return toPublicNote(note);
}

export async function getNote(userId, noteId) {
  if (!isValidObjectId(noteId)) throw notFound();
  const note = await Note.findOne({ _id: noteId, owner: userId });
  if (!note) throw notFound();
  return toPublicNote(note);
}

export async function updateNote(userId, noteId, changes) {
  if (!isValidObjectId(noteId)) throw notFound();
  const note = await Note.findOneAndUpdate(
    { _id: noteId, owner: userId },
    changes,
    { returnDocument: "after", runValidators: true },
  );
  if (!note) throw notFound();
  return toPublicNote(note);
}

export async function deleteNote(userId, noteId) {
  if (!isValidObjectId(noteId)) throw notFound();
  const note = await Note.findOneAndDelete({ _id: noteId, owner: userId });
  if (!note) throw notFound();
}
