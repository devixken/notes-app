import { Button, Card, Group, Text, Title } from "@mantine/core";

export function NoteCard({ note, onEdit, onDelete }) {
  return (
    <Card withBorder shadow="xs" radius="md" padding="lg">
      <Title order={4} lineClamp={1}>
        {note.title}
      </Title>
      <Text size="sm" c="dimmed" mt={4}>
        {new Date(note.updatedAt).toLocaleString("uk-UA")}
      </Text>
      <Text mt="sm" lineClamp={4} style={{ whiteSpace: "pre-wrap" }}>
        {note.content}
      </Text>
      <Group mt="md" gap="xs">
        <Button variant="light" size="xs" onClick={() => onEdit(note)}>
          Редагувати
        </Button>
        <Button variant="subtle" color="red" size="xs" onClick={() => onDelete(note)}>
          Видалити
        </Button>
      </Group>
    </Card>
  );
}
