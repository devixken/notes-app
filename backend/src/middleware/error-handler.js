export function notFound(req, res) {
  res.status(404).json({ error: "Not found" });
}

// Express recognises an error handler by its 4 arguments, so `next` must stay
export function errorHandler(err, req, res, next) {
  if (res.headersSent) {
    return next(err);
  }

  if (err.type === "entity.parse.failed") {
    return res.status(400).json({ error: "Malformed JSON" });
  }

  if (err.expose) {
    return res.status(err.status).json({ error: err.message });
  }

  console.error(err);
  return res.status(500).json({ error: "Internal server error" });
}
