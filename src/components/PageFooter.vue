<script>
export default {
  name: "PageFooter"
}
</script>

<template>
    <footer class="footer" style="background-color: #333; color: #fff; padding: 20px; text-align: center;">
      <div class="social-link">
        <a href="https://facebook.com" target="_blank" style="text-decoration: none; color: #fff;">
          <i class="bi bi-facebook" style="font-size: 30px; margin-right: 20px;"></i>
        </a>
      </div>

      <div class="social-link">
        <a href="https://instagram.com" target="_blank" style="text-decoration: none; color: #fff;">
          <i class="bi bi-instagram" style="font-size: 30px; margin-right: 20px;"></i>
        </a>
      </div>

      <div class="social-link">
        <a href="https://youtube.com" target="_blank" style="text-decoration: none; color: #fff;">
          <i class="bi bi-youtube" style="font-size: 30px; margin-right: 20px;"></i>
        </a>
      </div>

      <div class="social-link">
        <a href="tel:+421915864XX8" style="text-decoration: none; color: #fff;">
          <i class="bi bi-telephone" style="font-size: 30px; margin-right: 20px;"></i>
        </a>
      </div>

      <div class="copyright">
        <span style="font-size: 18px;">| 2023 FRIsport. All rights reserved.</span>
      </div>
    </footer>
</template>

<style scoped lang="scss">
  .footer {
    display: flex;
    align-items: center;
    justify-content: center;
    padding-right: 10px;
    transition: transform 0.3s;
    height: 10vh;
  }

  .social-link {
    transition: transform 0.3s;
  }

  .social-link:hover {
    transform: scale(1.3);
  }
</style>