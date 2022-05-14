﻿using Backend.Domain.Entity;

namespace Backend.Domain.Service
{
    public interface IJobService
    {
        public bool RateJob(string jobId, double rating);

        public List<Job> ListJobsByUser(string userId); 

        public List<Job> SearchJobsForFreelancer(string userId);

        public Job GetJobById(string jobId);
    }
}
