//taking name of the user
playerName = document.querySelector(".player");
let playGameBtn = document.querySelector(".play");
//function to redirect from landing page to categories page
const redirectToCategories = () => {
  if (playerName.value == "") {
    alert("Please enter your name");
  } else {
    window.location.href = `categoriesPage/categories.html?username=${encodeURIComponent(playerName.value)}`;
    playerName.value = "";
  }
};
//adding event listeners to start playing
playGameBtn.addEventListener("click", () => {
  redirectToCategories();
});

playerName.addEventListener("keyup", function (e) {
  if (e.key == "Enter") {
    redirectToCategories();
  }
});

