<template>
    <l-marker v-if="marker" :lat-lng="marker.position" :title="marker.title" :draggable="false" :icon="markerIcon(marker)">
      <l-popup>
        <!-- <router-link :to="markerLink(marker)"> -->
          {{ marker.text }}
        <!-- </router-link> -->
      </l-popup>
    </l-marker>
</template>

<script>
  // More options: https://leafletjs.com/examples/custom-icons/
  import { LMarker, LPopup } from 'vue2-leaflet';

  export default {
    name: 'MarkerPopup',
    components: {
      LMarker,
      LPopup
    },

    props: {
      marker: { type: Object }
    },

    computed: {
      providerMarker() {
        return L.icon({
            iconUrl: require("@/assets/images/marker-icon-green.png"),
            iconSize: [24, 40],
            iconAnchor: [12, 40],
            popupAnchor: [0, -30],
          })
      }
    },

    methods: {
      markerIcon(marker) {
        if(marker.type == "provider") {
          return this.providerMarker
        }
      },

      markerLink(marker) {
        return { name: marker.type, params: { id: marker.id } }
      }
    }
  }
</script>
