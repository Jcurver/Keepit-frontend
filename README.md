# 🗺️  Keepit 우리만의 지도 만들기

## ⛳️ 목표
#### 킵잇은 **좋은 장소를 찾는 모두를 위한 제품**을 만들고 있습니다.
> 우리가 sns나 블로그에서 얻은 장소 정보는 광고나 단순 보여주기식으로 인해 생각보다 만족하지 못한 경험으로 이어지게 됩니다. 
여러 플랫폼에 흩어져 있는 정보를 모으기에 기술적 제약과 불편함도 있고요. 
킵잇은 공통의 주제로 사람들이 모여 솔직한 장소 리뷰를 나누고 장소를 모아 그룹 지도를 만드는 커뮤니티 서비스를 목표로 합니다.  
#### 사소한 UX 디테일까지도 놓치지 않고 기능을 구현하는 것이 목표입니다.
>ex1. 유저가 어떤 상황에서 앱을 종료하더라도 문제가 없도록 조치하기  
ex2. 필요한 곳에 상황별 Skeleton을 적용하여 로딩중임을 꼭 보여주기  
ex3. 이미지와 글을 불러올 때 상황에 따라 캐싱 업데이트 조절하기  
ex4. 임시저장 기능을 통해 작성하던 글은 언제든 다시 작성할 수 있도록 구현  
ex5. 페이지를 스크롤 한 후 다른페이지로 이동했다 돌아왔을 때 리스트 데이터 업데이트 여부에 따라 새로고침 여부 핸들링  
ex6. 추가로 직접 기능들을 하나하나 사용해보며 Side Effect로 인해 발생되는 에러를 추적하고 핸들링  
#### CI/CD를 통한 자동화를 구현하여 쉽게 협업이 가능한 프로젝트를 목표로 합니다.
> e2e Test, Codepush와 XCode를 적절히 활용하여 무중단 배포 전략 구성하기
#### Github, Notion, Figma를 통한 활발한 소통을 바탕으로 효율적인 협업을 추구합니다.
> Git Flow 확립, 주간 회의시 작업내용 컨펌, 실시간 Notion ToDo 업데이트

#### 안정적인 서비스 운영을 위해서 테스트 코드를 작성합니다
> 기능이 지속적으로 추가되기 때문에 Side Effect 방지를 위해 e2e 테스트를 중점으로 점검합니다.


## ⛳️ 사용한 기술
- React-Native
- CodePush
- Redux
- Detox
- FCM
- React Navigation
## ⛳️ [Keepit 기능 소개(FrontEnd)](https://github.com/Jcurver/Keepit-frontend/wiki/Keepit-%EA%B8%B0%EB%8A%A5-%EB%AA%A8%EC%9D%8C)
- 기능 소개에서 알 수 있듯 보편적인 사이드프로젝트에 비해 규모가 있는 서비스입니다.
- 개발하는 과정에서 기존 기능에 Side Effect를 발생시키는 기능들이 지속적으로 추가되었기에 이를 해결하는데 많은 시간을 소비하였습니다. 이런 과정을 겪은 뒤로는 새로운 기능이 생겨도 Side Effect가 적게 발생할 수 있도록 코드를 유지보수 하였습니다.

## ⛳️ 기술적 이슈와 해결 과정
> 작업하며 겪었던 크고작은 다양한 이슈들, 그리고 진행했던 과정과 배운 점들을 기록해 보았습니다.
#### [Keepit의 핵심 기능 지도 구현하기](https://velog.io/@ifizzyou/Keepit%EC%9D%98-%ED%95%B5%EC%8B%AC-%EA%B8%B0%EB%8A%A5.-%EC%A7%80%EB%8F%84-%EA%B5%AC%ED%98%84%ED%95%98%EA%B8%B0)
> Webview와 Kakao API, Kakao cdn을 활용하여 발생할 수 있는 복잡하고 다양한 유저 이벤트의 모든 케이스를 대응하여 구현하였습니다.
#### [React-Native Toast 메시지 라이브러리 없이 구현하기](https://velog.io/@ifizzyou/React-Native-Toast-%EC%BB%A4%EC%8A%A4%ED%85%80-%EC%A0%9C%EC%9E%91%EA%B8%B0)
> 디자인 요구사항을 만족하는 Toast 라이브러리가 없다고 판단하여 확장성과 안정성을 고려해 직접 Toast 기능을 구현하였습니다.
#### [상황별 알림 구현을 위해 FCM v6 도입하기](https://velog.io/@ifizzyou/React-Native%EC%97%90-Firebase-Cloud-MessagingFCM-v6-%EB%8F%84%EC%9E%85%ED%95%98%EA%B8%B0)
> 백그라운드 / 포그라운드 / 인앱 알림 업데이트 및 dev / prd 구분을 위해 많은 시간 검색하고 적용한 내용을 담았습니다. 

#### [효율적인 CI/CD 환경 구축을 위해 CodePush 적용하기](https://velog.io/@ifizzyou/React-Native%EC%97%90-CodePush-%EC%A0%81%EC%9A%A9%ED%95%98%EA%B8%B0)
> CodePush를 통해서 Xcode 대비 CI/CD에 들어가는 시간을 10배 이상 단축하였으며, 무중단 배포 설정 및 업데이트 조건을 설정했습니다.

#### [e2e 테스트코드 작성을 위해 detox 도입](https://velog.io/@ifizzyou/e2e-%ED%85%8C%EC%8A%A4%ED%8A%B8%EC%BD%94%EB%93%9C-%EC%9E%91%EC%84%B1%EC%9D%84-%EC%9C%84%ED%95%B4-detox-%EB%9D%BC%EC%9D%B4%EB%B8%8C%EB%9F%AC%EB%A6%AC%EB%A5%BC-%EB%8F%84%EC%9E%85%ED%95%98%EB%8B%A4)
> 치명적인 에러를 사전 방지하기 위해서 로그인부터 시작해서 테스트코드를 점진적으로 적용해나가고있습니다.
## [작업하며 배우고 느낀 점들](https://github.com/Jcurver/Keepit-frontend/wiki/%EC%9E%91%EC%97%85%ED%95%98%EB%A9%B4%EC%84%9C-%EB%B0%B0%EC%9A%B0%EA%B3%A0-%EB%8A%90%EB%82%80-%EC%A0%90%EB%93%A4)
> 작업을 진행하면서 코드 내부에서도 많은 어려움을 마주했지만 코드 밖에서도 다양한 어려움이 있었습니다. 그런 어려움들을 극복한 과정들 역시 저에게 소중한 자산이기에 배우고 느낀 점을을 Trouble Shooting과 분리하여 기록하였습니다.