import React, { useEffect, useRef, useState } from 'react';
import { useStateStore } from '../../store/StateStore';
import { useReportStore } from '../../store/ReportInfoStore';
import { Link, useNavigate } from 'react-router-dom';

declare global {
  interface Window {
    kakao: any;
  }
}

const ReportMapPage: React.FC = () => {
  const [map, setMap] = useState<any>(null);
  const mapRef = useRef<any>(null);
  const [kakaoLoaded, setKakaoLoaded] = useState(false);
  const [centerInfo, setCenterInfo] = useState<string[]>([]); // 중심 좌표 정보를 위한 상태
  const KakaoMapApiKey = import.meta.env.VITE_KAKAOMAP_API_KEY;
  const { title, setTitle } = useStateStore();
  const {
    address,
    setAddress,
    latitude,
    setLatitude,
    longitude,
    setLongitude,
  } = useReportStore();

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
          center: new window.kakao.maps.LatLng(latitude, longitude),
          level: 2,
        };
        const initializedMap = new window.kakao.maps.Map(container, options);
        setMap(initializedMap);
        mapRef.current = initializedMap;
        setKakaoLoaded(true);
        const geocoder = new window.kakao.maps.services.Geocoder();
        geocoder.coord2Address(
          latitude,
          longitude,
          (result: any, status: any) => {
            if (status === window.kakao.maps.services.Status.OK) {
              const roadAddress = result[0].road_address
                ? result[0].road_address.address_name
                : '';
              const address = roadAddress || result[0].address.address_name;
              setAddress(address);
            }
          }
        );
        // 마커 생성 및 초기 위치 설정 (중심에 위치)
        const marker = new window.kakao.maps.Marker({
          position: initializedMap.getCenter(),
        });
        marker.setMap(initializedMap);

        // 지도 중심 좌표 변경 이벤트 등록 (중심 이동 시 마커 위치 및 주소 업데이트)
        window.kakao.maps.event.addListener(
          initializedMap,
          'center_changed',
          () => {
            const latlng = initializedMap.getCenter();
            setCenterInfo([latlng.getLat(), latlng.getLng()]);
            setLatitude(latlng.getLat());
            setLongitude(latlng.getLng());
            // 마커 위치를 새 지도 중심으로 업데이트
            marker.setPosition(latlng);

            // Reverse Geocoding으로 주소 얻기
            const geocoder = new window.kakao.maps.services.Geocoder();
            geocoder.coord2Address(
              latlng.getLng(),
              latlng.getLat(),
              (result: any, status: any) => {
                if (status === window.kakao.maps.services.Status.OK) {
                  const roadAddress = result[0].road_address
                    ? result[0].road_address.address_name
                    : '';
                  const address = roadAddress || result[0].address.address_name;
                  setAddress(address);
                }
              }
            );
          }
        );
      });
    };
  }, [address]);

  useEffect(() => {
    setTitle('위치 확인');
  }, [title, setTitle]);

  return (
    <>
      <div className="my-border flex h-12 w-full items-center justify-center">
        {address}
      </div>
      <div id="map" className="h-[calc(100vh-140px)] w-full"></div>
      <button onClick={handleBackClick} className="my-border h-12 w-full">
        확인
      </button>
    </>
  );
};

export default ReportMapPage;
