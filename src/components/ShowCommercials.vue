<script>
export default {
  name: "ShowCommercials",

  data() {
    return {
      isScaling: false,
    };
  },
  mounted() {
    this.startScalingAnimation();
  },
  methods: {
    startScalingAnimation() {
      setInterval(() => {
        this.isScaling = !this.isScaling;
      }, 2000);
    },
  }
};
</script>

<template>
  <div class="scaled-image left" :class="{ 'scaling': isScaling }">
    <a href="your_destination_url">
      <img src="../assets/Images/lidl.jpg" alt="Image 5">
    </a>
  </div>

  <div class="scaled-image right" :class="{ 'scaling': isScaling }">
    <a href="your_destination_url">
      <img src="../assets/Images/lidl.jpg" alt="Image 5">
    </a>
  </div>
</template>

<style scoped lang="scss">
.scaled-image {
  margin-top: 20vh;
  position: fixed;
  top: 0;
  display: block;
  text-decoration: none;
  overflow: hidden;
  transition: transform 1.5s;

  img {
    text-align: center;
    width: 18vw;
    height: 50%;
  }

  &.scaling {
    transform: scale(1.10);
  }

  &.left {
    left: 0;
  }

  &.right {
    right: 0;
  }
}
</style>
