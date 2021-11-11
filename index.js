// CONTENTFUL CLIENT
const client = contentful.createClient({
  space: "xqnou2nkxleq",
  accessToken: "lF5PTQNlbRz1wEgULBrg_azhtUnPfe493uP88lRDRjc",
});

// VARIABLES
let menuGrid = document.querySelector(".menu-grid-container");

// CLASSES
class UI {
  // display menu grid items
  async displayGrid() {
    try {
      let contentful = await client.getEntries({
        content_type: "texasBurger",
      });

      let displayGridItems = await contentful.items;
      displayGridItems = displayGridItems
        .map((item) => {
          const { title } = item.fields;
          const { id } = item.sys;
          const image = item.fields.image.fields.file.url;
          return { title, id, image };
        })
        .map((item) => {
          if (item.id == "4ix1oQNokTc2VFY3RJkiYt") {
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

      menuGrid.innerHTML = displayGridItems;

      // grid filter
      const gridItem = [...menuGrid.querySelectorAll(".menu-grid-img")];

      gridItem.forEach((item) => {
        item.addEventListener("mouseover", (e) => {
          if (e.target.id === item.id) {
            gridItem.forEach((item) => {
              item.classList.add("grid-filter");
              item.classList.remove("menu-grid-clr-border");
            });
            item.classList.remove("grid-filter");
            item.classList.add("menu-grid-clr-border");
          }
        });
        item.addEventListener("mouseleave", () => {
          console.log("sdasdasad");
          gridItem.forEach((item) => {
            item.classList.remove("grid-filter");
            item.classList.remove("menu-grid-clr-border");
          });
        });
      });
    } catch (error) {
      console.log(error);
    }
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const grid = new UI();

  grid.displayGrid().then();
});
