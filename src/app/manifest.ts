import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Organiza+",
    short_name: "Organiza+",
    description: "App personal de organizacion, comidas y gastos semanales",
    start_url: "/",
    display: "standalone",
    background_color: "#f6f3ee",
    theme_color: "#f6f3ee",
    lang: "es",
    icons: [
      {
        src: "/foto.png.jpeg",
        sizes: "192x192",
        type: "image/jpeg",
      },
      {
        src: "/foto.png.jpeg",
        sizes: "512x512",
        type: "image/jpeg",
      },
    ],
  };
}
