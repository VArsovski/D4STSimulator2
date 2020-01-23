using D4St_Api.Data.Entities;
using Microsoft.EntityFrameworkCore;

namespace D4St_Api.Data
{
    public class DataContext: DbContext
    {
        public DataContext(DbContextOptions<DataContext> options) : base(options)
        {
            
        }

        public DbSet<Skill> Skills { get; set; }
        public DbSet<CharacterClass> CharacterClasses { get; set; }
    }
}
