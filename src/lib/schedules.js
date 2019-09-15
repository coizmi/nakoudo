const { CronJob } = require("cron");

class Schedules {
  constructor() {
    this.jobs = {};
  }

  set(roomId, config, action) {
    const registered = this.jobs[roomId];

    if (registered) {
      registered.stop();
    }

    if (!config.cron) {
      return;
    }

    const job = new CronJob(config.schedule, action);

    this.jobs[roomId] = job;
    job.start();
  }
}

module.exports = new Schedules();
