# 🗺️Keepit 우리만의 지도 만들기

## 목표
- 킵잇은 **좋은 장소를 찾는 모두를 위한 제품**을 만들고 있습니다.
> 우리가 sns나 블로그에서 얻은 장소 정보는 광고나 단순 보여주기식으로 인해 생각보다 만족하지 못한 경험으로 이어지게 됩니다. 
여러 플랫폼에 흩어져 있는 정보를 모으기에 기술적 제약과 불편함도 있고요. 
킵잇은 공통의 주제로 사람들이 모여 솔직한 장소 리뷰를 나누고 장소를 모아 그룹 지도를 만드는 커뮤니티 서비스를 목표로 합니다.  
- 사소한 UX 디테일까지도 놓치지 않고 기능을 구현하는 것이 목표입니다.
> ex1. 유저가 어떤 상황에서 앱을 종료하거나 
ex2. 필요한 곳에 상황별 Skeleton을 적용하여 로딩중임을 꼭 보여주기
- CI/CD를 통한 자동화를 구현하여 쉽게 협업이 가능한 프로젝트를 목표로 합니다.
> e2e Test, Codepush와 XCode를 적절히 활용하여 무중단 배포 전략 구성하기
- Github, Notion, Figma를 통한 활발한 소통을 바탕으로 효율적인 협업을 추구합니다.
> Git Flow 확립, 주간 회의시 작업내용 컨펌, 실시간 Notion ToDo 업데이트


## 사용한 기술
**React-Native, CodePush, Redux, Detox, FCM**
## [Keepit 기능 소개(FrontEnd)](https://github.com/Jcurver/Keepit-frontend/wiki/Keepit-%EA%B8%B0%EB%8A%A5-%EB%AA%A8%EC%9D%8C)
- 기능 소개에서 알 수 있듯 일반적인 사이드프로젝트에 비해 규모가 있는 서비스입니다.
- 개발하는 과정에서 기존 기능에 Side Effect를 발생시키는 기능들이 지속적으로 추가되었기에 이를 해결하는데 많은 시간을 소비하였습니다. 이런 과정을 겪은 뒤로는 새로운 기능이 생겨도 Side Effect가 적게 발생할 수 있도록 코드를 유지보수 하였습니다.

## 기술적 이슈와 해결 과정

