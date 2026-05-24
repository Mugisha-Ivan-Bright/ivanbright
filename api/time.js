export default function handler(_req, res) {
  res.json({ timestamp: Date.now() })
}
