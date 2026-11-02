// Docusaurus calls this after SPA navigation, including history navigation.
export function onRouteDidUpdate() {
  window.dispatchEvent(new Event("caprover:route-update"));
}
