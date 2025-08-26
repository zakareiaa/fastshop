<template>
  <div class="app-container py-sm-6 py-3">
    <div class="d-flex justify-space-between align-center">
      <div class="position-relative mb-1 me-2">
        <div class="section-title">{{ title }}</div>
      </div>
      <div class="position-relative">
        <IconBtn
          class="reviews-button-prev me-3 b-radius-0"
          variant="tonal"
          color="primary"
          @click="slidePrev"
        >
          <VIcon icon="tabler-chevron-left" class="" />
        </IconBtn>

        <IconBtn
          class="reviews-button-next b-radius-0"
          variant="tonal"
          color="primary"
          @click="slideNext"
        >
          <VIcon icon="tabler-chevron-right" class="" />
        </IconBtn>
      </div>
    </div>
    <div v-show="!productsLoading">
      <swiper-container
        ref="swiperEl"
        space-between="10"
        slides-per-view="4"
        :breakpoints="{
          900: {
            slidesPerView: 4,
          },
          480: {
            slidesPerView: 2.5,
          },
          0: {
            slidesPerView: 2,
          },
        }"
        events-prefix="swiper-"
      >
        <swiper-slide
          v-for="product in products"
          :key="product.id"
          class="py-4"
        >
          <ProductCard :productProp="product" viewMode="grid" />
        </swiper-slide>
      </swiper-container>
    </div>

    <div v-show="productsLoading">
      <swiper-container
        ref="swiperElSkeleton"
        space-between="8"
        slides-per-view="4"
        :breakpoints="{
          900: {
            slidesPerView: 4,
          },
          480: {
            slidesPerView: 2.5,
          },
          0: {
            slidesPerView: 2,
          },
        }"
        events-prefix="swiper-"
      >
        <swiper-slide v-for="i in 8" class="py-3">
          <div
            class="skeleton"
            style="block-size: 400px; inline-size: 100%"
          ></div>
        </swiper-slide>
      </swiper-container>
    </div>
  </div>
</template>

<script>
import { register } from "swiper/element/bundle";
import ProductCard from "./ProductCard.vue";
register();

export default {
  props: {
    title: {
      type: String,
      required: true,
    },
    products: {
      type: Array,
      required: true,
    },
    productsLoading: {
      type: Boolean,
      required: true,
    },
  },

  mounted() {
    // this.startAutoplay();
  },

  unmounted() {
    // this.stopAutoplay();
  },

  methods: {
    toSlide(index) {
      this.$refs.swiperEl?.swiper.slideTo(index - 1);
      this.$refs.swiperElSkeleton?.swiper.slideTo(index - 1);
    },

    slideNext() {
      this.$refs.swiperEl?.swiper.slideNext();
      this.$refs.swiperElSkeleton?.swiper.slideNext();
    },

    slidePrev() {
      this.$refs.swiperEl?.swiper.slidePrev();
      this.$refs.swiperElSkeleton?.swiper.slidePrev();
    },

    startAutoplay() {
      this.$refs.swiperEl?.swiper.autoplay.start();
      this.$refs.swiperElSkeleton?.swiper.autoplay.start();
    },

    stopAutoplay() {
      this.$refs.swiperEl?.swiper.autoplay.stop();
      this.$refs.swiperElSkeleton?.swiper.autoplay.stop();
    },
  },
};
</script>

<style lang="scss" scoped>
.section-title {
  position: relative;
  font-size: 28px;
  font-weight: 800;
  line-height: 36px;
}


swiper-container::part(container) {
  padding-inline: 6px !important;
}
</style>
