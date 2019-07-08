<template lang="html">

  <div :class="mapClasses">
    <div class="overlay">
      <i class="fa fa-spinner fa-spin fa-fw fa-2x"></i>
    </div>
    <l-map class="map-height" :zoom="zoom" :center="center">
      <l-tile-layer :url="url" :attribution="attribution"></l-tile-layer>

      <marker-popup v-for="(marker, index) in markers" :marker="marker" :key="index"></marker-popup>
    </l-map>
  </div>

</template>

<script>
  import { LMap, LTileLayer, LMarker } from 'vue2-leaflet';
  import MarkerPopup from './ll-marker-popup';

  export default {
    name: 'll-map',

    components: {
      LMap,
      LTileLayer,
      // LMarker,
      MarkerPopup
    },

    props: ['markers', 'classes'],

    computed: {
      mapClasses() {
        return this.classes + ' map-container'
      }
    },

    data () {
      return {
        zoom: 9,
        center: L.latLng(-12.782241, -38.636312),
        url:'https://{s}.tile.osm.org/{z}/{x}/{y}.png',
        attribution:'&copy; <a href="https://osm.org/copyright">OpenStreetMap</a> contributors'
      }
    }
  }
</script>

<style scoped lang="scss">

.map-height {
  height: calc(100vh - 113px) !important;
}

.overlay {
  .fa {
    display: none;
  }
}

.loading-map,
.map-container {
  position: relative;
}

.leaflet-dragging {
  .overlay {
    height: 100%;
    width: 100%;
    z-index: 2000;
    position: absolute;
    background-color: rgba(47, 47, 47, 0.6);
    text-align: center;
    line-height: 380px;

    .fa {
      display: inline-block;
      color: $white;
    }
  }
}

.loading-map {
  .overlay {
    height: 100%;
    width: 100%;
    z-index: 10000;
    position: absolute;
    background-color: rgba(47, 47, 47, 0.6);
    text-align: center;
    line-height: 380px;

    .fa {
      display: inline-block;
      color: $white;
    }
  }
}

</style>

<style>
  @import "../../node_modules/leaflet/dist/leaflet.css";
</style>
