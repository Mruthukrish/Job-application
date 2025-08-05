const job = require('../models/jobs')

exports.createJob = async(jobData)=>{
    try{
        const newJob = new job(jobData);
        return await newJob.save();
    }
    catch(err){
        throw new Error(`Error creating job: ${err.message}`);
    }
};

exports.getJobById= async(jobId)=>{
    try{
        const jobData = await job.findById(jobId);
        if(!jobData){
            return null;
        }
        else{
            return jobData;
        }
    }
    catch(err){
        throw new Error('Error fetching job by ID: ' + err.message);
    }
};

exports.getAllJobs = async()=>{
    try{
        return await job.find({});
    }
    catch(err){
        throw new Error('Error fetching all jobs: ' + err.message);
    }
};
