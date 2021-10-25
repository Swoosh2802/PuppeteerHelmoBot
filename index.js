const puppeteer = require('puppeteer');

(async () => {
  const awaitTimeout = delay => new Promise(resolve => setTimeout(resolve, delay),console.log('pause'));
  const browser = await puppeteer.launch({
    userDataDir: "./user_data",
    headless: false,
  });
  
  const page = await browser.newPage();
  
  page.deleteCookie();
  await page.goto('https://www.helmo.be');
  console.log("se rend sur la page de helmo")
  await page.screenshot({ path: 'accueil.png' });
  await page.click("ul.nav:nth-child(5) > li:nth-child(1) > a:nth-child(1)")
  console.log("clic sur le bouton 'se connecter'")
  await awaitTimeout(2000)
  var pages = await browser.pages()
  await pages[2].waitForSelector("#username")
  await pages[2].focus('#username')
  await pages[2].keyboard.type('VOTRE IDENTIFIANT HELMO')
  await pages[2].focus('#password')
  await pages[2].keyboard.type('VOTRE MOT DE PASSE HELMO')
  await pages[2].click("body > div > div > div > div > form > div:nth-child(4) > button")
  console.log('entrée des données de connexion')
  await pages[2].waitForSelector("#contenuPage")
  await pages[2].screenshot({ path: 'connecté.png' })
  const utilisateur = await pages[2].$eval("div.contenu-widget:nth-child(2) > section:nth-child(1) > span:nth-child(1) > span:nth-child(2)", el => el.textContent);
  console.log('Le compte connecté est celui de '+utilisateur)
  await pages[2].goto("https://connect.helmo.be/secure/cours/documents-evaluatifs.aspx", {waitUntil: 'networkidle0'})
  await pages[2].click("#body_hlBulletinNavigateurWeb")
  console.log('clic sur le lien vers le bulletin')
  await awaitTimeout(5000)
  pages = await browser.pages()
  await pages[3].screenshot({path:'bulletin.png'})
  await pages[3].pdf({path: 'bulletin.pdf'}); //Ne fonctionne que en headless true
  console.log("génération du pdf")
  browser.close();
})();
