import { useState } from "react";
import { Alert, Button, Group, Modal, Stack, Textarea, TextInput } from "@mantine/core";

export function NoteFormModal({ note, onClose, onSave }) {
  const [title, setTitle] = useState(note?.title ?? "");
  const [content, setContent] = useState(note?.content ?? "");
  const [error, setError] = useState(null);
  const [saving, setSaving] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setError(null);
    setSaving(true);
    try {
      await onSave({ title, content });
      onClose();
    } catch (err) {
      setError(err.message);
      setSaving(false);
    }
  }

  return (
    <Modal opened onClose={onClose} title={note ? "Редагувати нотатку" : "Нова нотатка"}>
      <form onSubmit={handleSubmit}>
        <Stack>
          {error && <Alert color="red">{error}</Alert>}
          <TextInput
            label="Заголовок"
            required
            maxLength={200}
            data-autofocus
            value={title}
            onChange={(e) => setTitle(e.currentTarget.value)}
          />
          <Textarea
            label="Текст"
            autosize
            minRows={4}
            maxLength={10000}
            value={content}
            onChange={(e) => setContent(e.currentTarget.value)}
          />
          <Group justify="flex-end">
            <Button variant="default" onClick={onClose}>
              Скасувати
            </Button>
            <Button type="submit" loading={saving}>
              Зберегти
            </Button>
          </Group>
        </Stack>
      </form>
    </Modal>
  );
}
