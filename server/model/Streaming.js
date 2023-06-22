const db = require("../db/db");
const uuid = require("uuid");
const dateGenerator = require("../utils/DateGenerator");
const e = require("express");

const Stream = {};

Stream.setStreamingStatus = (hostID, roomID, status) => {
  return new Promise((resolve, reject) => {
    db.query(
      `insert into  StreamingStatus (host_id,room_id,status) values ('${hostID}','${roomID}','${status}')`,
      (err, results) => {
        if (err) {
          resolve({ status: false });
          console.log(err);
        } else {
          resolve({ status: true });
        }
      }
    );
  });
};

Stream.updateStreamingStatus = (hostID) => {
  console.log(hostID);
  return new Promise((resolve, reject) => {
    db.query(
      `UPDATE StreamingStatus
        SET status = 'false'
        WHERE host_id = '${hostID}' AND status='true';
        `,
      (err, results) => {
        if (err) {
          resolve({ status: false });
          console.log(err);
        } else {
          resolve({ status: true });
        }
      }
    );
  });
};

Stream.saveStreamDetails = (title, description, host_id) => {
  const id = uuid.v4();
  const date = dateGenerator();
  const timeStamp = new Date().getTime();
  return new Promise((resolve, reject) => {
    db.query(
      `insert into  Video_Stream (id,title, description, start_time, host_id,date) 
      values ('${id}','${title}','${description}','${timeStamp}','${host_id}','${date}')`,
      (err, results) => {
        if (err) {
          resolve({ status: false });
          console.log(err);
        } else {
          resolve({ status: true, id: id });
        }
      }
    );
  });
};

Stream.endStream = (id, video_url) => {
  const timeStamp = new Date().getTime();
  return new Promise((resolve, reject) => {
    db.query(
      `update  Video_Stream set end_time='${timeStamp}' , video_url='${video_url}' where id='${id}'`,
      (err, results) => {
        if (err) {
          resolve({ status: false });
          console.log(err);
        } else {
          resolve({ status: true });
        }
      }
    );
  });
};

Stream.getCurrentStreamingStatusofHost = (email) => {
  return new Promise((resolve, reject) => {
    db.query(`select * from User where email='${email}'`, (err, results) => {
      if (err || results.length <= 0) {
        resolve({ status: "Invalid emailID" });
      } else {
        db.query(
          `SELECT status,room_id
          FROM StreamingStatus
          WHERE host_id = '${results[0].id}'
          ORDER BY id DESC
          LIMIT 1;
          `,
          (error, data) => {
            if (error) {
              console.log(error);
            } else {
              console.log(data[0]);
              resolve(data[0]);
            }
          }
        );
      }
    });
  });
};

Stream.getCurrentStreamingStatusforGuest = (email) => {
  return new Promise((resolve, reject) => {
    db.query(
      `select college_id, department_id from User where email='${email}'`,
      (err, results) => {
        if (err || results.length <= 0) {
          resolve({ status: "Invalid emailID" });
        } else {
          db.query(
            `SELECT  S.status, S.room_id FROM User AS U INNER JOIN StreamingStatus AS S ON U.id = S.host_id
            INNER JOIN Department AS D ON S.room_id = D.room_id WHERE U.type = 'Host'
            AND U.college_id = '${results[0].college_id}'
            AND U.department_id = '${results[0].department_id}'
            AND S.status = 'true';
          `,
            (error, data) => {
              if (error) {
                console.log(error);
              } else {
                console.log(data);
                if (data.length > 0) {
                  resolve(data[0]);
                } else {
                  resolve({ status: false });
                }
              }
            }
          );
        }
      }
    );
  });
};

Stream.getHostRoomIDByStreamId = (streamID) => {
  return new Promise((resolve, reject) => {
    db.query(
      `select host_id from Video_Stream where id='${streamID}'`,
      (err, results) => {
        if (err || results.length <= 0) {
          resolve({ status: "Invalid Stream ID" });
        } else {
          console.log(results);
          db.query(
            `SELECT d.room_id FROM User u JOIN Department d ON u.department_id = d.id
WHERE u.id = '${results[0].host_id}'`,
            (err, result) => {
              if (err || results.length <= 0) {
                resolve({ status: "Invalid hostID" });
              } else {
                resolve({
                  host_id: results[0].host_id,
                  room_id: result[0].room_id,
                });
              }
            }
          );
        }
      }
    );
  });
};

