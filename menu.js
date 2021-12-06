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
  async getMenuGridItems() {
    try {
      let contentful = await client.getEntries({
        content_type: "texasBurger",
      });

      let gridItems = await contentful.items;
      gridItems = gridItems
        .filter((item) => {
          for (let i = 0; i < gridItems.length; i++) {
            if (
              item.fields.class[i] === "grid-item" ||
              item.fields.class[i] === "large-grid-item"
            ) {
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

      return gridItems;
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
    navLink.forEach((item) => {
      if (e.target === item) {
        item.addEventListener("click", () => {
          bsCollapse.Collapse();
        });
      }
    });
  }

  // create menu btns
  createMenuBtns(gridItems) {
    let bg = gridItems.map((item) => {
      const { title } = item;
      const image = item.image;
      return { title, image };
    });

    let menuBtns = ["all", ...new Set(gridItems.map((item) => item.title))];

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
        bg.forEach((test) => {
          if (id === test.title) {
            document.querySelector(
              ".banner"
            ).style.background = `url(./emerson-vieira-cpkPJ-U9eUM-unsplash.jpg) center/cover no-repeat`;
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

// collapse navbar
navbar.addEventListener("click", (e) => {
  UI.navCollapse(e);
});

// save to local storage
class Storage {
  static saveFavourite() {
    localStorage.setItem("favourite", JSON.stringify(favouriteArray));
  }

  static getFavourite() {
    favouriteArray = JSON.parse(localStorage.getItem("favourite"));
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const ui = new UI();
  const products = new Products();

  products
    .getMenuGridItems()
    .then(products.getMenuItems())
    .then((gridItems) => ui.createMenuBtns(gridItems));
});
