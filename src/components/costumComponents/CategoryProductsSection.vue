<template>
  <div class="app-container py-sm-6 py-3">
    <div class="d-flex justify-space-between align-center">
      <div class="position-relative mb-1 me-2">
        <div class="section-title">{{ title }}</div>
      </div>
      <div class="position-relative">
        <IconBtn
          class="reviews-button-prev rounded me-4"
          variant="tonal"
          color="primary"
          @click="slidePrev"
        >
          <VIcon icon="tabler-chevron-left" class="" />
        </IconBtn>

        <IconBtn
          class="reviews-button-next rounded"
          variant="tonal"
          color="primary"
          @click="slideNext"
        >
          <VIcon icon="tabler-chevron-right" class="" />
        </IconBtn>
      </div>
    </div>
    <div class="mt-3" v-show="!productsLoading">
      <swiper-container
        ref="swiperEl"
        space-between="20"
        slides-per-view="4"
        :breakpoints="{
          1280: {
            slidesPerView: 5,
          },
          1024: {
            slidesPerView: 4,
          },
          768: {
            slidesPerView: 3,
          },
          600: {
            slidesPerView: 3,
          },
          480: {
            slidesPerView: 2,
          },
          0: {
            slidesPerView: 1.3,
          },
        }"
        events-prefix="swiper-"
      >
        <swiper-slide
          v-for="product in products"
          :key="product.id"
          class="py-3"
        >
          <ProductCard :productProp="product" viewMode="grid" />
        </swiper-slide>
      </swiper-container>
    </div>

    <div class="mt-3" v-show="productsLoading">
      <swiper-container
        ref="swiperElSkeleton"
        space-between="20"
        slides-per-view="4"
        :breakpoints="{
          1280: {
            slidesPerView: 5,
          },
          1024: {
            slidesPerView: 4,
          },
          768: {
            slidesPerView: 3,
          },
          600: {
            slidesPerView: 3,
          },
          480: {
            slidesPerView: 2,
          },
          0: {
            slidesPerView: 1.3,
          },
        }"
        events-prefix="swiper-"
      >
        <swiper-slide v-for="i in 8" class="py-3">
          <div
            class="skeleton"
            style="border-radius: 16px; block-size: 400px; inline-size: 100%"
          ></div>
        </swiper-slide>
      </swiper-container>
    </div>
  </div>
</template>

<script>
import { register } from "swiper/element/bundle";
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
    this.startAutoplay();
  },

  unmounted() {
    this.stopAutoplay();
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
}

swiper-container::part(container) {
  padding-inline: 6px !important;
}
</style>
