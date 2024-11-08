const mongoose = require('mongoose');

const AdminSchema = new mongoose.Schema({
    loginID: {
      type: String,
      required: true
    },
     password: {
       type: String,
       required: true
     }
   });

   
   module.exports = mongoose.model('Admin', AdminSchema);