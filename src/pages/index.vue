<template>
  <Header />

  <!-- Hero Section -->
  <div class="aheroContainer fade-up-animation">
    <swiper-container
      ref="swiperEl"
      pagination="true"
      events-prefix="swiper-"
      class="hero-swiper"
    >
      <swiper-slide
        v-for="thumbnail in thumbnails"
        :key="thumbnail.image_url"
        class="thumbnail-slide"
      >
        <div
          class="slide-container"
          :class="{ 'cursor-pointer': thumbnail.product_url }"
          @click="handleThumbnailClick(thumbnail)"
        >
          <img class="thumbnail-image" :src="thumbnail?.image_url" />
          <div class="slide-overlay"></div>
          <div class="slide-content">
            <h2 class="slide-title text-h2">{{ $t("hero.main_title") }}</h2>
            <VBtn
              color="white"
              size="large"
              variant="outlined"
              rounded="0"
              @click="$router.push('/shop')"
            >
              {{ $t("hero.cta_button") }}
            </VBtn>
            <p class="slide-description">{{ $t("hero.description") }}</p>
          </div>
        </div>
      </swiper-slide>
    </swiper-container>
  </div>

  <!-- Categories Section -->
  <!-- <div class="fade-up-animation fade-up-delay-1">
    <CategoriesSection />
  </div> -->

  <!-- New Arrivals -->
  <div
    class="pt-4"
    v-show="!(!getNewProductsLoading && newProducts.length == 0)"
  >
    <CategoryProductsSection
      :title="$t('home.recommended')"
      :products="newProducts"
      :productsLoading="getNewProductsLoading"
    />
  </div>

  <!-- Products Category Section -->
  <template
    v-for="(category, index) in productsCategorySection"
    :key="category.id"
  >
    <div>
      <CategoryProductsSection
        :title="category[`name_${currentLanguage}`] || category?.name"
        :products="category.products"
        :productsLoading="false"
      />
    </div>
  </template>

  <!-- 👉 Brand-logo Swiper  -->
  <!-- <div class="app-container pt-2 pb-4">
    <div class="swiper-brands-carousel pt-6 pb-4">
      <swiper-container
        slides-per-view="3"
        :space-between="30"
        events-prefix="swiper-"
        :autoplay="{
          delay: 3000,
          disableOnInteraction: true,
        }"
        :breakpoints="{
          992: {
            slidesPerView: 7,
          },
          768: {
            slidesPerView: 3.5,
          },
        }"
      >
        <swiper-slide v-for="(img, index) in brandLogos" :key="index">
          <div class="brand-logo-container">
            <VImg
              :src="img"
              class="brand-logo"
              :class="{ dark: $vuetify.theme.current.dark }"
            />
          </div>
        </swiper-slide>
      </swiper-container>
    </div>
  </div> -->

  <Reviews />

  <Footer />

  <VSnackbar
    v-model="isSnackbarVisible"
    transition="scroll-y-reverse-transition"
    location="top end"
    :timeout="3000"
    :color="snackbarColor"
  >
    <span style="color: rgb(var(--v-theme-on-primary))">{{
      snackbarText
    }}</span>

    <template #actions>
      <VBtn
        color="rgb(var(--v-theme-on-primary))"
        @click="isSnackbarVisible = false"
      >
        Close
      </VBtn>
    </template>
  </VSnackbar>
</template>

<script>
import axios from "axios";

import { register } from "swiper/element/bundle";
register();

import CategoriesSection from "@/components/costumComponents/CategoriesSection.vue";
import CategoryProductsSection from "@/components/costumComponents/CategoryProductsSection.vue";
import Footer from "@/components/costumComponents/Footer.vue";
import Header from "@/components/costumComponents/Header.vue";
import ProductCard from "@/components/costumComponents/ProductCard.vue";
import Reviews from "@/components/costumComponents/Reviews.vue";

// Import brand logos
import adataLogo from "@/assets/images/brands_logos/adata.png";
import aocLogo from "@/assets/images/brands_logos/aoc.png";
import asusLogo from "@/assets/images/brands_logos/asus.png";
import attackLogo from "@/assets/images/brands_logos/attack.png";
import deepcoolLogo from "@/assets/images/brands_logos/deepcool.png";
import fifineLogo from "@/assets/images/brands_logos/fifine.webp";
import gigabyteLogo from "@/assets/images/brands_logos/gigabyte.png";
import matosLogo from "@/assets/images/brands_logos/matos.png";
import msiLogo from "@/assets/images/brands_logos/msi.png";

