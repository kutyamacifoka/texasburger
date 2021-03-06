// CONTENTFUL CLIENT
const client = contentful.createClient({
  space: "xqnou2nkxleq",
  accessToken: "lF5PTQNlbRz1wEgULBrg_azhtUnPfe493uP88lRDRjc",
});

// VARIABLES
// navbar
const navbar = document.getElementById("navbar-collapse");
const navLink = [...document.querySelectorAll(".nav-link")];
const menuBtns = [...document.querySelectorAll(".menu-btn")];
// menu grid
let menuGrid = document.querySelector(".menu-grid-container");
// menu slider containers
let menuSliderContainer = document.getElementById("menu-slider-container");
let sliderContainer = document.querySelector(".slider-container");
// menu slider tabs
const popularBtn = document.querySelector("#popular");
const favouriteBtn = document.querySelector("#favourite");
// menu slider btns
const prevBtn = document.querySelector(".fa-chevron-left");
const nextBtn = document.querySelector(".fa-chevron-right");
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

  async getSliderItems() {
    try {
      let contentful = await client.getEntries({
        content_type: "texasBurger",
      });

      let sliderItems = await contentful.items;
      sliderItems = sliderItems
        .filter((item) => {
          for (let i = 0; i < sliderItems.length; i++) {
            if (item.fields.class[i] === "slider-item") {
              return item;
            }
          }
        })
        .map((item) => {
          const { title } = item.fields;
          const itemClass = item.fields.class;
          const ingredients =
            item.fields.ingredients.content[0].content[0].value;
          const { id } = item.sys;
          const image = item.fields.image.fields.file.url;
          return { title, itemClass, ingredients, id, image };
        });

      return sliderItems;
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

  // display grid items
  displayMenuGridItems(gridItems) {
    // iterate over array
    gridItems = gridItems
      .map((item) => {
        const lgGrid = item.itemClass.find(
          (grid) => grid === "large-grid-item"
        );
        if (lgGrid) {
          return `<div class="menu-grid-item lg-menu-grid-item">
                <img src="${item.image}" class="menu-grid-img lg-grid-img" data-id="${item.title}" id="${item.id}" alt="${item.title}" srcset="">
                <p class="lg-menu-grid-title">${item.title}</p>
            </div>`;
        }
        return `<div class="menu-grid-item">
                <img src="${item.image}" class="menu-grid-img" data-id="${item.title}" id="${item.id}" alt="${item.title}" role="button" srcset="">
                <p class="menu-grid-title">${item.title}</p>
            </div>`;
      })
      .join("");

    menuGrid.innerHTML = gridItems;

    // variables
    let gridImg = [...document.querySelectorAll(".menu-grid-img")];

    // redirect to menu on click
    gridImg.forEach((img) => {
      img.addEventListener("click", (e) => {
        let id = e.currentTarget.dataset.id;
        id = this.replaceLetters(id);

        location.href = `menu.html#${id}`;
      });
    });

    menuBtns.forEach((btn) => {
      btn.addEventListener("click", (e) => {
        e.preventDefault();
        location.href = `menu.html#osszes`;
      });
    });

    // add filter
    gridImg.forEach((item) => {
      item.addEventListener("mouseover", (e) => {
        if (e.target.id === item.id) {
          gridImg.forEach((item) => {
            item.classList.add("filter-effect");
          });
          item.classList.remove("filter-effect");
          item.classList.add("menu-grid-clr-border");
        }
      });
      item.addEventListener("mouseleave", () => {
        gridImg.forEach((item) => {
          item.classList.remove("filter-effect");
          item.classList.remove("menu-grid-clr-border");
        });
      });
    });
  }

  // display popular sliders on load
  displayMenuSliderItems(sliderItems) {
    // add slider items to all array
    allItems = [{ sliderItems }];

    // iterate over items
    sliderItems = sliderItems
      .map((item) => {
        return `<div class="scene">
                    <div class="slider" id="${item.id}">
                        <div class="slider-face slider-face-front">
                            <div class="info-container">
                                <i class="fas fa-info-circle slider-info"></i>
                            </div>
                            <div class="star-container" id="${item.id}">
                                
                            </div>
                              <img src="${item.image}" class="slider-img" alt="${item.title}" srcset="">
                              <p class="slider-name" data-id="${item.title}">${item.title}</p>
                            </div>
                        <div class="slider-face slider-face-back">
                            <div class="back-btn-container">
                                <i class="fas fa-undo-alt back-btn"></i>
                            </div>
                              <p class="ingredients">${item.ingredients}</p>
                        </div>    
                     </div>
                </div>`;
      })
      .join("");

    sliderContainer.innerHTML = sliderItems;

    // variables
    let sliders = [...document.querySelectorAll(".slider")];
    let scene = [...document.querySelectorAll(".scene")];

    // functions
    this.carouselBtns(scene);
    this.addFilters(scene);
    this.flipProducts(sliders);
  }

  // display popular sliders on click
  displayPopularItems(starContainer) {
    // active title on load
    popularBtn.classList.add("menu-active");
    popularBtn.disabled = true;

    // disable button & add active class
    popularBtn.addEventListener("click", () => {
      popularBtn.classList.add("menu-active");
      popularBtn.disabled = true;
      favouriteBtn.classList.remove("menu-active");
      favouriteBtn.disabled = false;
    });

    // disable button & add active class
    favouriteBtn.addEventListener("click", () => {
      popularBtn.classList.remove("menu-active");
      popularBtn.disabled = false;
      favouriteBtn.classList.add("menu-active");
      favouriteBtn.disabled = true;
    });

    // display popular sliders on click event
    menuSliderContainer.addEventListener("click", (e) => {
      if (e.target === popularBtn) {
        // destructure all items
        let sliderItems = allItems[0].sliderItems;

        // iterate over array
        sliderItems = sliderItems
          .map((item) => {
            // get back items from local storage
            const inStorage = JSON.parse(localStorage.getItem("favourite"));

            // check if item ID is in the storage
            const itemID = inStorage.find((item) => item.itemID === item.id);

            if (itemID) {
              return `<div class="scene">
                    <div class="slider" id="${item.id}">
                        <div class="slider-face slider-face-front">
                            <div class="info-container">
                                <i class="fas fa-info-circle slider-info"></i>
                            </div>
                            <div class="star-container" id="${item.id}">
                                <i class="fas fa-star unfavourite"></i>
                            </div>
                              <img src="${item.image}" class="slider-img" alt="${item.title}" srcset="">
                              <p class="slider-name" data-id="${item.title}">${item.title}</p>
                            </div>
                        <div class="slider-face slider-face-back">
                            <div class="back-btn-container">
                                <i class="fas fa-undo-alt back-btn"></i>
                            </div>
                              <p class="ingredients">${item.ingredients}</p>
                        </div>    
                     </div>
                </div>`;
            }

            if (itemID === undefined) {
              return `<div class="scene">
                    <div class="slider" id="${item.id}">
                        <div class="slider-face slider-face-front">
                            <div class="info-container">
                                <i class="fas fa-info-circle slider-info"></i>
                            </div>
                            <div class="star-container" id="${item.id}">
                                <i class="far fa-star favourite"></i>
                            </div>
                              <img src="${item.image}" class="slider-img" alt="${item.title}" srcset="">
                              <p class="slider-name" data-id="${item.title}">${item.title}</p>
                            </div>
                        <div class="slider-face slider-face-back">
                            <div class="back-btn-container">
                                <i class="fas fa-undo-alt back-btn"></i>
                            </div>
                              <p class="ingredients">${item.ingredients}</p>
                        </div>    
                     </div>
                </div>`;
            }
          })
          .join("");

        sliderContainer.innerHTML = sliderItems;

        // variables
        const sliders = [...document.querySelectorAll(".slider")];
        let scene = [...document.querySelectorAll(".scene")];

        // functions
        this.flipProducts(sliders);
        this.addFavourites(starContainer);
        this.addFilters(scene);
      }
    });
  }

  // add items to storage, delete from storage, set icons on document load
  addFavourites() {
    // select star container
    let starContainer = [...document.querySelectorAll(".star-container")];

    starContainer.forEach((container) => {
      // variables
      let itemID = container.id;
      let itemTitle = container.parentElement.children[3].dataset.id;
      let ingredients =
        container.parentElement.parentElement.children[1].children[1]
          .textContent;
      let image = container.parentElement.children[2].src;
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

      // functions
      this.displayFavouriteItems(starContainer);
    });
  }

  // display favourite sliders on click
  displayFavouriteItems() {
    menuSliderContainer.addEventListener("click", (e) => {
      if (e.target === favouriteBtn) {
        // copy favourite array
        let sliders = [...favouriteArray];

        // iterate over array
        sliders = sliders
          .map((item) => {
            return `<div class="scene">
                    <div class="slider" id="${item.itemID}">
                        <div class="slider-face slider-face-front">
                            <div class="info-container">
                                <i class="fas fa-info-circle slider-info"></i>
                            </div>
                            <div class="star-container" id="${item.itemID}">
                                <i class="fas fa-star unfavourite"></i>
                            </div>
                              <img src="${item.image}" class="slider-img" alt="${item.itemTitle}" srcset="">
                              <p class="slider-name" data-id="${item.itemTitle}">${item.itemTitle}</p>
                            </div>
                        <div class="slider-face slider-face-back">
                            <div class="back-btn-container">
                                <i class="fas fa-undo-alt back-btn"></i>
                            </div>
                              <p class="ingredients">${item.ingredients}</p>
                        </div>    
                     </div>
                </div>`;
          })
          .join("");

        sliderContainer.innerHTML = sliders;
      }

      // innerHTML when favourite array is empty
      if (
        favouriteArray.length === 0 &&
        favouriteBtn.classList.contains("menu-active")
      ) {
        sliderContainer.innerHTML = `<h1 class="empty">M??g nincsenek kedvencek</h1>`;
      }

      // hide carousel btns if 1 or less item in storage
      if (
        favouriteArray.length <= 1 &&
        favouriteBtn.classList.contains("menu-active")
      ) {
        prevBtn.style.display = "none";
        nextBtn.style.display = "none";
      } else {
        prevBtn.style.display = "flex";
        nextBtn.style.display = "flex";
      }

      // variables
      let sliders = [...document.querySelectorAll(".slider")];
      let scene = [...document.querySelectorAll(".scene")];

      // functions
      this.flipProducts(sliders);
      this.addFilters(scene);

      // unfavourite item & remove from local storage
      if (
        e.target.classList.contains("unfavourite") &&
        favouriteBtn.classList.contains("menu-active")
      ) {
        // variables
        const sliderID = e.target.parentElement.parentElement.parentElement.id;
        const currentSlider =
          e.target.parentElement.parentElement.parentElement.parentElement;

        // find current target in local storage
        favouriteArray = favouriteArray.filter((item) => {
          if (item.itemID !== sliderID) {
            return item;
          }
        });

        // remove current slider
        currentSlider.remove();

        // update local storage
        localStorage.setItem("favourite", JSON.stringify(favouriteArray));
      }
    });
  }

  // carousel buttons
  carouselBtns(scene) {
    prevBtn.addEventListener("click", () => {
      // popular btn
      if (popularBtn.classList.contains("menu-active")) {
        // get scene
        scene = [...document.querySelectorAll(".scene")];

        // insert before
        sliderContainer.insertBefore(scene[scene.length - 1], scene[0]);

        // update scene
        scene = [...document.querySelectorAll(".scene")];
      }

      // favourite btn
      if (favouriteBtn.classList.contains("menu-active")) {
        // get scene
        scene = [...document.querySelectorAll(".scene")];

        // insert before
        sliderContainer.insertBefore(scene[scene.length - 1], scene[0]);

        // update scene
        scene = [...document.querySelectorAll(".scene")];
      }
    });

    nextBtn.addEventListener("click", () => {
      // popular btn
      if (popularBtn.classList.contains("menu-active")) {
        // get scene
        scene = [...document.querySelectorAll(".scene")];

        // insert after
        sliderContainer.appendChild(scene[0]);

        // update scene
        scene = [...document.querySelectorAll(".scene")];
      }

      // favourite btn
      if (favouriteBtn.classList.contains("menu-active")) {
        // get scene
        scene = [...document.querySelectorAll(".scene")];

        // insert after
        sliderContainer.appendChild(scene[0]);

        // update scene
        scene = [...document.querySelectorAll(".scene")];
      }
    });
  }

  // add filter at min 1024px
  addFilters(slider) {
    if (media.matches) {
      slider.forEach((item) => {
        item.addEventListener("mouseover", () => {
          slider.forEach((item) => {
            item.classList.add("filter-effect");
          });
          item.classList.remove("filter-effect");
        });
        item.addEventListener("mouseleave", () => {
          slider.forEach((item) => {
            item.classList.remove("filter-effect");
          });
        });
      });
    }
  }

  replaceLetters(value) {
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

  // flip slider items
  flipProducts(sliders) {
    sliders.forEach((container) => {
      container.addEventListener("click", (e) => {
        if (e.target.classList.contains("slider-info")) {
          container.classList.add("slider-flipped");
        }

        if (e.target.classList.contains("fa-undo-alt")) {
          container.classList.remove("slider-flipped");
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
navbar.addEventListener("click", (e) => {
  if (window.innerWidth < 992) {
    UI.navCollapse(e);
  }
});

document.addEventListener("DOMContentLoaded", () => {
  const ui = new UI();
  const products = new Products();

  // get grid items
  products
    .getMenuGridItems()
    .then((gridItems) => ui.displayMenuGridItems(gridItems))
    // get popular items
    .then(products.getSliderItems)
    .then((sliderItems) => ui.displayMenuSliderItems(sliderItems))
    // display popular items
    .then(ui.displayPopularItems())
    // add items to favourite array
    .then(() => ui.addFavourites())
    // date & home btn
    .then(ui.displayHomeBtn())
    .then(ui.displayDate());
});
