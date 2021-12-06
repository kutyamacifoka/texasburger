// CONTENTFUL CLIENT
const client = contentful.createClient({
  space: "xqnou2nkxleq",
  accessToken: "lF5PTQNlbRz1wEgULBrg_azhtUnPfe493uP88lRDRjc",
});

// VARIABLES
// navbar
const navbar = document.getElementById("navbar-collapse");
const navLink = [...document.querySelectorAll(".nav-link")];
// btn container
let btnContainer = document.querySelector(".btn-container");
// banner contiainer
let banner = document.querySelector(".banner");
// date
let date = document.querySelector("#date");
// home btn
const homeBtn = document.querySelector(".home-btn");

// variables
let favouriteArray = [];
let allItems = [];
let media = matchMedia("(min-width: 1024px)");

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
          const image = item.fields.image.fields.file.url;
          return { title, image };
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
    const bsCollapse = new bootstrap.Collapse(navbar);
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
    let menuBtns = ["all", ...new Set(bgImages.map((item) => item.title))];

    menuBtns = menuBtns
      .map((item) => {
        return `<button class="btn menu-btn" data-id="${item}">${item}`;
      })
      .join("");
    btnContainer.innerHTML = menuBtns;

    const btns = [...document.querySelectorAll(".menu-btn")];

    btns.forEach((btn) => {
      btn.addEventListener("mouseover", (e) => {
        const id = e.target.dataset.id;
        bgImages.forEach((item) => {
          if (id === item.title) {
            document.querySelector(
              ".banner"
            ).style.background = `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)),url(${item.image}) center/cover no-repeat`;
          }
          if (id === "all") {
            document.querySelector(
              ".banner"
            ).style.background = `url(./hero2.png) center/cover no-repeat`;
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
document.addEventListener("click", (e) => {
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
