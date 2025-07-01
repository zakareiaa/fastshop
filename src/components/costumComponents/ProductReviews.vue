<template>
  <div id="customer-review" class="position-relative">
    <div class="customer-reviews pb-12">
      <div class="app-container">
        <VRow v-if="productReviews.length > 0 || productReviewsLoading">
          <VCol cols="12" md="3">
            <div
              class="headers d-flex justify-center flex-column align-start h-100"
              style="max-inline-size: 275px"
            >
              <VChip label color="primary" class="mb-4" size="small">
                {{ $t("reviews.real_customers_reviews") }}
              </VChip>
              <div class="position-relative mb-1 me-2">
                <div class="section-title">{{ $t("reviews.title") }}</div>
              </div>
              <p class="text-body-1 mb-12">
                {{ $t("reviews.see_product_experience") }}
              </p>
              <div class="position-relative">
                <IconBtn
                  class="reviews-button-prev rounded me-4"
                  variant="tonal"
                  color="primary"
                  @click="slide('prev')"
                  :disabled="productReviews.length <= computedSlidesPerView"
                >
                  <VIcon icon="tabler-chevron-left" class="" />
                </IconBtn>
                <IconBtn
                  class="reviews-button-next rounded"
                  variant="tonal"
                  color="primary"
                  @click="slide('next')"
                  :disabled="productReviews.length <= computedSlidesPerView"
                >
                  <VIcon icon="tabler-chevron-right" class="" />
                </IconBtn>
              </div>
            </div>
          </VCol>
          <VCol cols="12" md="9">
            <div class="swiper-reviews-carousel">
              <swiper-container
                ref="customerReviewSwiper"
                :slides-per-view="swiperOptions.slidesPerView"
                :space-between="swiperOptions.spaceBetween"
                :autoplay-delay="swiperOptions.autoplayDelay"
                :autoplay-disable-on-interaction="
                  swiperOptions.autoplayDisableOnInteraction
                "
                :events-prefix="swiperOptions.eventsPrefix"
                :inject-styles="swiperOptions.injectStyles"
                :navigation="swiperOptions.navigation"
                :breakpoints="swiperOptions.breakpoints"
                v-show="!productReviewsLoading"
              >
                <swiper-slide
                  v-for="(review, index) in productReviews"
                  :key="review.id || index"
                  class="py-3"
                >
                  <VCard
                    class="d-flex h-100 align-stretch fill-height"
                    variant="outlined"
                  >
                    <VCardText
                      class="pa-6 d-flex flex-column justify-space-between align-start"
                    >
                      <p class="text-body-1 mb-4">"{{ review.comment }}"</p>
                      <div>
                        <VRating
                          :model-value="review.rating"
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
                            <span>{{
                              avatarText(review.customer_name || "U")
                            }}</span>
                          </VAvatar>
                          <div>
                            <h6 class="text-h6">
                              {{
                                review.customer_name || $t("reviews.anonymous")
                              }}
                            </h6>

                            <div class="text-body-2 text-disabled">
                              {{ productName || "" }}
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
                slides-per-view="1"
                space-between="20"
                autoplay-delay="3000"
                autoplay-disable-on-interaction="false"
                events-prefix="swiper-"
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
                v-show="productReviewsLoading"
              >
                <swiper-slide v-for="index in 8" :key="index">
                  <div
                    class="skeleton"
                    style="
                      border-radius: 6px;
                      block-size: 200px;
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
  </div>
  <!-- 
  <div v-else-if="productReviewsLoading" class="app-container customer-reviews pb-12">
    <VRow>
      <VCol cols="12" md="3">
        <VSkeletonLoader type="chip, heading, text, button" />
      </VCol>
      <VCol cols="12" md="9">
        <div class="swiper-reviews-carousel">
          <swiper-container :slides-per-view="1" :space-between="20" :breakpoints="swiperOptions.breakpoints">
            <swiper-slide v-for="i in 3" :key="`skeleton-${i}`">
              <VSkeletonLoader type="card-avatar, article" height="250" />
            </swiper-slide>
          </swiper-container>
        </div>
      </VCol>
    </VRow>
  </div> -->

  <div
    v-if="productReviews.length === 0 && !productReviewsLoading"
    class="app-container py-10"
  >
    <div
      class="d-flex flex-column align-center justify-center empty-state-container"
    >
      <VIcon
        icon="tabler-message-circle-off"
        size="80"
        color="primary"
        class="mb-6 empty-state-icon"
      />
      <h3 class="text-h5 font-weight-bold mb-2">
        {{ $t("reviews.no_reviews") }}
      </h3>
      <p class="text-body-1 text-medium-emphasis text-center mb-6">
        {{ $t("reviews.no_reviews_message") }}<br />
        {{ $t("reviews.be_first_experience") }}
      </p>
      <VBtn
        color="primary"
        prepend-icon="tabler-message-circle"
        @click="openReviewDialog"
        v-if="productReviews.length === 0"
      >
        {{ $t("reviews.write_review") }}
      </VBtn>
    </div>
  </div>

  <div class="d-flex justify-end mt-6" v-if="productReviews.length > 0">
    <VBtn
      color="primary"
      prepend-icon="tabler-message-circle"
      @click="openReviewDialog"
    >
      {{ $t("reviews.write_review") }}
    </VBtn>
  </div>

  <!-- Add Review Dialog -->
  <VDialog v-model="isReviewDialogVisible" width="500">
    <!-- Dialog close btn -->
    <DialogCloseBtn @click="isReviewDialogVisible = false" />

    <!-- Dialog Content -->
    <VCard :title="$t('reviews.write_review')">
      <VCardText>
        <VForm ref="reviewForm" @submit.prevent="">
          <VRow>
            <VCol cols="12">
              <VTextField
                v-model="newReview.customer_name"
                :label="$t('reviews.your_name')"
                :placeholder="$t('reviews.enter_name')"
                :rules="[
                  (value) => !!value || $t('reviews.name_required'),
                  (value) =>
                    (value && value.length >= 2) ||
                    $t('reviews.name_min_length'),
                ]"
              />
            </VCol>

            <VCol cols="12">
              <VTextarea
                v-model="newReview.comment"
                :label="$t('reviews.your_review')"
                :placeholder="$t('reviews.write_review_placeholder')"
                rows="4"
                :rules="[
                  (value) => !!value || $t('reviews.review_required'),
                  (value) =>
                    (value && value.length >= 2) ||
                    $t('reviews.review_min_length'),
                  (value) =>
                    (value && value.length <= 255) ||
                    $t('reviews.review_max_length'),
                ]"
              />
            </VCol>

            <VCol cols="12" class="d-flex justify-center">
              <VRating
                v-model="newReview.rating"
                color="warning"
                size="large"
                hover
              />
            </VCol>
          </VRow>
        </VForm>
      </VCardText>

      <!-- <VCardActions class="pa-6 pt-0"> -->
      <div class="pa-6 pt-0 d-flex justify-end">
        <VBtn
          @click="addReview"
          variant="tonal"
          color="primary"
          :loading="addReviewLoading"
          :disabled="addReviewLoading"
        >
          {{ $t("reviews.submit") }}
        </VBtn>
      </div>
      <!-- </VCardActions> -->
    </VCard>
  </VDialog>
