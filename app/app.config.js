// Expo reads app.json first and then this file. Nothing changes for the phone app.
// The browser build (deploy/build-browser-app.sh) sets CLEANSCAPE_BROWSER_BUILD: the app is then exported as one
// page of static files, served by the Earthy server under /app.
module.exports = ({ config }) => {
  if (!process.env.CLEANSCAPE_BROWSER_BUILD) return config;
  return {
    ...config,
    web: { ...config.web, output: 'single' },
    experiments: { ...config.experiments, baseUrl: '/app' },
  };
};
