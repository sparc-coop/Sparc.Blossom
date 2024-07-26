using Sparc.Ibis;
using Sparc.Kernel;
using Kori;
using System.Globalization;


var builder = WebApplication.CreateBuilder(args);

builder.Services.AddRazorPages();
builder.Services.AddServerSideBlazor();

builder.AddKori(new Uri("https://localhost:7129/"));
builder.AddSparcKernel();
builder.Services
    .AddIbis();

var app = builder.Build();

var supportedCultures = CultureInfo.GetCultures(CultureTypes.AllCultures)
    .Select(x => x.Name)
    .ToArray();

app.UseStaticFiles();
app.UseKori();

app.UseRequestLocalization(options => options
    .AddSupportedCultures(supportedCultures)
    .AddSupportedUICultures(supportedCultures));

app.MapBlazorHub();
app.MapFallbackToPage("/_Host");

app.Run();