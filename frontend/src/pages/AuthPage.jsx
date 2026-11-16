import { useState } from "react";
import { Link, Navigate, useNavigate } from "react-router";
import {
  Alert,
  Anchor,
  Button,
  Container,
  Paper,
  PasswordInput,
  Stack,
  Text,
  TextInput,
  Title,
} from "@mantine/core";
import { useAuth } from "../auth/auth-context.js";

const TEXT = {
  login: {
    title: "Вхід",
    submit: "Увійти",
    switchText: "Ще немає акаунта?",
    switchLink: "Зареєструватися",
    switchTo: "/register",
  },
  register: {
    title: "Реєстрація",
    submit: "Створити акаунт",
    switchText: "Вже є акаунт?",
    switchLink: "Увійти",
    switchTo: "/login",
  },
};

export function AuthPage({ mode }) {
  const { user, login, register } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const text = TEXT[mode];

  if (user) return <Navigate to="/" replace />;

  async function handleSubmit(event) {
    event.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      await (mode === "login" ? login : register)({ email, password });
      navigate("/", { replace: true });
    } catch (err) {
      setError(err);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Container size={420} py={80}>
      <Title ta="center" mb="lg">
        {text.title}
      </Title>
      <Paper withBorder shadow="sm" p="xl" radius="md">
        <form onSubmit={handleSubmit}>
          <Stack>
            {error && (
              <Alert color="red" title={error.message}>
                {error.details.map((d) => (
                  <div key={d.field}>
                    {d.field}: {d.message}
                  </div>
                ))}
              </Alert>
            )}
            <TextInput
              label="Email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.currentTarget.value)}
            />
            <PasswordInput
              label="Пароль"
              description={mode === "register" ? "Від 8 до 72 символів" : undefined}
              required
              value={password}
              onChange={(e) => setPassword(e.currentTarget.value)}
            />
            <Button type="submit" loading={submitting} fullWidth>
              {text.submit}
            </Button>
          </Stack>
        </form>
      </Paper>
      <Text ta="center" mt="md" size="sm">
        {text.switchText}{" "}
        <Anchor component={Link} to={text.switchTo}>
          {text.switchLink}
        </Anchor>
      </Text>
    </Container>
  );
}
