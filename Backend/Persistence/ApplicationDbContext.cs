﻿using Backend.Domain.Entity;
using Backend.Persistence.Model;
using Microsoft.EntityFrameworkCore;

namespace Backend.Persistence
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options)
        {

        }

        public DbSet<JobModel> Jobs { get; set; }
        public DbSet<MessageModel> Messages { get; set; }
        public DbSet<SkillModel> Skills { get; set; }
        public DbSet<UserModel> Users { get; set; }
        public DbSet<UserSkillModel> UserSkills { get; set; }
    }
}