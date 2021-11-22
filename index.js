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

let favouriteArray = [];

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
          if (
            item.itemClass === "grid-item" ||
            item.itemClass === "large-grid-item"
          ) {
            return item;
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
      sliderItems = sliderItems.map((item) => {
        const { title } = item.fields;
        const itemClass = item.fields.class;
        const { id } = item.sys;
        const image = item.fields.image.fields.file.url;
        return { title, itemClass, id, image };
      });
      // .filter((item) => {
      //   if (item.itemClass === "slider-item") {
      //     return item;
      //   }
      // })
      return sliderItems;
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
        if (item.itemClass === "large-grid-item") {
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
    let gridImg = [...menuGrid.querySelectorAll(".menu-grid-img")];

    // add filter
    gridImg.forEach((item) => {
      item.addEventListener("mouseover", (e) => {
        if (e.target.id === item.id) {
          gridImg.forEach((item) => {
            item.classList.add("grid-filter");
            item.classList.remove("menu-grid-clr-border");
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
                      <i class="far fa-star favourite"></i>
                  </div>
                    <img src="${item.image}" class="slider-img" alt="${item.title}" srcset="">
                    <p class="slider-name">${item.title}</p>
                </div>`;
      })
      .join("");
    sliderContainer.innerHTML = sliderItems;

    // menu slider images
    let slider = [...document.querySelectorAll(".slider")];

    // menu btn events
    sliderBtns.forEach((btn) => {
      btn.addEventListener("click", (e) => {
        if (e.target.classList.contains("fa-chevron-left")) {
          sliderContainer.insertBefore(slider[slider.length - 1], slider[0]);
          slider = [...document.querySelectorAll(".slider")];
        }
        if (e.target.classList.contains("fa-chevron-right")) {
          sliderContainer.appendChild(slider[0]);
          slider = [...document.querySelectorAll(".slider")];
        }
      });
    });

    // add filter
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
  }

  addToFavourite() {
    // add to favourites
    let starContainer = [...document.querySelectorAll(".star-container")];

    starContainer.forEach((container) => {
      container.addEventListener("click", (e) => {
        let iconId = e.currentTarget.id;
        let itemId = e.currentTarget.parentElement.id;
        let test = { iconId, itemId };
        console.log(test);

        if (e.target.classList.contains("favourite")) {
          container.innerHTML = `<i class="fas fa-star unfavourite"></i>`;
          favouriteArray.push(test);
        }
        if (e.target.classList.contains("unfavourite")) {
          container.innerHTML = `<i class="far fa-star favourite"></i>`;
          favouriteArray.pop(favourite);
        }
        Storage.saveToLocalStorage(favouriteArray);
      });
    });
  }

  // show home button
  displayHomeBtn() {
    window.addEventListener("scroll", () => {
      if (scrollY > 50) {
        homeBtn.classList.add("show-home-btn");
      } else {
        homeBtn.classList.remove("show-home-btn");
      }
    });
  }

  // show date
  displayDate() {
    date.innerHTML = new Date().getFullYear();
  }
}

// save to local storage
class Storage {
  static saveToLocalStorage(id) {
    localStorage.setItem("favourite", JSON.stringify(id));
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
    .then(() => ui.addToFavourite());

  // .then(ui.displayHomeBtn())
  // .then(ui.displayDate());
});
