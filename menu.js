// CONTENTFUL CLIENT
const client = contentful.createClient({
  space: "xqnou2nkxleq",
  accessToken: "lF5PTQNlbRz1wEgULBrg_azhtUnPfe493uP88lRDRjc",
});

// VARIABLES
// navbar
const navbar = document.querySelector(".navbar");
const navCollapse = document.getElementById("navbar-collapse");
const navLink = [...document.querySelectorAll(".nav-link")];
// banner container
let banner = document.querySelector(".banner");
let bannerTitle = document.querySelector(".banner-title");
let bannerSpan = document.querySelector(".banner-span");
// btn container
let btnContainer = document.querySelector(".btn-container");
// menu container
let menuBtnContainer = document.querySelector(".menu-btn-container");
// date
let date = document.querySelector("#date");
// home btn
const homeBtn = document.querySelector(".home-btn");

// variables
let favouriteArray = [];
let allItems = [];
let media = matchMedia("(min-width: 1069px)");

// CLASSES
// get products
class Products {
  async getBgImages() {
    try {
      let contentful = await client.getEntries({
        content_type: "texasBurger",
      });

      let bgImages = await contentful.items;
      bgImages = bgImages
        .filter((item) => {
          for (let i = 0; i < bgImages.length; i++) {
            if (item.fields.class[i] === "large-image") {
              return item;
            }
          }
        })
        .map((item) => {
          const { title } = item.fields;
          const itemClass = [{ ...item.fields.class }];
          const image = item.fields.image.fields.file.url;
          return { title, itemClass, image };
        });

      return bgImages;
    } catch (error) {
      console.log(error);
    }
  }

  async getMenuItems() {
    try {
      let contentful = await client.getEntries({
        content_type: "texasBurger",
      });

      let menuItems = await contentful.items;
      menuItems = menuItems
        .filter((item) => {
          for (let i = 0; i < menuItems.length; i++) {
            if (item.fields.class[i] === "menu-item") {
              return item;
            }
          }
        })
        .map((item) => {
          const { title } = item.fields;
          const itemClass = item.fields.class;
          const { id } = item.sys;
          const image = item.fields.image.fields.file.url;
          return { title, itemClass, id, image };
        });

      return menuItems;
    } catch (error) {
      console.log(error);
    }
  }
}

// display products
class UI {
  // navbar collapse
  static navCollapse(e) {
    const bsCollapse = new bootstrap.Collapse(navCollapse);
    if (e.target === navLink) {
      navLink.forEach((item) => {
        item.addEventListener("click", () => {
          bsCollapse.toggle();
        });
      });
    }
  }

  // create menu btns
  createMenuBtns(bgImages) {
    let menuBtns = ["összes", ...new Set(bgImages.map((item) => item.title))];

    // screen size is larger than 1069px
    if (media.matches) {
      menuBtns = menuBtns
        .map((item) => {
          return `<button class="btn menu-btn" data-id="${item}">${item}`;
        })
        .join("");
      btnContainer.innerHTML = menuBtns;
    }

    // screen size is smaller than 1069px
    if (!media.matches) {
      btnContainer.classList.add("max-container-width");
      btnContainer.innerHTML = `<button class="btn menu-btn" data-id="összes">összes
                                <button class="btn menu-btn" data-id="foods">étlap
                                <button class="btn menu-btn" data-id="drinks">itallap
                                <button class="btn menu-btn" data-id="other">egyéb`;
    }

    this.displayMenuBtns(bgImages);
    this.displayBG(bgImages);
    return bgImages;
  }

  displayMenuBtns(bgImages) {
    document.addEventListener("click", (e) => {
      const id = e.target.dataset.id;

      // get foods
      if (id === "foods") {
        let foods = bgImages.filter((item) => {
          let itemClass = item.itemClass[0];
          for (let i = 0; i < bgImages.length; i++) {
            if (itemClass[i] === "food") {
              return item;
            }
          }
        });
        foods = foods
          .map((item) => {
            return `<button class="btn menu-btn" data-id="${item.title}">${item.title}`;
          })
          .join("");

        menuBtnContainer.innerHTML = foods;
      }

      // get drinks
      if (id === "drinks") {
        let drinks = bgImages.filter((item) => {
          let itemClass = item.itemClass[0];
          for (let i = 0; i < bgImages.length; i++) {
            if (itemClass[i] === "drink") {
              return item;
            }
          }
        });
        drinks = drinks
          .map((item) => {
            return `<button class="btn menu-btn" data-id="${item.title}">${item.title}`;
          })
          .join("");

        menuBtnContainer.innerHTML = drinks;
      }

      // get other
      if (id === "other") {
        let others = bgImages.filter((item) => {
          let itemClass = item.itemClass[0];
          for (let i = 0; i < bgImages.length; i++) {
            if (itemClass[i] === "other") {
              return item;
            }
          }
        });
        others = others
          .map((item) => {
            return `<button class="btn menu-btn" data-id="${item.title}">${item.title}`;
          })
          .join("");

        menuBtnContainer.innerHTML = others;
      }

      // get all items
      if (id === "összes" && !media.matches) {
        let menuBtns = [...new Set(bgImages.map((item) => item.title))];

        menuBtns = menuBtns
          .map((item) => {
            return `<button class="btn menu-btn" data-id="${item}">${item}`;
          })
          .join("");
        menuBtnContainer.innerHTML = menuBtns;
      }
    });
  }

  // display background on hover
  displayBG(bgImages) {
    const btns = [...document.querySelectorAll(".menu-btn")];
    btns.forEach((btn) => {
      btn.addEventListener("mouseover", (e) => {
        const id = e.target.dataset.id;
        bgImages.forEach((item) => {
          if (id === item.title) {
            document.querySelector(
              ".banner"
            ).style.background = `linear-gradient(rgba(0, 0, 0, 0.35), rgba(0, 0, 0, 0.35)),url(${item.image}) center/cover no-repeat`;
            bannerTitle.innerHTML = `<h1 class="banner-bg">${item.title}</h1>`;
            bannerSpan.style.display = "none";
          }
          if (id === "összes") {
            document.querySelector(
              ".banner"
            ).style.background = `linear-gradient(rgba(0, 0, 0, 0.35), rgba(0, 0, 0, 0.35)),url(./hero2.png) center/cover no-repeat`;
            bannerTitle.innerHTML = `Texas <span>Burger</span=>
            </h1>`;
            bannerSpan.style.display = "flex";
          }
        });
      });
    });
  }

  // show home button
  displayHomeBtn() {
    window.addEventListener("scroll", () => {
      scrollY > 50
        ? homeBtn.classList.add("show-home-btn")
        : homeBtn.classList.remove("show-home-btn");
    });
  }

  // show date
  displayDate() {
    date.innerHTML = new Date().getFullYear();
  }
}

// save to local storage
class Storage {
  static saveFavourite() {
    localStorage.setItem("favourite", JSON.stringify(favouriteArray));
  }

  static getFavourite() {
    favouriteArray = JSON.parse(localStorage.getItem("favourite"));
  }
}

// collapse navbar
navCollapse.addEventListener("click", (e) => {
  if (window.innerWidth < 992) {
    UI.navCollapse(e);
  }
});

document.addEventListener("DOMContentLoaded", () => {
  const ui = new UI();
  const products = new Products();

  products
    .getBgImages()
    .then(products.getMenuItems())
    .then((bgImages) => ui.createMenuBtns(bgImages));
});