Stream.saveAttendance = (users, streamID) => {
  return new Promise((resolve, reject) => {
    users.forEach((user) => {
      const id = uuid.v4();
      db.query(
        `insert into Attendance (id,user_id,stream_id) values ('${id}','${user.userID}','${streamID}')`,
        (err, results) => {
          if (err) {
            console.log(err);
            resolve({
              status: false,
              message: "Error while saving attendance",
            });
          }
        }
      );
    });
    resolve({ status: true, message: "Attendance Data Stored!!" });
  });
};

Stream.saveSchedule = (fromDate, toDate, host_id, room_id, meeting_name) => {
  return new Promise((resolve, reject) => {
    const date = fromDate.formattedDate;
    const fromTime = fromDate.formattedTime;
    const toTime = toDate.formattedTime;

    db.query(
      `SELECT * FROM ClassSchedule WHERE class_date = '${date}' AND room_id = '${room_id}'`,
      (err, results) => {
        if (err) {
          console.log(err);
          reject({ status: err, message: "Database error" });
        } else {
          const conflictingSchedule = results.find((row) => {
            const existingTimeFrom = row.time_from;
            const existingTimeTo = row.time_to;

            return (
              (fromTime >= existingTimeFrom && fromTime < existingTimeTo) ||
              (toTime > existingTimeFrom && toTime <= existingTimeTo) ||
              (fromTime <= existingTimeFrom && toTime >= existingTimeTo)
            );
          });

          if (conflictingSchedule) {
            reject({
              status: true,
              message:
                "Someone else has scheduled a meeting in the selected room at the selected date and time",
            });
          } else {
            db.query(
              `INSERT INTO ClassSchedule (class_date, time_from, time_to, host_id, room_id, meeting_name) VALUES ('${date}','${fromTime}','${toTime}','${host_id}','${room_id}','${meeting_name}')`,
              (err, results) => {
                if (err) {
                  console.log(err);
                  reject({ status: err, message: "Database error" });
                } else {
                  resolve({
                    status: true,
                    message: "Schedule saved successfully",
                  });
                }
              }
            );
          }
        }
      }
    );
  });
};

Stream.getEventList = (roomID) => {
  console.log(roomID);
  return new Promise((resolve, reject) => {
    db.query(
      `select * from ClassSchedule where room_id='${roomID}'`,
      (err, results) => {
        if (err) {
          reject({ status: false, message: "Database error!" });
        } else {
          resolve(results);
        }
      }
    );
  });
};

Stream.getAttendanceHost = (hostID) => {
  return new Promise((resolve, reject) => {
    db.query(
      `SELECT DISTINCT Video_Stream.id AS stream_id, Video_Stream.title AS stream_title, User.id AS attendee_id, User.name AS attendee_name,CASE WHEN Attendance.user_id IS NULL THEN 'Absent' ELSE 'Present' END AS attendance_status FROM User AS Host JOIN Video_Stream ON Host.id = Video_Stream.host_id JOIN User ON User.college_id = Host.college_id AND User.department_id = Host.department_id LEFT JOIN Attendance ON User.id = Attendance.user_id AND Attendance.stream_id = Video_Stream.id WHERE Host.id = '${hostID}' AND User.id <> '${hostID}' ORDER BY Video_Stream.id, User.id;`,
      (err, results) => {
        if (err) {
          reject({ status: false, message: err });
        } else {
          // const groupedData = {};
          // results.forEach((attendance) => {
          //   const {
          //     stream_id,
          //     stream_title,
          //     attendee_id,
          //     attendee_name,
          //     attendance_status,
          //   } = attendance;

          //   if (!groupedData[stream_id]) {
          //     groupedData[stream_id] = {
          //       stream_id,
          //       stream_title,
          //       attendees: [],
          //     };
          //   }

          //   groupedData[stream_id].attendees.push({
          //     attendee_id,
          //     attendee_name,
          //     attendance_status,
          //   });
          // });

          // const groupedAttendanceData = Object.values(groupedData);
          // console.log(groupedAttendanceData);
          resolve(results);
        }
      }
    );
  });
};

Stream.getAttendanceGuest = (guestID) => {
  console.log(guestID);
  return new Promise((resolve, reject) => {
    db.query(
      `SELECT V.id AS stream_id, V.title AS stream_title, CASE WHEN A.user_id IS NULL THEN 'Absent' ELSE 'Present' END AS attendance_status  FROM Video_Stream V JOIN ( SELECT H.id FROM User H JOIN User G ON H.college_id = G.college_id AND H.department_id = G.department_id WHERE G.id = '${guestID}') AS Hosts ON V.host_id = Hosts.id LEFT JOIN Attendance A ON A.stream_id = V.id AND A.user_id = '${guestID}'`,
      (err, results) => {
        if (err) {
          reject({ status: false, message: err });
        } else {
          resolve(results);
        }
      }
    );
  });
};

module.exports = Stream;
