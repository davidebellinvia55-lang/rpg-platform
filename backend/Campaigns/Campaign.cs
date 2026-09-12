namespace RpgPlatform.Api.Campaigns;

public sealed class Campaign
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public string Name { get; set; } = "";
    public string Description { get; set; } = "";
    public string SystemId { get; set; } = "generic";
    public string SystemVersion { get; set; } = "1";
}