const YAML = require("yaml");

class Config {
  constructor(description) {
    const { cron, schedule, size, mention, template } = description
      ? YAML.parse(description)
      : {};

    this.cron = cron ? cron : false;
    this.schedule = schedule ? schedule : null;
    this.size = size ? size : 3;
    this.mention = mention ? mention : false;
    this.template = template ? template : "Group${groupNo}: ${members}";
  }

  toString() {
    return (
      `cron: ${this.cron} \n` +
      `schedule: ${this.schedule} \n` +
      `size: ${this.size} \n` +
      `mention: ${this.mention} \n` +
      `template: ${this.template}`
    );
  }
}

module.exports = Config;
