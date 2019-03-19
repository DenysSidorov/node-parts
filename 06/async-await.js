/*
lock
write
unlock
*/

async function lock() {}
async function write() {}
async function unlock() {}

await lock().catch(err => {});
await write().catch(err => {});
await unlock().catch(err => {});

// try {
//   await lock();
// } catch (err) {}
//
// try {
//   await write();
// } catch(err) {}
//
// try {
//   await unlock();
// } catch (err) {}

// lock()
//   .catch(err => {})
//   .then(() => write())
//   .catch(err => {})
//   .then(() => unlock())
//   .catch(err => {});
