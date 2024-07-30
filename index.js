const axios = require("axios");
const cheerio = require("cheerio");

const url =
  "https://store.playstation.com/es-mx/category/dc464929-edee-48a5-bcd3-1e6f5250ae80/1?FULL_GAME=storeDisplayClassification";

// Obtiene las mejores ofertas de juegos completos de la playstation store
async function getOffersData() {
  try {
    const response = await axios.get(url);
    return response.data;
  } catch (error) {
    console.error("Error fetching data:", error);
  }
}

// Checa si nuestro array de ofertas ya cuenta con una oferta agregada via su título
function hasOfferWithTitle(offers, title) {
  return offers.some((offer) => offer.title === title);
}

// Muestra las ofertas
async function displayOffers() {
  try {
    const offersHtml = await getOffersData();
    const $ = cheerio.load(offersHtml);

    const offers = [];

    const mainContainer = $(".psw-grid-list.psw-l-grid");

    mainContainer
      .find('[data-qa^="ems-sdk-grid#productTile"]')
      .each((_, element) => {
        const title = $(element)
          .find('[data-qa$="product-name"]')
          .text()
          .trim();
        const price = $(element)
          .find('[data-qa$="display-price"]')
          .text()
          .trim();

        if (title) {
          const offerAlreadyExists = hasOfferWithTitle(offers, title);

          if (!offerAlreadyExists) {
            console.log(`The offer with title ${title} has been created`);
            offers.push({ title, price });
          }
        }
      });

    console.table(offers);
    return offers;
  } catch (error) {
    console.error("Error fetching offers:", error);
  }
}

displayOffers();
