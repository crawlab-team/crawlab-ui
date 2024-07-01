import chalk from 'chalk';

export function log(msg, type = 'info') {
  const colors = {
    info: 'blue',
    warn: 'yellow',
    error: 'red',
    success: 'green',
  };

  // datetime
  const now = new Date();
  const time = now.toTimeString().split(' ')[0];
  const datetime = `${now.toDateString()} ${time}`;

  const memUsed = (process.memoryUsage().heapUsed / 1024 / 1024).toFixed(1);

  console.log(chalk[colors[type]](`[${datetime}] ${msg} | mem: ${memUsed}mb`));
}
