const baseUrl = 'https://jmsalazar.dev';

const manifest = {
  output: "public",
  name: "JMSalazarDev",
  short_name: "JMSalazarDev",
  start_url: "/",
  background_color: "#272b30",
  theme_color: "#12181b",
  display: "standalone",
  orientation: "portrait",
  description: "Un blog de un desarrollador de software",
  icon: "assets/favicon.svg",
  icons: [...[48, 72, 96, 128, 192, 384, 512].map((size) => ({
    src: `maskable_icon_x${size}.png`,
    sizes: `${size}x${size}`,
    type: 'image/png'
  })), {
    src: `maskable_icon.png`,
    sizes: `1080x1080`,
    type: 'image/png',
    purpose: 'any maskable'
  }]
}

module.exports = {
  buildTime: new Date(),
  name: "JMSalazarDev",
  url: baseUrl,
  authorName: "José Miguel Salazar",
  authorUrl: "https://twitter.com/JMSalazarDev",
  description: "Un blog de un desarrollador de software.",
  favicon: `${baseUrl}/favicon.ico`,
  google: {
    gtag: "G-KH7TX6T3E9"
  },
  manifest
};