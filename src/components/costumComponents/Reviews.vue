<template>
  <div
    id="customer-review"
    class="position-relative"
    v-show="reviewData.length > 0"
  >
    <div class="customer-reviews pb-12">
      <div class="app-container">
        <!-- 👉 Headers  -->
        <VRow>
          <VCol cols="12" md="3">
            <div
              class="headers d-flex justify-center flex-column align-start h-100"
              style="max-inline-size: 275px"
            >
              <VChip label color="primary" class="mb-4" size="small">
                {{ $t("reviews.real_customers_reviews") }}
              </VChip>
              <div class="position-relative mb-1 me-2">
                <div class="section-title">
                  {{ $t("reviews.what_people_say") }}
                </div>
              </div>
              <p class="text-body-1 mb-6">
                {{ $t("reviews.see_customer_experience") }}
              </p>
              <div class="position-relative">
                <IconBtn
                  class="reviews-button-prev rounded me-4"
                  variant="tonal"
                  color="primary"
                  @click="slide('prev')"
                >
                  <VIcon icon="tabler-chevron-left" class="" />
                </IconBtn>

                <IconBtn
                  class="reviews-button-next rounded"
                  variant="tonal"
                  color="primary"
                  @click="slide('next')"
                >
                  <VIcon icon="tabler-chevron-right" class="" />
                </IconBtn>
              </div>
            </div>
          </VCol>

          <VCol cols="12" md="9">
            <!-- 👉 Customer Review Swiper -->
            <div class="swiper-reviews-carousel">
              <!-- eslint-disable vue/attribute-hyphenation -->
              <swiper-container
                ref="customerReviewSwiper"
                slides-per-view="2"
                space-between="20"
                autoplay-delay="3000"
                autoplay-disable-on-interaction="false"
                events-prefix="swiper-"
                dir="ltr"
                :injectStyles="[
                  `
                    .swiper{
                      padding-block: 12px;
                      padding-inline: 12px;
                      margin-inline: -12px;
                    }
                    .swiper-button-next, .swiper-button-prev{
                      visibility: hidden;
                    }
                  `,
                ]"
                navigation="{
                  nextEl: '.swiper-button-next',
                  prevEl: '.swiper-button-prev',
                }"
                :breakpoints="{
                  1280: {
                    slidesPerView: 3,
                    spaceBetween: 20,
                  },
                  960: {
                    slidesPerView: 2,
                    spaceBetween: 20,
                  },
                  600: {
                    slidesPerView: 2,
                    spaceBetween: 20,
                  },
                }"
                v-show="!getReviewsLoading"
              >
                <swiper-slide v-for="(data, index) in reviewData" :key="index">
                  <VCard class="d-flex h-100 align-stretch" >
                    <VCardText
                      class="pa-6 d-flex flex-column justify-space-between align-start"
                    >
                      <p class="text-body-1">"{{ data.comment }}"</p>

                      <div>
                        <VRating
                          :model-value="data.rating"
                          color="warning"
                          density="compact"
                          class="mb-4"
                          readonly
                        />
                        <div class="d-flex align-center gap-x-3">
                          <VAvatar
                            size="38"
                            color="primary"
                            class="v-avatar-light-bg primary--text"
                            variant="tonal"
                          >
                            <span>{{ avatarText(data.customer_name) }}</span>
                          </VAvatar>
                          <div>
                            <h6 class="text-h6">
                              {{ data.customer_name }}
                            </h6>

                            <div class="text-body-2 text-disabled">
                              {{ data?.product?.name || "" }}
                            </div>
                          </div>
                        </div>
                      </div>
                    </VCardText>
                  </VCard>
                </swiper-slide>
              </swiper-container>

              <!-- Reviews Skeleton -->
              <swiper-container
                ref="customerReviewSwiperSkeleton"
                slides-per-view="2"
                space-between="20"
                autoplay-delay="3000"
                autoplay-disable-on-interaction="false"
                events-prefix="swiper-"
                dir="ltr"
                :breakpoints="{
                  1280: {
                    slidesPerView: 3,
                    spaceBetween: 20,
                  },
                  960: {
                    slidesPerView: 2,
                    spaceBetween: 20,
                  },
                  600: {
                    slidesPerView: 2,
                    spaceBetween: 20,
                  },
                }"
                v-show="getReviewsLoading"
              >
                <swiper-slide v-for="index in 8" :key="index">
                  <div
                    class="skeleton"
                    style="
                      border-radius: 6px;
                      block-size: 300px;
                      inline-size: 100%;
                    "
                  ></div>
                </swiper-slide>
              </swiper-container>
            </div>
          </VCol>
        </VRow>
      </div>
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
        {{ $t("common.close") }}
      </VBtn>
    </template>
  </VSnackbar>
</template>

<script>
import axios from "axios";

import { register } from "swiper/element/bundle";
register();

export default {
  computed: {
    currentLanguage() {
      return this.$i18n.locale;
    },
  },

  data() {
    return {
      reviewData: [
        {
          id: 1,
          comment: "",
          rating: 5,
          customer_name: "",
          product: {
            name: "",
          },
        },
      ],
      getReviewsLoading: false,

      snackbarText: "",
      snackbarColor: "",
      isSnackbarVisible: false,

      api_url: import.meta.env.VITE_API_URL,
    };
  },

  mounted() {
    this.getReviews();
  },

  methods: {
    async getReviews() {
      try {
        this.getReviewsLoading = true;
        const response = await axios.get(
          this.api_url + "/reviews?include_product=true",
          {
            headers: {
              Accept: "application/json",
            },
          }
        );
        this.reviewData = response.data.data;
      } catch (error) {
        console.error("Error fetching reviews:", error);
        this.showSnackbar(
          this.$t("notifications.error.failed_to_load_reviews"),
          "error"
        );
      } finally {
        this.getReviewsLoading = false;
      }
    },

    showSnackbar(text, color) {
      this.snackbarText = text;
      this.snackbarColor = color;
      this.isSnackbarVisible = true;
    },

    slide(dir) {
      const swiper = this.$refs.customerReviewSwiper?.swiper;
      if (dir === "prev") swiper.slidePrev();
      swiper.slideNext();
    },
  },
};
</script>

<style lang="scss">
@use "swiper/css/bundle";

swiper-container::part(bullet-active) {
  border-radius: 6px;
  background-color: rgba(
    var(--v-theme-on-background),
    var(--v-disabled-opacity)
  );
  inline-size: 38px;
}

swiper-container::part(bullet) {
  background-color: rgba(var(--v-theme-on-background));
}

.swiper-divider {
  margin-block: 72px 1rem;
}

.swiper-reviews-carousel {
  swiper-container {
    .swiper {
      padding-block-end: 3rem;
    }

    .swiper-button-next {
      display: none;
    }
  }

  swiper-slide {
    block-size: auto;
    opacity: 1;
  }
}
</style>

<style lang="scss" scoped>
.customer-reviews {
  padding-block: 48px 0;
}

@media (max-width: 600px) {
  .customer-reviews {
    padding-block: 1rem;
  }
}

#customer-review {
  border-radius: 3.75rem 3.75rem 0 0;
  background-color: rgb(var(--v-theme-background));
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
</style>
