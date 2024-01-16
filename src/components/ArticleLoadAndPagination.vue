<script>
import axios from "axios";

export default {
  name: "ArticleLoadAndPagination",
  data() {
    return {
      loading: false,
      articles: [],
      currentPage: 1,
      pageSize: 6,
    };
  },
  computed: {
    totalPages() {
      return Math.ceil(this.articles.length / this.pageSize);
    },
    pagedArticles() {
      const start = (this.currentPage - 1) * this.pageSize;
      const end = start + this.pageSize;
      return this.articles.slice(start, end);
    },
  },
  mounted() {
    this.fetchArticles();
  },
  methods: {
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
      const totalPages = Math.ceil(this.articles.length / this.pageSize);

      if (pageNumber >= 1 && pageNumber <= totalPages) {
        this.currentPage = pageNumber;
      }
    },
    confirmRemoveArticle(articleId) {
      const isConfirmed = window.confirm("Do you really want to delete this article?");
      if (isConfirmed) {
        // Zavolá serverový endpoint na odstránenie článku
        axios.delete(`http://127.0.0.1:8000/api/articles/${articleId}/`)
            .then(() => {
              // Aktualizuje lokálne dáta na odstránenie už odstráneného článku
              this.articles = this.articles.filter(article => article.id !== articleId);
            })
            .catch(error => {
              console.error('\n' + 'Error deleting article', error);
            });
      }
    },
    formatTimestamp(timestamp) {
      const options = { year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric', second: 'numeric', timeZoneName: 'short' };
      return new Date(timestamp).toLocaleString(undefined, options);
    },
  },
};
</script>

<template>
  <!--  Load článkov -->
  <div>
    <div v-if="loading" class="loading">Loading...</div>

    <div v-if="pagedArticles && pagedArticles.length" class="nhl-articles">
      <div v-for="article in pagedArticles" :key="article.id" class="news-box">
        <!-- Tlačidlo pre odstránenie -->
        <button @click="confirmRemoveArticle(article.id)" class="remove-article-btn">
          <i class="bi bi-x-lg"></i>
        </button>

        <article class="news-item side-item cat-item">
          <a :href="article.url" class="news-item-image">
            <picture>
              <img
                  :src="article.image"
                  :alt="article.title"
                  decoding="async"
                  data-nimg="responsive"
                  class="side-article lazy-load"
              />
            </picture>
          </a>
          <div class="news-item-data">
            <h2 class="news-item-title">
              <a :href="article.url">{{ article.title }}</a>
            </h2>
            <p class="news-item-description">{{ article.description }}</p>
            <p class="news-item-timestamp" style="font-size: 10px">
              Created: {{ formatTimestamp(article.created_at) }}
            </p>
          </div>
        </article>
      </div>
    </div>

    <!-- Pagination -->
    <div aria-label="Page navigation example" class="pagination-container">
      <ul class="pagination">
        <li class="page-item" :class="{ 'disabled': currentPage === 1 }">
          <a class="page-link" href="#" @click.prevent="changePage(currentPage - 1)">Previous</a>
        </li>
        <li v-for="page in totalPages" :key="page" class="page-item" :class="{ 'active': currentPage === page }">
          <a class="page-link" href="#" @click.prevent="changePage(page)">{{ page }}</a>
        </li>
        <li class="page-item" :class="{ 'disabled': currentPage === totalPages }">
          <a class="page-link" href="#" @click.prevent="changePage(currentPage + 1)">Next</a>
        </li>
      </ul>
    </div>
  </div>
</template>

<style scoped lang="scss">

// Tlačidlo na odstránenie článku
.remove-article-btn {
  position: absolute;
  top: 10px;
  right: 10px;
  cursor: pointer;
  padding: 5px 10px;
  background-color: #ff0000;
  border: none;
  border-radius: 5px;
  font-size: 1em;
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
</style>