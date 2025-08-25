<template>
  <!-- <div
    class="py-8"
    :class="{
      'bg-white': !$vuetify.theme.current.dark,
      'bg-dark': $vuetify.theme.current.dark,
    }"
    :style="{
      background: !$vuetify.theme.current.dark
        ? 'rgb(var(--v-theme-on-background)) !important'
        : '',
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
              <div
                class="section-title text-center"
                :style="{
                  color: !$vuetify.theme.current.dark
                    ? 'rgb(var(--v-theme-background)) !important'
                    : '',
                }"
              >
                {{ $t("footer.why_buy_from_us") }}
              </div>
            </div>
          </div>
          <p
            class="text-body-1 mb-0 text-center mt-2 px-4"
            :style="{
              color: !$vuetify.theme.current.dark
                ? 'rgba(var(--v-theme-background), var(--v-medium-emphasis-opacity)) !important'
                : '',
            }"
          >
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
              <VIcon
                :icon="data.icon"
                size="64"
                :color="
                  !$vuetify.theme.current.dark
                    ? 'rgb(var(--v-theme-background) !important'
                    : 'primary'
                "
              />
              <div class="text-center">
                <h5
                  class="text-h5 mb-2"
                  :style="{
                    color: !$vuetify.theme.current.dark
                      ? 'rgb(var(--v-theme-background) !important'
                      : '',
                  }"
                >
                  {{ $t("footer." + data.title_key) }}
                </h5>
                <p
                  class="text-body-1 mb-6"
                  style="max-inline-size: 310px"
                  :style="{
                    color: !$vuetify.theme.current.dark
                      ? 'rgba(var(--v-theme-background), var(--v-medium-emphasis-opacity)) !important'
                      : '',
                  }"
                >
                  {{ $t("footer." + data.desc_key) }}
                </p>
              </div>
            </div>
          </VCol>
        </VRow>
      </div>
    </div>
  </div> -->

  <!-- Questions & Answers Section -->
  <div
    class="pt-12 pb-0 mt-10"
    :class="{
      'bg-white': !$vuetify.theme.current.dark,
      'bg-dark': $vuetify.theme.current.dark,
    }"
    :style="{
      background: !$vuetify.theme.current.dark
        ? 'rgb(var(--v-theme-on-background)) !important'
        : '',
    }"
  >
    <div class="app-container" id="questions-answers">
      <div class="qa-section">
        <div
          class="headers d-flex justify-center flex-column align-center mb-8"
        >
          <div
            class="d-flex text-h4 mb-1 align-center flex-wrap justify-center"
          >
            <div class="position-relative me-2">
              <div
                class="section-title text-center"
                :style="{
                  color: !$vuetify.theme.current.dark
                    ? 'rgb(var(--v-theme-background)) !important'
                    : '',
                }"
              >
                {{ $t("footer.questions_answers") }}
              </div>
            </div>
          </div>
        </div>

        <VRow>
          <VCol cols="12" md="6">
            <VExpansionPanels multiple>
              <VExpansionPanel
                v-for="(qa, index) in questionsAnswers"
                :key="index"
                style="border-radius: 0 !important; background-color: #fff"
              >
                <VExpansionPanelTitle
                  :style="{
                    color: !$vuetify.theme.current.dark
                      ? 'rgb(var(--v-theme-on-background)) !important'
                      : 'rgb(var(--v-theme-background)) !important',
                  }"
                >
                  <VIcon
                    :icon="qa.icon"
                    class="me-3"
                    :color="
                      !$vuetify.theme.current.dark
                        ? 'rgb(var(--v-theme-on-background)) '
                        : 'rgb(var(--v-theme-background))'
                    "
                  />
                  {{ $t("footer." + qa.question_key) }}
                </VExpansionPanelTitle>
                <VExpansionPanelText
                  :style="{
                    color: !$vuetify.theme.current.dark
                      ? 'rgba(var(--v-theme-on-background), var(--v-medium-emphasis-opacity)) !important'
                      : 'rgba(var(--v-theme-background), var(--v-medium-emphasis-opacity)) !important',
                  }"
                >
                  {{ $t("footer." + qa.answer_key) }}
                </VExpansionPanelText>
              </VExpansionPanel>
            </VExpansionPanels>
          </VCol>
          <VCol cols="12" md="6" class="d-flex align-center justify-center">
            <div class="qa-image-container">
              <img
                src="/src/assets/images/thumbnails2.jpg"
                alt="Questions & Answers"
                class="qa-image"
                style="block-size: auto; max-inline-size: 100%"
              />
            </div>
          </VCol>
        </VRow>
      </div>
    </div>
  </div>

  <div
    class="footer text-center pt-6"
    :style="{
      background: !$vuetify.theme.current.dark
        ? 'rgb(var(--v-theme-on-background)) !important'
        : '',
    }"
  >
    <div class="app-container">
      <VRow class="py-12">
        <!-- 👉 FASTSHOP -->
        <VCol cols="12" md="4">
          <div class="text-center text-sm-start">
            <h3
              class="text-h4 font-weight-bold mb-4"
              :style="{
                color: !$vuetify.theme.current.dark
                  ? 'rgb(var(--v-theme-background)) !important'
                  : '',
              }"
            >
              FASTSHOP
            </h3>
            <p
              class="text-body-1"
              :style="{
                color: !$vuetify.theme.current.dark
                  ? 'rgba(var(--v-theme-background), var(--v-medium-emphasis-opacity)) !important'
                  : '',
              }"
            >
              {{ $t("footer.tagline") }}
            </p>
          </div>
        </VCol>

        <!-- 👉 Contact us -->
        <VCol cols="12" md="3">
          <div class="text-center text-sm-start">
            <h3
              class="text-h4 font-weight-bold mb-4"
              :style="{
                color: !$vuetify.theme.current.dark
                  ? 'rgb(var(--v-theme-background)) !important'
                  : '',
              }"
            >
              {{ $t("footer.contact_us") }}
            </h3>
            <p
              class="text-body-1"
              :style="{
                color: !$vuetify.theme.current.dark
                  ? 'rgba(var(--v-theme-background), var(--v-medium-emphasis-opacity)) !important'
                  : '',
              }"
            >
              0562815787
            </p>
            <!-- <p
              class="text-body-1"
              :style="{
                color: !$vuetify.theme.current.dark
                  ? 'rgba(var(--v-theme-background), var(--v-medium-emphasis-opacity)) !important'
                  : '',
              }"
            >
              Fastshop1097@gmail.com
            </p> -->
            <div class="d-flex gap-x-2 justify-center justify-sm-start">
              <VBtn
                icon="tabler-phone"
                variant="text"
                color="#4CAF50"
                @click="callNumber('tel:+213562815787')"
              />
              <VBtn
                icon="tabler-brand-instagram"
                variant="text"
                color="#E4405F"
                @click="openLink('https://www.instagram.com/fast_.shop1/')"
              />
              <VBtn
                icon="tabler-brand-tiktok"
                variant="text"
                color="#FFFFFF"
                @click="openLink('https://www.tiktok.com/@fast_.shop01')"
              />
              <VBtn
                icon="tabler-brand-telegram"
                variant="text"
                color="#0088CC"
                @click="openLink('https://t.me/fastshop00')"
              />
            </div>
            <div class="d-flex gap-x-2 justify-center justify-sm-start">
              <VBtn
                icon="tabler-brand-facebook"
                variant="text"
                color="#1877F2"
                @click="
                  openLink(
                    'https://www.facebook.com/profile.php?id=61575564910912&mibextid=wwXIfr&rdid=vnjuX0rA9Oc3ucAw&share_url=https%3A%2F%2Fwww.facebook.com%2Fshare%2F1JGB6fo5cx%2F%3Fmibextid%3DwwXIfr#'
                  )
                "
              />
              <VBtn
                icon="tabler-brand-snapchat"
                variant="text"
                color="#FFFC00"
                @click="openLink('https://www.snapchat.com/add/fast.shop1')"
              />
              <VBtn
                icon="tabler-brand-youtube"
                variant="text"
                color="#FF0000"
                @click="openLink('https://www.youtube.com/@FASTSHOP-3')"
              />
              <VBtn
                icon="tabler-brand-whatsapp"
                variant="text"
                color="#25D366"
                @click="openLink('https://wa.me/213562815787')"
              />
            </div>
          </div>
        </VCol>

        <!-- 👉 Menu -->
        <VCol cols="12" md="2">
          <div class="text-center text-sm-start">
            <h3
              class="text-h4 font-weight-bold mb-4"
              :style="{
                color: !$vuetify.theme.current.dark
                  ? 'rgb(var(--v-theme-background)) !important'
                  : '',
              }"
            >
              {{ $t("footer.menu") }}
            </h3>
            <p @click="$router.push('/')">
              <a
                class="text-body-1 cursor-pointer"
                :style="{
                  color: !$vuetify.theme.current.dark
                    ? 'rgba(var(--v-theme-background), var(--v-medium-emphasis-opacity)) !important'
                    : '',
                }"
                >{{ $t("footer.home") }}</a
              >
            </p>
            <p @click="$router.push('/shop')">
              <a
                class="text-body-1 cursor-pointer"
                :style="{
                  color: !$vuetify.theme.current.dark
                    ? 'rgba(var(--v-theme-background), var(--v-medium-emphasis-opacity)) !important'
                    : '',
                }"
                >{{ $t("footer.shop") }}</a
              >
            </p>
            <p @click="$router.push('about')">
              <a
                class="text-body-1 cursor-pointer"
                :style="{
                  color: !$vuetify.theme.current.dark
                    ? 'rgba(var(--v-theme-background), var(--v-medium-emphasis-opacity)) !important'
                    : '',
                }"
                >{{ $t("footer.about") }}</a
              >
            </p>
          </div>
        </VCol>

        <!-- 👉 Developed by -->
        <VCol cols="12" md="3">
          <div class="text-center text-sm-start">
            <h3
              class="text-h4 font-weight-bold mb-4"
              :style="{
                color: !$vuetify.theme.current.dark
                  ? 'rgb(var(--v-theme-background)) !important'
                  : '',
              }"
            >
              {{ $t("footer.developed_by") }}
            </h3>
            <p
              class="text-body-1"
              :style="{
                color: !$vuetify.theme.current.dark
                  ? 'rgba(var(--v-theme-background), var(--v-medium-emphasis-opacity)) !important'
                  : '',
              }"
            >
              <a
                href="https://zakariadjeddai.com"
                target="_blank"
                class="text-decoration-none"
                :style="{
                  color: !$vuetify.theme.current.dark
                    ? 'rgba(var(--v-theme-background), var(--v-medium-emphasis-opacity)) !important'
                    : '',
                }"
              >
                Zakaria Djeddai</a
              >
            </p>
            <div class="d-flex gap-x-2 justify-center justify-sm-start">
              <VBtn
                icon="tabler-briefcase"
                variant="text"
                :color="!$vuetify.theme.current.dark ? '#ffffff' : '#1976D2'"
                @click="openLink('https://zakariadjeddai.com/portfolio')"
                :title="$t('footer.see_my_work')"
              />
              <VBtn
                icon="tabler-phone"
                variant="text"
                :color="!$vuetify.theme.current.dark ? '#ffffff' : '#4CAF50'"
                @click="callNumber('tel:0669966723')"
              />
              <VBtn
                icon="tabler-brand-facebook"
                variant="text"
                :color="!$vuetify.theme.current.dark ? '#ffffff' : '#1877F2'"
                @click="
                  openLink('https://www.facebook.com/djeddai.zakaria.98/')
                "
              />
              <VBtn
                icon="tabler-brand-instagram"
                variant="text"
                :color="!$vuetify.theme.current.dark ? '#ffffff' : '#E4405F'"
                @click="openLink('https://www.instagram.com/zaakareia/')"
              />
            </div>
          </div>
        </VCol>
      </VRow>
    </div>

    <!-- 👉 Footer Line -->
    <div class="app-container footer-line w-100">
      <div class="d-flex justify-space-between align-center py-4">
        <span
          class="text-body-2"
          :style="{
            color: !$vuetify.theme.current.dark
              ? 'rgba(var(--v-theme-background), var(--v-medium-emphasis-opacity)) !important'
              : '',
          }"
        >
          &copy; {{ new Date().getFullYear() }}, FASTSHOP
        </span>
        <div
          @click="$router.push('/refund-policy')"
          class="text-body-2 cursor-pointer"
          :style="{
            color: !$vuetify.theme.current.dark
              ? 'rgba(var(--v-theme-background), var(--v-medium-emphasis-opacity)) !important'
              : '',
          }"
        >
          {{ $t("footer.returns_policy") }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const featuresData = [
  {
    title_key: "unique_styles",
    desc_key: "unique_styles_desc",
    icon: "tabler-hanger",
  },
  {
    title_key: "fast_delivery",
    desc_key: "fast_delivery_desc",
    icon: "tabler-truck-delivery",
  },
  {
    title_key: "easy_returns",
    desc_key: "easy_returns_desc",
    icon: "tabler-refresh",
  },
  {
    title_key: "pay_on_delivery",
    desc_key: "pay_on_delivery_desc",
    icon: "tabler-cash",
  },
];

const questionsAnswers = [
  {
    question_key: "delivery_time_question",
    answer_key: "delivery_time_answer",
    icon: "tabler-truck",
  },
  {
    question_key: "payment_method_question",
    answer_key: "payment_method_answer",
    icon: "tabler-credit-card",
  },
  {
    question_key: "order_tracking_question",
    answer_key: "order_tracking_answer",
    icon: "tabler-map-pin",
  },
  {
    question_key: "shipping_cost_question",
    answer_key: "shipping_cost_answer",
    icon: "tabler-calculator",
  },
];

const callNumber = (number) => {
  window.open(number, "_self");
};

const openLink = (url) => {
  window.open(url, "_blank");
};
</script>

<style lang="scss" scoped>
.section-title {
  font-size: 28px;
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

.footer-line {
  border-block-start: 1px solid rgb(255 255 255 / 12%);
}
</style>
