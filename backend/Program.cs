using Microsoft.EntityFrameworkCore;
using RpgPlatform.Api.Campaigns;
using RpgPlatform.Api.Data;

var builder = WebApplication.CreateBuilder(args);

var connectionString =
    builder.Configuration.GetConnectionString("Database")
    ?? throw new InvalidOperationException(
        "Manca la connessione al database.");

builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseNpgsql(connectionString));

var app = builder.Build();

app.MapGet("/api/health", () => Results.Ok(new
{
    status = "ok",
    service = "RpgPlatform.Api"
}));

app.MapGet("/api/campaigns", async (AppDbContext db) =>
{
    var campaigns = await db.Campaigns
        .AsNoTracking()
        .OrderBy(c => c.Name)
        .ToListAsync();

    return Results.Ok(campaigns);
});

app.MapPost("/api/campaigns", async (
    CreateCampaignRequest request,
    AppDbContext db) =>
{
    if (string.IsNullOrWhiteSpace(request.Name)
        || request.Name.Trim().Length > 120)
    {
        return Results.BadRequest(new
        {
            error = "Il nome è obbligatorio e può avere al massimo 120 caratteri."
        });
    }

    if ((request.Description?.Length ?? 0) > 4000)
    {
        return Results.BadRequest(new
        {
            error = "La descrizione può avere al massimo 4000 caratteri."
        });
    }

    var campaign = new Campaign
    {
        Name = request.Name.Trim(),
        Description = request.Description?.Trim() ?? "",
        SystemId = "generic",
        SystemVersion = "1"
    };

    db.Campaigns.Add(campaign);
    await db.SaveChangesAsync();

    return Results.Created(
        $"/api/campaigns/{campaign.Id}",
        campaign);
});

app.MapGet("/api/campaigns/{id:guid}", async (
    Guid id,
    AppDbContext db) =>
{
    var campaign = await db.Campaigns
        .AsNoTracking()
        .FirstOrDefaultAsync(c => c.Id == id);

    if (campaign is null)
    {
        return Results.NotFound();
    }

    return Results.Ok(campaign);
});

app.Run();

public sealed record CreateCampaignRequest(
    string? Name,
    string? Description);