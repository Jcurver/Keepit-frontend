import { screenHeight, screenWidth } from '../../../../config/globalStyle';
import Config from 'react-native-config';
import { mapStyle } from './mapStyle';

export const mapHTML = `
  <!DOCTYPE html>
  <html>
  <head>
  <meta charset="utf-8" />
  <title>Kakao 지도 시작하기</title>
   ${mapStyle}
  </head>
  <body>
  
  <div id="map" style="display:block; width:100%; height: ${
    screenHeight * 2.5
  }px;"></div>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/jquery/3.5.1/jquery.min.js"></script>
  
  <script type="text/javascript" src="https://dapi.kakao.com/v2/maps/sdk.js?appkey=${
    Config.KAKAO_MAP_APP_KEY
  }&libraries=services,clusterer"></script>

  <script>
    function once(fn, context) {
      var result;
      return function () {
        if (fn) {
          result = fn.apply(context || this, arguments);
          fn = null;
        }
        return result;
      };
    }
    let customClusterers = []
      
    function sendRN(data){
      window.ReactNativeWebView.postMessage(JSON.stringify(data));
    }
    var defaultLat = 36.5123059993883;
    var defaultLng = 127.7812980036908;
    var container = document.getElementById('map');
    var options = {
      center: new kakao.maps.LatLng(defaultLat, defaultLng),
      level: 12,
      draggable:true,
      scrollWheel:true,
      disableDoubleClick:false,
      disableDoubleClickZoom:false,
    };
    const map = new kakao.maps.Map(container, options);

    map.setMaxLevel(12);

    function panTo (y, x) {
      var moveLatLon = new kakao.maps.LatLng(y, x);
      map.panTo(moveLatLon);
    }

    let customOverlayArr = []
    let customOverlayArrFocus = []
    let overlayArr = []
    let overlayArrFocus = []
    let clusterMarkers = [];
    let defaultClusterMarkers=[];
    let markers = [];
    let customMarkers = [];
    let myDotOverlay;
    let clusterer = new kakao.maps.MarkerClusterer({
      map: map, 
      averageCenter: true, 
      minLevel: 1,
      calculator: [10, 100],
      styles: [{ // calculator 각 사이 값 마다 적용될 스타일을 지정한다
              width : '100px', height : '100px',
              background: '#52A7FF',
              border: '10px solid rgba(82,167,255, .35)',
              backgroundClip:'padding-box', 
              borderRadius: '999px',
              display:'flex',
              justifyContent:'center',
              alignItems:'center',
              fontSize:'43px',
              color: '#FFF',
              textAlign: 'center',
              fontWeight: '600',
              fontFamily:'Noto Sans Korean, sans-serif'
          },
          {
              width : '100px', height : '100px',
              background: '#00D282',
              border: '10px solid rgba(0,210,130, .35)',
              backgroundClip:'padding-box', 
              borderRadius: '999px',
              display:'flex',
              justifyContent:'center',
              alignItems:'center',
              fontSize:'43px',
              color: '#FFF',
              textAlign: 'center',
              fontWeight: '600',
              fontFamily:'Noto Sans Korean, sans-serif'
          },
          {
              width : '100px', height : '100px',
              background: '#665FFF',
              border: '10px solid rgba(102,95,255, .35)',
              backgroundClip:'padding-box', 
              borderRadius: '999px',
              display:'flex',
              justifyContent:'center',
              alignItems:'center',
              fontSize:'43px',
              color: '#FFF',
              textAlign: 'center',
              fontWeight: '600',
              fontFamily:'Noto Sans Korean, sans-serif'
          }
      ]
    });


    function customDivClick (i, customLen, len){
      sendRN({targetIndex:i,type:'customMarkers'})
      for(let m= 0; m < len; m++){
        overlayArrFocus[m].setMap(null)
        overlayArr[m].setMap(null)
        overlayArr[m].setMap(map)
      }
      for(let j= 0; j < customLen; j++){
        customOverlayArr[j].setMap(null)
        customOverlayArrFocus[j].setMap(null)
        if(i !== j){
          customOverlayArr[j].setMap(map)
        } 
      }
      customOverlayArrFocus[i].setMap(map)
    }

    function divClick (i,customLen, len){
      sendRN({targetIndex:i,type:'markers'})
      for(let j= 0; j < len; j++){
        overlayArr[j].setMap(null)
        overlayArrFocus[j].setMap(null)
        if(i !== j){
          overlayArr[j].setMap(map)
        }
      }
      for(let n= 0; n < customLen; n++){
        customOverlayArrFocus[n].setMap(null)
        customOverlayArr[n].setMap(null)
        customOverlayArr[n].setMap(map)
      }
      overlayArrFocus[i].setMap(map)
    }


    kakao.maps.load(function(){
    window.addEventListener("message", (e) => {
      try{

          let content;
          let contentFocus;
      clusterer.setMinClusterSize(1);

      
      for(let a = 0; a< overlayArrFocus?.length;a++){
        overlayArr[a].setMap(null);
        overlayArrFocus[a].setMap(null);
      }
      for(let b = 0; b < customOverlayArr?.length; b++){
        customOverlayArr[b].setMap(null);
        customOverlayArrFocus[b].setMap(null);

      }

      overlayArr = [];
      customOverlayArr = [];
      overlayArrFocus = [];
      customOverlayArrFocus = [];

      
      clusterer.clear();
      clusterer.clear();
      
      let data = JSON.parse(e.data);
      markers = data?.markers;
      customMarkers = data?.customMarkers;


      
      if(data?.zoomOut){
        map.setLevel(12);
        var moveLatLon = new kakao.maps.LatLng(defaultLat, defaultLng);
        map.setCenter(moveLatLon);
      }

      kakao.maps.event.addListener(map, 'dragend', function() {
        if(map.getLevel() === 12){
          panTo(defaultLat,defaultLng);
        }
        sendRN({dragend:true})
      });
         kakao.maps.event.addListener(map, 'zoom_changed', function() {
        sendRN({zoom_changed:true})
      });






      if(customMarkers?.length || markers?.length){

        for(let i = 0; i < customMarkers?.length; i++){
          let position = new kakao.maps.LatLng(customMarkers[i].y, customMarkers[i].x)

          if(customMarkers[i]?.imageUrl){
            if(customMarkers[i]?.reviewCount > 1 && customMarkers[i]?.reviewCount < 10){
              content = '<div class="divstyle" tabindex=' + i + ' id=' + "imageDiv"+ i +' onclick="panTo('+ customMarkers[i].y + ' , ' + customMarkers[i].x +' ); customDivClick(' + i + ', ' + customMarkers.length + ', ' + markers.length + ');" ><img class="imageMark" /><img class="realImage" src="'+ 'https://d3uii6bd.cloudfront.net/' + customMarkers[i].imageUrl + '?w=300&h=300" alt="https://d3uii6bdiuxwa3.cloudfront.net/dev/common/defaultmarker.jpg?w=300&h=300"/><div class="reviewCount width55">'+ customMarkers[i].reviewCount +'</div></div>'
              contentFocus = '<div class="divstyle" tabindex=' + i + ' id=' + "imageDiv"+ i +' onclick="panTo('+ customMarkers[i].y + ' , ' + customMarkers[i].x +' ); customDivClick(' + i + ', ' + customMarkers.length + ', ' + markers.length + ');" ><img class="imageMarkFocus" /><img class="realImage" src="'+ 'https://d3uii6bd.cloudfront.net/' + customMarkers[i].imageUrl + '?w=300&h=300" alt="https://d3uii6bdiuxwa3.cloudfront.net/dev/common/defaultmarker.jpg?w=300&h=300"/><div class="reviewCount width55">'+ customMarkers[i].reviewCount +'</div></div>'
            } else if(customMarkers[i]?.reviewCount > 9 && customMarkers[i]?.reviewCount < 100 ) {
              content = '<div class="divstyle" tabindex=' + i + ' id=' + "imageDiv"+ i +' onclick="panTo('+ customMarkers[i].y + ' , ' + customMarkers[i].x +' ); customDivClick(' + i + ', ' + customMarkers.length + ', ' + markers.length + ');" ><img class="imageMark" /><img class="realImage" src="'+ 'https://d3uii6bdiuxwa3.cloudfront.net/' + customMarkers[i].imageUrl + '?w=300&h=300" alt="https://d3uii6bdiuxwa3.cloudfront.net/dev/common/defaultmarker.jpg?w=300&h=300"/><div class="reviewCount width75">'+ customMarkers[i].reviewCount +'</div></div>'
              contentFocus = '<div class="divstyle" tabindex=' + i + ' id=' + "imageDiv"+ i +' onclick="panTo('+ customMarkers[i].y + ' , ' + customMarkers[i].x +' ); customDivClick(' + i + ', ' + customMarkers.length + ', ' + markers.length + ');" ><img class="imageMarkFocus" /><img class="realImage" src="'+ 'https://d3uii6bdiuxwa3.cloudfront.net/' + customMarkers[i].imageUrl + '?w=300&h=300" alt="https://d3uii6bdiuxwa3.cloudfront.net/dev/common/defaultmarker.jpg?w=300&h=300"/><div class="reviewCount width75">'+ customMarkers[i].reviewCount +'</div></div>'
            } else if(customMarkers[i]?.reviewCount > 99) {
              content = '<div class="divstyle" tabindex=' + i + ' id=' + "imageDiv"+ i +' onclick="panTo('+ customMarkers[i].y + ' , ' + customMarkers[i].x +' ); customDivClick(' + i + ', ' + customMarkers.length + ', ' + markers.length + ');" ><img class="imageMark" /><img class="realImage" src="'+ 'https://d3uii6bdiuxwa3.cloudfront.net/' + customMarkers[i].imageUrl + '?w=300&h=300" alt="https://d3uii6bdiuxwa3.cloudfront.net/dev/common/defaultmarker.jpg"/><div class="reviewCount width95">99+</div></div>'
              contentFocus = '<div class="divstyle" tabindex=' + i + ' id=' + "imageDiv"+ i +' onclick="panTo('+ customMarkers[i].y + ' , ' + customMarkers[i].x +' ); customDivClick(' + i + ', ' + customMarkers.length + ', ' + markers.length + ');" ><img class="imageMarkFocus" /><img class="realImage" src="'+ 'https://d3uii6bdiuxwa3.cloudfront.net/' + customMarkers[i].imageUrl + '?w=300&h=300" alt="https://d3uii6bdiuxwa3.cloudfront.net/dev/common/defaultmarker.jpg"/><div class="reviewCount width95">99+</div></div>'
            } else {
              content = '<div class="divstyle" tabindex=' + i + ' id=' + "imageDiv"+ i +' onclick="panTo('+ customMarkers[i].y + ' , ' + customMarkers[i].x +' ); customDivClick(' + i + ', ' + customMarkers.length + ', ' + markers.length + ');" ><img class="imageMark" /><img class="realImage" src="'+ 'https://d3uii6bdiuxwa.cloudfront.net/' + customMarkers[i].imageUrl + '?w=300&h=300" alt="https://d3uii6bdiuxwa3.cloudfront.net/dev/common/defaultmarker.jpg"/></div>'
              contentFocus = '<div class="divstyle" tabindex=' + i + ' id=' + "imageDiv"+ i +' onclick="panTo('+ customMarkers[i].y + ' , ' + customMarkers[i].x +' ); customDivClick(' + i + ', ' + customMarkers.length + ', ' + markers.length + ');" ><img class="imageMarkFocus" /><img class="realImage" src="'+ 'https://d3uii6bdiuxwa.cloudfront.net/' + customMarkers[i].imageUrl + '?w=300&h=300" alt="https://d3uii6bdiuxwa3.cloudfront.net/dev/common/defaultmarker.jpg"/></div>'
            }
          } else {
            if(customMarkers[i]?.reviewCount > 1 && customMarkers[i]?.reviewCount < 10){
              content = '<div class="divstyle" tabindex=' + i + ' id=' + "imageDiv"+ i +' onclick="panTo('+ customMarkers[i].y + ' , ' + customMarkers[i].x +' ); customDivClick(' + i + ', ' + customMarkers.length + ', ' + markers.length + ');" ><img class="imageMark" /><img class="image" /><div class="reviewCount width55">'+ customMarkers[i].reviewCount +'</div></div>'
              contentFocus = '<div class="divstyle" tabindex=' + i + ' id=' + "imageDiv"+ i +' onclick="panTo('+ customMarkers[i].y + ' , ' + customMarkers[i].x +' ); customDivClick(' + i + ', ' + customMarkers.length + ', ' + markers.length + ');" ><img class="imageMarkFocus" /><img class="image" /><div class="reviewCount width55">'+ customMarkers[i].reviewCount +'</div></div>'
             } else if(customMarkers[i]?.reviewCount > 9 && customMarkers[i]?.reviewCount < 100){
              content = '<div class="divstyle" tabindex=' + i + ' id=' + "imageDiv"+ i +' onclick="panTo('+ customMarkers[i].y + ' , ' + customMarkers[i].x +' ); customDivClick(' + i + ', ' + customMarkers.length + ', ' + markers.length + ');" ><img class="imageMark" /><img class="image" /><div class="reviewCount width75">'+ customMarkers[i].reviewCount +'</div></div>'
              contentFocus = '<div class="divstyle" tabindex=' + i + ' id=' + "imageDiv"+ i +' onclick="panTo('+ customMarkers[i].y + ' , ' + customMarkers[i].x +' ); customDivClick(' + i + ', ' + customMarkers.length + ', ' + markers.length + ');" ><img class="imageMarkFocus" /><img class="image" /><div class="reviewCount width75">'+ customMarkers[i].reviewCount +'</div></div>'
             } else if(customMarkers[i]?.reviewCount > 99){
              content = '<div class="divstyle" tabindex=' + i + ' id=' + "imageDiv"+ i +' onclick="panTo('+ customMarkers[i].y + ' , ' + customMarkers[i].x +' ); customDivClick(' + i + ', ' + customMarkers.length + ', ' + markers.length + ');" ><img class="imageMark" /><img class="image" /><div class="reviewCount width95">99+</div></div>'
              contentFocus = '<div class="divstyle" tabindex=' + i + ' id=' + "imageDiv"+ i +' onclick="panTo('+ customMarkers[i].y + ' , ' + customMarkers[i].x +' ); customDivClick(' + i + ', ' + customMarkers.length + ', ' + markers.length + ');" ><img class="imageMarkFocus" /><img class="image" /><div class="reviewCount width95">99+</div></div>'
             } else {
              content = '<div class="divstyle" tabindex=' + i + ' id=' + "imageDiv"+ i +' onclick="panTo('+ customMarkers[i].y + ' , ' + customMarkers[i].x +' ); customDivClick(' + i + ', ' + customMarkers.length + ', ' + markers.length + ');" ><img class="imageMark" /><img class="image" /></div>'
              contentFocus = '<div class="divstyle" tabindex=' + i + ' id=' + "imageDiv"+ i +' onclick="panTo('+ customMarkers[i].y + ' , ' + customMarkers[i].x +' ); customDivClick(' + i + ', ' + customMarkers.length + ', ' + markers.length + ');" ><img class="imageMarkFocus" /><img class="image" /></div>'
            }
          }
          customOverlayArrFocus.push(new kakao.maps.CustomOverlay({
            position: position,
            content: contentFocus,
            xAnchor: 0.3,
            yAnchor: 1
          }))
          
          customOverlayArr.push(new kakao.maps.CustomOverlay({
            position: position,
            content: content,
            xAnchor: 0.3,
            yAnchor: 1
          }))
        }
        for(let k = 0; k < markers.length; k++){
          let position2 = new kakao.maps.LatLng(markers[k].y, markers[k].x)
          let content2 = '<div class="divstyle" tabindex=m' + k + ' id=' + "imageDiv"+ k +' onclick="panTo('+ markers[k].y + ' , ' + markers[k].x +' );divClick(' + k + ', ' + customMarkers.length + ', ' + markers.length + ')" ><img class="mark" /></div>'
          let contentFocus2 = '<div class="divstyle" tabindex=m' + k + ' id=' + "imageDiv"+ k +' onclick="panTo('+ markers[k].y + ' , ' + markers[k].x +' );divClick(' + k + ', ' + customMarkers.length + ', ' + markers.length + ')" ><img class="markFocus" /></div>'
          overlayArr.push(new kakao.maps.CustomOverlay({
            position: position2,
            content: content2,
            xAnchor: 0.3,
            yAnchor: 1
          }))
          overlayArrFocus.push(new kakao.maps.CustomOverlay({
            position: position2,
            content: contentFocus2,
            xAnchor: 0.3,
            yAnchor: 1,
          }))
        }
      } 
      // customDivClick(0,2,2);
      
      if(customMarkers.length > 0 || markers.length > 0){
        clusterMarkers = customMarkers.map((markerData)=>{
          return new kakao.maps.Marker({
            position : new kakao.maps.LatLng(markerData.y,markerData.x)
          })
        })
      defaultClusterMarkers = markers.map((markerData)=>{
          return new kakao.maps.Marker({
            position : new kakao.maps.LatLng(markerData.y,markerData.x)
          })
        })
      }







    let pastLevel = 12;
      
    function setCluster(level){
      if(map.getLevel()> level && pastLevel <= level){
        clusterer.addMarkers(clusterMarkers);
        clusterer.addMarkers(defaultClusterMarkers);

        for(let i = 0; i < customMarkers.length; i++){
          customOverlayArr[i].setMap(null)
          customOverlayArrFocus[i].setMap(null)
        }
        for(let k = 0; k < markers.length; k++){
          overlayArr[k].setMap(null)
          overlayArrFocus[k].setMap(null)
        }
        } else if(map.getLevel() <= level && pastLevel > level ){
          clusterer.removeMarkers(clusterMarkers);
          clusterer.removeMarkers(defaultClusterMarkers);
          for(let i = 0; i < customMarkers.length; i++){
            customOverlayArr[i].setMap(map)
            
          }
          for(let k = 0; k < markers.length; k++){
            overlayArr[k].setMap(map)
          }
        }
        pastLevel = map.getLevel();
      }
      if(!data?.myLatLng?.latitude){
        if(data?.pinGroupData){
          map.setLevel(12)
          panTo(defaultLat,defaultLng);
        clusterer.addMarkers(clusterMarkers);
      }  else if(data?.targetPosition){
        map.setLevel(5);
        setTimeout(()=>{
          panTo(data.targetPosition.y, data.targetPosition.x);
          if(data.targetPosition?.inGroup){
            customDivClick(0,customOverlayArr.length,overlayArr.length);
          } else {
            divClick(0,customOverlayArr.length,overlayArr.length);
          }
        },100)
      }
    }

      
      if(data?.myLatLng?.latitude){
        var setMyDot = once(function(){
          map.setLevel(5);
        panTo(data?.myLatLng.latitude, data?.myLatLng.longitude)
        let position = new kakao.maps.LatLng(data?.myLatLng.latitude, data?.myLatLng.longitude)
        let mycontent = '<div class="myDot" />'
        myDotOverlay?.setMap(null);
        myDotOverlay = new kakao.maps.CustomOverlay({
          position: position,
          content: mycontent,
          xAnchor: 0,
          yAnchor:0
        });
        myDotOverlay.setMap(map);
      })
      setMyDot()
    } else{
      myDotOverlay?.setMap(null);
    }
    setCluster(7);
      kakao.maps.event.addListener(map, 'zoom_changed', function() {
        setCluster(7)
      });
      kakao.maps.event.addListener(map, 'click', function() {
        sendRN({click:true})
      });      
      kakao.maps.event.addListener(map, 'dblclick', function() {
        sendRN({doubleClick:true})
      });
    } catch (e){
      alert(e)
    }



    }) // eventListener message closed
    })
    </script>
    <script>
    </script>
    </body>
 </html>
`;
