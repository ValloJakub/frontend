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

      editingArticle: null,
      editedTitle: "",
      editedSpecification: "",
      editedDescription: "",
      editedImage: null,

      comments: [],
      showCommentsModal: false,
      newCommentContent: "",
      selectedArticleId: null,

      discussionMode: false,
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

    async saveEditedArticle() {
      if (this.editingArticle) {
        if (
            this.editedTitle.length < 20 ||
            this.editedTitle.length > 100 ||
            !this.editedSpecification ||
            !this.editedDescription.trim() ||
            !this.editedImage
        ) {
          console.error('Invalid input. Please check your data.');
          return;
        }

        const editedArticleIndex = this.articles.findIndex(
            (article) => article.id === this.editingArticle.id
        );

        if (editedArticleIndex !== -1) {

          // Pripraví dáta na odoslanie
          const formData = new FormData();
          formData.append('specification', this.editedSpecification);
          formData.append('title', this.editedTitle);
          formData.append('description', this.editedDescription);
          formData.append('image', this.editedImage);

          try {
            const response = await axios.put(`http://127.0.0.1:8000/api/articles/${this.editingArticle.id}/`, formData);

            this.articles[editedArticleIndex] = response.data;

            this.cancelEdit();
          } catch (error) {
            console.error('Error updating article:', error);
          }
        }
      }
    },

    handleImageUpload(event) {
      const file = event.target.files[0];
      this.editedImage = file;
    },

    cancelEdit() {
      this.editingArticle = null;
      this.editedTitle = "";
      this.editedSpecification = "";
      this.editedDescription = "";
      this.editedImage = null;
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
      this.fetchArticles();
    },

    showDiscussion(articleId) {
      this.discussionMode = true;
      this.selectedArticleId = articleId;
      this.getCommentsForArticle(articleId);
    },

    cancelDiscussion() {
      this.discussionMode = false;
    },

    async getCommentsForArticle(selectedArticleId) {
      try {
        const response = await axios.get(`http://127.0.0.1:8000/api/comments/?post=${selectedArticleId}`);
        const filteredComments = response.data.filter(comment => comment.article === selectedArticleId);

        if (filteredComments.length > 0) {
          this.comments = filteredComments.reverse();
        } else {
          this.comments = [];
          console.log('No comments for this article.');
        }
      } catch (error) {
        console.error('Error getting comments for article:', error);
      }
    },

    editArticle(articleId) {
      const articleToEdit = this.articles.find(article => article.id === articleId);

      if (articleToEdit) {
        this.editingArticle = articleToEdit;
        this.editedTitle = articleToEdit.title;
        this.editedSpecification = articleToEdit.specification;
        this.editedDescription = articleToEdit.description;
        this.editedImage = articleToEdit.image;
      }
    },

    formatTimestamp(timestamp) {
      const options = { year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric', second: 'numeric'};
      return new Date(timestamp).toLocaleString(undefined, options);
    },

    openComments(articleId) {
      console.log('Opening comments modal');
      this.showCommentsModal = true;
      this.selectedArticleId = articleId;
      console.log('Selected Article ID:', this.selectedArticleId);
    },

    cancelAddComment() {
      this.showCommentsModal = false;
      this.newCommentContent = "";
    },

    async addComment() {
      if (this.newCommentContent.trim() === "") {
        console.error("Invalid comment content. Please enter a comment.");
        return;
      }
      // Pripraví dáta na odoslanie
      const formData = new FormData();

      formData.append('content', this.newCommentContent);
      formData.append('created_at', new Date().toISOString());
      formData.append('author', this.author = 1);
      formData.append('article', this.selectedArticleId);

      axios.post(`http://127.0.0.1:8000/api/comments/`, formData)
          .then(response => {
            console.log("Comment added successfully:", response.data);
            this.getCommentsForArticle();

            this.newCommentContent = "";
            this.selectedArticleId = null;

            this.cancelAddComment();
          })
    },
  },
};
</script>

