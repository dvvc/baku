const IDS = 26;
const ACTIVITIES = [
  'Prepare',
  'Setup',
  'Welcome Guests',
  'Perform',
  'Oversee',
  'DJ',
  'Tech',
  'Cleanup',
  'Host',
  'Run Event',
  'Cook',
  'Waiter',
  'Lead',
];

const DURATIONS = [30, 60, 120];

const ENTRIES = 100;

const BLOCK_LENGTH = 15;
const DAY_START = 6 * 60;
const DAY_END = 26 * 60 + BLOCK_LENGTH;
const DAY_LENGTH = DAY_END - DAY_START;
const BLOCKS_IN_DAY = DAY_LENGTH / BLOCK_LENGTH;

function choice(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function pad(n, len) {
  let s = String(n);
  while (s.length < len) {
    s = '0' + s;
  }
  return s;
}

function generateId(max) {
  return pad(Math.floor(Math.random() * max) + 1, 3);
}

function minutesToTime(mins) {
  let hour = Math.floor(mins / 60) % 24;
  let minute = mins % 60;

  return { hour, minute };
}

function generateTime(durations) {
  let duration = choice(durations);
  let startBlock = Math.floor(Math.random() * BLOCKS_IN_DAY);
  let startMinutes = DAY_START + startBlock * BLOCK_LENGTH;
  return { start: minutesToTime(startMinutes), duration };
}

let schedule = {};
let all = [];

function timeToMinutes(t) {
  return (t.hour * 60 + t.minute - DAY_START + 24 * 60) % (24 * 60);
}

function validateEntry(entry, schedule) {
  let existing = schedule[entry.id] || [];
  // console.log(entry, schedule);
  for (let s of existing) {
    let candidateStart = timeToMinutes(entry.start);
    let candidateEnd = candidateStart + entry.duration;
    let existingStart = timeToMinutes(s.start);
    let existingEnd = existingStart + s.duration;

    if (!(candidateEnd <= existingStart || candidateStart >= existingEnd)) return false;
  }

  return true;
}

function generate() {
  for (let i = 0; i < ENTRIES; i++) {
    let valid = false;
    let entry;
    while (!valid) {
      let id = generateId(IDS);
      let time = generateTime(DURATIONS);
      let activity = choice(ACTIVITIES);

      entry = { id, ...time, activity };

      valid = validateEntry(entry, schedule);
    }

    if (!schedule[entry.id]) {
      schedule[entry.id] = [];
    }

    schedule[entry.id].push(entry);
    all.push(entry);
  }

  console.log(JSON.stringify({ schedules: all }, null, 2));

  /* Object.keys(schedule).forEach(id => {
   *   console.log(`=== ${id} ===`);
   *   schedule[id]
   *     .sort((x, y) => timeToMinutes(x.start) - timeToMinutes(y.start))
   *     .forEach(sch => {
   *       let start = `${pad(sch.start.hour, 2)}:${pad(sch.start.minute, 2)}`;
   *       let endTime = minutesToTime(timeToMinutes(sch.start) + DAY_START + sch.duration);
   *       let end = `${pad(endTime.hour, 2)}:${pad(endTime.minute, 2)}`;
   *       console.log(`${start} - ${end} -- ${sch.activity}`);
   *     });
   * }); */
}

generate();

module.export = generate;
