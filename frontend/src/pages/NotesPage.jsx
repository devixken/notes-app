import { useEffect, useState } from "react";
import {
  Alert,
  AppShell,
  Button,
  Center,
  Container,
  Group,
  Loader,
  SimpleGrid,
  Text,
  Title,
} from "@mantine/core";
import { notifications } from "@mantine/notifications";
import * as notesApi from "../api/notes.js";
import { useAuth } from "../auth/auth-context.js";
import { NoteCard } from "../components/NoteCard.jsx";
import { NoteFormModal } from "../components/NoteFormModal.jsx";

export function NotesPage() {
  const { user, logout } = useAuth();
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  // null = modal closed, {} = new note, a note object = editing that note
  const [editing, setEditing] = useState(null);

  useEffect(() => {
    notesApi
      .listNotes()
      .then(setNotes)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  async function handleSave(values) {
    if (editing.id) {
      const updated = await notesApi.updateNote(editing.id, values);
      setNotes((list) => [updated, ...list.filter((n) => n.id !== updated.id)]);
    } else {
      const created = await notesApi.createNote(values);
      setNotes((list) => [created, ...list]);
    }
  }

  async function handleDelete(note) {
    try {
      await notesApi.deleteNote(note.id);
      setNotes((list) => list.filter((n) => n.id !== note.id));
      notifications.show({ message: `Нотатку «${note.title}» видалено` });
    } catch (err) {
      notifications.show({ color: "red", message: err.message });
    }
  }

  return (
    <AppShell header={{ height: 60 }} padding="md">
      <AppShell.Header>
        <Group h="100%" px="md" justify="space-between">
          <Title order={3}>Нотатки</Title>
          <Group>
            <Text size="sm" c="dimmed">
              {user.email}
            </Text>
            <Button variant="default" size="xs" onClick={logout}>
              Вийти
            </Button>
          </Group>
        </Group>
      </AppShell.Header>

      <AppShell.Main>
        <Container size="lg">
          <Group justify="space-between" mb="md">
            <Text c="dimmed">Усього: {notes.length}</Text>
            <Button onClick={() => setEditing({})}>Нова нотатка</Button>
          </Group>

          {error && <Alert color="red">{error}</Alert>}

          {loading ? (
            <Center py="xl">
              <Loader />
            </Center>
          ) : notes.length === 0 ? (
            <Text ta="center" c="dimmed" py="xl">
              Нотаток ще немає. Створи першу.
            </Text>
          ) : (
            <SimpleGrid cols={{ base: 1, sm: 2, lg: 3 }}>
              {notes.map((note) => (
                <NoteCard
                  key={note.id}
                  note={note}
                  onEdit={setEditing}
                  onDelete={handleDelete}
                />
              ))}
            </SimpleGrid>
          )}
        </Container>
      </AppShell.Main>

      {editing && (
        <NoteFormModal
          note={editing.id ? editing : null}
          onClose={() => setEditing(null)}
          onSave={handleSave}
        />
      )}
    </AppShell>
  );
}
