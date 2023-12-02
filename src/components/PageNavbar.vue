<script>
export default {
  name: "PageNavbar",
  mounted() {
    this.animateSearchPlaceholder();
  },
  methods: {
    animateSearchPlaceholder() {
      const searchInput = document.querySelector('.search input');
      const placeholderText = "Search Sports News";
      let index = 0;

      setInterval(() => {
        const currentPlaceholder = placeholderText.substring(0, index + 1);
        searchInput.setAttribute('placeholder', currentPlaceholder);

        index++;
        if (index > placeholderText.length) {
          index = 0;
          setTimeout(() => {
            searchInput.setAttribute('placeholder', '');
          }, 1500); // Adjust the delay before starting the animation again
        }
      }, 150); // Adjust the typing speed
    },
  },
};
</script>

<template>
  <header>
    <nav>
      <ul>
        <li><router-link to="/"></router-link></li>
        <li>
          <a href="#">
            <img src="../assets/Images/live.png" alt="Image 1" style="width: 60px; height: auto">
          </a>
        </li>
        <li>
          <a href="#">
            <img src="../assets/Images/crown.png" alt="Image 1" style="width: 60px; height: auto; margin-left: -5px">
            <span class="premium-text">Premium+</span>
          </a>
        </li>
        <li>
          <router-link to="/nhl-page">
            <img src="../assets/Images/nhl.png" alt="Image 1" style="width: 40px; height: auto">
            <span class="image-text">NHL</span>
          </router-link>
        </li>
        <li>
          <a href="#">
            <img src="../assets/Images/pml.png" alt="Image 1" style="width: 80px; height: auto; margin-left: -15px">
            <span class="image-text">Premier League</span>
          </a>
        </li>

        <li class="dropdown">
          <a href="#" class="dropbtn"><i class="bi bi-person-circle"></i></a>
          <div class="dropdown-content">
            <router-link to="/login-page">Log in</router-link>
            <a href="#">Register</a>
          </div>
        </li>
        <li>
          <section class="search">
            <form action="search-results.html" method="get">
              <input type="text" name="q" placeholder="Search Sports News" style="font-size: 25px;">
              <button type="submit" style="font-size: 25px;"><i class="bi bi-search"></i>Search</button>
            </form>
          </section>
        </li>
      </ul>
    </nav>
  </header>
</template>

<style scoped lang="scss">
header {
  background-color: rgba(221, 221, 221, 0.99);
  color: black;
  padding: 10px;
}

header ul li {
  position: relative;
  list-style: none;
}

header ul li a {
  text-decoration: none;
  display: flex;
  flex-direction: column;
  align-items: center;
}

header ul li:hover .image-text {
  opacity: 1;
}

.image-text  {
  position: absolute;
  bottom: -20px;
  left: 50%;
  transform: translateX(-50%);
  font-size: 14px;
  opacity: 0;
  color: white;
  transition: opacity 0.3s;
}

.premium-text {
  position: absolute;
  bottom: -15px;
  left: 50%;
  transform: translateX(-50%);
  font-size: 14px;
  opacity: 0;
  color: white;
  transition: opacity 0.3s;
}

header ul li:hover .premium-text {
  opacity: 1;
  color: #b09604; /* Change this line to set the color when hovered */
}

header ul li:nth-child(5) .image-text {
  bottom: -40px;
  right: -26px;
}

body {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  margin: 0;
}

main {
  flex: 1;
}

.social-link {
  transition: transform 0.3s;
}

.social-link:hover {
  transform: scale(1.3);
}

nav ul li:first-child a {
  font-size: 30px;
}

nav ul li:first-child a::before {
  content: "FRI";
  color: blue;
}

nav ul li:first-child a::after {
  content: "sport";
  color: white;
}

nav {
  margin-left: -10px;
  margin-top: 25px;
  position: fixed;
  top: -60px; /* Initially hide the navbar above the viewport */
  width: 100%;
  background-color: #333;
  color: #fff;
  padding: 15px;
  text-align: center;
  transition: top 0.3s; /* Add smooth transition for the appearing/disappearing effect */
}

.premium-image {
  position: relative;
  display: inline-block;
}

nav ul {
  text-align: left;
  list-style: none;
  padding: 0;
  font-size: 20px;
}

nav ul li {
  text-align: left;
  display: inline-block;
  margin-right: 15px;
}

nav ul li a {
  font-size: 22px;
  transition: transform 0.3s;
  text-decoration: none;
  display: inline-block;
}

nav ul li a:hover {
  transform: scale(1.2);
  transition: transform 0.3s;
}

.feature {
  list-style: none;
}

nav a {
  text-decoration: none;
  color: #fff;
}

nav ul li:nth-child(1) a:hover {
  color: dodgerblue;
}

nav ul li:nth-child(2) a:hover {
}

nav ul li:nth-child(3) a:hover {
  color: red;
}

.search {
  position: sticky;
  margin-top: 25px;
  margin-left: 47vw;
}

.dropdown {
  position: relative;
  display: inline-block;
  margin-left: auto;
  left: 46vw;
  z-index: 1; /* Ensure the dropdown is above other elements */
  transform: scale(1.3);
}

.dropdown-content {
  display: none;
  position: absolute;
  background-color: #f9f9f9;
  min-width: 80px;
  z-index: 2; /* Ensure the dropdown content is above the dropdown button */
}

.dropbtn:hover {
  transform: scale(1.2);
}

.dropdown-content a {
  color: black;
  padding: 8px 12px; /* Adjust the padding values as needed */
  text-decoration: none;
  display: block;
  font-size: 18px; /* Add or modify the font-size property as needed */
}

.dropdown-content a:hover {
  background-color: #f1f1f1;
}

.dropdown:hover .dropdown-content {
  display: block;
}

@media (max-width: 1540px) {
  .dropdown {
    position: sticky;
    left: 63vw;
    margin-top: 2.4vw;
    transform: scale(1.3);
  }

  .search {
    position: sticky;
    margin-left: 35vw;
  }

  .search input, .search button {
    font-size: 16px;
  }
}


@media (max-width: 768px) {
  nav {
    flex-direction: column;
  }
  ul {
    margin-top: 10px;
    text-align: center;
  }
  .search {
    text-align: center;
    margin-right: auto;
    margin-left: auto;
  }

  .search input, .search button {
    font-size: 16px;
  }
}
@media (max-width: 480px) {
  .feature {
    flex-basis: 100%;
  }
}

nav {
  position: relative;
  z-index: 1;
}

.cta-button {
  display: inline-block;
  padding: 15px 30px;
  background-color: #FF5733;
  color: #fff;
  text-decoration: none;
  border-radius: 5px;
}

.search button:hover {
  background-color: lightgray;
  color: white;
  transform: scale(1.15);
  transition: background-color 0.3s, color 0.3s, transform 0.3s;
}

p {
  font-size: 40px;
}
</style>