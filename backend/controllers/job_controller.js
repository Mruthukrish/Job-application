const job_service = require('../services/job_service');

exports.createJob = async(req,res)=>{
    try{
        const jobData =req.body;
        const newJob= await job_service.createJob(jobData);

        res.status(201).json({
            success: true,
            message: 'Job created successfully',
            data: newJob
        });

        res.status(409).json({
            success: false,
            message: 'Job already exists with the same title and company name'
        });

        res.status(400).json({
            success: false,
            message: 'Invalid job data provided'
        });
    }
    catch(err){
        res.status(500).json({
            success: false,
            message: `Error creating job: ${err.message}`
        });
    };
}

exports.getJobById = async(req,res)=>{
    try{
        const jobData = await job_service.getJobById(req.params.id);
        if(!jobData){
            return res.status(404).json({
                success: false,
                message: 'Job not found'
            });
        }
        res.status(200).json({
            success: true,
            message: 'Job retrieved successfully',
            data: jobData
        });
    }
    catch(err){
        res.status(500).json({
            success: false,
            message: `Error retrieving job: ${err.message}`
        });
    }
}

exports.getAllJobs = async(req, res)=>{
    try{
        const jobs= await job_service.getAllJobs();
        res.status(200).json({
            success: true,
            message: 'Jobs retrieved successfully',
            data: jobs
        });
    }
    catch(err){
        res.status(500).json({
            success: false,
            message: `Error retrieving all jobs: ${err.message}`
        });
    }
}