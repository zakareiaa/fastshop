<template>
  <div
    class="py-8"
    :class="{
      'bg-white': !$vuetify.theme.current.dark,
      'bg-dark': $vuetify.theme.current.dark,
    }"
  >
    <div class="app-container" id="features">
      <div class="feature-cards">
        <div
          class="headers d-flex justify-center flex-column align-center mb-8"
        >
          <div
            class="d-flex text-h4 mb-1 align-center flex-wrap justify-center"
          >
            <div class="position-relative me-2">
              <div class="section-title text-center">
                {{ $t("footer.why_buy_from_us") }}
              </div>
            </div>
          </div>
          <p class="text-body-1 mb-0 text-center mt-2 px-4">
            {{ $t("footer.company_description") }}
          </p>
        </div>
        <VRow>
          <VCol
            v-for="(data, index) in featuresData"
            :key="index"
            cols="12"
            sm="6"
            md="3"
          >
            <div
              class="d-flex flex-column align-center justify-center gap-4 mx-auto px-4"
            >
              <VIcon :icon="data.icon" size="64" color="primary" />
              <div class="text-center">
                <h5 class="text-h5 mb-2">
                  {{ $t("footer." + data.title_key) }}
                </h5>
                <p class="text-body-1 mb-6" style="max-inline-size: 310px">
                  {{ $t("footer." + data.desc_key) }}
                </p>
              </div>
            </div>
          </VCol>
        </VRow>
      </div>
    </div>
  </div>

  <div class="footer text-center pt-6">
    <div class="d-flex justify-center mb-4">
      <div
        class="d-flex gap-x-4 align-center justify-center text-primary pb-3 border-b flex-wrap"
      >
        <h6 class="text-h6 mb-sm-0">{{ $t("footer.about_us") }}</h6>

        <a href="#" class="text-subtitle-2" target="noopener noreferrer">{{
          $t("footer.privacy_policy")
        }}</a>
        <a href="#" class="text-subtitle-2" target="noopener noreferrer">{{
          $t("footer.terms_of_use")
        }}</a>
        <a href="#" target="noopener noreferrer" class="text-subtitle-2">{{
          $t("footer.terms_of_sale")
        }}</a>
      </div>
    </div>
    <!-- 👉 Footer Line -->
    <div class="footer-line w-100 pt-2 pb-4">
      <div class="app-container">
        <!-- Desktop Layout -->
        <div class="d-none d-md-flex justify-space-between align-center">
          <div>{{ $t("footer.all_rights_reserved") }}</div>
          <div class="d-flex align-center gap-x-1">
            <span>{{ $t("footer.developed_by") }}</span>
            <a href="https://zakariadjeddai.com" target="noopener noreferrer"
              >Zakaria Djeddai</a
            >
          </div>
          <div class="d-flex align-center gap-x-4">
            <h6 class="text-h6">{{ $t("footer.follow_us") }}</h6>
            <div class="d-flex gap-x-0">
              <VBtn
                icon="tabler-brand-facebook"
                color="#1877F2"
                size="small"
                variant="text"
                @click="
                  openLink(
                    'https://www.facebook.com/profile.php?id=100083778390910'
                  )
                "
              />
              <VBtn
                icon="tabler-brand-instagram"
                color="#E4405F"
                size="small"
                variant="text"
                @click="openLink('https://www.instagram.com/zerostech/')"
              />
              <VBtn
                icon="tabler-brand-tiktok"
                :color="!$vuetify.theme.current.dark ? '#000000' : '#FFFFFF'"
                size="small"
                variant="text"
                @click="openLink('https://www.tiktok.com/@zeros.dz')"
              />
              <VBtn
                icon="tabler-brand-youtube"
                color="#FF0000"
                size="small"
                variant="text"
                @click="openLink('https://www.youtube.com/@zeros_dz')"
              />
            </div>
          </div>
        </div>

        <!-- Mobile Layout -->
        <div class="d-md-none d-flex flex-column gap-4 text-center">
          <!-- Social Media -->
          <div class="d-flex align-center justify-center gap-x-2">
            <h6 class="text-h6 me-2">{{ $t("footer.follow_us") }}</h6>
            <div class="d-flex gap-x-0">
              <VBtn
                icon="tabler-brand-facebook"
                color="#1877F2"
                size="small"
                variant="text"
                @click="
                  openLink(
                    'https://www.facebook.com/profile.php?id=100083778390910'
                  )
                "
              />
              <VBtn
                icon="tabler-brand-instagram"
                color="#E4405F"
                size="small"
                variant="text"
                @click="openLink('https://www.instagram.com/zerostech/')"
              />
              <VBtn
                icon="tabler-brand-tiktok"
                :color="!$vuetify.theme.current.dark ? '#000000' : '#FFFFFF'"
                size="small"
                variant="text"
                @click="openLink('https://www.tiktok.com/@zeros.dz')"
              />
              <VBtn
                icon="tabler-brand-youtube"
                color="#FF0000"
                size="small"
                variant="text"
                @click="openLink('https://www.youtube.com/@zeros_dz')"
              />
            </div>
          </div>

          <!-- Developer Info -->
          <div class="d-flex align-center justify-center gap-x-1 text-sm">
            <span>{{ $t("footer.developed_by") }}</span>
            <a href="https://zakariadjeddai.com" target="noopener noreferrer"
              >Zakaria Djeddai</a
            >
          </div>

          <!-- Copyright -->
          <div class="text-sm">{{ $t("footer.all_rights_reserved") }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const featuresData = [
  {
    title_key: "competitive_prices",
    desc_key: "competitive_prices_desc",
    icon: "tabler-tag",
  },
  {
    title_key: "fast_delivery",
    desc_key: "fast_delivery_desc",
    icon: "tabler-truck-delivery",
  },
  {
    title_key: "customer_service",
    desc_key: "customer_service_desc",
    icon: "tabler-phone",
  },
  {
    title_key: "real_warranty",
    desc_key: "real_warranty_desc",
    icon: "tabler-shield",
  },
];

const openLink = (url) => {
  window.open(url, "_blank");
};
</script>

<style lang="scss" scoped>
.section-title::after {
  position: absolute;
  background: url("@assets/images/section-title-icon.png") no-repeat left bottom;
  background-size: contain;
  block-size: 100%;
  content: "";
  inline-size: 120%;
  inset-block-end: 0;
  inset-inline-start: -12%;
}

.section-title {
  font-size: 24px;
  font-weight: 800;
  line-height: 36px;
}

.feature {
  .v-avatar {
    &.v-avatar--variant-outlined {
      border: 2px solid rgba(var(--v-theme-primary), 0.32);

      &:hover {
        background: rgba(var(--v-theme-primary), 0.16);
        cursor: pointer;
      }
    }
  }
}

// Responsive styles
@media (max-width: 768px) {
  .text-h4 {
    font-size: 1.5rem !important;
  }

  .feature-cards .v-icon {
    font-size: 48px !important;
  }
}

@media (max-width: 480px) {
  .text-h4 {
    font-size: 1.25rem !important;
  }

  .feature-cards .v-icon {
    font-size: 40px !important;
  }

  .gap-x-4 {
    gap: 0.5rem !important;
  }

  .text-subtitle-2 {
    font-size: 0.75rem !important;
  }
}
</style>
