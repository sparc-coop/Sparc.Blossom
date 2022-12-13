using Sparc.Blossom;
using Sparc.Ibis;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddRazorPages();
builder.Services.AddServerSideBlazor();

builder.AddBlossom();
builder.Services.AddIbis();
builder.Services.AddLocalization();

var app = builder.Build();

app.UseStaticFiles();
app.UseAllCultures();
app.MapBlazorHub();
app.MapFallbackToPage("/_Host");

app.Run();