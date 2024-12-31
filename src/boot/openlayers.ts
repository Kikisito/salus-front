import { defineBoot } from '#q-app/wrappers';
import "vue3-openlayers/styles.css";
import OpenLayersMap from "vue3-openlayers";

export default defineBoot(({ app }) => {
  app.use(OpenLayersMap);
});
