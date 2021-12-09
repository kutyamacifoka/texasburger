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
  createCategoryBtns(bgImages) {
    // screen size is larger than 1069px
    let categoryBtns = [
      "összes",
      ...new Set(bgImages.map((item) => item.title)),
    ];
    if (media.matches) {
      categoryBtns = categoryBtns
        .map((item) => {
          return `<button class="btn category-btn" data-id="${item}">${item}`;
        })
        .join("");

      categoryBtnContainer.innerHTML = categoryBtns;
    }

    // screen size is smaller than 1069px
    if (!media.matches) {
      // get buttons
      let categoryBtns = [
        "összes",
        ...new Set(
          bgImages.map((item) => {
            let itemClass = item.itemClass[0];
            for (let i = 0; i < bgImages.length; i++) {
              if (itemClass[i] !== "large-image") {
                let buttons = itemClass[i];
                return buttons;
              }
            }
          })
        ),
      ]
        .map((item) => {
          return `<button class="btn category-btn" data-id="${item}">${item}`;
        })
        .join("");

      categoryBtnContainer.innerHTML = categoryBtns;
    }

    // functions
    this.displayMenuBtns(bgImages);
    this.displayBG(bgImages);

    return bgImages;
  }

  // display on small screen menu buttons
  displayMenuBtns(bgImages) {
    if (!media.matches) {
      // variables
      let categoryBtns = [...document.querySelectorAll(".category-btn")];

      // button events
      categoryBtns.forEach((btn) => {
        btn.addEventListener("click", (e) => {
          // disable category btns
          categoryBtns.forEach((item) => {
            item.disabled = true;
          });

          // add animation
          menuBtnContainer.classList.add("container-animation");
          menuBtnContainer.classList.add("active-container");

          // remove animation and enable buttons
          menuBtnContainer.addEventListener("animationend", () => {
            menuBtnContainer.classList.remove("container-animation");

            categoryBtns.forEach((item) => {
              item.disabled = false;
            });
          });

          // get button ID
          const id = e.currentTarget.dataset.id;

          // display menu category
          let filtered = bgImages
            .filter((item) => {
              let itemClass = item.itemClass[0];
              for (let i = 0; i < bgImages.length; i++) {
                if (id === itemClass[i]) {
                  let items = itemClass[i];
                  return items;
                }
              }
            })
            .map((item) => {
              return `<button class="btn menu-btn" data-id="${item.title}">${item.title}`;
            })
            .join("");

          menuBtnContainer.innerHTML = filtered;

          // functions
          this.displayBG(bgImages);
          this.showActiveBtn(bgImages);

          // display all menu item
          if (id === "összes") {
            let showAll = bgImages
              .map((item) => {
                return `<button class="btn menu-btn" data-id="${item.title}">${item.title}`;
              })
              .join("");

            menuBtnContainer.innerHTML = showAll;

            // functions
            this.displayBG(bgImages);
            this.showActiveBtn(bgImages);
          }
        });
      });
    }

    this.showActiveBtn(bgImages);
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
    });
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

      // on mouse leave, the banner is the last active item
      if (media.matches) {
        categoryBtnContainer.addEventListener("mouseleave", (e) => {
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
            });
          }
        });
      }
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

      // on mouse leave, the banner is the last active item
      if (!media.matches) {
        menuBtnContainer.addEventListener("mouseleave", (e) => {
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
            });
          }
        });
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
    .then((bgImages) => ui.createCategoryBtns(bgImages));
  // .then((bgImages) => ui.showActiveBtn(bgImages));
});
