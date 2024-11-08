import React, { useEffect, useRef, useState } from 'react';
import NavBar from './components/AdminNavBar';

const AdminMap: React.FC = () => {
  const mapRef = useRef<HTMLDivElement | null>(null);
  const [map, setMap] = useState<any>(null); // 카카오맵 인스턴스 저장
  const [markers, setMarkers] = useState<any[]>([]); // 마커 배열

  // 카카오 API Key
  const KakaoMapApiKey = import.meta.env.VITE_KAKAOMAP_API_KEY; // 실제 API 키로 변경하세요

  // 지도 초기화 및 마커 설정
  useEffect(() => {
    const script = document.createElement('script');
    script.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=${KakaoMapApiKey}&autoload=false&libraries=services`;
    script.async = true;
    document.head.appendChild(script);

    script.onload = () => {
      window.kakao.maps.load(() => {
        const container = mapRef.current!;
        const options = {
          center: new window.kakao.maps.LatLng(37.5665, 126.9780), // 서울 위치
          level: 7, // 줌 레벨
        };
        const initializedMap = new window.kakao.maps.Map(container, options);
        setMap(initializedMap); // 맵 인스턴스를 상태에 저장

        // 지도에 마커 추가
        const markerData = [
          { latitude: 37.5665, longitude: 126.9780, title: '서울' },
          { latitude: 35.1796, longitude: 129.0756, title: '부산' },
          { latitude: 37.4563, longitude: 126.7050, title: '인천' },
        ];

        const newMarkers = markerData.map((data) => {
          const position = new window.kakao.maps.LatLng(data.latitude, data.longitude);
          const marker = new window.kakao.maps.Marker({
            position: position,
            map: initializedMap, // 맵에 마커 추가
          });

          // 클릭 시 인포윈도우 열기
          const infoWindowContent = 
            <div style="padding: 5px;">
              <strong>${data.title}</strong>
            </div>
          ;
          const infoWindow = new window.kakao.maps.InfoWindow({
            content: infoWindowContent,
          });

          window.kakao.maps.event.addListener(marker, 'click', () => {
            infoWindow.open(initializedMap, marker);
          });

          return marker;
        });

        setMarkers(newMarkers); // 마커 상태 저장
      });
    };

    script.onerror = () => {
      console.error('카카오맵 스크립트 로딩 실패');
    };
  }, [KakaoMapApiKey]);

  return (
    <div className="min-h-screen bg-gray-100">
      {/* NavBar Component */}
      <NavBar />
      <div className="container mx-auto p-4">
        {/* <h2 className="text-2xl font-bold mb-4">지도</h2> */}
        {/* 지도 */}
        <div
          ref={mapRef}
          id="map"
          className="w-full h-[640px] rounded-lg shadow-md"
        ></div>
      </div>
    </div>
  );
};

export default AdminMap;