const fs = require('fs');
const cheerio = require('cheerio')
const puppeteerExtra = require('puppeteer-extra')
const stealthPlugin = require('puppeteer-extra-plugin-stealth')
const puppeteer = require('puppeteer')

async function searchGoogleMaps() {
  try {
    const start = Date.now();

    puppeteerExtra.use(stealthPlugin());

    const browser = await puppeteer.launch({
      headless: false, // Set to true if you want to run headless
    })

    const page = await browser.newPage();

    const query = "IT company in nherunagar"; // Original query
    const pincode = "380015"; // Pincode query
    const searchTerm = `${query} ${pincode}`.split(" ").join("+");
    const baseUrl = `https://www.google.com/search?sca_esv=cf88ce8ca10dd34a&sca_upv=1&tbs=lf:1,lf_ui:2&tbm=lcl&sxsrf=ADLYWIJYhtysxwoAWqskS7tMB7-ndMh6lg:1719332690181&q=${searchTerm}`;

    async function autoScroll(page) {
      await page.evaluate(async () => {
        const distance = 100;
        const delay = 100;
        while (document.scrollingElement.scrollTop + window.innerHeight < document.scrollingElement.scrollHeight) {
          document.scrollingElement.scrollBy(0, distance);
          await new Promise((resolve) => setTimeout(resolve, delay));
        }
      });
    }

    async function scrapeCurrentPage() {
      await autoScroll(page);
      const html = await page.content();
      const $ = cheerio.load(html);

      const businesses = [];

      $('div.VkpGBb').each((index, element) => {
        const storeName = $(element).find('div.dbg0pd span.OSrXXb').text().trim();
        const starsText = $(element).find('span.yi40Hd').text().trim();
        const ratingText = $(element).find('span.z3HNkc').attr('aria-label');
        const reviewsText = $(element).find('span.RDApEe').text().trim();
        const address = $(element).find('div:nth-child(3)').text().trim();
        const phone = $(element).find('div:nth-child(4)').text();
        const website = $(element).find('a[href*="https://"]').attr('href');
        const placeUrl = $(element).find('a.vwVdIc').attr('href');

        const stars = starsText ? parseFloat(starsText) : null;
        const numberOfReviews = reviewsText ? parseInt(reviewsText.replace('(', '').replace(')', '')) : null;

        businesses.push({
          placeId:`ChI${placeUrl?.split("?")?.[0]?.split("ChI")?.[1]}`,
          address,
          category: address ? address.split("·")[0]?.trim() : null,
          phone,
          googleUrl: placeUrl,
          bizWebsite: website,
          storeName,
          ratingText,
          stars,
          numberOfReviews,
        });
      });

      return businesses;
    }

    async function scrapeAllPages() {
      let allBusinesses = [];
      let currentPage = 0;
      let hasNextPage = true;

      while (hasNextPage) {
        const url = `${baseUrl}&start=${currentPage * 20}`;
        try {
          await page.goto(url, { waitUntil: "networkidle2" });
        } catch (error) {
          console.log("Error going to page:", error);
          await browser.close();
          return [];
        }

        const businesses = await scrapeCurrentPage();
        allBusinesses = allBusinesses.concat(businesses);

        const nextButton = await page.$('td.d6cvqb a#pnnext');
        hasNextPage = !!nextButton;

        if (hasNextPage) {
          try {
            await Promise.all([
              page.waitForNavigation({ waitUntil: "networkidle2" }),
              nextButton.click()
            ]);
          } catch (error) {
            console.log("Error clicking next button:", error);
            break; // Exit loop if unable to click
          }
        }

        currentPage += 1;
      }

      return allBusinesses;
    }

    const allBusinesses = await scrapeAllPages();

    const end = Date.now();
    console.log(`Time in seconds: ${Math.floor((end - start) / 1000)}`);
    console.log('Businesses:', allBusinesses);

    // Write to a JSON file
    // fs.writeFileSync('businesses4.json', JSON.stringify(allBusinesses, null, 2), 'utf-8');
    console.log('Data saved to businesses.json');

    // Now close the browser
    await browser.close();

    return allBusinesses;
  } catch (error) {
    console.log("Error at googleMaps:", error.message);
  }
}

searchGoogleMaps().then((businesses) => {
  console.log(businesses)
  console.log(businesses.length)
});
