<script>
export default {
  name: "FriSportMainPage",
  data() {
    return {
      isScaling: false,
    };
  },
  mounted() {
    // Start the scaling animation on component mount
    this.startScalingAnimation();
  },
  methods: {
    startScalingAnimation() {
      setInterval(() => {
        this.isScaling = !this.isScaling;
      }, 2000); // Adjust the duration of each scaling phase (in milliseconds)
    },
  },
};
</script>

<template>
  <body>
  <div class="scaled-image left" :class="{ 'scaling': isScaling }">
    <a href="your_destination_url">
      <img src="../assets/Images/lidl.jpg" alt="Image 5">
    </a>
  </div>

  <main>
    <div class="container-text-center">
      <div class="row">
        <div class="col">
          <a href="#">
            <div class="image-container">
              <figure>
                <figcaption>Slafkovsky scores for the fifth time</figcaption>
                <img src="../assets/Images/slafkovsky.jpg" alt="Image 1">
              </figure>
            </div>
          </a>
        </div>
        <div class="col">
          <a href="#">
            <div class="image-container">
              <figure>
                <figcaption>Lebron announces his return</figcaption>
                <img src="../assets/Images/lebron.jpg" alt="Image 2">
              </figure>
            </div>
          </a>
        </div>
        <div class="col">
          <a href="#">
            <div class="image-container">
              <figure>
                <figcaption>Lionel Messi vs Cristiano Ronaldo.. again</figcaption>
                <img src="../assets/Images/messironaldo.png" alt="Image 3">
              </figure>
            </div>
          </a>
        </div>
        <div class="col">
          <a href="#">
            <div class="image-container">
              <figure>
                <figcaption>Toronto Maple Leafs undefeated so far</figcaption>
                <img src="../assets/Images/toronto.jpg" alt="Image 4">
              </figure>
            </div>
          </a>
        </div>
        <div class="col">
          <a href="#">
            <div class="image-container">
              <figure>
                <figcaption>Another victory for Max Verstappen</figcaption>
                <img src="../assets/Images/verstappen.webp" alt="Image 5">
              </figure>
            </div>
          </a>
        </div>
      </div>
    </div>
  </main>

  <div aria-label="Page navigation example" class="pagination-container">
    <ul class="pagination">
      <li class="page-item"><a class="page-link" href="#">Previous</a></li>
      <li class="page-item"><a class="page-link" href="#">1</a></li>
      <li class="page-item"><a class="page-link" href="#">2</a></li>
      <li class="page-item"><a class="page-link" href="#">3</a></li>
      <li class="page-item"><a class="page-link" href="#">Next</a></li>
    </ul>
  </div>

  <div class="scaled-image right" :class="{ 'scaling': isScaling }">
    <a href="your_destination_url">
      <img src="../assets/Images/lidl.jpg" alt="Image 5">
    </a>
  </div>
  </body>
</template>

<style scoped lang="scss">
.pagination-container {
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #ddd; /* Add background color if needed */
  padding: 10px;
}

.pagination {
  list-style: none;
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 0;
  padding: 0;
}

.page-item {
  margin: 0 5px;
}

.page-link {
  text-decoration: none;
  color: #333;
  padding: 5px 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.page-link:hover {
  background-color: #f8f9fa;
}

body {
  background-color: white;
  font-family: Arial, sans-serif;
  margin: 0;
  padding: 0;
}

.container-text-center {
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;
}

.col {
  margin-bottom: 20px;
  flex: 0 0 auto;
}

.image-container {
  text-align: center;
  width: 30%;
  position: relative;
  overflow: hidden; /* Added overflow to hide caption overflow */
  margin: 0 auto;
}

.image-container figure {
  position: relative;
  overflow: hidden;
  transition: transform 0.3s;
}

.image-container figcaption {
  font-weight: bold;
  bottom: 0;
  left: 0;
  width: 100%;
  background: rgba(0, 0, 0, 0.7);
  color: #fff;
  padding: 10px;
  margin: 0;
  box-sizing: border-box;
  transition: transform 0.3s, background 0.3s, color 0.3s;
  transform-origin: center bottom;
}

.image-container:hover figure {
  transform: scale(1.05);
}

.col img {
  width: 100%;
  height: auto;
  max-height: 20vw;
}


.col figure {
  position: relative;
  overflow: hidden;
  transition: transform 0.3s;
}

.col img {
  width: 100%;
  height: auto;
  max-height: 20vw;
  transition: transform 0.3s;
}

.col figure figcaption {
  position: absolute;
  left: 0;
  width: 100%;
  background: rgba(0, 0, 0, 0.7);
  color: #fff;
  padding: 10px;
  margin: 0;
  box-sizing: border-box;
  transition: transform 0.3s, background 0.3s, color 0.3s;
  transform-origin: center bottom;
  z-index: 2; /* Ensure the text stays on top */
}

.col:hover figure img {
  transform: scale(1.05);
}

.col:hover figure figcaption {
  transform: scaleY(1.3);
  transform: scaleX(1.1);
  background: rgba(0, 0, 0, 0.7);
  color: #fff;
}

.scaled-image {
  margin-top: 20vh;
  position: fixed;
  top: 0;
  display: block;
  text-decoration: none;
  overflow: hidden;
  transition: transform 1.5s;
}

.scaling {
  transform: scale(1.10);
}

.scaled-image img {
  text-align: center;
  width: 18vw;
  height: 50%;
}

.left {
  left: 0;
}

.right {
  right: 0;
}

.row {
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>