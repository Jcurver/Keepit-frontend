export const mapStyle = `  <style>
      div:focus { outline:none; border:0; }
      div { outline:none; border:0;  }
      img {outline:none; border:0; }
      img:focus {outline:none; border:0; }
      .divstyle{
        width:180px;
        height:180px;
        position: relative;
      }     
      .divstyle:focus{

        outline: none;
        //         width:180px;

        // width:1000px;
        // height:1000px;
      }

      .imageMark{
        position:absolute;
        width:150px;
        height:180px;
        background: center / contain no-repeat url('https://d3uii6bdiuxwa3.cloudfront.net/dev/common/review_default.png');
        background-size:cover;
        z-index:0
        outline:none;

      }
      .imageMarkFocus{
        position:absolute;
        width:150px;
        height:180px;
        background: center / contain no-repeat url('https://d3uii6bdiuxwa3.cloudfront.net/dev/common/review_focus.png');
        background-size:cover;
        outline:none;
        z-index:8;
      }
      .image{
        position:absolute;
        left:15px;
        top:15px;
        width:120px;
        height:120px;
        border-radius:999px;
        background: center / contain no-repeat url('https://d3uii6bdiuxwa3.cloudfront.net/dev/common/defaultmarker.jpg');
        background-size:cover;
        z-index:10;
        outline:none;

      }
      .mark{
        position:absolute;
        width:67px;
        height:90px;
        background: center / contain no-repeat url('https://d3uii6bdiuxwa3.cloudfront.net/dev/common/place_default.png');
        background-size:cover;
        outline:none;

      }
      .realImage{
        position:absolute ;
        left:15px;
        top:15px;
        width:120px;
        height:120px;
        border-radius:999px;
        z-index:101;
      }
      .markFocus{
        position:absolute;
        width:105px;
        height:150px;
        background: center / contain no-repeat url('https://d3uii6bdiuxwa3.cloudfront.net/dev/common/place_focus.png');
        background-size:cover;
        z-index:7;
      outline: none;
      }
      .reviewCount{
        position:absolute;

        height:55px;
        border-radius:999px;
        right:0;
        top:0;
        background-color:#00D282;
        z-index:15;
        color:white;
        display:flex;
        justify-content:center;
        align-items:center;
        font-size:36px;
        font-weight:500;
        font-family:Noto Sans Korean, sans-serif;
      }
      .width55{
        width:55px;
        right:20px;
      }
      .width75{
        width:75px;
        right:10px;
      }
      .width95{
        width:95px;
      }

      .myDot{
        width:40px;
        height:40px;
        background-color:#3893FF;
        border:3px solid white;
        box-shadow:0px 0px 33px 10px #3893FF ;
        // background: center / contain no-repeat url('https://d3uii6bdiuxwa3.cloudfront.net/dev/common/place_focus.png');
        border-radius:999px;
      }
      </style>`;
