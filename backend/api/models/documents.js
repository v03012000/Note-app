let mongoose = require('mongoose');
var notesSchema = new mongoose.Schema({
    document_url: {
      type: String,
      unique: true,
      required: 'Not a valid document'
    },
    filename: {
      type: String,
      required: 'file name can\'t be empty'
    },
    blobname: {
      type: String,
      required: 'Not a valid document'
     },
    verified: {
        type: Boolean,
        default:false
    },
    rating: {
        type: Number,
        required: true,
        default: 0,
      },
    
}
);

  mongoose.model('notes', notesSchema);