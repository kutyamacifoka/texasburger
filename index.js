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

// CLASSES
class UI {
  // display menu grid items
  async displayMenuGrid() {
    try {
      let contentful = await client.getEntries({
        content_type: "texasBurger",
      });

      let displayMenuGridItems = await contentful.items;
      displayMenuGridItems = displayMenuGridItems
        .map((item) => {
          const { title } = item.fields;
          const itemClass = item.fields.class;
          const { id } = item.sys;
          const image = item.fields.image.fields.file.url;
          return { title, itemClass, id, image };
        })
        .filter((item) => {
          if (item.itemClass === "grid-item") {
            return item;
          }
        });

      let firstImgId = displayMenuGridItems[0].id;

      // iterate over items
      displayMenuGridItems = displayMenuGridItems
        .map((item) => {
          if (item.id == firstImgId) {
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

      menuGrid.innerHTML = displayMenuGridItems;

      // grid filter
      const gridItem = [...menuGrid.querySelectorAll(".menu-grid-img")];

      // add filter
      function addFilter(variable) {
        variable.forEach((item) => {
          item.addEventListener("mouseover", (e) => {
            if (e.target.id === item.id) {
              variable.forEach((item) => {
                item.classList.add("grid-filter");
                item.classList.remove("menu-grid-clr-border");
              });
              item.classList.remove("grid-filter");
              item.classList.add("menu-grid-clr-border");
            }
          });
          item.addEventListener("mouseleave", () => {
            variable.forEach((item) => {
              item.classList.remove("grid-filter");
              item.classList.remove("menu-grid-clr-border");
            });
          });
        });
      }

      addFilter(gridItem);
    } catch (error) {
      console.log(error);
    }
  }

  // display menu slider on load
  async displayMenuSlider() {
    try {
      let contentful = await client.getEntries({
        content_type: "texasBurger",
      });

      let displayMenuSliderItems = await contentful.items;
      displayMenuSliderItems = displayMenuSliderItems
        .map((item) => {
          const { title } = item.fields;
          const itemClass = item.fields.class;
          const { id } = item.sys;
          const image = item.fields.image.fields.file.url;
          return { title, itemClass, id, image };
        })
        // .filter((item) => {
        //   if (item.itemClass === "slider-item") {
        //     return item;
        //   }
        // })
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

      sliderContainer.innerHTML = displayMenuSliderItems;

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
      function addFilter(variable) {
        variable.forEach((item) => {
          item.addEventListener("mouseover", () => {
            variable.forEach((item) => {
              item.classList.add("grid-filter");
            });
            item.classList.remove("grid-filter");
          });
          item.addEventListener("mouseleave", () => {
            variable.forEach((item) => {
              item.classList.remove("grid-filter");
            });
          });
        });
      }

      addFilter(slider);

      // add to favourites
      let starContainer = [...document.querySelectorAll(".star-container")];

      starContainer.forEach((container) => {
        container.addEventListener("click", (e) => {
          let favourite = e.currentTarget.parentElement;
          favourite.classList.toggle("favourite");

          if (favourite.classList.contains("favourite")) {
            container.innerHTML = `<i class="fas fa-star favourite"></i>`;
          } else {
            container.innerHTML = `<i class="far fa-star unfavourite"></i>`;
          }
        });
      });

      // display menu slider
      function displaySlider() {
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

      displaySlider();
    } catch (error) {
      console.log(error);
    }
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

class Storeage {
  static saveToLocalStorage() {}
}

document.addEventListener("DOMContentLoaded", () => {
  const menuGrid = new UI();
  const menuSlider = new UI();
  const showDate = new UI();
  const showHomeBtn = new UI();

  menuGrid.displayMenuGrid();
  menuSlider.displayMenuSlider();
  showDate.displayDate();
  showHomeBtn.displayHomeBtn();
});
