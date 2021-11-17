// CONTENTFUL CLIENT
const client = contentful.createClient({
  space: "xqnou2nkxleq",
  accessToken: "lF5PTQNlbRz1wEgULBrg_azhtUnPfe493uP88lRDRjc",
});

// VARIABLES
let menuGrid = document.querySelector(".menu-grid-container");
let menuSlider = document.getElementById("menu-slider-container");
let menuSliderTitle = document.querySelectorAll(".menu-slider-title");
let sliderContainer = document.querySelector(".slider-container");
const sliderBtns = [...document.querySelectorAll(".slider-btn")];
let date = document.querySelector("#date");
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
      displayMenuGridItems = displayMenuGridItems.map((item) => {
        const { title } = item.fields;
        const { id } = item.sys;
        const image = item.fields.image.fields.file.url;
        return { title, id, image };
      });

      let firstImgId = displayMenuGridItems[0].id;

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
          const { id } = item.sys;
          const image = item.fields.image.fields.file.url;
          return { title, id, image };
        })
        .map((item) => {
          return `<div class="slider">
                    <img src="${item.image}" class="slider-img" id="${item.title}" alt="${item.title}" srcset="">
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

      // display menu slider
      function displaySlider() {
        menuSlider.addEventListener("click", (e) => {
          if (e.target.id == "popular") {
            menuSliderTitle.forEach((title) => {
              title.classList.remove("menu-active");
              title.disabled = false;
              e.target.classList.add("menu-active");
              e.target.disabled = true;
            });
            sliderContainer.innerHTML = displayMenuSliderItems;
          }
          if (e.target.id == "favourite") {
            menuSliderTitle.forEach((title) => {
              title.classList.remove("menu-active");
              title.disabled = false;
              e.target.classList.add("menu-active");
              e.target.disabled = true;
            });
            sliderContainer.innerHTML = "dddddddddd";
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

document.addEventListener("DOMContentLoaded", () => {
  const menuGrid = new UI();
  const menuSlider = new UI();
  const showDate = new UI();
  const showHomeBtn = new UI();

  menuGrid
    .displayMenuGrid()
    .then(menuSlider.displayMenuSlider())
    .then(showDate.displayDate())
    .then(showHomeBtn.displayHomeBtn());
});
