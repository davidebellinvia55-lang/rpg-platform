using Microsoft.EntityFrameworkCore;
using RpgPlatform.Api.Campaigns;
using RpgPlatform.Api.Data;
using RpgPlatform.Api.Characters;

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

app.MapGet("/api/campaigns/{campaignId:guid}/characters", async (
    Guid campaignId,
    AppDbContext db) =>
{
    var campaignExists = await db.Campaigns
        .AnyAsync(c => c.Id == campaignId);

    if (!campaignExists)
    {
        return Results.NotFound();
    }

    var characters = await db.Characters
        .AsNoTracking()
        .Where(c => c.CampaignId == campaignId)
        .OrderBy(c => c.Name)
        .Select(c => new
        {
            c.Id,
            c.CampaignId,
            c.Name,
            c.Biography
        })
        .ToListAsync();

    return Results.Ok(characters);
});

app.MapPost("/api/campaigns/{campaignId:guid}/characters", async (
    Guid campaignId,
    CreateCharacterRequest request,
    AppDbContext db) =>
{
    var campaignExists = await db.Campaigns
        .AnyAsync(c => c.Id == campaignId);

    if (!campaignExists)
    {
        return Results.NotFound();
    }

    if (string.IsNullOrWhiteSpace(request.Name)
        || request.Name.Trim().Length > 120)
    {
        return Results.BadRequest(new
        {
            error = "Il nome è obbligatorio e può avere al massimo 120 caratteri."
        });
    }

    if ((request.Biography?.Length ?? 0) > 8000)
    {
        return Results.BadRequest(new
        {
            error = "La biografia può avere al massimo 8000 caratteri."
        });
    }

    var character = new Character
    {
        CampaignId = campaignId,
        Name = request.Name.Trim(),
        Biography = request.Biography?.Trim() ?? ""
    };

    db.Characters.Add(character);
    await db.SaveChangesAsync();

    return Results.Created(
        $"/api/campaigns/{campaignId}/characters/{character.Id}",
        new
        {
            character.Id,
            character.CampaignId,
            character.Name,
            character.Biography
        });
});

app.MapGet(
    "/api/campaigns/{campaignId:guid}/characters/{characterId:guid}",
    async (
        Guid campaignId,
        Guid characterId,
        AppDbContext db) =>
{
    var character = await db.Characters
        .AsNoTracking()
        .Where(c => c.CampaignId == campaignId && c.Id == characterId)
        .Select(c => new
        {
            c.Id,
            c.CampaignId,
            c.Name,
            c.Biography
        })
        .FirstOrDefaultAsync();

    if (character is null)
    {
        return Results.NotFound();
    }

    return Results.Ok(character);
});

app.Run();

public sealed record CreateCampaignRequest(
    string? Name,
    string? Description);

public sealed record CreateCharacterRequest(
    string? Name,
    string? Biography);