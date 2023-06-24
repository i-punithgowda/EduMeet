const Stream = require("../model/Streaming");
const fs = require("fs");

const VideoHandler = {
  setStreamingStatus: async (req, res) => {
    try {
      const { hostID, roomID, status } = req.body;
      const data = await Stream.setStreamingStatus(hostID, roomID, status);
      res.send(data);
    } catch (err) {
      res.send("Something went wrong!");
    }
  },

  updateStreamingStatus: async (req, res) => {
    try {
      const { hostID } = req.body;
      const data = await Stream.updateStreamingStatus(hostID);
      console.log(data);
      res.send(data);
    } catch (err) {
      res.send("Something went wrong!!");
    }
  },

  saveStreamDetails: async (req, res) => {
    try {
      const { title, description, host_id } = req.body;
      const data = await Stream.saveStreamDetails(title, description, host_id);
      res.send(data);
    } catch (err) {
      console.log(err);
      res.send("Something went wrong!!");
    }
  },

  endStream: async (req, res) => {
    try {
      const { id, video_url } = req.body;
      const data = await Stream.endStream(id, video_url);
      res.send(data);
    } catch (err) {
      console.log(err);
      res.send("Something went wrong!!");
    }
  },

  getCurrentStreamingStatusofHost: async (req, res) => {
    try {
      const { email } = req.params;
      const data = await Stream.getCurrentStreamingStatusofHost(email);
      res.send(data);
    } catch (err) {
      res.send("Something went wrong!!");
    }
  },

  getCurrentStreamingStatusforGuest: async (req, res) => {
    try {
      const { email } = req.params;
      //console.log("asf", email);
      const data = await Stream.getCurrentStreamingStatusforGuest(email);
      res.send(data);
    } catch (err) {
      res.send("Something went wrong!!");
    }
  },

  getHostRoomIDByStreamId: async (req, res) => {
    try {
      const { streamID } = req.params;
      const data = await Stream.getHostRoomIDByStreamId(streamID);
      res.send(data);
    } catch (err) {
      res.send("Something went wrong!!");
    }
  },

  saveAttendance: async (req, res) => {
    try {
      const { users, streamID } = req.body;
      const data = await Stream.saveAttendance(users, streamID);
      res.send(data);
    } catch (err) {
      console.log(err);
      res.send("Something went wrong!!");
    }
  },

  saveSchedule: async (req, res) => {
    try {
      const { fromDate, toDate, host_id, room_id, meeting_name } = req.body;
      const data = await Stream.saveSchedule(
        fromDate,
        toDate,
        host_id,
        room_id,
        meeting_name
      );
      //console.log(data);
      res.status(200).send(data);
    } catch (err) {
      //console.log(err);
      res.status(500).send(err);
    }
  },

  getEventList: async (req, res) => {
    try {
      const { roomID } = req.params;
      const data = await Stream.getEventList(roomID);
      res.status(200).send(data);
    } catch (err) {
      console.log(err);
      res.send("Something went wrong!!");
    }
  },

  getAttendanceHost: async (req, res) => {
    try {
      const { hostID } = req.params;
      const data = await Stream.getAttendanceHost(hostID);
      res.status(200).send(data);
    } catch (err) {
      console.log(err);
      res.send("Something went wrong!!");
    }
  },

  getAttendanceGuest: async (req, res) => {
    try {
      const { guestID } = req.params;
      const data = await Stream.getAttendanceGuest(guestID);
      res.status(200).send(data);
    } catch (err) {
      console.log(err);
      res.send("Something went wrong!!");
    }
  },

  getVideoHost: async (req, res) => {
    try {
      const { hostID } = req.params;
      const data = await Stream.getVideoHost(hostID);
      res.status(200).send(data);
    } catch (err) {
      console.log(err);
      res.send("Something went wrong!!");
    }
  },

  getVideoGuest: async (req, res) => {
    try {
      const { guestID } = req.params;
      const data = await Stream.getVideoGuest(guestID);
      res.status(200).send(data);
    } catch (err) {
      console.log(err);
      res.send("Something went wrong!!");
    }
  },

  getSpecificVideo: async (req, res) => {
    try {
      const { streamID } = req.params;
      const data = await Stream.getSpecificVideo(streamID);
      res.status(200).send(data);
    } catch (err) {
      console.log(err);
      res.send("Something went wrong!!");
    }
  },

  saveComments: async (req, res) => {
    try {
      const obj = req.body;
      const data = await Stream.SaveComments(obj);
      res.status(200).send(data);
    } catch (err) {
      res.send(err);
    }
  },

  saveReply: async (req, res) => {
    try {
      const obj = req.body;
      const data = await Stream.SaveReplies(obj);
      res.status(200).send(data);
    } catch (err) {
      res.send(err);
    }
  },

  getCommentsAndReplies: async (req, res) => {
    try {
      const { streamID } = req.params;
      //console.log(streamID);
      const data = await Stream.getCommentsAndReplies(streamID);
      res.status(200).send(data);
    } catch (err) {
      res.send(err);
    }
  },
};

module.exports = VideoHandler;
