function startBackend() {
  return 'Backend workspace ready';
}

if (process.env.NODE_ENV !== 'test') {
  console.log(startBackend());
}

module.exports = { startBackend };
