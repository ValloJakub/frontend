
<script>
import ShowCommercials from "@/components/ShowCommercials.vue";
import axios from "axios";

export default {
  name: "NhlPage",
  components: { ShowCommercials },
  data() {
    return {
      nhlArticles: [],

      editingArticle: null,
      editedTitle: "",
      editedSpecification: "",
      editedDescription: "",
      editedImage: null,
    };
  },
  mounted() {
    this.fetchNhlArticles();
  },
  methods: {
    async fetchNhlArticles() {
      try {
        const response = await axios.get("http://127.0.0.1:8000/api/articles/", {
          params: {
            specification: "NHL",
          },
        });
        this.nhlArticles = response.data.reverse();
      } catch (error) {
        console.error("Error fetching NHL articles:", error);
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

        const editedArticleIndex = this.nhlArticles.findIndex(
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

            this.nhlArticles[editedArticleIndex] = response.data;

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

    confirmRemoveArticle(articleId) {
      const isConfirmed = window.confirm("Do you really want to delete this article?");
      if (isConfirmed) {
        // Zavolá serverový endpoint na odstránenie článku
        axios.delete(`http://127.0.0.1:8000/api/articles/${articleId}/`)
            .then(() => {
              // Aktualizuje lokálne dáta na odstránenie už odstráneného článku
              this.nhlArticles = this.nhlArticles.filter(article => article.id !== articleId);
            })
            .catch(error => {
              console.error('\n' + 'Error deleting article', error);
            });
      }
      this.fetchNhlArticles();
    },

    editArticle(articleId) {
      const articleToEdit = this.nhlArticles.find(article => article.id === articleId);

      if (articleToEdit) {
        this.editingArticle = articleToEdit;
        this.editedTitle = articleToEdit.title;
        this.editedSpecification = articleToEdit.specification;
        this.editedDescription = articleToEdit.description;
        this.editedImage = articleToEdit.image;
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
  <ShowCommercials></ShowCommercials>
  <div>
    <div v-if="!editingArticle" class="nhl-articles">
      <div v-if="nhlArticles.length > 0">
        <div v-for="article in nhlArticles" :key="article.id" class="article-box">
          <div class="article-content">
            <!-- Tlačidlá pre úpravu a odstránenie -->
            <button @click="editArticle(article.id)" class="edit-article-btn">
              <i class="bi bi-pencil-fill"></i>
            </button>
            <button @click="confirmRemoveArticle(article.id)" class="remove-article-btn">
              <i class="bi bi-x-lg"></i>
            </button>
            <img :src="article.image" alt="Article Image" />
            <p class="specification">{{ article.specification }}</p>
            <div class="title-content">
              <p>{{ article.title }}</p>
            </div>

            <div class="content">
              <p>{{ article.description }}</p>
            </div>
            <p class="news-item-timestamp" style="font-size: 11px">
              Created: {{ formatTimestamp(article.created_at) }}
            </p>
          </div>
        </div>
      </div>
    </div>

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
  </div>
</template>

<style scoped lang="scss">
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

.article-box:hover {
  transform: scale(1.05);
}

.specification{
  margin-top: 10px;
  text-decoration: none;
  color: #333;
  background-color: #ddd;
  padding: 5px 10px;
  border-radius: 5px;
  font-weight: bold;
}

.title-content {
  margin: 10px 0;
  font-size: 1.2em;
  max-width: 100%;
  text-align: center;
  font-weight: bold;
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

.article-box {
  border: 2px solid #ddd;
  border-radius: 8px;
  margin: 20px auto;
  width: 30%;
  overflow: hidden;
  transition: transform 0.3s ease;
}

.title-content {
  font-size: 18px;
}

.content {
  font-size: 14px;
}

.specification {
  font-size: 16px;
}

.article-content img {
  width: 100%;
  height: auto;
  display: block;
}

.timestamp {
  font-size: 12px;
  color: #555;
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
</style>
