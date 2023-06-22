const User = require("../model/User");

const UserHandler = {
  saveColleges: async (req, res) => {
    try {
      const { collegeName } = req.body;
      const data = await User.saveColleges(collegeName);
      res.send("College data inserted succesfully").status(200);
    } catch (err) {
      console.log(err);
      res.send("Something went wrong !! please try again.").status(500);
    }
  },

  getColleges: async (req, res) => {
    try {
      const data = await User.getColleges();
      res.json(data).status(200);
    } catch (err) {
      console.log(err);
      res.send("Something went wrong !! please try again.").status(500);
    }
  },

  getCollegeById: async (req, res) => {
    try {
      const { collegeID } = req.params;
      const data = await User.getCollegeByID(collegeID);
      res.send(data).status(200);
    } catch (err) {
      console.log(err);
      res.send("Something went wrong !! please try again.").status(500);
    }
  },

  saveDepartment: async (req, res) => {
    try {
      const departmentData = req.body;
      const data = await User.saveDepartment(departmentData);
      res.send("Department data inserted succesfully").status(200);
    } catch (err) {
      console.log(err);
      res.send("Something went wrong !! please try again.").status(500);
    }
  },

  getDepartments: async (req, res) => {
    try {
      const { collegeID } = req.params;
      const data = await User.getDepartments(collegeID);
      res.send(data).status(200);
    } catch (err) {
      console.log(err);
      res.send("Something went wrong !! please try again.").status(500);
    }
  },

  getDepartmentByID: async (req, res) => {
    try {
      const { deptID } = req.params;
      const data = await User.getDepartmentByID(deptID);
      res.send(data).status(200);
    } catch (err) {
      console.log(err);
      res.send("Something went wrong !! please try again.").status(500);
    }
  },

  createUser: async (req, res) => {
    try {
      const data = req.body;
      const status = await User.create(data);
      res.status(200).send(status);
    } catch (err) {
      console.log(err);
      res.status(500).send(err);
    }
  },

  getAllUser: async (req, res) => {
    try {
      const data = await User.getAll();
      res.status(200).send(data);
    } catch (err) {
      console.log(err);
      res.send("Something went wrong!! try again later").status(500);
    }
  },

  getSpecificUser: async (req, res) => {
    try {
      const { id } = req.params;
      const data = await User.getSpecificUser(id);
      res.status(200).send(data);
    } catch (err) {
      console.log(err);
      res.status(500).send("Something went wrong !! try again later...");
    }
  },

  getSpecificUserByEmail: async (req, res) => {
    try {
      const { email } = req.params;
      const data = await User.getSpecificUserByEmail(email);
      res.status(200).send(data);
    } catch (err) {
      console.log(err);
      res.status(500).send("Something went wrong !! try again later...");
    }
  },

  login: async (req, res) => {
    try {
      const data = req.body;
      const response = await User.login(data);
      res.status(200).send(response);
    } catch (err) {
      console.log(err);
      res.status(500).send(err);
    }
  },

  oauth: async (req, res) => {
    try {
      const data = req.body;
      const response = await User.oauth(data);
      res.status(200).send(response);
    } catch (err) {
      console.log(err);
      res.status(500).send(err);
    }
  },

  getCollegeAndDepartmentOfUser: async (req, res) => {
    try {
      const { userID } = req.params;
      const response = await User.getCollegeAndDepartmentOfUser(userID);
      res.status(200).send(response);
    } catch (err) {
      console.log(err);
      res.status(500).send("Something went wrong !! try again later...");
    }
  },

  userStatus: async (req, res) => {
    try {
      const data = req.body;
      const response = await User.getStatus(data);
      res.status(200).send(response);
    } catch (err) {
      console.log(err);
      res.status(500).send(err);
    }
  },

  verifyUser: async (req, res) => {
    try {
      const data = req.body;
      const response = await User.verify(data);
      res.status(200).send(response);
    } catch (err) {
      console.log(err);
      res.status(500).send(err);
    }
  },

  additionalInfo: async (req, res) => {
    try {
      const data = req.body;
      const response = await User.additionalInfo(data);
      res.status(200).send(response);
    } catch (err) {
      console.log(err);
      res.status(500).send(err);
    }
  },

  forgotPassword: async (req, res) => {
    try {
      const data = req.body;
      const response = await User.forgotPassword(data);
      res.status(200).send(response);
    } catch (err) {
      console.log(err);
      res.status(500).send(err);
    }
  },
};

module.exports = UserHandler;