<template>
  <div>
    <div v-if="loading" class="loading">Loading...</div>

    <!-- Zobrazenie článkov -->
    <div v-if="!editingArticle && pagedArticles && pagedArticles.length" class="nhl-articles">
      <div v-for="article in pagedArticles" :key="article.id" class="news-box">
        <!-- Tlačidlá pre úpravu a odstránenie -->
        <button @click="editArticle(article.id)" class="edit-article-btn">
          <i class="bi bi-pencil-fill"></i>
        </button>
        <button @click="confirmRemoveArticle(article.id)" class="remove-article-btn">
          <i class="bi bi-x-lg"></i>
        </button>

        <!-- Obsah článku -->
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
              <p class="news-item-category">{{ article.specification }}</p>
              <a :href="article.url">{{ article.title }}</a>
            </h2>
            <p class="news-item-description">{{ article.description }}</p>
            <div class="news-item-timestamp" style="font-size: 11px">
              Created: {{ formatTimestamp(article.created_at) }}
            </div>
            <div class="comments-content" style="font-size: 11px">
              <button @click="showDiscussion(article.id)" style="font-size: 14px;" class="comments-button">
                <i class="bi bi-chat-dots"></i> Enter Discussion
              </button>
              <button @click="openComments(article.id)" style="font-size: 14px;" class="comments-button">
                <i class="bi bi-chat-dots"></i> Add comment
              </button>
            </div>
          </div>
        </article>
      </div>
    </div>

    <select v-model="specification" class="form-control rounded-3" id="specificationInput">
      <option value="" disabled selected>Select a specification</option>
      <option value="NHL">NHL</option>
      <option value="PML">PML</option>
      <option value="F1">F1</option>
      <option value="NBA">NBA</option>
    </select>

    <!-- Úpravu článku -->
    <div v-if="editingArticle" class="edit-form">

      <div class="text-body-secondary" style="font-size: 30px; margin-top: 10px; color: black">
        Edit the Article
      </div>

      <div class="form-group">
        <label for="editedTitle" style="font-size: 20px; color: black; text-align: left; display: block;">Title</label>
        <input v-model="editedTitle" id="editedTitle" class="form-control" />
      </div>

      <div class="form-group">
        <label for="editedSpecification" style="font-size: 20px; color: black; text-align: left; display: block;">Specification</label>
        <select v-model="editedSpecification" class="form-control">
          <option value="" disabled selected>Select a specification</option>
          <option value="NHL">NHL</option>
          <option value="PML">PML</option>
          <option value="F1">F1</option>
          <option value="NBA">NBA</option>
        </select>
      </div>

      <div class="form-group">
        <label for="editedDescription" style="font-size: 20px; color: black; text-align: left; display: block;">Content</label>
        <textarea v-model="editedDescription" id="editedDescription" class="form-control"></textarea>
      </div>

      <div class="form-group">
        <label for="imageInput" style="font-size: 20px; color: black; text-align: left; display: block;">Image</label>
        <div class="form-floating mb-3">
          <input @change="handleImageUpload" type="file" accept="image/*" class="form-control" id="imageInput">
          <label for="imageInput" style="font-size: 12px; color: black; text-align: left;">
            <i class="bi bi-image"></i>
            {{ editedImage ? 'Select Image' : 'Upload Image' }}
          </label>
        </div>
      </div>

      <div class="form-group" style="text-align: center; margin-top: 10px;">
        <button @click="saveEditedArticle" class="btn btn-primary">Edit</button>
        <button @click="cancelEdit" class="btn btn-secondary">Cancel</button>
      </div>
    </div>

    <!-- Pridanie komentáru -->
    <div v-if="showCommentsModal" class="add-comment-form">

      <div class="text-body-secondary" style="font-size: 30px; margin-top: 10px; color: black">
        Express your opinion
      </div>

      <div class="form-group">
        <label for="newCommentContent" style="font-size: 20px; color: black; text-align: left; display: block;">Content</label>
        <textarea v-model="newCommentContent" id="newCommentContent" class="form-control"></textarea>
      </div>

      <div class="form-group" style="text-align: center; margin-top: 10px;">
        <button @click="addComment" class="btn btn-primary">Add Comment</button>
        <button @click="cancelAddComment" class="btn btn-secondary">Cancel</button>
      </div>
    </div>

    <!-- Zobrazenie komentárov v diskusii -->
    <div v-if="discussionMode" class="discussion-form">
      <h3>Discussion</h3>

      <div v-if="comments.length > 0">
        <!-- Vypísať komentáre, ak sú k dispozícii -->
        <div v-for="comment in comments" :key="comment.id" class="comment-container">
          <!-- Zobrazenie komentára -->
          <div class="comment">
            <div class="comment-header">
              <!--              <span class="comment-author">Author: {{ comment.author.username }}</span>-->
              <span class="comment-author">Author:</span>-

              <span class="comment-timestamp">{{ formatTimestamp(comment.created_at) }}</span>
            </div>
            <div class="comment-content">{{ comment.content }}</div>
            <div> ---------------------------------------------------------------------------- </div>
          </div>
        </div>
      </div>

      <div v-else>
        <!-- ak nie sú k dispozícii žiadne komentáre -->
        <p>No comments have been added yet.</p>
      </div>

      <div class="form-group" style="text-align: center; margin-top: 10px;">
        <button @click="cancelDiscussion" class="btn btn-secondary">Cancel</button>
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
.comments-button:hover {
  transform: scale(1.05);
}

