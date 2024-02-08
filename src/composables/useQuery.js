import { reactive } from "vue";

export const query = reactive({
  genre: "",
  range: "1,2,3,4,5",
  search: "",
  nearby: true,
  map: false,
  lat: 45.50,
  lon: -73.50,
  limit: 10,
});
