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
let categoryBtnContainer = document.querySelector(".category-btn-container");
// menu button container
let menuBtnContainer = document.querySelector(".menu-btn-container");
// menu item container
const sliderContainer = document.querySelector(".slider-container");
// date
let date = document.querySelector("#date");
// home btn
const homeBtn = document.querySelector(".home-btn");

// variables
let favouriteArray;
if (localStorage.getItem("favourite") === null) {
  favouriteArray = [];
  localStorage.setItem("favourite", JSON.stringify(favouriteArray));
} else {
  favouriteArray = JSON.parse(localStorage.getItem("favourite"));
}

let allItems = [];

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
  createCategoryBtns(bgImages) {
    // screen size is larger than 1069px
    let categoryBtns = [
      "összes",
      ...new Set(bgImages.map((item) => item.title)),
    ];

    categoryBtns = categoryBtns
      .map((item) => {
        return `<a id="${item}" role="button" class="btn category-btn" data-id="${item}">${item}</a>`;
      })
      .join("");

    categoryBtnContainer.innerHTML = categoryBtns;

    // functions
    this.displayBG(bgImages);
  }

  // show active button
  showActiveBtn(bgImages) {
    // variables
    let menuBtns = [...document.querySelectorAll(".menu-btn")];
    const categoryBtns = [...document.querySelectorAll(".category-btn")];

    // active category button on large screen
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

    // active menu button on small screen
    menuBtns.forEach((btn) => {
      btn.addEventListener("click", (e) => {
        menuBtns.forEach((item) => {
          // remove active from all
          item.classList.remove("active-btn");
        });

        // add active to current target
        e.currentTarget.classList.add("active-btn");
      });
    });

    this.displayBG(bgImages);
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

        bgImages.forEach((item) => {
          if (id === item.title) {
            document.querySelector(
              ".banner"
            ).style.background = `linear-gradient(rgba(0, 0, 0, 0.35), rgba(0, 0, 0, 0.35)), url(${item.image}) center/cover no-repeat`;
            bannerTitle.innerHTML = `${item.title}`;
            bannerSpan.style.opacity = 0;
          }

          if (id === "összes") {
            document.querySelector(
              ".banner"
            ).style.background = `linear-gradient(rgba(0, 0, 0, 0.35), rgba(0, 0, 0, 0.35)), url(./hero2.png) center/cover no-repeat`;
            bannerTitle.innerHTML = `Texas <span>Burger</span>`;
            bannerSpan.style.opacity = 1;
          }
        });
      });

      categoryBtnContainer.addEventListener("mouseleave", () => {
        if (btn.classList.contains("active-btn")) {
          const id = btn.dataset.id;

          bgImages.forEach((item) => {
            if (id === item.title) {
              document.querySelector(
                ".banner"
              ).style.background = `linear-gradient(rgba(0, 0, 0, 0.35), rgba(0, 0, 0, 0.35)), url(${item.image}) center/cover no-repeat`;
              bannerTitle.innerHTML = `${item.title}`;
              bannerSpan.style.opacity = 0;
            }

            if (id === "összes") {
              document.querySelector(
                ".banner"
              ).style.background = `linear-gradient(rgba(0, 0, 0, 0.35), rgba(0, 0, 0, 0.35)), url(./hero2.png) center/cover no-repeat`;
              bannerTitle.innerHTML = `Texas <span>Burger</span>`;
              bannerSpan.style.opacity = 1;
            }
          });
        }
      });
    });
  }

  displayMenuItems(menuItems) {
    // variables
    const btns = [...document.querySelectorAll(".btn")];

    // show all items on document load
    btns.forEach((btn) => {
      // variables
      let id = btn.dataset.id;

      // check where redirected is coming from
      const docReferrer = document.referrer;

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

      if (docReferrer && url === id) {
        // btn.classList.add("active-btn");
        // btn.style.transform = "translateY(-0.15rem)";

        let filtered = menuItems
          .filter((item) => {
            let itemClass = item.itemClass;
            for (let i = 0; i < menuItems.length + 1; i++) {
              if (itemClass[i] === id) {
                let items = itemClass[i];
                return items;
              }
            }
          })
          .map((item) => {
            return `<div class="slider" id="${item.id}">
                        <div class="star-container" id="${item.id}">
                            <i class="far fa-star favourite"></i>
                        </div>
                        <div class="slider-header">
                            <img src="${item.image}" class="slider-img" alt="${item.title}" srcset="">
                        </div>
                        <div class="slider-footer">
                            <div class="slider-info">
                                <h3 class="slider-name" data-id="${item.title}">${item.title}</h3>
                                <p class="slider-price">${item.price} Ft</p>  
                            </div>
                                <p class="slider-description">${item.description}</p>
                        </div>
                     </div>`;
          })
          .join("");

        sliderContainer.innerHTML = filtered;
      }

      if (url === id && id === "osszes") {
        // btn.classList.add("active-btn");
        // btn.style.transform = "translateY(-0.15rem)";

        let showAll = menuItems
          .map((item) => {
            return `<div class="slider" id="${item.id}">
                          <div class="star-container" id="${item.id}">
                              <i class="far fa-star favourite"></i>
                          </div>
                          <div class="slider-header">
                              <img src="${item.image}" class="slider-img" alt="${item.title}" srcset="">
                          </div>
                          <div class="slider-footer">
                              <div class="slider-info">
                                  <h3 class="slider-name" data-id="${item.title}">${item.title}</h3>
                                  <p class="slider-price">${item.price} Ft</p>  
                              </div>
                                  <p class="slider-description">${item.description}</p>
                          </div>
                       </div>`;
          })
          .join("");

        sliderContainer.innerHTML = showAll;
      }
    });

    document.addEventListener("click", (e) => {
      if (
        e.target.classList.contains("menu-btn") ||
        e.target.classList.contains("category-btn")
      ) {
        // variables
        const id = e.target.dataset.id;
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

        window.history.replaceState(null, "asd", [`${url}`]);

        // filter menu items
        btns.forEach(() => {
          let filtered = menuItems
            .filter((item) => {
              let itemClass = item.itemClass;
              for (let i = 0; i < menuItems.length + 1; i++) {
                if (itemClass[i] === id) {
                  let items = itemClass[i];
                  return items;
                }
              }
            })
            .map((item) => {
              return `<div class="slider" id="${item.id}">
                        <div class="star-container" id="${item.id}">
                            <i class="far fa-star favourite"></i>
                        </div>
                        <div class="slider-header">
                            <img src="${item.image}" class="slider-img" alt="${item.title}" srcset="">
                        </div>
                        <div class="slider-footer">
                            <div class="slider-info">
                                <h3 class="slider-name" data-id="${item.title}">${item.title}</h3>
                                <p class="slider-price">${item.price} Ft</p>  
                            </div>
                                <p class="slider-description">${item.description}</p>
                        </div>
                     </div>`;
            })
            .join("");

          sliderContainer.innerHTML = filtered;

          sliderContainer.classList.add("menu-animation");

          sliderContainer.addEventListener("animationend", () => {
            sliderContainer.classList.remove("menu-animation");
          });
        });

        // show all items on click event
        if (e.target.dataset.id === "összes") {
          let showAll = menuItems
            .map((item) => {
              return `<div class="slider" id="${item.id}">
                        <div class="star-container" id="${item.id}">
                            <i class="far fa-star favourite"></i>
                        </div>
                        <div class="slider-header">
                            <img src="${item.image}" class="slider-img" alt="${item.title}" srcset="">
                        </div>
                        <div class="slider-footer">
                            <div class="slider-info">
                                <h3 class="slider-name" data-id="${item.title}">${item.title}</h3>
                                <p class="slider-price">${item.price} Ft</p>  
                            </div>
                                <p class="slider-description">${item.description}</p>
                        </div>
                     </div>`;
            })
            .join("");

          sliderContainer.innerHTML = showAll;
        }
      }
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
    .then((bgImages) => ui.createCategoryBtns(bgImages))
    .then(
      products
        .getMenuItems()
        .then((menuItems) => ui.displayMenuItems(menuItems))
    )
    .then(ui.displayHomeBtn())
    .then(ui.displayDate());
});
