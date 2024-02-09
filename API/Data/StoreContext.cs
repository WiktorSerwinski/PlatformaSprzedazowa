using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using API.Entities;
using API.Entities.Orders;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace API.Data
{
    public class StoreContext : IdentityDbContext<User,Role,int>
    {
        public StoreContext(DbContextOptions options) : base(options)
        {
        }

        public DbSet<Product> Products { get; set; }
        public DbSet<Basket> Baskets {get;set;}

         public DbSet<PrepaidCode> PrepaidCodes {get;set;}

        public DbSet<Rating> Ratings {get;set;}

        public DbSet<Order> Orders {get;set;}

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {

            base.OnModelCreating(modelBuilder);
            modelBuilder.Entity<User>()
                .HasOne(u => u.Address)
                .WithOne()
                .HasForeignKey<AddressUser>(u => u.Id)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<Role>()
                .HasData(
                    new Role{Id = 1,Name="Member",NormalizedName = "MEMBER"},
                    new Role{Id =2,Name="Admin", NormalizedName="ADMIN"}
                );

        }
    }
}