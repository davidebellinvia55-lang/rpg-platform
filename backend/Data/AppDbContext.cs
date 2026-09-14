using Microsoft.EntityFrameworkCore;
using RpgPlatform.Api.Campaigns;
using RpgPlatform.Api.Characters;

namespace RpgPlatform.Api.Data;

public sealed class AppDbContext(
    DbContextOptions<AppDbContext> options) : DbContext(options)
{
    public DbSet<Campaign> Campaigns => Set<Campaign>();
    public DbSet<Character> Characters => Set<Character>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        var campaign = modelBuilder.Entity<Campaign>();

        campaign.HasKey(c => c.Id);
        campaign.Property(c => c.Name)
            .HasMaxLength(120)
            .IsRequired();
        campaign.Property(c => c.Description)
            .HasMaxLength(4000)
            .IsRequired();
        campaign.Property(c => c.SystemId)
            .HasMaxLength(80)
            .IsRequired();
        campaign.Property(c => c.SystemVersion)
            .HasMaxLength(40)
            .IsRequired();

        var character = modelBuilder.Entity<Character>();

        character.HasKey(c => c.Id);

        character.Property(c => c.Name)
            .HasMaxLength(120)
            .IsRequired();

        character.Property(c => c.Biography)
            .HasMaxLength(8000)
            .IsRequired();

        character.HasOne(c => c.Campaign)
            .WithMany()
            .HasForeignKey(c => c.CampaignId)
            .OnDelete(DeleteBehavior.Restrict);
    }
}