const apiclient = require("./apiclient");
const Config = require("./config");
const group = require("./group");
const schedules = require("./schedules");
const shuffle = require("./shuffle");

class Nakoudo {
  constructor(robot) {
    this.robot = robot;
  }

  setup() {
    this.robot.respond(/run/i, async message => {
      const roomId = message.envelope.user.roomID;

      await apiclient.login();
      const roomInfo = await apiclient.fetchRoomInfo(roomId);

      const config = new Config(roomInfo.description);
      const members = await apiclient.fetchMembers(roomId, roomInfo.t);
      this.announce(roomId, members, config);
    });

    this.robot.respond(/config/i, async message => {
      const roomId = message.envelope.user.roomID;

      await apiclient.login();
      const roomInfo = await apiclient.fetchRoomInfo(roomId);
      const config = new Config(roomInfo.description);
      this.robot.send({ room: roomId }, "```" + config.toString() + "```");

      this.configure(roomId, roomInfo.t, config);
    });

    this.configureAll();
  }

  async configureAll() {
    await apiclient.login();
    const rooms = await apiclient.fetchRooms();

    for (const room of rooms) {
      if (room.t !== "c" && room.t !== "p") {
        continue;
      }

      const roomInfo = await apiclient.fetchRoomInfo(room._id);
      const config = new Config(roomInfo.description);
      this.configure(room._id, roomInfo.t, config);
    }
  }

  configure(roomId, roomType, config) {
    schedules.set(roomId, config, async () => {
      await apiclient.login();
      const members = await apiclient.fetchMembers(roomId, roomType);
      this.announce(roomId, members, config);
    });
  }

  announce(roomId, members, config) {
    shuffle(members);
    const groups = group(members, config.size);
    const memberLists = this.toString(groups, config.mention);
    const messages = memberLists.map((memberList, i) => {
      const groupNo = i + 1;
      return config.template
        .replace("${groupNo}", groupNo)
        .replace("${members}", memberList);
    });
    messages.forEach(message => this.robot.send({ room: roomId }, message));
  }

  toString(groups, mention) {
    return groups.map(members => {
      return members
        .map(member => (mention ? `@${member.username}` : member.username))
        .join(" ");
    });
  }
}

module.exports = Nakoudo;
