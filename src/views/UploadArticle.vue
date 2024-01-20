<script>
import axios from 'axios';

export default {
  name: "UploadArticle",
  data() {
    return {
      title: "",
      specification: "",
      description: "",
      image: null,
      error: null,
    };
  },
  methods: {
    handleImageUpload(event) {
      const file = event.target.files[0];

      if (!file) {
        this.error = "Please upload an image.";
        return;
      }

      this.image = file;
      this.error = null;
    },

    closeWindow() {
      this.$router.push('/');
    },

    handleSubmit() {
      if (this.title.length > 100) {
        this.error = "Title is too long.";
        return;
      }

      if (this.title.length < 20) {
        this.error = "Title is too short.";
        return;
      }

      if (this.specification.length === 0 || !["NHL", "PML", "F1", "NBA"].includes(this.specification)) {
        this.error = "Invalid specification!";
        return;
      }

      if (this.description.length === 0) {
        this.error = "Content cannot be empty!";
        return;
      }

      if (!this.image) {
        this.error = "Please upload an image.";
        return;
      }

      // Pripraví dáta na odoslanie
      const formData = new FormData();
      formData.append('specification', this.specification);
      formData.append('title', this.title);
      formData.append('description', this.description);
      formData.append('image', this.image);

      // Vytvorí požiadavku HTTP
      axios.post('http://127.0.0.1:8000/api/articles/', formData)
          .then(response => {
            // Úspešná odpoveď
            console.log('Response from server:', response.data);

            // Presmeruj na hlavnú stránku
            this.$router.push('/');

            // Vyčisti po úspešnom príspevku
            this.title = "";
            this.description = "";
            this.image = null;
            this.specification = "";

            // Vyčisti error
            this.error = null;
          })
          .catch(error => {
            // Spracuj error
            console.error('Error sending data to server:', error);

            this.error = "Error submitting data. Please try again.";
          });
    }
  }
}
</script>

<template>
  <div class="upload-article-window">
    <div class="modal-dialog" role="document">
      <div class="modal-content rounded-4 shadow">
        <div class="modal-header p-5 pb-4 border-bottom-0">
          <h1 class="fw-bold mb-0 fs-2" style="color: white; font-size: 36px">Upload Article</h1>
        </div>

        <div class="modal-body p-5 pt-0">
          <div v-if="error" class="text-danger">{{ error }}</div>

          <div class="text-body-secondary" style="font-size: 36px; margin-top: 10px; color: black">
            Create a new Article
          </div>

          <form @submit.prevent="handleSubmit">
            <div class="form-group">
              <label for="titleInput" style="font-size: 22px; color: black; text-align: left; display: block;">Title</label>
              <div class="form-floating mb-3">
                <input v-model="title" type="text" class="form-control rounded-3" id="titleInput" :placeholder="titlePlaceholder" style="font-size: 24px; text-align: left; display: block;">
                <label for="titleInput" :class="{ 'active': title }" style="font-size: 16px; color: black; text-align: left;"><i class="bi bi-file-text"></i>
                  {{ title ? '' : 'Add a title to your article' }}</label>
              </div>
            </div>

            <div class="form-group">
              <label for="specificationInput" style="font-size: 22px; color: black; text-align: left; display: block;">Specification</label>
              <div class="form-floating mb-3">
                <select v-model="specification" class="form-control rounded-3" id="specificationInput">
                  <option value="" disabled selected>Select a specification</option>
                  <option value="NHL">NHL</option>
                  <option value="PML">PML</option>
                  <option value="F1">F1</option>
                  <option value="NBA">NBA</option>
                </select>
                <label for="specificationInput" :class="{ 'active': specification }" style="font-size: 16px; color: black; text-align: left;"><i class="bi bi-file-text"></i>
                  {{ specification ? '' : '' }}</label>
              </div>
            </div>

            <div class="form-group">
              <label for="descriptionInput" style="font-size: 22px; color: black; text-align: left; display: block;">Content</label>
              <div class="form-floating mb-3">
                <textarea v-model="description" class="form-control rounded-3" id="descriptionInput" :placeholder="descriptionPlaceholder" style="font-size: 24px"></textarea>
                <label for="descriptionInput" :class="{ 'active': description }" style="font-size: 16px; color: black"><i class="bi bi-card-text"></i>
                  {{ description ? '' : 'Add a description to your article' }}</label>
              </div>
            </div>

            <div class="form-group">
              <label for="imageInput" style="font-size: 22px; color: black; text-align: left; display: block;">Image</label>
              <div class="form-floating mb-3">
                <input @change="handleImageUpload" type="file" accept="image/*" class="form-control rounded-3" id="imageInput">
                <label for="imageInput" style="font-size: 16px; color: black; text-align: left;">
                  <i class="bi bi-image"></i>
                  {{ image ? 'Image selected' : 'Upload Image' }}
                </label>
              </div>
            </div>

            <button type="submit" class="upload-article-btn" style="font-size: 30px; padding: 10px 20px;">Upload</button>
            <button type="button" class="close-btn" @click="closeWindow" style="font-size: 30px; padding: 10px 20px;">Close</button>

            <hr class="my-4">
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.upload-article-window {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 1000;
  background-color: rgba(255, 255, 255, 255);
  width: 80vw;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0px 0px 10px 0px rgba(0, 0, 0, 0.2);
}

.close-btn {
  margin-left: 10px;
  border-width: 3px;
  transition: background-color 0.3s, color 0.3s, transform 0.3s;
}

.close-btn:hover {
  transform: scale(1.1);
}

.upload-article-btn {
  transition: background-color 0.3s, color 0.3s, transform 0.3s;

  background-color: transparent;
  border-width: 3px;
  color: black;
}

.upload-article-btn:hover {
  background-color: lightgray;
  transform: scale(1.1);
  transition: background-color 0.3s, color 0.3s, transform 0.3s;
}
</style>