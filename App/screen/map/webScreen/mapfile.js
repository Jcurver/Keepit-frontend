import { PixelRatio } from 'react-native';
import Config from 'react-native-config';
import { screenHeight, screenWidth } from '../../../config/globalStyle';

export const getMap = (lat = 37.5025, lng = 127.0358) => {
  return `
  <!DOCTYPE html>
  <html>
    <head>
      <meta charset="utf-8" />
      <title>Kakao 지도 시작하기</title>
    </head>

    <body>
 <div id="map" style="display:block; width:100%; height: ${
   screenHeight * 2.7
 }px;"></div>
    <script type="text/javascript" src="https://dapi.kakao.com/v2/maps/sdk.js?appkey=${
      Config.KAKAO_MAP_APP_KEY
    }"></script>
    <script>
      var container = document.getElementById('map');
      var options = {
        center: new kakao.maps.LatLng(${lat}, ${lng}),
        level: 1
      };
  
      var map = new kakao.maps.Map(container, options);
    </script>
    </body>
  </html>`;
};
