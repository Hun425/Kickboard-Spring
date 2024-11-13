import React, { useEffect, useRef, useState } from 'react';

declare global {
  interface Window {
    kakao: any;
  }
}

const ListMap: React.FC = () => {
  const [map, setMap] = useState<any>(null);
  const mapRef = useRef<any>(null);
  const [kakaoLoaded, setKakaoLoaded] = useState(false);
  map;
  kakaoLoaded;
  // 카카오맵이 로딩됐는지 여부 확인
  // =============================================================
  const KakaoMapApiKey = import.meta.env.VITE_KAKAOMAP_API_KEY;

  // 지도 띄우기 위해 document에 script 추가
  useEffect(() => {
    const script = document.createElement('script');
    script.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=${KakaoMapApiKey}&autoload=false&libraries=services`;
    script.async = true;
    document.head.appendChild(script);

    script.onload = () => {
      window.kakao.maps.load(() => {
        const container = document.getElementById('map');
        const options = {
          center: new window.kakao.maps.LatLng(35.1595, 126.8526),
          level: 6,
        };
        const initializedMap = new window.kakao.maps.Map(container, options);
        setMap(initializedMap);
        mapRef.current = initializedMap;
        setKakaoLoaded(true); // 로딩 끝났으면 로딩상태 true로 바꿔
      });
    };
  }, []);
  return (
    <>
      <div id="map" className="mb-5 h-[500px] w-full"></div>
    </>
  );
};

export default ListMap;
