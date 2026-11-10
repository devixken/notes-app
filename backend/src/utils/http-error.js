export function httpError(status, message) {
  const error = new Error(message);
  error.status = status;
  error.expose = status < 500;
  return error;
}
