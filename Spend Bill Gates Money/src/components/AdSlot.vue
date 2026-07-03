<template>
  <iframe
    v-if="variant === 'native'"
    src="/ads/native.html"
    title="Advertisement"
    width="100%"
    height="320"
    frameborder="0"
    scrolling="no"
  />
  <iframe
    v-else
    :key="bannerSrc"
    :src="bannerSrc"
    title="Advertisement"
    :width="isMobile ? 300 : 728"
    :height="isMobile ? 250 : 90"
    frameborder="0"
    scrolling="no"
  />
</template>

<script setup>
import { computed } from 'vue'
import { useDeviceDetection } from '@/utils/useDeviceDetection.js'

defineProps({
  variant: {
    type: String,
    required: true,
    validator: (v) => ['native', 'banner'].includes(v),
  },
})

const { isMobile } = useDeviceDetection()

const bannerSrc = computed(() => (isMobile.value ? '/ads/banner-300.html' : '/ads/banner-728.html'))
</script>
