const express = require('express');
const app = express();
const cors = require('cors');
const PORT = getPort(process.env.PORT);

const staff = require('./staff.json');
const schedule = require('./schedule.json');

app.use(cors());
function getPort(port) {
  if (!port) return 3000;
  let p = parseInt(port);
  if (Number.isNaN(p)) throw new Error(`Invalid port ${port}`);
  return p;
}

app.get('/staff', (req, res) => res.json(staff));
app.get('/schedule', (req, res) => res.json(schedule));

// Catch not found routes
app.use((req, res) => res.status(404).send({ msg: `Path ${req.path} not found` }));

app.listen(PORT, () => console.log(`Server listening on port ${PORT}`));
