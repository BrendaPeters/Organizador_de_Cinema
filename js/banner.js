const BANNER_IMAGES = [
  "assets/1.jpg",
  "assets/2.jpg",
  "assets/3.jpg",
  "assets/4.jpg",
  "assets/5.jpg",
  "assets/6.jpg",
  "assets/7.jpg",
  "assets/8.jpg",
  "assets/8.webp",
  "assets/inter.jpg",
  "assets/joker.jpg",
  "assets/luta.jpg",
  "assets/10.webp",
  "assets/origem.jpg",
  "assets/toy_4.jpg",
  "assets/Toy_Story_3.jpg",
  "assets/toy2.jpg",
];

function montarBanners() {
  const leftTrack = document.querySelector(".banner-track-up");
  const rightTrack = document.querySelector(".banner-track-down");
  if (!leftTrack || !rightTrack || BANNER_IMAGES.length === 0) return;

  const todas = [...BANNER_IMAGES, ...BANNER_IMAGES];

  todas.forEach((src) => {
    const img = document.createElement("img");
    img.src = src;
    img.alt = "";
    leftTrack.appendChild(img.cloneNode());
    rightTrack.appendChild(img);
  });
}
