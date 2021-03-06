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
const bannerContainer = document.getElementById("banner-container");
let banner = document.querySelector(".banner");
let bannerTitle = document.querySelector(".banner-title");
let bannerSpan = document.querySelector(".banner-span");
// btn container
let categoryBtnContainer = document.querySelector(".category-btn-container");
// menu item container
const sliderContainer = document.querySelector(".slider-container");
// side menu
const sideMenu = document.querySelector("#side-menu");
const sideMenuIcon = [...document.querySelectorAll(".side-icon")];
const sideMenuBtnContainer = document.querySelector(".side-menu-btn-container");
const sideMenuArrowContainer = document.querySelector(
  ".side-menu-arrow-container"
);
// home btn
const homeBtn = document.querySelector(".home-btn");
// date
let date = document.querySelector("#date");

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
let url = window.location.hash;
const media = matchMedia("(min-width: 1900px)");
let activeBtn;
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
          let dataset = title;
          dataset = UI.replaceLetters(dataset);
          return { title, itemClass, image, dataset };
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
          for (let i = 0; i < menuItems.length; i++) {
            if (itemClass[i] !== undefined && itemClass[i] !== "menu-item") {
              itemClass[i] = UI.replaceLetters(itemClass[i]);
            }
          }
          const { price } = item.fields;
          const description =
            item.fields.description.content[0].content[0].value;
          const ingredients =
            item.fields.ingredients.content[0].content[0].value;
          const { id } = item.sys;
          const image = item.fields.image.fields.file.url;
          return {
            title,
            itemClass,
            price,
            description,
            ingredients,
            id,
            image,
          };
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
      "??sszes",
      ...new Set(bgImages.map((item) => item.title)),
    ];

    let sideBtns = [...categoryBtns];

    categoryBtns = categoryBtns
      .map((item) => {
        const id = UI.replaceLetters(item);
        return `<p class="btn category-btn menu-btn" data-id="${id}">${item}</p>`;
      })
      .join("");

    categoryBtnContainer.innerHTML = categoryBtns;

    sideBtns = sideBtns
      .map((item) => {
        const id = UI.replaceLetters(item);
        return `<p class="btn side-menu-btn menu-btn" data-id="${id}">${item}</p>`;
      })
      .join("");

    sideMenuBtnContainer.innerHTML = sideBtns;

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
    const sideMenuBtns = [...document.querySelectorAll(".side-menu-btn")];
    const menuBtns = [...document.querySelectorAll(".menu-btn")];

    url = url.slice(1, url.length);

    // active category button
    menuBtns.forEach((btn) => {
      const id = btn.dataset.id;

      // add active class to button
      if (id === url) {
        btn.classList.add("active-btn");
        activeBtn = btn;
      }

      // display active btn on click
      btn.addEventListener("click", (e) => {
        menuBtns.forEach((item) => {
          // remove active from all
          item.classList.remove("active-btn");
        });

        // variables
        const id = e.currentTarget.dataset.id;

        // add active to side menu btns
        if (e.currentTarget.classList.contains("category-btn")) {
          sideMenuBtns.forEach((sideBtn) => {
            if (sideBtn.dataset.id === id) {
              sideBtn.classList.add("active-btn");
            }
          });
        }

        // add active to category btns
        if (e.currentTarget.classList.contains("side-menu-btn")) {
          categoryBtns.forEach((categoryBtn) => {
            if (categoryBtn.dataset.id === id) {
              categoryBtn.classList.add("active-btn");
            }
          });
        }

        // add active to current target
        e.currentTarget.classList.add("active-btn");
      });
    });
  }

  // display background on hover
  displayBG(bgImages) {
    // variables
    const menuBtns = [...document.querySelectorAll(".menu-btn")];
    const categoryBtnContainer = document.querySelector(
      ".category-btn-container"
    );
    const sideBtnContainer = document.querySelector(".side-menu-btn-container");

    bgImages.forEach((item) => {
      const title = item.dataset;

      menuBtns.forEach((btn) => {
        btn.addEventListener("mouseover", (e) => {
          // get ID
          const id = e.target.dataset.id;

          if (title === id) {
            banner.style.background = `linear-gradient(rgba(0, 0, 0, 0.35), rgba(0, 0, 0, 0.35)), url(${item.image}) center/cover no-repeat`;
            bannerTitle.innerHTML = `${item.title}`;
            bannerSpan.style.opacity = 0;
          }

          if (id === "osszes") {
            banner.style.background = `linear-gradient(rgba(0, 0, 0, 0.35), rgba(0, 0, 0, 0.35)), url(./hero.jpg) center/cover no-repeat`;
            bannerTitle.innerHTML = `Texas <span>Burger</span>`;
            bannerSpan.style.opacity = 1;
          }
        });

        categoryBtnContainer.addEventListener("mouseleave", () => {
          // get ID
          const id = btn.dataset.id;

          if (btn.classList.contains("active-btn") && title === id) {
            banner.style.background = `linear-gradient(rgba(0, 0, 0, 0.35), rgba(0, 0, 0, 0.35)), url(${item.image}) center/cover no-repeat`;
            bannerTitle.innerHTML = `${item.title}`;
            bannerSpan.style.opacity = 0;
          }

          if (btn.classList.contains("active-btn") && id === "osszes") {
            banner.style.background = `linear-gradient(rgba(0, 0, 0, 0.35), rgba(0, 0, 0, 0.35)), url(./hero.jpg) center/cover no-repeat`;
            bannerTitle.innerHTML = `Texas <span>Burger</span>`;
            bannerSpan.style.opacity = 1;
          }
        });

        sideBtnContainer.addEventListener("mouseleave", () => {
          // get ID
          const id = btn.dataset.id;

          if (btn.classList.contains("active-btn") && title === id) {
            banner.style.background = `linear-gradient(rgba(0, 0, 0, 0.35), rgba(0, 0, 0, 0.35)), url(${item.image}) center/cover no-repeat`;
            bannerTitle.innerHTML = `${item.title}`;
            bannerSpan.style.opacity = 0;
          }

          if (btn.classList.contains("active-btn") && id === "osszes") {
            banner.style.background = `linear-gradient(rgba(0, 0, 0, 0.35), rgba(0, 0, 0, 0.35)), url(./hero.jpg) center/cover no-repeat`;
            bannerTitle.innerHTML = `Texas <span>Burger</span>`;
            bannerSpan.style.opacity = 1;
          }
        });
      });
    });
  }

  displayMenuItems(menuItems) {
    // variables
    const menuBtns = [...document.querySelectorAll(".menu-btn")];
    const categoryBtn = document.querySelector(".category-btn");
    const sideMenuBtn = document.querySelector(".side-menu-btn");
    let id;

    // set default button if url !== btn id
    if (activeBtn == undefined || null) {
      id = `osszes`;
      location.href = `#${id}`;

      categoryBtn.classList.add("active-btn");
      sideMenuBtn.classList.add("active-btn");
    } else {
      id = activeBtn.dataset.id;
    }

    // set bg image on doc load
    images.forEach((item) => {
      const title = item.dataset;

      // change on doc load
      if (title === url) {
        banner.style.background = `linear-gradient(rgba(0, 0, 0, 0.35), rgba(0, 0, 0, 0.35)), url(${item.image}) center/cover no-repeat`;
        bannerTitle.innerHTML = `${item.title}`;
        bannerSpan.style.opacity = 0;
      }
    });

    // filter & display products on doc load
    if (url === id) {
      // callback function
      this.filteredProducts(menuItems, activeBtn);
    }

    // display all products on doc load
    if (id === "osszes") {
      // callback function
      this.allProducts(menuItems, activeBtn);
    }

    menuBtns.forEach((btn) => {
      btn.addEventListener("click", (e) => {
        // get id
        const id = e.target.dataset.id;

        // change current url on click
        url = url.replace(url, `#${id}`);

        // replace url
        window.history.replaceState({ id }, "Texas Burger", [`${url}`]);

        // filter & display products on click
        if (id !== "osszes") {
          // callback function
          this.filteredProducts(menuItems, btn);
          this.addFavourites();
        }

        // display all products on click
        if (id === "osszes") {
          // callback function
          this.allProducts(menuItems);
          this.addFavourites();
        }
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

  // display side menu / change how many products displayed at once
  displaySideMenu() {
    // display side menu on scroll & no button press
    window.addEventListener("scroll", () => {
      const bannerContainerHeight =
        bannerContainer.getBoundingClientRect().height;
      const scrollHeight = scrollY > bannerContainerHeight;

      // if scrollHeight true && and side menu NOT locked with button
      if (scrollHeight && !sideMenu.classList.contains("locked")) {
        // set container's display
        sideMenu.style.display = "grid";
        sideMenuArrowContainer.style.display = "grid";

        // remove hide animation from containers
        sideMenu.classList.remove("animation-hide");
        sideMenuArrowContainer.classList.remove("animation-hide");

        // add show animation to containers
        sideMenu.classList.add("animation-show");
        sideMenuArrowContainer.classList.add("animation-show");

        // on animation end display remains
        sideMenu.addEventListener("animationend", () => {
          sideMenu.style.display = "grid";
        });

        sideMenuArrowContainer.addEventListener("animationend", () => {
          sideMenuArrowContainer.style.display = "grid";
        });
      }

      // if scrollHeight true && and side menu LOCKED with button
      if (scrollHeight && sideMenu.classList.contains("locked")) {
        // set container's display
        sideMenuArrowContainer.style.display = "grid";

        // remove hide animation from container
        sideMenuArrowContainer.classList.remove("animation-hide");

        // add show animation to container
        sideMenuArrowContainer.classList.add("animation-show");

        // on animation end display remains
        sideMenuArrowContainer.addEventListener("animationend", () => {
          sideMenuArrowContainer.style.display = "grid";
        });
      }

      // if scrollHeight false (less than 850)
      if (!scrollHeight) {
        // remove animation
        sideMenu.classList.remove("animation-show");
        sideMenuArrowContainer.classList.remove("animation-show");

        // add animation
        sideMenu.classList.add("animation-hide");
        sideMenuArrowContainer.classList.add("animation-hide");

        // on animation end display remains
        sideMenu.addEventListener("animationend", () => {
          sideMenu.style.display = "none";
        });

        sideMenuArrowContainer.addEventListener("animationend", () => {
          sideMenuArrowContainer.style.display = "none";
        });
      }
    });

    // change how many products are displayed
    sideMenuIcon.forEach((btn) => {
      btn.addEventListener("click", (e) => {
        const slider = [...document.querySelectorAll(".slider")];

        if (e.target.classList.contains("fa-th")) {
          this.changeProductLayout(
            sliderContainer,
            slider,
            250,
            350,
            "grid",
            "column",
            "auto",
            "385px"
          );
        }

        if (e.target.classList.contains("fa-th-large")) {
          this.changeProductLayout(
            sliderContainer,
            slider,
            250,
            550,
            "grid",
            "column",
            "auto",
            "385px"
          );
        }

        if (e.target.classList.contains("fa-th-list")) {
          this.changeProductLayout(
            sliderContainer,
            slider,
            250,
            725,
            "flex",
            "row",
            "500px",
            "100%"
          );
        }
      });
    });

    // display or hide side menu on click
    sideMenuArrowContainer.addEventListener("click", (e) => {
      if (e.target.classList.contains("side-arrow")) {
        // toggle locked class
        sideMenu.classList.toggle("locked");
        e.currentTarget.classList.toggle("show-arrow");

        // if side menu is locked, change button HTML
        sideMenu.classList.contains("locked")
          ? (sideMenuArrowContainer.innerHTML = `<i class="fas fa-angle-double-right side-arrow"></i>`)
          : (sideMenuArrowContainer.innerHTML = `<i class="fas fa-angle-double-left side-arrow"></i>`);
      }

      if (sideMenu.classList.contains("locked")) {
        sideMenu.classList.remove("animation-show");
        sideMenu.classList.add("animation-hide");

        sideMenu.addEventListener("animationend", () => {
          sideMenu.style.display = "none";
        });
      }

      if (!sideMenu.classList.contains("locked")) {
        sideMenu.style.display = "grid";

        sideMenu.classList.remove("animation-hide");
        sideMenu.classList.add("animation-show");

        sideMenu.addEventListener("animationend", () => {
          sideMenu.style.display = "grid";
        });
      }
    });
  }

  changeProductLayout(
    sliderContainer,
    slider,
    min,
    max,
    display,
    direction,
    slideHeight,
    imgHeight
  ) {
    // variable
    const sliderHeader = [...document.querySelectorAll(".slider-header")];

    // change max-width of slider container
    sliderContainer.style.gridTemplateColumns = `repeat(auto-fit, minmax(${min}px, ${max}px))`;

    // change height, display & flexdirection of every slider
    slider.forEach((slide) => {
      slide.style.display = `${display}`;
      slide.style.flexDirection = `${direction}`;
      slide.style.height = `${slideHeight}`;
    });

    // change the height of the images
    sliderHeader.forEach((header) => {
      header.style.height = `${imgHeight}`;
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
        for (let i = 0; i < 3; i++) {
          if (itemClass[i] == productID) {
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
                                  <p id="${product.id}" class="storage-text"></p>
                                  <img src="${product.image}" class="slider-img" alt="${product.title}" srcset="">
                              </div>
                              <div class="slider-footer">
                                  <div>
                                       <h3 class="slider-name" data-id="${product.title}">${product.title}</h3>
                                       <p class="slider-price">${product.price}</p>
                                  </div> 
                                  <p class="slider-description">${product.description}</p>
                                  <p class="slider-ingredients">${product.ingredients}</p>
                              </div>
                </div>`;
      })
      .join("");

    sliderContainer.innerHTML = filtered;
  }

  allProducts(menuItems) {
    let showAll = menuItems
      .map((product) => {
        return `<div class="slider" id="${product.id}">
                              <div class="star-container" id="${product.id}">

                              </div>
                              <div class="slider-header">
                                  <p id="${product.id}" class="storage-text"></p>
                                  <img src="${product.image}" class="slider-img" alt="${product.title}" srcset="">
                              </div>
                              <div class="slider-footer">
                                  <div>
                                       <h3 class="slider-name" data-id="${product.title}">${product.title}</h3>
                                       <p class="slider-price">${product.price}</p>
                                  </div> 
                                  <p class="slider-description">${product.description}</p>
                                  <p class="slider-ingredients">${product.ingredients}</p>
                              </div>
                        </div>`;
      })
      .join("");

    sliderContainer.innerHTML = showAll;
  }

  // add items to storage, delete from storage, set icons on document load
  addFavourites() {
    const starContainer = [...document.querySelectorAll(".star-container")];
    const storageText = [...document.querySelectorAll(".storage-text")];

    starContainer.forEach((container) => {
      // variables
      let itemID = container.id;
      let itemTitle =
        container.parentElement.children[2].children[0].children[0].dataset.id;
      let image = container.parentElement.children[1].children[1].src;
      let ingredients =
        container.parentElement.children[2].children[2].textContent;
      let id = { itemTitle, itemID, image, ingredients };

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

          // change text on click + animations
          storageText.forEach((text) => {
            if (text.id === container.id) {
              text.textContent = `elt??volt??tva a kedvencekb??l`;
              text.classList.add("show-text");
              text.classList.remove("hide-text");

              text.addEventListener("animationend", () => {
                text.classList.add("hide-text");
                text.classList.remove("show-text");
              });
            }
          });

          // update storage
          Storage.saveFavourite();
        }

        if (e.target.classList.contains("favourite")) {
          // change icon
          container.innerHTML = `<i class="fas fa-star unfavourite"></i>`;

          // change text on click + animations
          storageText.forEach((text) => {
            if (text.id === container.id) {
              text.textContent = `hozz??adva a kedvencekhez`;
              text.classList.add("show-text");
              text.classList.remove("hide-text");

              text.addEventListener("animationend", () => {
                text.classList.add("hide-text");
                text.classList.remove("show-text");
              });
            }
          });

          // add to local storage
          favouriteArray.push(id);

          // update storage
          Storage.saveFavourite();
        }
      });
    });
  }

  static replaceLetters(value) {
    // get url
    value = value
      .replace(/??/g, "a")
      .replace(/??/g, "o")
      .replace(/??/g, "o")
      .replace(/??/g, "o")
      .replace(/??/g, "u")
      .replace(/??/g, "u")
      .replace(/??/g, "u")
      .replace(/??/g, "i")
      .replace(/??/g, "e");

    return value;
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
    .then((bgImages) => ui.displayBG(bgImages))
    .then(
      products
        .getMenuItems()
        .then((menuItems) => ui.displayMenuItems(menuItems))
        .then((menuItems) => ui.addFavourites(menuItems))
    )
    .then(ui.displaySideMenu())
    .then(ui.displayHomeBtn())
    .then(ui.displayDate());
});
