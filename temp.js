container.addEventListener("click", (e) => {
  let itemID = e.currentTarget.parentElement.id;
  let iconID = e.currentTarget.id;
  let id = { itemID, iconID };

  let inStorage = favouriteArray.find((item) => item.itemID === iconID);
  if (inStorage) {
    e.currentTarget.innerHTML = `<i class="fas fa-star unfavourite"></i>`;
  }
  favouriteArray.push(id);
  Storage.saveFavourite(favouriteArray);
});
