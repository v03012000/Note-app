let mongoose = require('mongoose');
const reviewSchema = mongoose.Schema(
  {
    name: { type: String, required: true },
    rating: { type: Number, required: true },
    comment: { type: String, required: true },
    user: {
     type: mongoose.Schema.Types.ObjectId,
     required: true,
     ref: 'User',
    },
    notesId:{
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'notes',
    }
   },
  {
    timestamps: true,
  }
)
mongoose.model('reviews',reviewSchema);

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
      reviews: [reviewSchema],
      numReviews: {
        type: Number,
        required: true,
        default: 0,
      },
    
}
);

  mongoose.model('notes', notesSchema);
  