export default {
  components: {
    ProductCard,
    Header,
    Reviews,
    CategoryProductsSection,
    CategoriesSection,
  },

  computed: {
    currentLanguage() {
      return this.$i18n.locale;
    },
  },

  data() {
    return {
      thumbnails: [
        {
          id: 2,
          image_url: "/src/assets/images/thumbnails.jpeg",
          position: 1,
          product_url: null,
        },
      ],

      newProducts: [],
      getNewProductsLoading: true,

      productsCategorySection: [],
      getProductsCategorySectionLoading: true,

      brandLogos: [
        adataLogo,
        aocLogo,
        asusLogo,
        attackLogo,
        deepcoolLogo,
        fifineLogo,
        gigabyteLogo,
        matosLogo,
        msiLogo,
      ],

      isSnackbarVisible: false,
      snackbarText: "",
      snackbarColor: "",

      api_url: import.meta.env.VITE_API_URL,
      app_url: import.meta.env.VITE_APP_URL,
    };
  },

  mounted() {
    this.startAutoplay();
    this.getThumbnail();
    this.getNewProducts();
    this.getProductsCategorySection();
  },

  unmounted() {
    this.stopAutoplay();
  },

  methods: {
    async getThumbnail() {
      try {
        const response = await axios.get(this.api_url + "/thumbnails", {
          headers: {
            Accept: "application/json",
          },
        });
        if (response.data && response.data.length > 0) {
          this.thumbnails = response.data;
        }
      } catch (error) {
        this.showSnackbar(
          "Something went wrong while fetching thumbnail urls",
          "error"
        );
      }
    },

    handleThumbnailClick(thumbnail) {
      if (thumbnail && thumbnail.product_url) {
        let path = thumbnail.product_url;
        if (path.startsWith("http")) {
          try {
            const url = new URL(path);
            path = url.pathname + url.search;
          } catch (error) {
            console.error("Could not parse URL:", path, error);
          }
        }
        this.$router.push(path);
      }
    },

    async getNewProducts() {
      try {
        this.getNewProductsLoading = true;
        const response = await axios.get(
          this.api_url + "/products?is_new[eq]=1&per_page=20",
          {
            headers: {
              Accept: "application/json",
            },
          }
        );
        this.newProducts = response.data.data;
      } catch (error) {
        this.showSnackbar(
          "Something went wrong while fetching new products",
          "error"
        );
      } finally {
        this.getNewProductsLoading = false;
      }
    },

    async getProductsCategorySection() {
      try {
        this.getProductsCategorySectionLoading = true;
        const response = await axios.get(
          this.api_url +
            "/categories?per_page=-1&show_on_home_page[eq]=1&include_products=true",
          {
            headers: {
              Accept: "application/json",
            },
          }
        );
        console.log(response.data);

        const categories = response.data.data;

        // Filter products with status 0 in each category and then filter out empty categories
        this.productsCategorySection = categories
          .map((category) => {
            if (category.products) {
              category.products = category.products.filter(
                (product) => product.status !== 0
              );
            }
            return category;
          })
          .filter(
            (category) => category.products && category.products.length > 0
          );
      } catch (error) {
        this.showSnackbar(
          "Something went wrong while fetching products",
          "error"
        );
      } finally {
        this.getProductsCategorySectionLoading = false;
      }
    },

    showSnackbar(text, color) {
      this.snackbarText = text;
      this.snackbarColor = color;
      this.isSnackbarVisible = true;
    },

    toSlide(index) {
      this.$refs.swiperEl?.swiper.slideTo(index - 1);
    },

    slideNext() {
      this.$refs.swiperEl?.swiper.slideNext();
    },

    slidePrev() {
      this.$refs.swiperEl?.swiper.slidePrev();
    },

    startAutoplay() {
      this.$refs.swiperEl?.swiper.autoplay.start();
    },

    stopAutoplay() {
      this.$refs.swiperEl?.swiper.autoplay.stop();
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
</style>

<style lang="scss">
.hero-swiper {
  overflow: hidden;
  block-size: 700px;
  inline-size: 100%;
}

@media (max-width: 991px) {
  .hero-swiper {
    block-size: calc(100vh - 100px);
  }
}

.thumbnail-slide {
  display: flex;
  align-items: center;
  justify-content: center;
  inline-size: 100%;
}

.slide-container {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  block-size: 100%;
  inline-size: 100%;
}

.slide-container.cursor-pointer {
  cursor: pointer;
}

.thumbnail-image {
  block-size: 100%;
  inline-size: 100%;
  object-fit: cover;
}

.slide-overlay {
  position: absolute;
  z-index: 1;
  background: linear-gradient(
    135deg,
    rgb(0 0 0 / 70%) 0%,
    rgb(0 0 0 / 50%) 50%,
    rgb(0 0 0 / 80%) 100%
  );
  inset: 0;
}

.slide-content {
  position: absolute;
  z-index: 2;
  inline-size: 100%;
  inset-block-start: 50%;
  inset-inline-start: 50%;
  text-align: center;
  transform: translate(-50%, -50%);
}

.slide-title {
  z-index: 40;
  color: #fff;
  font-weight: 900;
  margin-block-end: 1.3rem;
  padding-inline: 8px;
}

.slide-description {
  z-index: 40;
  color: rgba(255, 255, 255, 75%);
  font-weight: 500;
  line-height: 1.8;
  margin-block-start: 1.3rem;
  margin-inline: auto;
  max-inline-size: 830px;
  padding-inline: 8px;
}

.section-title {
  font-size: 28px;
  font-weight: 800;
  line-height: 36px;
}

.brand-logo-container {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 10px;
  block-size: 60px;
  cursor: pointer;
  inline-size: 100%;
}

.brand-logo {
  filter: grayscale(100%);
  max-block-size: 40px;
  max-inline-size: 100%;
  object-fit: contain;
  opacity: 0.7;
  transition: all 0.3s ease;
}

.brand-logo:hover {
  filter: grayscale(0%);
  opacity: 1;
}

.brand-logo.dark {
  filter: grayscale(100%) invert(1) brightness(1.2);
  opacity: 1;
}

.brand-logo.dark:hover {
  filter: grayscale(100%) invert(1) brightness(1.2);
  opacity: 0.7;
}

/* Fade up animations */
@keyframes fade-up {
  from {
    opacity: 0;
    transform: translateY(30px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.fade-up-animation {
  animation: fade-up 0.8s ease-out forwards;
  opacity: 0;
}

.fade-up-delay-1 {
  animation-delay: 0.2s;
}

.fade-up-delay-2 {
  animation-delay: 0.4s;
}

.fade-up-delay-3 {
  animation-delay: 0.6s;
}

/* Reduce motion for users who prefer it */
@media (prefers-reduced-motion: reduce) {
  .fade-up-animation {
    animation: none;
    opacity: 1;
  }
}
</style>
