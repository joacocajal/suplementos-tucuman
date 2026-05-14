export const PRODUCT_IMAGE_MAP = {
  "Vitamina C x60 Star Nutrition": "/productos/vitaminacstar.png",
  "Cafeína x30 Star Nutrition": "/productos/caffeinestar.png",
  "Citrato de Magnesio x60 Star Nutrition": "/productos/magensiostar.png",
  "Collagen Plus 360gr Star Nutrition": "/productos/collagenstar.png",
  "Creatina Monohidrata Star Nutrition 300gr": "/productos/creatinastar.png",
  "Gel Chitaka": "/productos/gelchitaka.png",
  "Gel Chitaka x12": "/productos/gelchitakax12.png",
  "Gel Mervick C/cafeína": "/productos/gelmervickconcafeina.png",
  "Gel Mervick C/cafeína x12": "/productos/gelmervickconcafeinax12.png",
  "Gel Mervick S/cafeína": "/productos/gelmervicksincafeina.png",
  "Gel Mervick S/cafeína x12": "/productos/gelmervicksincafeinax12.png",
  "Hidromax 20 sobres": "/productos/hydromax-x20.png",
  "Hydromax 600gr": "/productos/hydromax600gr.png",
  "Hydroplus Endurance 700gr Star Nutrition": "/productos/hydroplusendurance700gr.png",
  "Proteína Whey Star Nutrition 2lb": "/productos/proteinstar2lb.png",
  "Recovery Drink 540gr": "/productos/recoverydrink540gr.png",
  "Recovery Drink 10 sobres": "/productos/recoverydrinkx10.png",
  "Shake Everlast": "/productos/shakeeverlast.png",
  "Combo Star": "/productos/combo-star1.png",
  "Combo Creatina x2": "/productos/combo-creatina1.png",
  "Combo Star Premium": "/productos/combo-star-premium1.png",
  "Combo Carrera": "/productos/combo-carrera.jpeg",
  "Combo Geles Mervick x12 + Regalo": "/productos/combo-geles-mervick1.png",
};

export function getProductImage(producto) {
  if (producto.imagen_url) return producto.imagen_url;
  return PRODUCT_IMAGE_MAP[producto.nombre] || null;
}
