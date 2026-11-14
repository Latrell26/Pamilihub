import { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Pamilihub — San Pablo City Local Delicacies",
    short_name: "Pamilihub",
    description: "Web-based e-commerce platform for authentic food delicacies of San Pablo City, Laguna",
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#e11d48",
    icons: [
      {
        src: "/icon-192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/icon-512.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
  };
}