.comments-button {
  transition: transform 0.2s ease;
}

.discussion-button:hover {
  transform: scale(1.05);
}

.discussion-button {
  transition: transform 0.2s ease;
}

.edit-form {
  position: fixed;
  top: 50%;
  left: 50%;
  width: 500px;
  height: 550px;
  transform: translate(-50%, -50%);
  background-color: white;
  padding: 20px;
  max-width: 600px;
  border: 2px solid #ddd;
  border-radius: 8px;
  z-index: 999;
  margin: 0 auto;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
}

.discussion-form {
  position: fixed;
  top: 50%;
  left: 50%;
  width: 80vw;
  height: 80vh;
  transform: translate(-50%, -50%);
  background-color: white;
  padding: 20px;
  max-width: 600px;
  border: 2px solid #ddd;
  border-radius: 8px;
  z-index: 999;
  margin: 0 auto;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);

  overflow-y: auto;
}

.add-comment-form {
  position: fixed;
  top: 50%;
  left: 50%;
  width: 500px;
  height: 400px;
  transform: translate(-50%, -50%);
  background-color: white;
  padding: 20px;
  max-width: 600px;
  border: 2px solid #ddd;
  border-radius: 8px;
  z-index: 999;
  margin: 0 auto;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
}

.large-input {
  width: 100%;
  padding: 10px;
  font-size: 16px;
}

textarea {
  width: 100%;
  height: 100px;
  padding: 10px;
  font-size: 14px;
}

.form-group {
  margin-bottom: 15px;
}

.button-container {
  display: flex;
  justify-content: flex-end;
  margin-top: 20px;
}

.save-button,
.cancel-button {
  cursor: pointer;
  padding: 10px 15px;
  margin-left: 10px;
  background-color: cornflowerblue;
  border: none;
  border-radius: 5px;
  font-size: 1em;
  transition: transform 0.2s ease;
}

.save-button:hover,
.cancel-button:hover {
  transform: scale(1.15);
}

// Tlačidlo na odstránenie článku
.remove-article-btn {
  position: absolute;
  top: 10px;
  right: 10px;
  cursor: pointer;
  padding: 5px 10px;
  background-color: #d02f2f;
  border: none;
  border-radius: 5px;
  font-size: 1em;
  transition: transform 0.2s ease;
}

.edit-article-btn {
  position: absolute;
  top: 10px;
  left: 10px;
  cursor: pointer;
  padding: 5px 10px;
  background-color: cornflowerblue;
  border: none;
  border-radius: 5px;
  font-size: 1em;
  transition: transform 0.2s ease;
}

.edit-article-btn:hover, .remove-article-btn:hover {
  transform: scale(1.15);
}

.news-box {
  border: 2px solid #ddd;
  border-radius: 8px;
  margin: 20px auto;
  width: 30%;
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

.news-item-timestamp {
  margin-top: 10px;
}

.news-item-image img {
  width: 100%;
  height: auto;
  display: block;
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
  line-height: 1.2;
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