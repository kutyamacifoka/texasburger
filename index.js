// CONTENTFUL CLIENT
const client = contentful.createClient({
  space: "xqnou2nkxleq",
  accessToken: "lF5PTQNlbRz1wEgULBrg_azhtUnPfe493uP88lRDRjc",
});

// VARIABLES
// menu grid
let menuGrid = document.querySelector(".menu-grid-container");
// menu slider
let menuSlider = document.getElementById("menu-slider-container");
let menuSliderTitle = document.querySelectorAll(".menu-slider-title");
let sliderContainer = document.querySelector(".slider-container");
let popularContainer = document.querySelector(".popular-container");
const sliderBtns = [...document.querySelectorAll(".slider-btn")];
// date
let date = document.querySelector("#date");
// home btn
const homeBtn = document.querySelector(".home-btn");

// local storage
let favouriteArray;
let allItems = [];

// media query
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
        .map((item) => {
          const { title } = item.fields;
          const itemClass = item.fields.class;
          const { id } = item.sys;
          const image = item.fields.image.fields.file.url;
          return { title, itemClass, id, image };
        })
        .filter((item) => {
          for (let i = 0; i < gridItems.length; i++) {
            if (
              item.itemClass[i] === "grid-item" ||
              item.itemClass[i] === "large-grid-item"
            ) {
              return item;
            }
          }
        });

      return gridItems;
    } catch (error) {
      console.log(error);
    }
  }

  async getSliderItems() {
    try {
      let contentful = await client.getEntries({
        content_type: "texasBurger",
      });

      let sliderItems = await contentful.items;
      sliderItems = sliderItems
        .map((item) => {
          const { title } = item.fields;
          const itemClass = item.fields.class;
          const { id } = item.sys;
          const image = item.fields.image.fields.file.url;
          return { title, itemClass, id, image };
        })
        .filter((item) => {
          for (let i = 0; i < sliderItems.length; i++) {
            if (item.itemClass[i] === "slider-item") {
              return item;
            }
          }
        });

      return sliderItems;
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
        .map((item) => {
          const { title } = item.fields.title;
          const itemClass = item.fields.class;
          const { id } = item.sys;
          const image = item.fields.image.fields.file.url;
          return { title, itemClass, id, image };
        })
        .filter((item) => {
          for (let i = 0; i < menuItems.length; i++) {
            return item;
          }
        });

      return menuItems;
    } catch (error) {
      console.log(error);
    }
  }
}

// display products
class UI {
  // display grid items
  displayMenuGridItems(gridItems) {
    gridItems = gridItems
      .map((item) => {
        const lgGrid = item.itemClass.find(
          (grid) => grid === "large-grid-item"
        );
        if (lgGrid) {
          return `<div class="menu-grid-item lg-menu-grid-item">
                <img src="${item.image}" class="menu-grid-img lg-grid-img" id="${item.id}" alt="${item.title}" srcset="">
                <p class="lg-menu-grid-title" data-id="${item.title}">${item.title}</p>
            </div>`;
        }
        return `<div class="menu-grid-item">
                <img src="${item.image}" class="menu-grid-img" id="${item.id}" alt="${item.title}" srcset="">
                <p class="menu-grid-title" data-id="${item.title}">${item.title}</p>
            </div>`;
      })
      .join("");

    menuGrid.innerHTML = gridItems;

    // grid filter
    let gridImg = [...document.querySelectorAll(".menu-grid-img")];

    // add filter
    gridImg.forEach((item) => {
      item.addEventListener("mouseover", (e) => {
        if (e.target.id === item.id) {
          gridImg.forEach((item) => {
            item.classList.add("grid-filter");
          });
          item.classList.remove("grid-filter");
          item.classList.add("menu-grid-clr-border");
        }
      });
      item.addEventListener("mouseleave", () => {
        gridImg.forEach((item) => {
          item.classList.remove("grid-filter");
          item.classList.remove("menu-grid-clr-border");
        });
      });
    });
  }

  // display slider items
  displayMenuSliderItems(sliderItems) {
    sliderItems = sliderItems
      .map((item) => {
        return `<div class="slider" id="${item.id}">
                  <div class="star-container" id="${item.id}">
                    
                  </div>
                    <img src="${item.image}" class="slider-img" alt="${item.title}" srcset="">
                    <p class="slider-name" data-id="${item.title}">${item.title}</p>
                </div>`;
      })
      .join("");
    sliderContainer.innerHTML = sliderItems;

    // menu slider images
    let slider = [...document.querySelectorAll(".slider")];
    let starContainer = [...document.querySelectorAll(".star-container")];

    allItems = [...slider];

    // menu btn events
    sliderBtns.forEach((btn) => {
      btn.addEventListener("click", (e) => {
        // insert before
        if (
          e.target.classList.contains("fa-chevron-left") &&
          !sliderContainer.classList.contains("hide-item")
        ) {
          sliderContainer.insertBefore(slider[slider.length - 1], slider[0]);
          slider = [...document.querySelectorAll(".slider")];
        }

        // insert after
        if (
          e.target.classList.contains("fa-chevron-right") &&
          !sliderContainer.classList.contains("hide-item")
        ) {
          sliderContainer.appendChild(slider[0]);
          slider = [...document.querySelectorAll(".slider")];
        }
      });
    });

    this.addFilters(slider);

    // active title on load
    menuSliderTitle.forEach((title) => {
      if (title.id === "popular") {
        title.classList.add("menu-active");
      }
    });

    // choose slider container
    menuSlider.addEventListener("click", (e) => {
      if (e.target.id == "popular") {
        menuSliderTitle.forEach((title) => {
          title.classList.remove("menu-active");
          title.disabled = false;
          e.target.classList.add("menu-active");
          e.target.disabled = true;
          sliderContainer.classList.remove("hide-item");
          popularContainer.classList.add("hide-item");
        });
      }
      if (e.target.id == "favourite") {
        menuSliderTitle.forEach((title) => {
          title.classList.remove("menu-active");
          title.disabled = false;
          e.target.classList.add("menu-active");
          e.target.disabled = true;
          popularContainer.classList.remove("hide-item");
          sliderContainer.classList.add("hide-item");
        });
      }
    });

    this.addFavourites(starContainer);
  }

