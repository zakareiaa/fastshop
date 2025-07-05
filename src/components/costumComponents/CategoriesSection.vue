<template>
  <div class="app-container py-sm-6 py-3">
    <div class="d-flex justify-space-between align-center">
      <div class="position-relative mb-1 me-2">
        <div class="section-title">{{ $t("home.categories") }}</div>
      </div>
      <div class="position-relative">
        <IconBtn
          class="categories-button-prev rounded me-4"
          variant="tonal"
          color="primary"
          @click="slidePrev"
        >
          <VIcon icon="tabler-chevron-left" class="" />
        </IconBtn>

        <IconBtn
          class="categories-button-next rounded"
          variant="tonal"
          color="primary"
          @click="slideNext"
        >
          <VIcon icon="tabler-chevron-right" class="" />
        </IconBtn>
      </div>
    </div>
    <div class="mt-3" v-show="!categoriesLoading">
      <swiper-container
        ref="swiperEl"
        space-between="25"
        slides-per-view="8"
        dir="ltr"
        :breakpoints="{
          1440: {
            slidesPerView: 8,
            spaceBetween: 20,
            },
            1024: {
            slidesPerView: 6,
            spaceBetween: 20,
            },
            768: {
            slidesPerView: 5,
            spaceBetween: 20,
            },
            600: {
            slidesPerView: 4,
            spaceBetween: 15,
            },
            350: {
            slidesPerView: 2.5,
            spaceBetween: 12,
            },
            0: {
            slidesPerView: 2,
            spaceBetween: 10,
            },
          }"
        events-prefix="swiper-"
      >
        <swiper-slide
          v-for="cat in categories"
          :key="cat.id"
          class="py-3"
          style="block-size: auto !important"
        >
          <CategoryCard :category="cat" />
        </swiper-slide>
      </swiper-container>
    </div>

    <div v-show="categoriesLoading" class="mt-3">
      <swiper-container
        space-between="20"
        slides-per-view="6"
        dir="ltr"
        :breakpoints="{
          1440: {
            slidesPerView: 8,
          },
          1024: {
            slidesPerView: 6,
          },
          768: {
            slidesPerView: 5,
          },
          600: {
            slidesPerView: 4,
          },
          350: {
            slidesPerView: 3,
          },
          0: {
            slidesPerView: 2,
          },
        }"
        events-prefix="swiper-"
      >
        <swiper-slide v-for="i in 12" :key="i" class="py-3">
          <div>
            <div
              class="skeleton"
              style="border-radius: 16px; block-size: 160px; inline-size: 100%"
            ></div>
          </div>
        </swiper-slide>
      </swiper-container>
    </div>
  </div>

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

import CategoryCard from "./CategoryCard.vue";

export default {
  components: { CategoryCard },

  computed: {
    currentLanguage() {
      return this.$i18n.locale;
    },
  },

  data() {
    return {
      categories: [],
      categoriesLoading: true,

      totalProducts: 0,

      api_url: import.meta.env.VITE_API_URL,

      isSnackbarVisible: false,
      snackbarText: "",
      snackbarColor: "",
    };
  },

  async mounted() {
    this.startAutoplay();
    await this.getAllProductsCount();
    this.getCategories();
  },

  unmounted() {
    this.stopAutoplay();
  },

  methods: {
    async getCategories() {
      this.categoriesLoading = true;
      try {
        const response = await axios.get(
          this.api_url + "/categories?per_page=-1",
          {
            headers: {
              Accept: "application/json",
            },
          }
        );
        this.categories = [
          {
            id: 0,
            name: "All",
            name_ar: "كل المنتجات",
            name_fr: "Tous",
            products_count: this.totalProducts,
          },
          ...response.data.data,
        ];
      } catch (error) {
        this.showSnackbar(
          "Something went wrong while fetching categories",
          "error"
        );
      } finally {
        this.categoriesLoading = false;
      }
    },

    async getAllProductsCount() {
      try {
        const response = await axios.get(this.api_url + "/products/count", {
          headers: {
            Accept: "application/json",
          },
        });
        this.totalProducts = response.data.count;
      } catch (error) {
        this.showSnackbar(
          "Something went wrong while fetching products count",
          "error"
        );
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

<style lang="scss">
.section-title {
  font-size: 24px;
  font-weight: 800;
  line-height: 36px;
}

.section-title::after {
  position: absolute;
  background-image: url("@assets/images/section-title-icon.png");
  background-position: left bottom;
  background-repeat: no-repeat;
  background-size: contain;
  block-size: 100%;
  content: "";
  font-weight: 800;
  inline-size: 120%;
  inset-block-end: 0;
  inset-inline-start: -12%;

  // filter: grayscale(100%) contrast(100%) brightness(100%);
}
</style>

<style lang="scss" scoped>
swiper-container::part(container) {
  padding-inline: 6px !important;
}
</style>
