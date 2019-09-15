const fetch = require("node-fetch");
const querystring = require("querystring");

const url = process.env.ROCKETCHAT_URL + "/api/v1";
const user = process.env.ROCKETCHAT_USER;
const password = process.env.ROCKETCHAT_PASSWORD;

class ApiClient {
  constructor(url, user, password) {
    this.url = url;
    this.user = user;
    this.password = password;
  }

  async login() {
    const endpoint = `/login`;
    const body = JSON.stringify({ user, password });
    const headers = {
      Accept: "application/json",
      "Content-Type": "application/json"
    };

    const res = await fetch(`${this.url}${endpoint}`, {
      method: "POST",
      headers,
      body
    });
    const { data } = await res.json();

    this.auth = {
      userId: data.userId,
      token: data.authToken
    };

    return this;
  }

  async fetchRooms() {
    const result = await this.get(`/rooms.get`);
    return result.update;
  }

  async fetchRoomInfo(roomId) {
    const result = await this.get(`/rooms.info`, { roomId });
    return result.room;
  }

  async fetchMembers(roomId, roomType) {
    let members = [];

    if (roomType === "c") {
      members = await this.fetchChannelMembers(roomId);
    }

    if (roomType === "p") {
      members = await this.fetchGroupMembers(roomId);
    }

    return members.filter(member => member.username !== this.user);
  }

  async fetchChannelMembers(roomId) {
    const result = await this.get(`/channels.members`, { roomId });
    return result.members;
  }

  async fetchGroupMembers(roomId) {
    const result = await this.get(`/groups.members`, { roomId });
    return result.members;
  }

  async get(endpoint, params) {
    let url = `${this.url}${endpoint}`;
    if (params) {
      const query = querystring.stringify(params);
      url += `?${query}`;
    }
    const res = await fetch(url, {
      method: "GET",
      headers: {
        "X-User-Id": this.auth.userId,
        "X-Auth-Token": this.auth.token
      }
    });

    return res.json();
  }
}

const client = new ApiClient(url, user, password);

module.exports = client;
