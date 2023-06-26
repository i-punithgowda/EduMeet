const express = require("express");
const app = express();
const http = require("http").createServer(app);
const io = require("socket.io")(http);
const PORT = process.env.SOCKET_PORT || 5001;
const path = require("path");

let socketList = {};
const roomData = [];
const pollResults = [];

app.use(express.static(path.join(__dirname, "public")));

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../client/build")));

  app.get("/*", function (req, res) {
    res.sendFile(path.join(__dirname, "../client/build/index.html"));
  });
}

// Route
app.get("/ping", (req, res) => {
  res
    .send({
      success: true,
    })
    .status(200);
});

// Socket
io.on("connection", (socket) => {
  console.log(`New User connected: ${socket.id}`);

  socket.on("disconnect", () => {
    socket.disconnect();
    console.log("User disconnected!");
  });

  socket.on("BE-check-user", ({ roomId, userName }) => {
    let error = false;

    io.sockets.in(roomId).clients((err, clients) => {
      clients.forEach((client) => {
        if (socketList[client] == userName) {
          error = true;
        }
      });
      socket.emit("FE-error-user-exist", { error });
    });
  });

  /**
   * Join Room
   */

  socket.on("BE-join-room", ({ roomId, userName, firstName, type }) => {
    // Socket Join RoomName

    socket.join(roomId);

    // console.log("NEW USER JOINED ROOM " + roomId + " his ID :  " + userName);

    const userExists = roomData.some((room) => room.userName === userName);

    if (!userExists) {
      // Push roomId and userName only if userName doesn't exist
      roomData.push({
        roomId: roomId,
        userName: userName,
      });
    }

    socketList[socket.id] = {
      userName,
      video: true,
      audio: true,
      firstName,
      type,
    };

    // Set User List
    io.sockets.in(roomId).clients((err, clients) => {
      try {
        const users = [];
        clients.forEach((client) => {
          console.log(client);
          // Add User List
          users.push({ userId: client, info: socketList[client] });
        });
        socket.broadcast.to(roomId).emit("FE-user-join", users);
        // io.sockets.in(roomId).emit('FE-user-join', users);
      } catch (e) {
        io.sockets.in(roomId).emit("FE-error-user-exist", { err: true });
      }
    });
  });

  socket.on("BE-call-user", ({ userToCall, from, signal }) => {
    io.to(userToCall).emit("FE-receive-call", {
      signal,
      from,
      info: socketList[socket.id],
    });
  });

  socket.on("BE-accept-call", ({ signal, to }) => {
    io.to(to).emit("FE-call-accepted", {
      signal,
      answerId: socket.id,
    });
  });

  socket.on("BE-send-message", ({ roomId, msg, sender, firstName }) => {
    console.log(firstName);
    io.sockets
      .in(roomId)
      .emit("FE-receive-message", { msg, sender, firstName });
  });

  socket.on("BE-leave-room", ({ roomId, leaver }) => {
    delete socketList[socket.id];
    socket.broadcast
      .to(roomId)
      .emit("FE-user-leave", { userId: socket.id, userName: [socket.id] });
    io.sockets.sockets[socket.id].leave(roomId);
  });

  socket.on("end-stream", ({ roomId }) => {
    console.log("end - stream - recieved ");
    console.log("stream-ended-event emitted to room" + roomId);
    io.sockets.in(roomId).emit("stream-ended");
  });

  socket.on(
    "create-poll",
    ({ roomId, currentQuestion, pollOptions, questionID }) => {
      console.log("create - poll - recieved ");
      console.log(`${roomId}-${currentQuestion}-${pollOptions}-${questionID}`);
      io.sockets.in(roomId).emit("poll-recieved", {
        questionID: questionID,
        currentQuestion: currentQuestion,
        pollOptions: pollOptions,
      });
    }
  );

  socket.on(
    "poll-submit",
    ({ roomId, currentUser, selectedPollOption, questionID, question }) => {
      pollResults.push({
        roomId: roomId,
        questionID: questionID,
        selectedPollOption: selectedPollOption,
        question: question,
      });
    }
  );

  socket.on("get-poll-questions", ({ roomId }) => {
    console.log("request received");
    const uniqueQuestions = [];

    pollResults.forEach((poll) => {
      if (
        poll.roomId === roomId &&
        !uniqueQuestions.some((q) => q.questionID === poll.questionID)
      ) {
        uniqueQuestions.push({
          roomId: poll.roomId,
          questionID: poll.questionID,
          selectedPollOption: poll.selectedPollOption,
          question: poll.question,
        });
      }
    });

    console.log(uniqueQuestions);
    io.sockets.in(roomId).emit("poll-questions", uniqueQuestions);
  });

  socket.on("get-poll-results", ({ roomId, questionID }) => {
    const uniqueQuestions = {};

    pollResults.forEach((result) => {
      if (result.roomId === roomId && result.questionID === questionID) {
        const questionKey = `${result.questionID}_${result.question}`;
        if (!uniqueQuestions[questionKey]) {
          uniqueQuestions[questionKey] = {
            questionID: result.questionID,
            question: result.question,
            options: {},
          };
        }
        const optionKey = `${result.selectedPollOption}`;
        if (!uniqueQuestions[questionKey].options[optionKey]) {
          uniqueQuestions[questionKey].options[optionKey] = 1;
        } else {
          uniqueQuestions[questionKey].options[optionKey]++;
        }
      }
    });

    const results = Object.values(uniqueQuestions);

    io.sockets.in(roomId).emit("poll-results", results);
  });

  socket.on("get-all-users", ({ roomId }) => {
    const filteredData = roomData.filter((room) => {
      return room.roomId == roomId;
    });

    console.log(filteredData);
    io.sockets.in(roomId).emit("all-users", filteredData);
  });

  socket.on("BE-toggle-camera-audio", ({ roomId, switchTarget }) => {
    if (switchTarget === "video") {
      socketList[socket.id].video = !socketList[socket.id].video;
    } else {
      socketList[socket.id].audio = !socketList[socket.id].audio;
    }
    socket.broadcast
      .to(roomId)
      .emit("FE-toggle-camera", { userId: socket.id, switchTarget });
  });
});

http.listen(PORT, () => {
  console.log("Connected : " + PORT);
});