</template>

<script>
import axios from "axios";
import { register } from "swiper/element/bundle";
register();

export default {
  props: {
    productId: {
      type: [String, Number],
      required: true,
    },
    productName: {
      type: [String],
      required: true,
    },
  },
  data() {
    return {
      productReviews: [],
      productReviewsLoading: false,

      snackbarText: "",
      snackbarColor: "",
      isSnackbarVisible: false,

      isReviewDialogVisible: false,
      newReview: {
        customer_name: "",
        comment: "",
        rating: 5,
      },
      addReviewLoading: false,

      api_url: import.meta.env.VITE_API_URL,

      swiperOptions: {
        slidesPerView: 1,
        spaceBetween: 20,
        autoplayDelay: 3000,
        autoplayDisableOnInteraction: false,
        eventsPrefix: "swiper-",
        injectStyles: [
          `
            .swiper{
              padding-block: 12px;
              padding-inline: 12px;
              margin-inline: -12px;
            }
            .swiper-button-next, .swiper-button-prev{
              visibility: hidden; /* Controlled by custom buttons */
            }
          `,
        ],
        navigation: {
          nextEl: ".swiper-button-next",
          prevEl: ".swiper-button-prev",
        },
        breakpoints: {
          600: { slidesPerView: 2, spaceBetween: 20 },
          960: { slidesPerView: 2, spaceBetween: 20 },
          1280: { slidesPerView: 3, spaceBetween: 20 },
        },
      },
      currentWindowWidth: window.innerWidth,
    };
  },

  computed: {
    computedSlidesPerView() {
      const breakpoints = this.swiperOptions.breakpoints;
      let activeSlidesPerView = this.swiperOptions.slidesPerView;
      const sortedBreakpoints = Object.keys(breakpoints).sort((a, b) => a - b);
      for (const bp of sortedBreakpoints) {
        if (this.currentWindowWidth >= parseInt(bp)) {
          activeSlidesPerView = breakpoints[bp].slidesPerView;
        }
      }
      return activeSlidesPerView;
    },
  },

  mounted() {
    if (this.productId) {
      this.getProductReviews();
    }
    window.addEventListener("resize", this.handleResize);
    this.handleResize(); // Initial check
  },

  beforeUnmount() {
    window.removeEventListener("resize", this.handleResize);
  },

  watch: {
    productId(newVal) {
      if (newVal) {
        this.getProductReviews();
      }
    },
  },

  methods: {
    handleResize() {
      this.currentWindowWidth = window.innerWidth;
    },

    avatarText(name) {
      if (!name) return "U";
      const parts = name.split(" ").filter(Boolean);
      if (parts.length === 0) return "U";
      if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
      return (
        parts[0].charAt(0) + parts[parts.length - 1].charAt(0)
      ).toUpperCase();
    },

    async getProductReviews() {
      if (!this.productId) return;
      this.productReviewsLoading = true;
      try {
        const response = await axios.get(
          `${this.api_url}/reviews?product_id[eq]=${this.productId}&per_page=30`,
          {
            headers: { Accept: "application/json" },
          }
        );
        this.productReviews = response.data.data || [];
      } catch (error) {
        console.error("Error fetching product reviews:", error);
        this.showSnackbar(
          this.$t("notifications.error.failed_to_load_reviews"),
          "error"
        );
        this.productReviews = [];
      } finally {
        this.productReviewsLoading = false;
      }
    },

    openReviewDialog() {
      this.isReviewDialogVisible = true;
    },

    async addReview() {
      const validate = await this.$refs.reviewForm.validate();

      if (validate.valid && this.newReview.rating) {
        try {
          this.addReviewLoading = true;
          this.newReview.product_id = this.productId;

          const response = await axios.post(
            `${this.api_url}/reviews`,
            this.newReview,
            {
              headers: {
                Accept: "application/json",
              },
            }
          );

          // For now, just simulate a successful submission
          this.showSnackbar(
            this.$t("notifications.success.review_added"),
            "success"
          );

          this.isReviewDialogVisible = false;

          // Reset form and close dialog
          this.newReview = {
            product_id: null,
            customer_name: null,
            rating: 5,
            comment: null,
          };
        } catch (error) {
          console.error("Error adding review:", error);
          if (
            error.response &&
            error.response.data &&
            error.response.data.errors
          ) {
            const errors = error.response.data.errors;
            let errorMessage =
              this.$t("notifications.error.failed_to_add_review") + ": ";

            if (errors.customer_name) {
              errorMessage += errors.customer_name[0];
            } else if (errors.rating) {
              errorMessage += errors.rating[0];
            } else {
              errorMessage += this.$t("reviews.check_input_try_again");
            }

            this.showSnackbar(errorMessage, "error");
          } else {
            this.showSnackbar(
              this.$t("notifications.error.failed_to_add_review_generic"),
              "error"
            );
          }
        } finally {
          this.addReviewLoading = false;
        }
      } else {
        if (
          this.newReview.customer_name &&
          this.newReview.comment &&
          !this.newReview.rating
        ) {
          this.showSnackbar(this.$t("reviews.select_rating"), "error");
        }
      }
    },

    showSnackbar(text, color) {
      this.isSnackbarVisible = false;
      this.snackbarText = text;
      this.snackbarColor = color;
      this.isSnackbarVisible = true;
    },
    slide(dir) {
      const swiperInstance = this.$refs.customerReviewSwiper?.swiper;
      if (swiperInstance) {
        if (dir === "prev") swiperInstance.slidePrev();
        else swiperInstance.slideNext();
      }
    },
  },
};
</script>

