/*
==========
CONTENTFUL CLIENT
========== 
*/

const client = contentful.createClient({
  space: "xqnou2nkxleq",
  accessToken: "lF5PTQNlbRz1wEgULBrg_azhtUnPfe493uP88lRDRjc",
});

/*
==========
GLOBAL SELECTORS
========== 
*/

// navbar
const navbar = document.querySelector(".navbar");
const navCollapse = document.getElementById("navbar-collapse");
const navLink = [...document.querySelectorAll(".nav-link")];
// banner container
let banner = document.querySelector(".banner");
let bannerTitle = document.querySelector(".banner-title");
let bannerSpan = document.querySelector(".banner-span");
// btn container
let categoryBtnContainer = document.querySelector(".category-btn-container");
// menu item container
const sliderContainer = document.querySelector(".slider-container");
// date
let date = document.querySelector("#date");
// home btn
const homeBtn = document.querySelector(".home-btn");

// create or parse back array on doc load
let favouriteArray;
if (localStorage.getItem("favourite") === null) {
  favouriteArray = [];
  localStorage.setItem("favourite", JSON.stringify(favouriteArray));
} else {
  favouriteArray = JSON.parse(localStorage.getItem("favourite"));
}

/*
==========
GLOBAL VARIABLES
========== 
*/

let allItems = [];
let images;

/*
==========
SERVER REQUESTS
========== 
*/

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
            if (item.fields.class[i] === "grid-item") {
              return item;
            }
          }
        })
        .map((item) => {
          const { title } = item.fields;
          const itemClass = [item.fields.class];
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
          const { price } = item.fields;
          const description =
            item.fields.description.content[0].content[0].value;
          const { id } = item.sys;
          const image = item.fields.image.fields.file.url;
          return { title, itemClass, price, description, id, image };
        });

      return menuItems;
    } catch (error) {
      console.log(error);
    }
  }
}

