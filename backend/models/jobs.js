const mongoose = require('mongoose');
const jobSchema = new mongoose.Schema({
    jobId: {
        type: String,
        required: true,
        unique: true
    },
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true,
        maxLength: [5000, 'Description cannot exceed 5000 characters']
    },
    experience: {
        type: String,
        required: true,
        enum: ['Fresher', '1-3 years', '3-5 years', '5+ years'],
        default: 'Fresher'
    },
    jobType: {
        type: String,
        required: true,
        enum: ['Full-time', 'Part-time', 'Contract', 'Internship'],
        default: 'Full-time'
    },
    jobMode: {
        type: String,
        required: true,
        enum: ['on-site', 'off-site', 'hybrid']
    },
    salary: {
        type: Number,
        required: true,
        min: [0, 'Salary must be a positive number'],
        max: [1000000, 'Salary cannot exceed 1,000,000']
    },
    location: {
        type: String,
        required: true
    },
    companyName: {
        type: String,
        default: 'Senthuron Tech'
    },
    companyDescription: {
        type: String,
        maxLength: [5000, 'Description cannot exceed 5000 characters'],
        default: 'Senthuron Tech is a leading technology company specializing in innovative solutions.'
    },
    skillsRequired: {
        type: [String],
        required: true
    },
    benefits: {
        type: [String],
        default: []
    },
    openDate: {
        type: Date,
        required: true
    },
    closeDate: {
        type: Date,
        required: true,
        validate: {
            validator: function (value) {
                // `this` refers to the document
                return value > this.openDate;
            },
            message: 'Close date must be after open date'
        }
    },
    status: {
        type: String,
        enum: ['open', 'closed'],
        default: 'open'
    }
}, {
    versionKey: '__v',
    timestamps: true
})
module.exports = mongoose.model('Job', jobSchema);