  addFavourites(item) {
    item.forEach((container) => {
      // variables
      let itemID = container.id;
      let itemTitle = container.parentElement.children[2].dataset.id;
      let image = container.parentElement.children[1].src;
      let id = { itemTitle, itemID, image };

      // parse back storage
      Storage.getFavourite();

      // find item id in storage
      let inStorage = favouriteArray.find((item) => item.itemID === itemID);

      // icons on document load
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
          this.displayFavourites();
        }
      });
    });
  }

  displayFavourites() {
    menuSlider.addEventListener("click", (e) => {
      if (e.target.id == "favourite") {
        // copy favourite array
        let favouriteProducts = [...favouriteArray];

        // iterate over array
        favouriteProducts = favouriteProducts
          .map((item) => {
            return `<div class="favourite-item" id="${item.itemID}">
                    <div class="star-container" id="${item.itemID}">
                        <i class="fas fa-star unfavourite"></i>
                    </div>
                        <img src="${item.image}" class="favourite-img" alt="${item.itemTitle}" srcset="">
                        <p class="favourite-name" data-id="${item.itemTitle}">${item.itemTitle}</p>
                 </div>`;
          })
          .join("");

        popularContainer.innerHTML = favouriteProducts;
      }

      // variables
      let favouriteItems = [...document.querySelectorAll(".favourite-item")];

      // add filter
      this.addFilters(favouriteItems);

      // SLIDER BUTTONS
      // insert before
      if (
        e.target.classList.contains("fa-chevron-left") &&
        !popularContainer.classList.contains("hide-item")
      ) {
        popularContainer.insertBefore(
          favouriteItems[favouriteItems.length - 1],
          favouriteItems[0]
        );
        favouriteItems = [...document.querySelectorAll(".favourite-item")];
      }

      // insert after
      if (
        e.target.classList.contains("fa-chevron-right") &&
        !popularContainer.classList.contains("hide-item")
      ) {
        popularContainer.appendChild(favouriteItems[0]);
        favouriteItems = document.querySelectorAll(".favourite-item");
      }
    });

    // update star container
    let starContainer = [...document.querySelectorAll(".star-container")];

    popularContainer.addEventListener("click", (e) => {
      // variables
      const iconID = e.target.parentElement.parentElement.id;
      const currentSlider = e.target.parentElement.parentElement;

      // unfavourite item & remove from local storage
      if (e.target.classList.contains("unfavourite")) {
        // globally find product
        let product = allItems.find((item) => {
          if (item.id === iconID) {
            return item;
          }
        });

        // globally remove favourite icon
        if (product) {
          starContainer.forEach((star) => {
            if (star.id == product.id) {
              star.innerHTML = `<i class="far fa-star favourite"></i>`;
            }

            // find current target in local storage
            favouriteArray = favouriteArray.filter((item) => {
              if (item.itemID !== iconID) {
                return item;
              }
            });

            // remove current item
            currentSlider.remove();

            // update local storage
            localStorage.setItem("favourite", JSON.stringify(favouriteArray));
          });
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

  // add filter at min 1024px
  addFilters(slider) {
    if (media.matches) {
      slider.forEach((item) => {
        item.addEventListener("mouseover", () => {
          slider.forEach((item) => {
            item.classList.add("grid-filter");
          });
          item.classList.remove("grid-filter");
        });
        item.addEventListener("mouseleave", () => {
          slider.forEach((item) => {
            item.classList.remove("grid-filter");
          });
        });
      });
    }
  }
}

// save to local storage
class Storage {
  static saveFavourite() {
    localStorage.setItem("favourite", JSON.stringify(favouriteArray));
  }

  static getFavourite() {
    if (localStorage.getItem("favourite") === null) {
      favouriteArray = [];
    } else {
      favouriteArray = JSON.parse(localStorage.getItem("favourite"));
    }
    return favouriteArray;
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const ui = new UI();
  const products = new Products();

  products
    .getMenuGridItems()
    .then((gridItems) => ui.displayMenuGridItems(gridItems))
    .then(products.getSliderItems)
    .then((sliderItems) => ui.displayMenuSliderItems(sliderItems))
    .then(() => ui.displayFavourites())
    .then(products.getMenuItems)
    .then(ui.displayHomeBtn())
    .then(ui.displayDate());
});
