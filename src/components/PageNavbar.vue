<script>
export default {
  name: "PageNavbar",

  computed: {
    isUserLoggedIn() {
      return this.$store.getters.getUser !== null;
    },

    currentUserEmail() {
      const user = this.$store.getters.getUser;
      return user ? user.email : '';
    },

    isUserAdmin() {
      const user = this.$store.getters.getUser;
      return user ? user.admin : false;
    },
  },

  methods: {
    logout() {
      this.$store.commit('logout');
      this.$router.push('/');
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
          <router-link v-if="isUserLoggedIn" to="/favourites-page">
            <img src="../assets/Images/heart.webp" alt="Image 1" style="width: 40px; height: auto; margin-left: -5px">
            <span class="premium-text">Favourite</span>
          </router-link>
        </li>
        <li>
          <router-link to="/nhl-page">
            <img src="../assets/Images/nhl.png" alt="Image 1" style="width: 40px; height: auto">
            <span class="image-text">NHL</span>
          </router-link>
        </li>
        <li>
          <router-link to="/pml-page">
            <img src="../assets/Images/pml.png" alt="Image 1" style="width: 80px; height: auto; margin-left: -15px">
            <span class="image-text">Premier League</span>
          </router-link>
        </li>
        <li  v-if="isUserLoggedIn && isUserAdmin" class="upload-article">
          <router-link to="/upload-page">
            <div style="font-size: 25px">Upload Article</div>

          </router-link>
        </li>
        <li class="nav-item dropdown dropdown-right">
          <a href="#" class="dropbtn"><i :class="{ 'admin-color': isUserAdmin }" class="bi bi-person-circle"></i></a>
          <div class="dropdown-content">
            <router-link v-if="!isUserLoggedIn" to="/login-page">Login</router-link>
            <router-link v-if="!isUserLoggedIn" to="/register-page">Register</router-link>
            <a href="" v-if="isUserLoggedIn" @click="logout">Logout</a>
          </div>
        </li>
        <li v-if="isUserLoggedIn" class="author-name" :class="{ 'admin-color': isUserAdmin }">
          {{ currentUserEmail }}
        </li>
      </ul>
    </nav>
  </header>
</template>

<style scoped lang="scss">
.admin-color {
  color: goldenrod;
}

header {
  background-color: #333;
  color: #ffffff;
  position: fixed;
  width: 100%;
  top: 0;
  z-index: 999;
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
  color: #d02f2f;
}

header ul li:nth-child(5) .image-text {
  bottom: -40px;
  right: -20px;
}

header ul li:nth-child(6) .image-text {
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

nav ul li.nav-item {
  margin-right: 15px;
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

nav a {
  text-decoration: none;
  color: #fff;
}

.dropdown {
  position: relative;
  display: inline-block;
  margin-left: auto;
  z-index: 1;
  transform: scale(1.3);
  color: black;
}

.dropdown-content {
  display: none;
  position: absolute;
  background-color: lightgrey;
  min-width: 60px;
  z-index: 2;
}

.dropbtn:hover {
  transform: scale(1.2);
}

.dropdown-content a {
  color: black;
  padding: 8px 12px;
  text-decoration: none;
  display: block;
  font-size: 18px;
}

.dropdown-content a:hover {
  background-color: lightgrey;
}

.dropdown:hover .dropdown-content {
  display: block;
}

@media (max-width: 1920px) {
  nav ul li.dropdown-right {
    margin-left: 52vw;
  }
}

@media (max-width: 1580px) {
  nav ul li.dropdown-right {
    margin-left: 40vw;
  }
}

@media (max-width: 1360px) {
  nav ul li.dropdown-right {
    margin-left: 30vw;
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
}

nav {
  position: relative;
  z-index: 1;
}

p {
  font-size: 40px;
}
</style>