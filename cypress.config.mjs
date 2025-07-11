import { defineConfig } from "cypress";

export default defineConfig({
  e2e: {
    specPattern: "cypress/e2e/**/*.spec.{js,jsx}", 
    setupNodeEvents(on, config) {
      // Jika tidak digunakan, kosongkan
    },
  },
});
