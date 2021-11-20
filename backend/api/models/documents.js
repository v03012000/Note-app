let mongoose = require('mongoose');
let mongoosastic = require('mongoosastic');
let elasticsearch=require('elasticsearch');
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
      required: 'file name can\'t be empty',
      es_type: 'completion',
      es_search_analyzer: 'simple',
      es_indexed: true,
    },
    blobname: {
      type: String,
      required: 'Not a valid document'
     },
    verified: {
        type: Boolean,
        default:false
    },
    verified_date:{
       type: Date,
    },
    rating: {
        type: Number,
        required: true,
        default: 0,
      },
    subject:{
        type:String,
        required: 'Notes must be of a subject',
        es_indexed: true,
    },
    year:{
      type:Number,
      required: 'Notes must be of a passing year',
      es_indexed: true
  },
    major:{
      type:String,
      required:"Notes must be of major",
      es_indexed: true,
    },
      reviews: [reviewSchema],
      numReviews: {
        type: Number,
        required: true,
        default: 0,
      },
    
}
);
 // notesSchema.index({ major: 1, subject: 1 });
  var esClient = new elasticsearch.Client({host: 'localhost:9200'});
  notesSchema.plugin(mongoosastic, {
    filter: function(doc) {
        return doc.verified === false;
      }
          //index:'notes',
   // type: '_doc',
   // esClient: esClient
    });

  var Notes= mongoose.model('notes', notesSchema);

  Notes.createMapping(function(err, mapping){
    // do neat things here
    if (err) {
      console.log('error creating mapping (you can safely ignore this)');
      console.log(err);
  } else {
      console.log('mapping created!');
      console.log(mapping);
  }
  });
 

var stream = Notes.synchronize({verified:true});
  var count = 0;
 
  stream.on('data', function(err, doc){
    count++;
  });
  stream.on('close', function(){
    console.log('indexed ' + count + ' documents!');
  });
  stream.on('error', function(err){
    console.log(err);
  });

  Notes.search(null, {
    suggest: {
        "suggestions": {
            "text":"system",
            "completion": {
                "field": "filename"
            }
        }
    },
    "size" : 0
},
function(err, results) {
    if (err) {
        return console.log(JSON.stringify(err, null, 4));
    }
     console.log(results.suggest);
    //return console.log(JSON.stringify(results, null, 4));
});