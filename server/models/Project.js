const mongoose = require('mongoose');

/**
 * Project Schema
 * Stores project information and team members
 */
const projectSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Project name is required'],
      trim: true,
      minlength: [2, 'Project name must be at least 2 characters'],
      maxlength: [100, 'Project name cannot exceed 100 characters'],
    },
    description: {
      type: String,
      trim: true,
      maxlength: [500, 'Description cannot exceed 500 characters'],
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Project owner is required'],
    },
    members: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Indexes for faster queries
projectSchema.index({ owner: 1, createdAt: -1 });
projectSchema.index({ members: 1 });

/**
 * Virtual field to populate tasks
 */
projectSchema.virtual('tasks', {
  ref: 'Task',
  localField: '_id',
  foreignField: 'project',
});

/**
 * Pre-save middleware to ensure owner is in members array
 */
projectSchema.pre('save', function (next) {
  // Add owner to members if not already present
  if (!this.members.some((member) => member.equals(this.owner))) {
    this.members.push(this.owner);
  }
  next();
});

/**
 * Cascade delete tasks when project is deleted
 */
projectSchema.pre('deleteOne', { document: true, query: false }, async function (next) {
  try {
    await mongoose.model('Task').deleteMany({ project: this._id });
    next();
  } catch (error) {
    next(error);
  }
});

/**
 * Transform output - remove __v
 */
projectSchema.set('toJSON', {
  transform: (doc, ret) => {
    delete ret.__v;
    return ret;
  },
});

module.exports = mongoose.model('Project', projectSchema);
