<script>
import axios from 'axios';

export default {
  name: "LoginPage",
  data() {
    return {
      email: "",
      password: "",
      error: null,
    };
  },
  computed: {
    emailPlaceholder() {
      return this.email ? '' : 'abc@gmail.com';
    },
    passwordPlaceholder() {
      return this.password ? '' : 'Password';
    },
  },
  methods: {
    handleSubmit() {
      const userData = {
        email: this.email,
        password: this.password,
      };

      axios.post('http://127.0.0.1:8000/api/login/', userData)
          .then(response => {
            console.log('Login successful:', response.data);
            this.error = null;

            this.$store.commit("setUser", response.data.user);
            this.$store.commit("setToken", response.data.token);

            // Presmeruj na hlavnú stránku
            this.$router.push('/');
          })
          .catch(error => {
            console.error('Error logging in:', error);
            if (error.response.status === 401) {
              this.error = 'No such user. Invalid email or password';
            } else if (error.response.status === 404) {
              this.error = 'Email not found';
            } else {
              this.error = 'An error occurred during login';
            }
          });
    },
  },
};
</script>

<template>
  <div class="login-body" tabindex="-1" role="dialog" id="modalSignin">
    <div class="modal-dialog" role="document">
      <div class="modal-content rounded-4 shadow">
        <div class="modal-header p-5 pb-4 border-bottom-0">
          <h1 class="fw-bold mb-0 fs-2" style="color: white; font-size: 36px">Sign up for free</h1>
        </div>

        <div class="modal-body p-5 pt-0">
          <div class="text-body-secondary" style="font-size: 36px; margin-top: 10px;">
            Sign in with existing account
          </div>
          <div v-if="error" class="text-danger">{{ error }}</div>

          <form @submit.prevent="handleSubmit">
            <div class="form-group">
              <label for="floatingInput" style="font-size: 20px; color: black; text-align: left; display: block;">Email</label>
              <div class="form-floating mb-3">
                <input v-model="email" type="email" class="form-control rounded-3" id="floatingInput" :placeholder="emailPlaceholder" style="font-size: 24px; text-align: left; display: block;">
                <label for="floatingInput" :class="{ 'active': email }" style="font-size: 16px; color: lightslategrey; text-align: left;"><i class="bi bi-envelope-open-fill"></i>
                  {{ email ? '' : 'abc@gmail.com' }}</label>
              </div>
            </div>

            <div class="form-group">
              <label for="floatingInput" style="font-size: 20px; color: black; text-align: left; display: block;">Password</label>
              <div class="form-floating mb-3">
                <input v-model="password" type="password" class="form-control rounded-3" id="floatingPassword" :placeholder="passwordPlaceholder" style="font-size: 24px">
                <label for="floatingPassword" :class="{ 'active': password }" style="font-size: 16px; color: lightslategrey"><i class="bi bi-lock-fill"></i>
                  {{ password ? '' : 'Password' }}</label>
              </div>
            </div>
            <button type="submit" class="sign-up" style="font-size: 30px; padding: 10px 20px;">Sign in</button>
            <div class="text-body-secondary" style="font-size: 28px; margin-top: 10px;">
              By clicking Sign in, you agree to the terms of use
            </div>
            <h2 class="fs-5 fw-bold mb-3" style="font-size: 36px; color: white">Or use a third-party</h2>
            <div class="d-flex flex-column">
              <button class="w-100 py-2 mb-2 btn btn-outline-secondary rounded-3 text-center" type="submit">
                <svg class="bi me-1" width="50" height="50"><use xlink:href="#twitter"></use></svg>
                <i class="bi bi-twitter-x"></i>
                Sign up with Twitter
              </button>

              <button class="w-100 py-2 mb-2 btn btn-outline-primary rounded-3 text-center" type="submit">
                <svg class="bi me-1" width="50" height="50"><use xlink:href="#facebook"></use></svg>
                <i class="bi bi-facebook"></i>Sign up with Facebook
              </button>

              <button class="w-100 py-2 mb-ins2 btn btn-outline-secondary rounded-3 text-center" type="submit">
                <svg class="bi me-1" width="50" height="50"><use xlink:href="#github"></use></svg>
                <i class="bi bi-instagram"></i>
                Sign up with Instagram
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
body {
  background-color: lightgray;
  font-family: Arial, sans-serif;
  margin: 0;
  padding: 0;
  margin-bottom: 100px;
}

.btn-outline-primary {
  background-color: transparent;
  margin-left: 20px;
  padding-right: 50px;
  border-width: 3px;
  border-color: blue !important;
  color: blue;
  font-size: 24px;
}

.btn-primary {
  background-color: blue;
  color: white;
}

.btn-primary:hover {
  background-color: #3030e8;
  transform: scale(1.1);
  transition: background-color 0.3s, color 0.3s, transform 0.3s;
}

.btn-outline-secondary {
  background-color: transparent;
  margin-left: 20px;
  padding-right: 50px;
  border-width: 3px;
  border-color: grey !important;
  color: black;
  font-size: 24px;
}

.btn-outline-primary:hover {
  background-color: #3030e8;
  color: white;
  transform: scale(1.1);
  transition: background-color 0.3s, color 0.3s, transform 0.3s;
}

.btn-outline-secondary:hover {
  background-color: lightgray;
  transform: scale(1.1);
  transition: background-color 0.3s, color 0.3s, transform 0.3s;
}

.login-body {
  margin-bottom: 15vh;
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;
}

.sign-up {
  background-color: transparent;
  border-width: 3px;
  color: black;
}

.sign-up:hover {
  background-color: lightgray;
  transform: scale(1.1);
  transition: background-color 0.3s, color 0.3s, transform 0.3s;
}

.form-floating {
  margin-top: 5px;
  margin-bottom: 5px;
}

.modal-content {
  max-width: 600px;
  max-height: 900px;
  margin: 0 auto;
}

.modal-header {
  padding: 2rem 2rem 1rem;
}

.modal-body {
  padding: 1rem 2rem;
}
</style>