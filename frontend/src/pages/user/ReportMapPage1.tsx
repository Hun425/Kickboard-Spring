import React, { useEffect, useRef, useState } from 'react';
import { useStateStore } from '../../store/StateStore';
import { useReportStore } from '../../store/ReportInfoStore';
import { useNavigate } from 'react-router-dom';

declare global {
  interface Window {
    kakao: any;
  }
}

const ReportMapPage1: React.FC = () => {
  const [map, setMap] = useState<any>(null);
  const mapRef = useRef<any>(null);
  const [kakaoLoaded, setKakaoLoaded] = useState(false);
  map;
  kakaoLoaded;

  const KakaoMapApiKey = import.meta.env.VITE_KAKAOMAP_API_KEY;
  const { title, setTitle } = useStateStore();
  const { latitude1, longitude1, address1 } = useReportStore();
  const navigate = useNavigate();
  const handleBackClick = () => {
    navigate(-1); // -1은 이전 페이지로 이동
  };

  useEffect(() => {
    const script = document.createElement('script');
    script.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=${KakaoMapApiKey}&autoload=false&libraries=services`;
    script.async = true;
    document.head.appendChild(script);

    script.onload = () => {
      window.kakao.maps.load(() => {
        const container = document.getElementById('map');
        const options = {
          center: new window.kakao.maps.LatLng(latitude1, longitude1),
          level: 4,
        };
        const initializedMap = new window.kakao.maps.Map(container, options);
        setMap(initializedMap);
        mapRef.current = initializedMap;
        setKakaoLoaded(true);

        // 마커 생성 및 초기 위치 설정 (중심에 위치)
        const marker = new window.kakao.maps.Marker({
          position: initializedMap.getCenter(),
        });
        marker.setMap(initializedMap);
      });
    };
  }, []);

  useEffect(() => {
    setTitle('위치 확인');
  }, [title, setTitle]);

  return (
    <>
      <div className="my-border flex h-12 w-full items-center justify-center">
        {address1}
      </div>
      <div id="map" className="h-[calc(100vh-140px)] w-full"></div>
      <button onClick={handleBackClick} className="my-border h-12 w-full">
        확인
      </button>
    </>
  );
};

export default ReportMapPage1;
