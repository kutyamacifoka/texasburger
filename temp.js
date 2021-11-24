if (!inStorage) {
  Storage.getFavourite();

  container.innerHTML = `<i class="far fa-star favourite"></i>`;
  container.addEventListener("click", (e) => {
    favouriteArray.push(id);
    Storage.saveFavourite(favouriteArray);
    // container.innerHTML = `<i class="fas fa-star unfavourite"></i>`;
  });
}
container.addEventListener("click", (e) => {
  // remove item from local storage
  favouriteArray = favouriteArray.filter((item) => {
    if (item.iconID !== iconID) {
      return item;
    }
  });
  Storage.saveFavourite(favouriteArray);
  // change icon
  // container.innerHTML = `<i class="far fa-star favourite"></i>`;
});
