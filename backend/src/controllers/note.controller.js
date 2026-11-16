import {
  listNotes,
  createNote,
  getNote,
  updateNote,
  deleteNote,
} from "../services/note.service.js";

export async function list(req, res) {
  const notes = await listNotes(req.userId);
  res.json(notes);
}

export async function create(req, res) {
  const note = await createNote(req.userId, req.body);
  res.status(201).json(note);
}

export async function getOne(req, res) {
  const note = await getNote(req.userId, req.params.id);
  res.json(note);
}

export async function update(req, res) {
  const note = await updateNote(req.userId, req.params.id, req.body);
  res.json(note);
}

export async function remove(req, res) {
  await deleteNote(req.userId, req.params.id);
  res.status(204).end();
}
