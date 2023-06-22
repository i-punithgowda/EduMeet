const db = require("../db/db");
const uuid = require("uuid");
const bcrypt = require("bcrypt");
const saltRounds = 10;
const messenger = require("../utils/Nodemailer");
const User = {};

User.create = async (user) => {
  const id = uuid.v4();
  const hashedPassword = await bcrypt.hash(user.password, saltRounds);
  console.log(user);
  return new Promise((resolve, reject) => {
    db.query(
      `select * from User where email='${user.email}'`,
      (err, results) => {
        if (err) {
          reject(err);
        } else if (results.length > 0) {
          resolve({ message: "User already exists!!!", status: false });
        } else {
          db.query(
            `insert into User (id,email,password,new_user,isVerified) values ('${id}','${user.email}','${hashedPassword}','1','0')`,
            (err, results) => {
              if (err) {
                reject(err);
              } else {
                const subject = "Email Verification for EduMeet";
                const message = `
  <html>
    <body>
      <h1>Greetings from EduMeet!</h1>
      <p>We are happy that you are here. We would like you to verify your email before proceeding.</p>
      <p>Please click the following link to verify your email:</p>
      <a href="http://localhost:3000/verify/${user.email}">Verify Email</a>
    </body>
  </html>
`;

                messenger(subject, message, user.email);
                resolve({
                  status: true,
                  message:
                    "Registration succesfull!! please check your email for verification link!!",
                });
              }
            }
          );
        }
      }
    );
  });
};

User.getAll = () => {
  return new Promise((resolve, reject) => {
    db.query(
      "select id , name , college_id, department_id , email , type, user_image from User",
      (err, results) => {
        if (err) {
          reject(err);
        } else {
          resolve(results);
        }
      }
    );
  });
};

User.getSpecificUser = (id) => {
  return new Promise((resolve, reject) => {
    db.query(
      `select id,name,email,type from User where id='${id}'`,
      (err, results) => {
        if (err) {
          reject(err);
        } else {
          resolve(results);
        }
      }
    );
  });
};

User.getSpecificUserByEmail = (email) => {
  return new Promise((resolve, reject) => {
    db.query(
      `select id,name,email,type from User where email='${email}'`,
      (err, results) => {
        if (err) {
          reject(err);
        } else {
          resolve(results);
        }
      }
    );
  });
};

User.login = (data) => {
  return new Promise((resolve, reject) => {
    const email = data.email;
    const password = data.password;
    db.query(
      `SELECT * FROM User WHERE email = ?`,
      [email],
      async (err, results) => {
        if (err) {
          reject(err);
        } else if (results.length === 0) {
          resolve({ status: "Invalid credentials" });
        } else if (results.length > 0) {
          if (results[0].password == null) {
            console.log("no pass");
            resolve({ status: "Invalid username or password..." });
          } else {
            const hashedPassword = results[0].password;
            const match = await bcrypt.compare(password, hashedPassword);
            if (match) {
              resolve({
                val: true,
                email: results[0].email,
                status: "Login success",
              });
            } else {
              resolve({ status: "Invalid username or password..." });
            }
          }
        }
      }
    );
  });
};

User.oauth = (data) => {
  return new Promise((resolve, reject) => {
    const email = data.email;
    console.log("EEE : ", "email");
    const id = uuid.v4();
    db.query(
      `SELECT * FROM User WHERE email = ?`,
      [email],
      async (err, results) => {
        if (err) {
          reject(err);
        } else if (results.length > 0) {
          resolve({ status: true, type: "User already exists" });
        } else if (results.length === 0) {
          db.query(
            `insert into User (id,email,new_user,isVerified) values ('${id}','${email}','1','1')`,
            (err, results) => {
              if (err) {
                reject(err);
              } else {
                resolve({ status: true, type: "Registered Sucesfully!!" });
              }
            }
          );
        }
      }
    );
  });
};

User.getColleges = (id) => {
  return new Promise((resolve, reject) => {
    db.query(`select * from College`, (err, results) => {
      if (err) {
        reject(err);
      } else {
        resolve(results);
      }
    });
  });
};

User.getDepartments = (collegeID) => {
  return new Promise((resolve, reject) => {
    db.query(
      `select * from Department where college_id=${collegeID}`,
      (err, results) => {
        if (err) {
          reject(err);
        } else {
          resolve(results);
        }
      }
    );
  });
};

