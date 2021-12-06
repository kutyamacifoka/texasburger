// CONTENTFUL CLIENT
const client = contentful.createClient({
  space: "xqnou2nkxleq",
  accessToken: "lF5PTQNlbRz1wEgULBrg_azhtUnPfe493uP88lRDRjc",
});

// VARIABLES
// navbar
const navbar = document.getElementById("navbar-collapse");
const navLink = [...document.querySelectorAll(".nav-link")];
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
class Products {}

// display products
class UI {
  // navbar collapse
  navCollapse() {
    // const bsCollapse = new bootstrap.Collapse(navbar);
    // navLink.forEach((item) => {
    //   item.addEventListener("click", () => {
    //     bsCollapse.toggle();
    //   });
    // });
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

document.addEventListener("DOMContentLoaded", () => {
  const ui = new UI();
  const products = new Products();

  // create array in local storage
  Storage.saveFavourite();

  // collapse navbar
  ui.navCollapse();
});
