<script>
import axios from 'axios';

export default {
  name: "RegisterPage",
  data() {
    return {
      email: "",
      password: "",
      confirmPassword: "",
      number: "",
      errors: {},
    };
  },
  computed: {
    emailPlaceholder() {
      return this.email ? '' : 'abc@gmail.com';
    },
    passwordPlaceholder() {
      return this.password ? '' : 'Password';
    },
    confirmPasswordPlaceholder() {
      return this.confirmPassword ? '' : 'Type Password Again';
    },
    numberPlaceholder() {
      return this.number ? '' : 'Phone Number';
    },
  },
  watch: {
    email: 'validateEmail',
    password: 'validatePassword',
    confirmPassword: 'validatePassword',
  },
  methods: {
    handleSubmit() {
      if (this.validateForm()) {
        const userData = {
          email: this.email,
          password: this.password,
          password_confirmation: this.confirmPassword,
          phone_number: this.number,
        };

        axios.post('http://127.0.0.1:8000/api/register/', userData)
            .then(response => {
              console.log('User registered successfully:', response.data);

              // Presmeruj na login stránku po registrácii
              this.$router.push('/login-page');
            })
            .catch(error => {
              console.error('Error registering user:', error);
              if (error.response && error.response.data) {
                this.errors = error.response.data;
              }
            });
      }
    },
    validateEmail() {
      this.errors.email = this.email ? '' : 'Email is required.';
    },
    validatePassword() {
      this.errors.password = this.password ? '' : 'Password is required.';

      const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
      if (!passwordRegex.test(this.password)) {
        this.errors.passwordStrength = 'Password must be at least 8 characters long and include at least one letter and one number.';
      } else {
        this.errors.passwordStrength = '';
      }

      this.errors.confirmPassword = this.password === this.confirmPassword ? '' : 'Passwords do not match.';
    },
    validateForm() {
      this.validateEmail();
      this.validatePassword();

      const numberRegex = /^\d*$/; // Iba čísla
      this.errors.number = numberRegex.test(this.number) ? '' : 'Phone Number must contain only numbers.';

      return !Object.values(this.errors).some(error => error);
    },
  },
};
</script>

<template>
  <div class="login-body" tabindex="-1" role="dialog" id="modalSignin">
    <div class="modal-dialog" role="document">
      <div class="modal-content rounded-4 shadow">
        <div class="modal-header p-5 pb-4 border-bottom-0">
          <h1 class="fw-bold mb-0 fs-2" style="color: white; font-size: 40px">Sign up for free</h1>
        </div>

        <div class="modal-body p-5 pt-0">
          <div class="text-body-secondary" style="font-size: 36px; margin-top: 10px; color: black">
            Create your Account now!
          </div>
          <form @submit.prevent="handleSubmit">
            <div class="form-group">
              <label for="floatingInput" style="font-size: 20px; color: black; text-align: left; display: block;">Email</label>
              <div class="form-floating mb-3" :class="{ 'has-error': errors.email }">
                <input v-model="email" type="email" class="form-control rounded-3" id="floatingInput" :placeholder="emailPlaceholder" style="font-size: 24px">
                <label for="floatingInput" :class="{ 'active': email }" style="font-size: 16px; color: lightslategrey">
                  <i class="bi bi-envelope-open-fill"></i> {{ email ? '' : 'abc@gmail.com' }}
                </label>
              </div>
              <div v-if="errors.email" class="error-message">{{ errors.email }}</div>
            </div>

            <div class="form-group">
              <label for="floatingPassword" style="font-size: 20px; color: black; text-align: left; display: block;">Password</label>
              <div class="form-floating mb-3" :class="{ 'has-error': errors.password || errors.passwordStrength }">
                <input v-model="password" type="password" class="form-control rounded-3" id="floatingPassword" :placeholder="passwordPlaceholder" style="font-size: 24px">
                <label for="floatingPassword" :class="{ 'active': password }" style="font-size: 16px; color: lightslategrey">
                  <i class="bi bi-lock-fill"></i> {{ password ? '' : 'Password here' }}
                </label>
                <div v-if="errors.password" class="error-message">{{ errors.password }}</div>
                <div v-if="errors.passwordStrength" class="error-message">{{ errors.passwordStrength }}</div>
              </div>
            </div>

            <div class="form-group">
              <label for="floatingConfirmPassword" style="font-size: 20px; color: black; text-align: left; display: block;">Confirm Password</label>
              <div class="form-floating mb-3" :class="{ 'has-error': errors.confirmPassword }">
                <input v-model="confirmPassword" type="password" class="form-control rounded-3" id="floatingConfirmPassword" :placeholder="confirmPasswordPlaceholder" style="font-size: 24px">
                <label for="floatingConfirmPassword" :class="{ 'active': confirmPassword }" style="font-size: 16px; color: lightslategrey">
                  <i class="bi bi-lock-fill"></i> {{ confirmPassword ? '' : 'Reenter your Password' }}
                </label>
                <div v-if="errors.confirmPassword" class="error-message">{{ errors.confirmPassword }}</div>
              </div>
            </div>

            <div class="form-group">
              <label for="floatingNumber" style="font-size: 20px; color: black; text-align: left; display: block;">Phone Number</label>
              <div class="form-floating mb-3">
                <input v-model="number" type="text" inputmode="numeric" pattern="[0-9]*" class="form-control rounded-3" id="floatingNumber" :placeholder="numberPlaceholder" style="font-size: 24px; padding-right: 0;">
                <label for="floatingNumber" :class="{ 'active': number }" style="font-size: 16px; color: lightslategrey">
                  <i class="bi bi-telephone-inbound-fill"></i> {{ number ? '' : 'Phone Number (optional)' }}
                </label>
              </div>
            </div>

            <button type="submit" class="sign-up" style="font-size: 30px; padding: 10px 20px;">Create Account</button>
            <div class="text-body-secondary" style="font-size: 28px; margin-top: 10px;">
              By clicking Create account, you agree to the terms of use
            </div>
            <hr class="my-4">
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
  max-height: 1200px;
  margin: 0 auto;
}

.modal-header {
  padding: 2rem 2rem 1rem;
}

.modal-body {
  padding: 1rem 2rem;
}

.error-message {
  color: red;
  font-size: 14px;
  margin-top: 5px;
}

.has-error input {
  border-color: red !important;
}
</style>