User.getCollegeByID = (collegeID) => {
  return new Promise((resolve, reject) => {
    db.query(`select * from College where id=${collegeID}`, (err, results) => {
      if (err) {
        reject(err);
      } else {
        resolve(results);
      }
    });
  });
};

User.getDepartmentByID = (deptID) => {
  return new Promise((resolve, reject) => {
    db.query(`select * from Department where id=${deptID}`, (err, results) => {
      if (err) {
        reject(err);
      } else {
        resolve(results);
      }
    });
  });
};

User.saveColleges = (collegeName) => {
  try {
    return new Promise((resolve, reject) => {
      db.query(
        `insert into College (college_name) values('${collegeName}')`,
        (err, results) => {
          if (err) {
            reject(err);
          } else {
            resolve(results);
          }
        }
      );
    });
  } catch (err) {
    reject(err);
  }
};

User.saveDepartment = (data) => {
  try {
    return new Promise((resolve, reject) => {
      db.query(
        `insert into Department (department_name,college_id) values('${data.departmentName}','${data.collegeID}')`,
        (err, results) => {
          if (err) {
            reject(err);
          } else {
            resolve(results);
          }
        }
      );
    });
  } catch (err) {
    reject(err);
  }
};

User.getCollegeAndDepartmentOfUser = (userID) => {
  try {
    return new Promise((resolve, reject) => {
      db.query(
        `select college_id,department_id from User where id='${userID}'`,
        (err, results) => {
          if (err) {
            reject(err);
          } else {
            db.query(
              `select * from College where id='${results[0].college_id}'`,
              (error, collegeData) => {
                collegeName = collegeData[0].college_name;
                db.query(
                  `select * from Department where id='${results[0].department_id}'`,
                  (error, departmentData) => {
                    deptName = departmentData[0].department_name;
                    roomID = departmentData[0].room_id;
                    resolve({
                      collegeName: collegeName,
                      deptName: deptName,
                      roomID: roomID,
                    });
                  }
                );
              }
            );
          }
        }
      );
    });
  } catch (err) {
    reject(err);
  }
};

User.getStatus = (data) => {
  const email = data.email;
  console.log(data);
  try {
    return new Promise((resolve, reject) => {
      db.query(
        `select id,new_user,isVerified from User where email='${email}'`,
        (err, results) => {
          if (err) {
            reject(err);
          } else {
            resolve(results);
          }
        }
      );
    });
  } catch (err) {
    reject(err);
  }
};

User.verify = (data) => {
  try {
    return new Promise((resolve, reject) => {
      db.query(
        `select email from User where email='${data.email}'`,
        (err, results) => {
          if (err) {
            reject(err);
          } else {
            if (results.length > 0) {
              db.query(
                `update User set isVerified='1' where email='${data.email}'`,
                (err, results) => {
                  if (err) {
                    reject(err);
                  } else {
                    resolve({
                      message: "Verification succesfull",
                      status: true,
                    });
                  }
                }
              );
            } else {
              resolve({ status: false, message: "Invalid email" });
            }
          }
        }
      );
    });
  } catch (err) {
    reject(err);
  }
};

User.additionalInfo = (data) => {
  try {
    return new Promise((resolve, reject) => {
      db.query(
        `update User set name='${data.name}' , type='${data.type}',college_id='${data.college_id}',department_id='${data.department_id}',new_user='0' where email='${data.email}'`,
        (err, results) => {
          if (err) {
            console.log(err);
            resolve({
              status: false,
              message: "Error occured",
            });
          } else {
            resolve({
              status: true,
              message: "Thank you for providing additional information!",
            });
          }
        }
      );
    });
  } catch (err) {
    reject(err);
  }
};

User.forgotPassword = async (data) => {
  const email = data.email;
  const password = data.password;
  const hashedPassword = await bcrypt.hash(password, saltRounds);
  try {
    return new Promise((resolve, reject) => {
      db.query(
        `update User set password='${hashedPassword}' where email='${email}'`,
        (err, results) => {
          if (err) {
            reject(err);
          } else {
            resolve({ status: true, message: "Updated password" });
          }
        }
      );
    });
  } catch (err) {
    reject(err);
  }
};

module.exports = User;
