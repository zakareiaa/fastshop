<template>
  <Header />

  <!-- Hero Section -->
  <div class="app-container heroContainer">
    <div v-show="getThumbnailLoading">
      <div
        class="skeleton hero-swiper"
        style="border-radius: 16px;"
      ></div>
    </div>

    <swiper-container
      v-show="!getThumbnailLoading"
      ref="swiperEl"
      pagination="true"
      space-between="20"
      events-prefix="swiper-"
      class="hero-swiper"
    >
      <swiper-slide
        v-for="thumbnail in thumbnails"
        :key="thumbnail.image_url"
        class="thumbnail-slide"
      >
        <img
          class="thumbnail-image"
          :src="app_url + thumbnail?.image_url"
          :class="{ 'cursor-pointer': thumbnail.product_url }"
          @click="handleThumbnailClick(thumbnail)"
        />
      </swiper-slide>
    </swiper-container>
  </div>

  <!-- Categories Section -->
  <CategoriesSection />

  <!-- New Arrivals -->
  <div v-show="!getNewProductsLoading && newProducts.length > 0">
    <CategoryProductsSection
      :title="$t('home.new_arrivals')"
      :products="newProducts"
      :productsLoading="getNewProductsLoading"
    />
  </div>

  <!-- Products Category Section -->
  <template v-for="category in productsCategorySection" :key="category.id">
    <CategoryProductsSection
      :title="category[`name_${currentLanguage}`] || category?.name"
      :products="category.products"
      :productsLoading="false"
    />
  </template>

  <!-- 👉 Brand-logo Swiper  -->
  <div class="app-container pt-2 pb-4">
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
            slidesPerView:7,
          },
          768: {
            slidesPerView: 4,
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
  </div>

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
      thumbnails: [],
      getThumbnailLoading: true,

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
        this.getThumbnailLoading = true;
        const response = await axios.get(this.api_url + "/thumbnails", {
          headers: {
            Accept: "application/json",
          },
        });
        this.thumbnails = response.data;
      } catch (error) {
        this.showSnackbar(
          "Something went wrong while fetching thumbnail urls",
          "error"
        );
      } finally {
        this.getThumbnailLoading = false;
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
        console.log(response.data);
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
  block-size: 500px;
  inline-size: 100%;
}

@media (max-width: 991px) {
  .hero-swiper {
    block-size: 300px;
  }
}

@media (max-width: 600px) {
  .hero-swiper {
    block-size: 180px;
  }
}

.thumbnail-slide {
  display: flex;
  align-items: center;
  justify-content: center;
  inline-size: 100%;
}

.cursor-pointer {
  cursor: pointer;
}

.thumbnail-image {
  border-radius: 16px;
  block-size: 100%;
  inline-size: 100%;
  object-fit: cover;
}

.section-title {
  font-size: 24px;
  font-weight: 800;
  line-height: 36px;
}

.section-title::after {
  position: absolute;
  background: url("@assets/images/section-title-icon.png") no-repeat left
    bottom/contain;
  background-size: contain;
  block-size: 100%;
  content: "";
  font-weight: 800;
  inline-size: 120%;
  inset-block-end: 0;
  inset-inline-start: -12%;
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
</style>