<style lang="scss">
@use "swiper/css/bundle";

// General swiper styles if needed, e.g., for bullets if ever used
// swiper-container::part(bullet-active) { ... }
// swiper-container::part(bullet) { ... }

.swiper-reviews-carousel {
  swiper-container {
    .swiper {
      padding-block-end: 1rem; // Reduced padding from 3rem
    }

    // Hiding default nav buttons as custom ones are used
    .swiper-button-next,
    .swiper-button-prev {
      display: none !important;
    }
  }

  swiper-slide {
    display: flex; /* Added for fill-height on VCard */
    block-size: auto; // Ensures slides adapt to content height
    opacity: 1;

    & > .v-card {
      inline-size: 100%; /* Ensure VCard takes full width of slide */
    }
  }
}
</style>

<style lang="scss" scoped>
.customer-reviews {
  padding-block: 32px 0 !important;
}

@media (max-width: 600px) {
  .customer-reviews {
    padding-block: 2rem; // Adjusted padding for smaller screens
  }
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

.reviews {
  display: flex;
  flex-flow: column nowrap;
  gap: 8px;
  max-block-size: 600px;
  overflow-y: auto;
  padding-block-end: 16px;
  padding-inline-end: 16px;
}

.skeleton-review {
  border-radius: 8px;
  block-size: 140px;
  inline-size: 100%;
  margin-block-end: 16px;
}

.empty-state-container {
  border-radius: 8px;
  background-color: rgba(var(--v-theme-surface), 0.9);
  padding-block: 3rem;
  padding-inline: 1rem;
}

.empty-state-icon {
  opacity: 0.8;
}

swiper-container::part(container) {
  padding-inline: 6px !important;
}
</style>
