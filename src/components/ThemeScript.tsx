export function ThemeScript() {
  const code = `
    (function() {
      try {
        var stored = localStorage.getItem('syncflow-theme');
        var theme = stored || 'system';
        var dark = theme === 'dark' || (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);
        document.documentElement.classList.toggle('dark', dark);
        document.documentElement.style.colorScheme = dark ? 'dark' : 'light';
      } catch (e) {}
    })();
  `;

  return <script dangerouslySetInnerHTML={{ __html: code }} />;
}
