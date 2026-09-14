using RpgPlatform.Api.Campaigns;

namespace RpgPlatform.Api.Characters;

public sealed class Character
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public Guid CampaignId { get; set; }
    public Campaign Campaign { get; set; } = null;
    public string Name { get; set; } = "";
    public string Biography { get; set; } = "";
}