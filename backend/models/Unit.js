const mongoose = require('mongoose');

const unitSchema = new mongoose.Schema({
    unitName: {
        type: String,
        required: [true, 'Unit name is required'],
        trim: true
    },
    adminName: {
        type: String,
        required: [true, 'Admin name is required'],
        trim: true
    },
    location: {
        type: String,
        required: [true, 'Location is required'],
        trim: true
    },
    address: {
        type: String,
        required: [true, 'Address is required'],
        trim: true
    },
    workerCapacity: {
        type: Number,
        required: [true, 'Worker capacity is required'],
        min: [1, 'Capacity must be at least 1']
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
        trim: true,
        lowercase: true,
        match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
    },
    phoneNo: {
        type: String,
        required: [true, 'Phone number is required'],
        trim: true
    },
    isActive: {
        type: Boolean,
        default: true
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

// Virtual for getting the number of workers assigned to this unit
unitSchema.virtual('currentWorkers', {
    ref: 'Worker',
    localField: '_id',
    foreignField: 'unit',
    count: true
});

// Method to check if unit has capacity for more workers
unitSchema.methods.hasCapacity = function() {
    return this.currentWorkers < this.workerCapacity;
};

// Pre-save middleware to validate worker capacity
unitSchema.pre('save', async function(next) {
    if (this.isModified('workerCapacity')) {
        const currentWorkers = await mongoose.model('Worker').countDocuments({ unit: this._id });
        if (this.workerCapacity < currentWorkers) {
            throw new Error('Worker capacity cannot be less than current number of workers');
        }
    }
    next();
});

const Unit = mongoose.model('Unit', unitSchema);

module.exports = Unit;
