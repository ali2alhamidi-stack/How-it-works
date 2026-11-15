using Microsoft.Web.WebView2.Core;
using Microsoft.Web.WebView2.Wpf;
using System;
using System.Diagnostics;
using System.IO;
using System.Windows;
using System.Windows.Input;

namespace Awamer.Desktop;

internal static class Program
{
    private static readonly Uri AppOrigin = new("https://awamer-app-production.up.railway.app/");
    [STAThread]
    private static void Main()
    {
        var app = new Application { ShutdownMode = ShutdownMode.OnMainWindowClose };
        var browser = new WebView2();
        var window = new Window {
            Title = "أوامر | نظام أوامر العمل والتشغيل",
            Width = 1440, Height = 900, MinWidth = 850, MinHeight = 560,
            WindowStartupLocation = WindowStartupLocation.CenterScreen,
            Content = browser
        };
        window.Loaded += async (_, _) => {
            try {
                string folder = Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.LocalApplicationData), "Awamer", "WebView2");
                Directory.CreateDirectory(folder);
                var env = await CoreWebView2Environment.CreateAsync(userDataFolder: folder);
                await browser.EnsureCoreWebView2Async(env);
                var core = browser.CoreWebView2;
                core.Settings.IsWebMessageEnabled = false;
                core.Settings.AreDevToolsEnabled = false;
                core.Settings.IsStatusBarEnabled = false;
                core.NavigationStarting += (_, e) => {
                    if (IsTrusted(e.Uri)) return;
                    e.Cancel = true;
                    OpenExternal(e.Uri);
                };
                core.NewWindowRequested += (_, e) => {
                    e.Handled = true;
                    OpenExternal(e.Uri);
                };
                browser.Source = AppOrigin;
            } catch (Exception) {
                MessageBox.Show("تعذر تشغيل WebView2. تحقق من تثبيت Microsoft Edge WebView2 Runtime ثم أعد فتح أوامر.", "أوامر", MessageBoxButton.OK, MessageBoxImage.Error);
            }
        };
        window.KeyDown += (_, e) => {
            if (e.Key == Key.F5 && browser.CoreWebView2 != null) { browser.Reload(); e.Handled = true; }
            else if (e.Key == Key.Escape && browser.CanGoBack) { browser.GoBack(); e.Handled = true; }
        };
        app.Run(window);
    }
    private static bool IsTrusted(string? value) =>
        Uri.TryCreate(value, UriKind.Absolute, out Uri? uri)
        && uri.Scheme == Uri.UriSchemeHttps
        && uri.Host.Equals(AppOrigin.Host, StringComparison.OrdinalIgnoreCase)
        && uri.Port == 443 && uri.UserInfo.Length == 0;
    private static void OpenExternal(string? value)
    {
        if (!Uri.TryCreate(value, UriKind.Absolute, out Uri? uri)) return;
        if (uri.Scheme != Uri.UriSchemeHttps && uri.Scheme != Uri.UriSchemeMailto) return;
        try { Process.Start(new ProcessStartInfo(uri.AbsoluteUri) { UseShellExecute = true }); } catch {}
    }
}
