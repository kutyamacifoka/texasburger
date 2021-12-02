// CONTENTFUL CLIENT
const client = contentful.createClient({
  space: "xqnou2nkxleq",
  accessToken: "lF5PTQNlbRz1wEgULBrg_azhtUnPfe493uP88lRDRjc",
});

// VARIABLES
// menu grid
let menuGrid = document.querySelector(".menu-grid-container");
// menu slider
let menuSliderContainer = document.getElementById("menu-slider-container");
const popularBtn = document.querySelector("#popular");
const favouriteBtn = document.querySelector("#favourite");

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

  // display sliders
  displayMenuSliderItems(sliderItems) {
    let sliders = [...sliderItems];
    // display sliders on load
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

    let starContainer = [...document.querySelectorAll(".star-container")];
    let values = { sliders, starContainer };
    return values;
  }

  addFavourites(values) {
    let starContainer = values.starContainer;
    starContainer.forEach((container) => {
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
        }
      });
      this.chooseContainer(values);
      this.displayFavourites(values);
    });
  }

  chooseContainer(values) {
    // menu slider images
    // let slider = [...document.querySelectorAll(".slider")];

    let starContainer = values.starContainer;

    // active title on load
    popularBtn.classList.add("menu-active");
    popularBtn.disabled = true;

    popularBtn.addEventListener("click", () => {
      popularBtn.classList.add("menu-active");
      popularBtn.disabled = true;
      favouriteBtn.classList.remove("menu-active");
      favouriteBtn.disabled = false;
    });

    favouriteBtn.addEventListener("click", () => {
      popularBtn.classList.remove("menu-active");
      popularBtn.disabled = false;
      favouriteBtn.classList.add("menu-active");
      favouriteBtn.disabled = true;
    });

    menuSliderContainer.addEventListener("click", (e) => {
      if (e.target === popularBtn) {
        let slider = values.sliders;
        slider = slider
          .map((item) => {
            return `<div class="slider" id="${item.id}">
                  <div class="star-container" id="${item.id}">
                  
                  </div>
                    <img src="${item.image}" class="slider-img" alt="${item.title}" srcset="">
                    <p class="slider-name" data-id="${item.title}">${item.title}</p>
                </div>`;
          })
          .join("");

        sliderContainer.innerHTML = slider;
      }
    });

    return starContainer;
  }

  displayFavourites(starContainer) {
    menuSliderContainer.addEventListener("click", (e) => {
      if (e.target === favouriteBtn) {
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

        sliderContainer.innerHTML = favouriteProducts;
      }

      let favouriteItems = [...document.querySelectorAll(".favourite-item")];

      // unfavourite item & remove from local storage
      if (
        e.target.classList.contains("unfavourite") &&
        favouriteBtn.classList.contains("menu-active")
      ) {
        // variables
        const iconID = e.target.parentElement.parentElement.id;
        const currentSlider = e.target.parentElement.parentElement;

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
          });
        }

        // find current target in local storage
        favouriteArray = favouriteArray.filter((item) => {
          if (item.itemID !== iconID) {
            return item;
          }
        });

        // remove current item
        currentSlider.remove();

        // remove grid filter from remaining items
        favouriteItems.forEach((item) => {
          item.classList.remove("grid-filter");
        });

        // update local storage
        localStorage.setItem("favourite", JSON.stringify(favouriteArray));
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

  // get grid items
  products
    .getMenuGridItems()
    .then((gridItems) => ui.displayMenuGridItems(gridItems))
    // popular items
    .then(products.getSliderItems)
    .then((sliderItems) => ui.displayMenuSliderItems(sliderItems))
    .then((values) => ui.addFavourites(values));

  // date & home btn
  // .then(ui.displayHomeBtn())
  // .then(ui.displayDate());
});
