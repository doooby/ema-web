export function databaseRoutes (routes, resolve) {
  for (let [ path, component ] of Object.entries({
    '/': 'users/browse',
    '/users/browse': 'users/browse',
  })) {
    path = `/database${path}`;
    component = resolve(__dirname, `../../pages/database/${component}.vue`);
    routes.push({ path, component });
  }
}
