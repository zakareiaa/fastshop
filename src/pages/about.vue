<template>
  <Header />

  <div class="about-page-wrapper">
    <!-- Hero Section -->
    <div class="hero-section app-container">
      <VCard class="pa-6 px-3 px-sm-6">
        <VRow>
          <VCol cols="12" md="6" class="d-flex flex-column justify-center">
            <h1 class="text-h2 font-weight-bold mb-4 ps-0">
              {{ $t("about.company_name") }}
            </h1>
            <div class="text-body-1 mb-6 about-intro">
              <p>
                {{ $t("about.intro_p1") }}
              </p>
              <p>
                {{ $t("about.intro_p2") }}
              </p>
              <p>
                {{ $t("about.intro_p3") }}
              </p>
            </div>
            <div>
              <VBtn
                color="primary"
                size="large"
                variant="elevated"
                class="shop-now-button"
                @click="$router.push('/shop')"
              >
                <VIcon start icon="tabler-shopping-cart" class="me-2"></VIcon>
                {{ $t("about.shop_now") }}
              </VBtn>
              <VBtn
                variant="outlined"
                size="large"
                href="tel:+213557097634"
                class="contact-us-button"
              >
                <VIcon start icon="tabler-phone" class="me-2"></VIcon>
                {{ $t("about.contact_us") }}
              </VBtn>
            </div>
          </VCol>
          <VCol cols="12" md="6" class="d-flex justify-center align-center">
            <img
              src="@/assets/images/about1.png"
              alt="About Us Hero Image"
              class="hero-image rounded"
              cover
            />
          </VCol>
        </VRow>
      </VCard>
      <!-- Our Mission Section -->
      <VCard class="mt-8 pa-6 px-3 px-sm-6 mb-3">
        <VRow>
          <VCol cols="12" md="6" class="d-flex justify-center align-center">
            <img
              src="@/assets/images/about2.jpg"
              alt="Our Mission Image"
              class="hero-image rounded"
              cover
            />
          </VCol>
          <VCol cols="12" md="6" class="d-flex flex-column justify-center">
            <h1 class="text-h2 font-weight-bold mb-4 ps-0">
              {{ $t("about.our_mission") }}
            </h1>
            <div class="text-body-1 mb-6">
              <p>
                {{ $t("about.mission_p1") }}
              </p>
              <p>
                {{ $t("about.mission_p2") }}
              </p>
            </div>
            <div class="contact-info mt-4">
              <div class="d-flex align-center mb-2">
                <VIcon icon="tabler-phone" color="primary" class="me-2"></VIcon>
                <span
                  >{{ $t("about.contact_questions") }}
                  <span
                    class="pa-0 text-primary cursor-pointer"
                    @click="callPhoneNumber('0557097634')"
                  >
                    0557 09 76 34
                  </span>
                </span>
              </div>
              <div class="d-flex align-center">
                <VIcon icon="tabler-mail" color="primary" class="me-2"></VIcon>
                <span
                  >{{ $t("about.contact_email") }}
                  <span
                    class="pa-0 text-primary cursor-pointer"
                    @click="openEmail('contact@hichem-technology.com')"
                  >
                    contact@hichem-technology.com
                  </span>
                </span>
              </div>
            </div>
          </VCol>
        </VRow>
      </VCard>

      <Reviews />
    </div>
  </div>

  <Footer />
</template>

<script>
import Footer from "@/components/costumComponents/Footer.vue";
import Header from "@/components/costumComponents/Header.vue";
import Reviews from "@/components/costumComponents/Reviews.vue";

export default {
  name: "AboutUs",

  components: {
    Header,
    Footer,
    Reviews,
  },

  computed: {
    currentLanguage() {
      return this.$i18n.locale;
    },
  },

  methods: {
    callPhoneNumber(phoneNumber) {
      window.location.href = `tel:${phoneNumber}`;
    },
    openEmail(email) {
      window.location.href = `mailto:${email}`;
    },
  },
};
</script>

<script setup>
import "@styles/header.css";

definePage({
  meta: {
    layout: "blank",
    public: true,
  },
});
</script>

<style lang="scss">
@use "@core/scss/template/pages/page-auth";

.about-page-wrapper {
  .hero-section {
    padding-block: 2rem;

    .about-intro p {
      font-size: 1.1rem;
      line-height: 1.7;
      margin-block-end: 1rem;
    }

    .hero-image {
      block-size: 100%;

      // box-shadow: 0 10px 30px rgba(0, 0, 0, 10%);
      inline-size: 100%;

      // max-block-size: 400px;
      transition: transform 0.3s ease;

      &:hover {
        transform: translateY(-5px);
      }
    }
  }

  .our-story-section,
  .our-values-section,
  .our-team-section,
  .contact-section {
    .text-h3 {
      position: relative;
      display: inline-block;
    }
  }

  .value-card {
    border-block-start: 4px solid var(--v-theme-primary);
    transition: transform 0.3s ease, box-shadow 0.3s ease;

    &:hover {
      box-shadow: 0 15px 30px rgba(0, 0, 0, 10%) !important;
      transform: translateY(-10px);
    }

    .value-icon {
      margin-inline-end: 1rem;
    }
  }

  .team-card {
    overflow: hidden;
    transition: transform 0.3s ease;

    &:hover {
      transform: translateY(-10px);
    }

    .team-image {
      transition: transform 0.5s ease;

      .team-card:hover & {
        transform: scale(1.05);
      }
    }

    .social-icons {
      .v-icon {
        cursor: pointer;
        opacity: 0.7;
        transition: color 0.3s ease, opacity 0.3s ease;

        &:hover {
          color: var(--v-theme-primary);
          opacity: 1;
        }
      }
    }
  }

  .max-width-800 {
    max-inline-size: 800px;
  }

  .contact-section {
    .v-list-item {
      margin-block-end: 1rem;

      .v-avatar {
        margin-inline-end: 1rem;
      }
    }
  }
}

.shop-now-button,
.contact-us-button {
  margin-inline-end: 1rem;
}

@media (max-width: 600px) {
  .shop-now-button,
  .contact-us-button {
    inline-size: 100%;
    margin-block-end: 1rem;
    margin-inline-end: 0;
  }
}
</style>
