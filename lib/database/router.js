export function databaseRoutes (routes, resolve) {
  for (let [ path, component ] of Object.entries({
    '/': 'index',
  })) {
    path = `/database${path}`;
    component = resolve(__dirname, `../../pages/database/${component}.vue`);
    routes.push({ path, component });
  }
}
