<template>
  <Header />

  <div>
    <!-- Page Header -->
    <div class="app-container page-header">
      <VRow justify="center">
        <VCol cols="12" md="8" lg="6">
          <div class="text-center">
            <h1 class="text-h3 font-weight-bold mb-4">
              {{ $t("refund_policy.title") }}
            </h1>
            <p class="text-h6 text-medium-emphasis">
              {{ $t("refund_policy.subtitle") }}
            </p>
          </div>
        </VCol>
      </VRow>
    </div>

    <VDivider class="my-8" />

    <!-- Policy Content -->
    <div class="app-container policy-content">
      <VRow justify="center">
        <VCol cols="12">
          <VRow>
            <!-- Policy Text Section -->
            <VCol cols="12" sm="6">
              <VCard
                class="pa-6 h-100 b-radius-0"
                elevation="2"
                :variant="
                  !$vuetify.theme.current.dark ? 'outlined' : 'elevated'
                "
              >
                <div class="policy-section">
                  <VIcon
                    icon="tabler-package"
                    size="48"
                    color="primary"
                    class="mb-4"
                  />
                  <h2 class="text-h5 font-weight-bold mb-4">
                    {{ $t("refund_policy.title") }}
                  </h2>
                  <p class="text-body-1 leading-7">
                    {{ $t("refund_policy.policy_text") }}
                  </p>
                </div>
              </VCard>
            </VCol>

            <!-- Contact Information -->
            <VCol cols="12" sm="6">
              <VCard
                class="pa-6 h-100 b-radius-0"
                elevation="2"
                :variant="
                  !$vuetify.theme.current.dark ? 'outlined' : 'elevated'
                "
              >
                <div class="policy-section">
                  <VIcon
                    icon="tabler-message-circle"
                    size="48"
                    color="secondary"
                    class="mb-4"
                  />
                  <h2 class="text-h5 font-weight-bold mb-4">
                    {{ $t("header.contact_us") }}
                  </h2>
                  <p class="text-body-1 leading-7 mb-6">
                    {{ $t("refund_policy.contact_info") }}
                  </p>

                  <!-- Instagram Contact Button -->
                  <VBtn
                    color="primary"
                    :variant="
                      !$vuetify.theme.current.dark ? 'outlined' : 'elevated'
                    "
                    size="large"
                    href="https://instagram.com/modiasn"
                    target="_blank"
                    rel="noopener noreferrer"
                    class="mb-4"
                  >
                    <VIcon icon="tabler-brand-instagram" class="me-2" />
                    modiasn
                  </VBtn>
                </div>
              </VCard>
            </VCol>

            <!-- Return Process -->
            <VCol cols="12" sm="6" offset-sm="3">
              <VCard
                class="pa-6 h-100 b-radius-0"
                elevation="2"
                :variant="
                  !$vuetify.theme.current.dark ? 'outlined' : 'elevated'
                "
              >
                <div class="policy-section">
                  <VIcon
                    icon="tabler-refresh"
                    size="48"
                    color="success"
                    class="mb-4"
                  />
                  <h2 class="text-h5 font-weight-bold mb-4">
                    {{ $t("refund_policy.title") }}
                  </h2>
                  <p class="text-body-1 leading-7">
                    {{ $t("refund_policy.process_info") }}
                  </p>
                </div>
              </VCard>
            </VCol>
          </VRow>
        </VCol>
      </VRow>
    </div>

    <!-- Call to Action -->
  </div>

  <Footer />
</template>

<script>
import Footer from "@/components/costumComponents/Footer.vue";
import Header from "@/components/costumComponents/Header.vue";

export default {
  name: "RefundPolicy",
  head() {
    return {
      title: this.$t("refund_policy.title"),
      meta: [
        {
          hid: "description",
          name: "description",
          content: this.$t("refund_policy.subtitle"),
        },
      ],
    };
  },
  components: {
    Header,
    Footer,
  },
};
</script>

<script setup>
definePage({
  meta: {
    layout: "blank",
    public: true,
  },
});
</script>

<style lang="scss" scoped>
.page-header {
  padding-block: 4rem 2rem;
}

.policy-content {
  padding-block: 2rem;
}

.policy-section {
  text-align: center;
}

.cta-section {
  padding-block: 4rem;
}

.leading-7 {
  line-height: 1.75;
}

// Responsive adjustments
@media (max-width: 768px) {
  .page-header {
    padding-block: 2rem 1rem;
  }

  .policy-content .v-card {
    padding: 1.5rem !important;
  }

  .cta-section {
    padding-block: 2rem;
  }

  .cta-section .v-card {
    padding: 1.5rem !important;
  }
}
</style>
