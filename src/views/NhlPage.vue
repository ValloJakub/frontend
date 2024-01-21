
<script>
import ShowCommercials from "@/components/ShowCommercials.vue";
import axios from "axios";

export default {
  name: "NhlPage",
  components: { ShowCommercials },
  data() {
    return {
      nhlArticles: [],

      // Úprava článku
      editingArticle: null,
      editedTitle: "",
      editedSpecification: "",
      editedDescription: "",
      editedImage: null,

      // Pridávanie komentu
      comments: [],
      showCommentsModal: false,
      newCommentContent: "",
      selectedArticleId: null,

      discussionMode: false,

      // Úprava komentu
      editingComment: null,
      editedCommentContent: "",
    };
  },

  computed: {
    showButtons() {
      return this.$store.state.user;
    },
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
        if (this.editedTitle.length < 20 || this.editedTitle.length > 100) {
          alert('Invalid input. The title length cannot be shorter than 20 characters and longer than 100 characters!');
          return;
        } else if (!this.editedSpecification) {
          alert('Invalid input. You have to choose specification!');
          return;
        } else if (!this.editedDescription.trim()) {
          alert('Invalid input. Content cannot be empty!');
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

    editComment(commentId) {
      this.editingComment = this.comments.find(comment => comment.id === commentId);
    },

    async deleteComment(comment) {
      const isConfirmed = window.confirm("Do you really want to delete this comment?");

      if (isConfirmed) {
        try {
          await axios.delete(`http://127.0.0.1:8000/api/comments/${comment.id}/`);

          // Aktualizuje komenty - odstráni už odstránený koment
          this.comments = this.comments.filter(c => c.id !== comment.id);
        } catch (error) {
          console.error('Error deleting comment', error);
        }
      }
    },

    cancelEditComment() {
      this.editingComment = null;
      this.editedCommentContent = "";
    },

    async saveEditedComment() {
      if (this.editingComment) {
        if (this.editedCommentContent.trim() === "") {
          console.error("Invalid comment content. Please enter a comment.");
          return;
        }

        const editedCommentIndex = this.comments.findIndex(
            (comment) => comment.id === this.editingComment.id
        );

        if (editedCommentIndex !== -1) {
          const formData = new FormData();
          formData.append('content', this.editedCommentContent);
          // Aktualizovaný čas úpravy
          formData.append('edited_at', new Date().toISOString());

          try {
            // Put vyžaduje zadať všetky polia, patch nie
            const response = await axios.patch(`http://127.0.0.1:8000/api/comments/${this.editingComment.id}/`,formData);

            this.comments[editedCommentIndex] = response.data;

            this.cancelEditComment();
          } catch (error) {
            console.error("Error updating comment:", error);
          }
        }
      }
    },

    confirmRemoveArticle(articleId) {
      const isConfirmed = window.confirm("Do you really want to delete this article?");
      if (isConfirmed) {
        // Zavolá serverový endpoint na odstránenie článku
        axios.delete(`http://127.0.0.1:8000/api/articles/${articleId}/`)
            .then(() => {
              // Aktualizuje články - odstráni už odstránený článok
              this.nhlArticles = this.nhlArticles.filter(article => article.id !== articleId);
            })
            .catch(error => {
              console.error('\n' + 'Error deleting article', error);
            });
      }
      this.fetchNhlArticles();
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
      formData.append('author', this.$store.state.user);
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
  <ShowCommercials></ShowCommercials>
  <div>
    <div v-if="!editingArticle" class="nhl-articles">
      <div v-if="nhlArticles.length > 0">
        <div v-for="article in nhlArticles" :key="article.id" class="article-box">
          <div class="article-content">
            <!-- Tlačidlá pre úpravu a odstránenie -->
            <button v-if="showButtons" @click="editArticle(article.id)" class="edit-article-btn">
              <i class="bi bi-pencil-fill"></i>
            </button>
            <button v-if="showButtons" @click="confirmRemoveArticle(article.id)" class="remove-article-btn">
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

            <div class="comments-content" style="font-size: 11px">
              <button @click="showDiscussion(article.id)" style="font-size: 14px;" class="discussion-button">
                <i class="bi bi-chat-dots"></i> Enter Discussion
              </button>
              <button v-if="showButtons"  @click="openComments(article.id)" style="font-size: 14px;" class="comments-button">
                <i class="bi bi-chat-dots"></i> Add comment
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Úprava článku -->
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
      <button v-if="showButtons" @click="addComment" class="btn btn-primary">Add Comment</button>
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
<!--            <span class="comment-author">Author:</span>- -->
            <span v-if="comment.edited_at" class="comment-timestamp">{{ formatTimestamp(comment.edited_at) }} (edited)</span>
            <span v-else class="comment-timestamp">{{ formatTimestamp(comment.created_at) }}</span>
            <button v-if="showButtons" @click="editComment(comment.id)" class="edit-comment-btn">Edit</button>
            <button v-if="showButtons" @click="deleteComment(comment)" class="delete-comment-btn">Delete</button>
          </div>
          <div class="comment-content">{{ comment.content }}</div>
          <div> ---------------------------------------------------------------------------- </div>
        </div>

        <!-- Úprava komentáru -->
        <div v-if="editingComment" class="add-comment-form">

          <div class="text-body-secondary" style="font-size: 30px; margin-top: 10px; color: black">
            Edit your Comment
          </div>

          <div class="form-group">
            <label for="newCommentContent" style="font-size: 20px; color: black; text-align: left; display: block;">Content</label>
            <textarea v-model="editedCommentContent" id="newCommentContent" class="form-control"></textarea>
          </div>

          <div class="form-group" style="text-align: center; margin-top: 10px;">
            <button @click="saveEditedComment" class="btn btn-primary">Edit</button>
            <button @click="cancelEditComment" class="btn btn-secondary">Cancel</button>
          </div>
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

</template>

<style scoped lang="scss">
.edit-comment-btn,
.delete-comment-btn {
  font-size: 12px;
  padding: 5px 8px;
  margin-left: 5px;
  transition: transform 0.2s ease;
}

.edit-comment-btn:hover {
  transform: scale(1.05);
  background-color: cornflowerblue;
}
.delete-comment-btn:hover {
  transform: scale(1.05);
  background-color: indianred;
}

.comments-button:hover {
  transform: scale(1.05);
}

.comments-button {
  transition: transform 0.2s ease;
  margin-left: 5px;
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
  font-size: 18px;
  max-width: 100%;
  text-align: center;
  font-weight: bold;
  overflow-y: auto;
  overflow: hidden;
  margin-left: 10px;
  margin-right: 10px;
}


.content {
  font-size: 14px;
  line-height: 1.2;
  text-align: center;
  max-width: 100%;
  margin-left: 15px;
  margin-right: 15px;
  overflow-y: auto;
  overflow: hidden;
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

.article-box {
  border: 2px solid #ddd;
  border-radius: 8px;
  margin: 20px auto;
  width: 30%;
  overflow: hidden;
  transition: transform 0.3s ease;
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
