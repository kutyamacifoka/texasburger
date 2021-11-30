if (e.target.id == "favourite" && favouriteArray.length == 0) {
  popularContainer.innerHTML = `<h2 style="color:#fc3">empty</h2>`;
  sliderBtns.forEach((btn) => {
    btn.style.display = "none";
  });
} else {
  sliderBtns.forEach((btn) => {
    btn.style.display = "flex";
  });
}
