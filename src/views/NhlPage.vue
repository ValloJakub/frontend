<script>
import axios from 'axios';

export default {
  name: "NhlPage",
  data() {
    return {
      isScaling: false,
      loading: false,
      articles: [],
      currentPage: 1,
      pageSize: 6, // Number of articles per page
    };
  },
  computed: {
    pagedArticles() {
      const start = (this.currentPage - 1) * this.pageSize;
      const end = start + this.pageSize;
      return this.articles.slice(start, end);
    },
  },
  mounted() {
    this.startScalingAnimation();
    this.fetchArticles();
  },
  methods: {
    startScalingAnimation() {
      setInterval(() => {
        this.isScaling = !this.isScaling;
      }, 2000);
    },
    async fetchArticles() {
      this.loading = true;
      try {
        const response = await axios.get('http://127.0.0.1:8000/api/articles/');
        console.log('Response:', response.data);

        if (response.data) {
          this.articles = response.data.reverse();
        } else {
          console.error('Error fetching articles: Response data or results are null or undefined');
        }
      } catch (error) {
        console.error('Error fetching articles:', error);
      } finally {
        this.loading = false;
      }
    },
    changePage(pageNumber) {
      this.currentPage = pageNumber;
    },
  },
};
</script>

<template>
  <main>
    <div class="scaled-image left" :class="{ 'scaling': isScaling }">
      <a href="your_destination_url">
        <img src="../assets/Images/lidl.jpg" alt="Image 5">
      </a>
    </div>

    <div v-if="loading" class="loading">Loading...</div>

    <div v-if="pagedArticles && pagedArticles.length" class="nhl-articles">
      <div v-for="article in pagedArticles" :key="article.id" class="news-box">
        <article class="news-item side-item cat-item">
          <a :href="article.url" class="news-item-image">
            <picture>
              <span>
                <img
                    :src="article.image"
                    :alt="article.title"
                    decoding="async"
                    data-nimg="responsive"
                    class="side-article lazy-load"
                />
                <noscript></noscript>
              </span>
            </picture>
          </a>
          <div class="news-item-data">
            <h2 class="news-item-title">
              <a :href="article.url">{{ article.title }}</a>
            </h2>
            <p class="news-item-description">{{ article.description }}</p>
          </div>
        </article>
      </div>
    </div>

    <div aria-label="Page navigation example" class="pagination-container">
      <ul class="pagination">
        <li class="page-item" :class="{ 'disabled': currentPage === 1 }">
          <a class="page-link" href="#" @click.prevent="changePage(currentPage - 1)">Previous</a>
        </li>
        <li v-for="page in Math.ceil(articles.length / pageSize)" :key="page" class="page-item" :class="{ 'active': currentPage === page }">
          <a class="page-link" href="#" @click.prevent="changePage(page)">{{ page }}</a>
        </li>
        <li class="page-item" :class="{ 'disabled': currentPage === Math.ceil(articles.length / pageSize) }">
          <a class="page-link" href="#" @click.prevent="changePage(currentPage + 1)">Next</a>
        </li>
      </ul>
    </div>

    <div class="scaled-image right" :class="{ 'scaling': isScaling }">
      <a href="your_destination_url">
        <img src="../assets/Images/lidl.jpg" alt="Image 5">
      </a>
    </div>
  </main>
</template>

<style scoped lang="scss">
.pagination-container {
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #ddd;
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

.news-box {
  border: 2px solid #ddd;
  border-radius: 8px;
  margin: 20px auto;
  width: 25%;
  overflow: hidden;
  transition: transform 0.3s ease;
}

.news-box:hover {
  transform: scale(1.05);
}

.news-item {
  display: flex;
  flex-direction: column;
}

.news-item-image {
  overflow: hidden;
  border-radius: 8px 8px 0 0;
}

.news-item-image img {
  width: 100%;
  height: auto;
  display: block;
}

.news-item-data {
  padding: 10px;
  text-align: center;
}

.news-item-category-wrapper {
  margin-bottom: 10px;
}

.news-item-category {
  text-decoration: none;
  color: #333;
  background-color: #ddd;
  padding: 5px 10px;
  border-radius: 5px;
  font-weight: bold;
}

.news-item-title {
  margin: 10px 0;
  font-size: 1.2em;
  max-width: 100%;
  text-align: center;
}

.news-item-description {
  font-size: 1em;
  line-height: 1.4;
  text-align: center;
  max-width: 100%;
  margin: 0 auto;
}

.content-container {
  position: relative;
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
</style>