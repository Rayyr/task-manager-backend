import mongoose from "mongoose";

const projectSchema=new mongoose.Schema({

    name:{
        type:String,
        required:[true,"Name is required"],
        trim:true,
        maxlength: [100, "Name cannot exceed 100 characters"],

    },
   
        description: {
      type: String,
      trim: true,
      maxlength: [500, "Description cannot exceed 500 characters"],
    },
    color: {
      type: String,
      trim: true,
      match: [/^#[0-9a-fA-F]{6}$/, "Color must be a hex code like #3b82f6"],
    },
    owner:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    }

},
{ timestamps: true, id: false });

// One user cannot have two projects with the same name.
// strength: 2 makes it case-insensitive ("Work" and "work" count as the same).
projectSchema.index(
  { owner: 1, name: 1 },
  { unique: true, collation: { locale: "en", strength: 2 } }
);


export default mongoose.model("Project", projectSchema);