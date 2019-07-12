    var map;
    var tygronWSMLayersInfo; 
    var tygronWSMLayers;

    require([
      "esri/map", "esri/dijit/BasemapGallery", "esri/arcgis/utils",
      "dojo/parser",

      'esri/layers/WMSLayerInfo', 'esri/geometry/Extent', 'esri/layers/WMSLayer',
      "dojo/dom-construct", "dojo/dom", "dojo/dom-class", "dojo/on", "dojo/query",
      "esri/dijit/BasemapGallery", "esri/dijit/LayerList", "esri/layers/ArcGISImageServiceLayer", 
      "esri/layers/ImageServiceParameters", "esri/layers/ArcGISDynamicMapServiceLayer",
      "esri/layers/ImageParameters", "esri/layers/FeatureLayer",

      "dijit/layout/BorderContainer", "dijit/layout/ContentPane", "dijit/TitlePane",
      "dojo/domReady!"
    ], function(
      Map, BasemapGallery, arcgisUtils,
      parser, WMSLayerInfo, Extent, WMSLayer, 
      domConstruct, dom, domClass, on, query,
      BasemapGallery, LayerList, ArcGISImageServiceLayer, 
      ImageServiceParameters, ArcGISDynamicMapServiceLayer, 
      ImageParameters, FeatureLayer,
      tygronWSMLayersInfo, tygronWSMLayers
    ) {
      parser.parse();

      tygronWSMLayersInfo = [];
      tygronWSMLayers = [];

      function setTygronWsmLayerInfo(response) {
        for (feature of response.features) {
          tygronWSMLayersInfo.push(new WMSLayerInfo({
            name: ''+feature.properties.id,
            title: 'Overlay ' + feature.properties.name
          }));
        }
      }

      function AssembleWsmLayers(url) {
        for (layerInfo of tygronWSMLayersInfo) {
          tygronWSMLayers.push(
              new WMSLayer(url,{
                id: layerInfo.title,
                resourceInfo: {
                  extent: new Extent(),
                layerInfos: [layerInfo]
                },
                visibleLayers: [layerInfo.name],
                visible: false
              })
            );
        }
      }

      function setEsriSources() {
        var params = new ImageServiceParameters();
        params.noData = 0;
        var imageServiceLayer = new ArcGISImageServiceLayer("https://ahn.arcgisonline.nl/arcgis/rest/services/Hoogtebestand/AHN2_r/ImageServer", {
          imageServiceParameters: params,
          opacity: 0.75,
          visible: false,
          id: "AHN-Esri"
        });
        tygronWSMLayers.push(imageServiceLayer);

        var dynamicMapServiceLayer = new ArcGISDynamicMapServiceLayer("https://basisregistraties.arcgisonline.nl/arcgis/rest/services/BRT/BRT_TOP10NL/MapServer/",{
        id: "TOP10NL-esri",
        visible: false
      });
      tygronWSMLayers.push(dynamicMapServiceLayer);

      var featureLayer = new FeatureLayer("https://services.arcgis.com/nSZVuSZjHpEZZbRo/ArcGIS/rest/services/Bestuurlijke_Grenzen_2017_Gemeenten/FeatureServer/0", {
        id: "Gemeente-feature-layer-Esri",
        visible: false
      });
      tygronWSMLayers.push(featureLayer);
      }

      var LayerList = new LayerList({
        map: map,
        layers: tygronWSMLayers
      },"layerList");

      on(dom.byId("api-submit"),"click", function(evt){
        var tygronToken = dom.byId("api-input").value;
        var wmsUrl = "https://test.tygron.com/web/wms?&token=" + tygronToken;

        if(tygronWSMLayers && tygronWSMLayers.length > 0) {
          if(dom.byId("api-input").value == "koe") {
            buildingToCows(tygronToken);
          } else {
            dom.byId("api-submit-error").innerHTML = "I couldn't quickly figure out how to reinitialize the layer list when readding layers to the map .... So please refresh and submit your token."
          }
        } else {
          axios.get("https://test.tygron.com/web/overlays.geojson?token=" + tygronToken)
          .then(function(response){
            setTygronWsmLayerInfo(response.data);
            AssembleWsmLayers(wmsUrl);
            setEsriSources();
            map.addLayers(tygronWSMLayers);
            LayerList.startup();
          });
        }
      });

      map = new Map("map", {
        basemap: "topo",
        center: [4.470559, 51.923023],
        zoom: 16
      });

    });