/*
==========
USER INTERFACE
========== 
*/

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
  createCategoryBtns(bgImages) {
    // screen size is larger than 1069px
    let categoryBtns = [
      "összes",
      ...new Set(bgImages.map((item) => item.title)),
    ];

    categoryBtns = categoryBtns
      .map((item) => {
        return `<p class="btn category-btn" data-id="${item}">${item}</p>`;
      })
      .join("");

    categoryBtnContainer.innerHTML = categoryBtns;

    // functions
    this.showActiveBtn();

    // copy images
    images = [...bgImages];
    return images;
  }

  // show active button
  showActiveBtn() {
    // variables
    const categoryBtns = [...document.querySelectorAll(".category-btn")];

    // active category button
    categoryBtns.forEach((btn) => {
      btn.addEventListener("click", (e) => {
        categoryBtns.forEach((item) => {
          // remove active from all
          item.classList.remove("active-btn");
          item.style.transform = "translateY(0)";
        });

        // add active to current target
        e.currentTarget.classList.add("active-btn");
        e.currentTarget.style.transform = "translateY(-0.15rem)";
      });
    });
  }

  // display background on hover
  displayBG(bgImages) {
    // variables
    const btns = [...document.querySelectorAll(".btn")];

    // button events
    btns.forEach((btn) => {
      btn.addEventListener("mouseover", (e) => {
        // get ID
        const id = e.target.dataset.id;
        // callback function
        this.filterBGs(bgImages, id);
      });

      categoryBtnContainer.addEventListener("mouseleave", () => {
        if (btn.classList.contains("active-btn")) {
          // get ID
          const id = btn.dataset.id;
          // callback function
          this.filterBGs(bgImages, id);
        }
      });
    });
  }

  displayMenuItems(menuItems) {
    // variables
    const categoryBtns = [...document.querySelectorAll(".category-btn")];
    // get url hash e.g "#pizza" etc.
    let url = window.location.hash;
    url = url.slice(1, url.length);
    url = url
      .replace(/á/g, "a")
      .replace(/ö/g, "o")
      .replace(/ő/g, "o")
      .replace(/ó/g, "o")
      .replace(/ü/g, "u")
      .replace(/ű/g, "u")
      .replace(/ú/g, "u")
      .replace(/í/g, "i")
      .replace(/é/g, "e");

    // set bg image on doc load
    this.filterBGs(images, url);

    // show menu items on document load
    categoryBtns.forEach((btn) => {
      // get id
      let id = btn.dataset.id;

      id = id
        .replace(/á/g, "a")
        .replace(/ö/g, "o")
        .replace(/ő/g, "o")
        .replace(/ó/g, "o")
        .replace(/ü/g, "u")
        .replace(/ű/g, "u")
        .replace(/ú/g, "u")
        .replace(/í/g, "i")
        .replace(/é/g, "e");

      // filter & display products on doc load, show active btn
      if (url === id) {
        btn.classList.add("active-btn");
        btn.style.transform = "translateY(-0.15rem)";

        // callback function
        this.filteredProducts(menuItems, btn, url);
      }

      // display all products on doc load, show active btn
      if (url === id && id === "osszes") {
        btn.classList.add("active-btn");
        btn.style.transform = "translateY(-0.15rem)";

        // callback function
        this.allProducts(menuItems, btn);
      }

      btn.addEventListener("click", (e) => {
        // get url
        let url = window.location.hash;
        url = url.replace(url, `#${id}`);
        url = url
          .replace(/á/g, "a")
          .replace(/ö/g, "o")
          .replace(/ő/g, "o")
          .replace(/ó/g, "o")
          .replace(/ü/g, "u")
          .replace(/ű/g, "u")
          .replace(/ú/g, "u")
          .replace(/í/g, "i")
          .replace(/é/g, "e");

        // change current url on click
        window.history.replaceState(null, "Texas Burger", [`${url}`]);

        // filter & display products on click, show active btn
        if (
          e.target.classList.contains("category-btn") &&
          e.target.dataset.id !== "összes"
        ) {
          // callback function
          this.filteredProducts(menuItems, btn);
          this.addFavourites();
        }

        // display all products on click, show active btn
        if (e.target.dataset.id === "összes") {
          // callback function
          this.allProducts(menuItems);
          this.addFavourites();
        }
      });
    });
    return menuItems;
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

  /*
  ==========
  CALLBACK FUNCTIONS
  ========== 
  */

  filteredProducts(menuItems, btn) {
    let filtered = menuItems
      .filter((item) => {
        let itemClass = item.itemClass;
        const productID = btn.dataset.id;
        for (let i = 0; i < menuItems.length; i++) {
          if (itemClass[i] == productID && !undefined) {
            let values = itemClass[i];
            return values;
          }
        }
      })
      .map((product) => {
        return `<div class="slider" id="${product.id}">
                              <div class="star-container" id="${product.id}">
                              </div>
                              <div class="slider-header">
                                  <img src="${product.image}" class="slider-img" alt="${product.title}" srcset="">
                              </div>
                              <div class="slider-footer">
                                  <div class="slider-info">
                                      <h3 class="slider-name" data-id="${product.title}">${product.title}</h3>
                                      <p class="slider-price">${product.price} Ft</p>
                                  </div>
                                      <p class="slider-description">${product.description}</p>
                              </div>
                </div>`;
      })
      .join("");

    sliderContainer.innerHTML = filtered;

    sliderContainer.classList.add("menu-animation");

    sliderContainer.addEventListener("animationend", () => {
      sliderContainer.classList.remove("menu-animation");
    });
  }

  allProducts(menuItems) {
    let showAll = menuItems
      .map((product) => {
        return `<div class="slider" id="${product.id}">
                              <div class="star-container" id="${product.id}">
                              </div>
                              <div class="slider-header">
                                  <img src="${product.image}" class="slider-img" alt="${product.title}" srcset="">
                              </div>
                              <div class="slider-footer">
                                  <div class="slider-info">
                                      <h3 class="slider-name" data-id="${product.title}">${product.title}</h3>
                                      <p class="slider-price">${product.price} Ft</p>
                                  </div>
                                      <p class="slider-description">${product.description}</p>
                              </div>
                        </div>`;
      })
      .join("");

    sliderContainer.innerHTML = showAll;
  }

  // add items to storage, delete from storage, set icons on document load
  addFavourites(menuItems) {
    const starContainer = [...document.querySelectorAll(".star-container")];

    starContainer.forEach((container) => {
      // variables
      let itemID = container.id;
      let itemTitle =
        container.parentElement.children[2].children[0].children[0].dataset.id;
      let image = container.parentElement.children[1].children[0].src;
      let id = { itemTitle, itemID, image };

      // get items from local storage
      favouriteArray = JSON.parse(localStorage.getItem("favourite"));

      // check if item ID is in the storage
      let inStorage = favouriteArray.find((item) => item.itemID === itemID);

      // set icons on document load
      inStorage
        ? (container.innerHTML = `<i class="fas fa-star unfavourite"></i>`)
        : (container.innerHTML = `<i class="far fa-star favourite"></i>`);

      container.addEventListener("click", (e) => {
        if (e.target.classList.contains("unfavourite")) {
          // change icon
          container.innerHTML = `<i class="far fa-star favourite"></i>`;
          // remove item from local storage
          favouriteArray = favouriteArray.filter((item) => {
            if (item.itemID !== itemID) {
              return item;
            }
          });

          // update storage
          Storage.saveFavourite();
        }

        if (e.target.classList.contains("favourite")) {
          // change icon
          container.innerHTML = `<i class="fas fa-star unfavourite"></i>`;

          // add to local storage
          favouriteArray.push(id);

          // update storage
          Storage.saveFavourite();
        }
      });
    });
    return menuItems;
  }

  // change background based on product
  filterBGs(bgImages, id, url) {
    bgImages.forEach((item) => {
      // change on doc load
      if (item.title === url) {
        document.querySelector(
          ".banner"
        ).style.background = `linear-gradient(rgba(0, 0, 0, 0.35), rgba(0, 0, 0, 0.35)), url(${item.image}) center/cover no-repeat`;
        bannerTitle.innerHTML = `${item.title}`;
        bannerSpan.style.opacity = 0;
      }

      // show individual product
      if (id === item.title) {
        document.querySelector(
          ".banner"
        ).style.background = `linear-gradient(rgba(0, 0, 0, 0.35), rgba(0, 0, 0, 0.35)), url(${item.image}) center/cover no-repeat`;
        bannerTitle.innerHTML = `${item.title}`;
        bannerSpan.style.opacity = 0;
      }

      // show all product
      if (id === "összes") {
        document.querySelector(
          ".banner"
        ).style.background = `linear-gradient(rgba(0, 0, 0, 0.35), rgba(0, 0, 0, 0.35)), url(./hero2.png) center/cover no-repeat`;
        bannerTitle.innerHTML = `Texas <span>Burger</span>`;
        bannerSpan.style.opacity = 1;
      }
    });
  }
}

/*
==========
STORAGE FUNCTIONS
========== 
*/

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
    .then((bgImages) => ui.createCategoryBtns(bgImages))
    .then((bgImages) => ui.displayBG(bgImages));

  products
    .getMenuItems()
    .then((menuItems) => ui.displayMenuItems(menuItems))
    .then((menuItems) => ui.addFavourites(menuItems))
    .then(ui.displayHomeBtn())
    .then(ui.displayDate());
});
