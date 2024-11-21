import React, { useEffect, useRef, useState } from 'react';
import { Report } from '../../../types/index';

interface Props {
  selectedReport: Report | null;
  reports: Report[];
  onSelectReport: (report: Report) => void;
}

const KakaoMap: React.FC<Props> = ({
  selectedReport,
  reports,
  onSelectReport,
}) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<any>(null);
  const [markers, setMarkers] = useState<any[]>([]);
  const [infowindows, setInfowindows] = useState<any[]>([]);
  const [centerAddress, setCenterAddress] = useState<string>('');
  const [selectedStatuses, setSelectedStatuses] = useState<string[]>(['전체']);
  const [overlays, setOverlays] = useState<any[]>([]);
  const activeOverlayRef = useRef<any>(null);
  const KAKAO_MAP_KEY = import.meta.env.VITE_KAKAOMAP_API_KEY;

  const companyColors: { [key: string]: string } = {
    빔: '#7448ff', // 빔
    디어: '#ffe301', // 디어
    지쿠터: '#34d025', // 지쿠
    타고가: '#f88379', // 타고가
    씽씽: '#ffd939', // 씽씽
  };

  const getStatusLabel = (status: Report['adminStatus']) => {
    switch (status) {
      case 'REPORT_RECEIVED':
        return '신고접수';
      case 'COLLECT_RECEIVED':
        return '수거접수';
      case 'COLLECT_PROGRESS':
        return '수거중';
      case 'COLLECT_COMPLETED':
        return '수거완료';
      case 'REPORT_COMPLETED':
        return '신고처리완료';
      default:
        return status;
    }
  };
  // 지도 이동 함수 추가
  const moveToLocation = (lat: number, lng: number) => {
    if (!map) return;

    const moveLatLng = new window.kakao.maps.LatLng(lat, lng);
    map.panTo(moveLatLng);
  };

  // 오버레이 표시 함수
  const showOverlay = (overlay: any, _marker: any) => {
    // 이전 활성 오버레이가 있다면 제거
    if (activeOverlayRef.current) {
      activeOverlayRef.current.setMap(null);
    }

    overlay.setMap(map);
    activeOverlayRef.current = overlay;
  };

  // selectedReport 변경 감지하여 지도 이동
  useEffect(() => {
    if (selectedReport && map) {
      moveToLocation(selectedReport.latitude, selectedReport.longitude);

      // 해당 리포트의 오버레이 찾기 및 표시
      // const reportIndex = reports.findIndex(r => r.reportId === selectedReport.reportId);
      // if (reportIndex !== -1 && overlays[reportIndex]) {
      //   showOverlay(overlays[reportIndex], markers[reportIndex]);
      // }
    }
  }, [selectedReport, map]);
  const getFormattedDate = (dateString: string) => {
    const date = new Date(dateString);
    const month = String(date.getMonth() + 1).padStart(2, '0'); // 월은 0부터 시작하므로 +1
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');

    return `${month}월 ${day}일 ${hours}:${minutes}:${seconds}`;
  };

  useEffect(() => {
    if (!map) return;

    markers.forEach((marker) => marker.setMap(null));
    infowindows.forEach((infowindow) => infowindow.close());
    overlays.forEach((overlay) => overlay.setMap(null));

    const filteredReports = getFilteredReports();
    const newMarkers: any[] = [];
    const newInfowindows: any[] = [];
    const newOverlays: any[] = [];

    filteredReports.forEach((report) => {
      const position = new window.kakao.maps.LatLng(
        report.latitude,
        report.longitude
      );

      const markerImage = new window.kakao.maps.MarkerImage(
        createMarkerImage(
          companyColors[report.companyName] || '#FF0000',
          report.adminStatus
        ).src,
        new window.kakao.maps.Size(24, 35)
      );

      const marker = new window.kakao.maps.Marker({
        position,
        map,
        image: markerImage,
      });

      const overlay = new window.kakao.maps.CustomOverlay({
        content: createCustomOverlayContent(report),
        position: position,
        xAnchor: 0.5,
        yAnchor: 1,
      });

      // 마커 클릭 이벤트 수정
      window.kakao.maps.event.addListener(marker, 'click', () => {
        onSelectReport(report);
        showOverlay(overlay, marker);
      });

      newMarkers.push(marker);
      newInfowindows.push(infowindows);
      newOverlays.push(overlay);
    });

    setMarkers(newMarkers);
    setInfowindows(newInfowindows);
    setOverlays(newOverlays);

    // 초기 선택된 리포트가 있다면 해당 위치로 이동
    if (selectedReport) {
      moveToLocation(selectedReport.latitude, selectedReport.longitude);
    }
  }, [map, reports, selectedStatuses]);

  const createCustomOverlayContent = (report: Report) => {
    const content = document.createElement('div');
    content.className = 'custom-overlay';
    content.innerHTML = `
      <div class="overlay-wrapper" style="
        position: relative;
        width: 300px;
        border-radius: 10px;
        background-color: white;
        box-shadow: 0 2px 6px rgba(0,0,0,0.1);
        padding: 15px;
        font-family: system-ui, -apple-system, sans-serif;
      ">
        <div class="close-btn" style="
          position: absolute;
          top: 10px;
          right: 10px;
          cursor: pointer;
          font-size: 18px;
          color: #666;
        ">&times;</div>
        
 
        <div style="padding: 0 5px;">
          <div style="
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 8px;
          ">
            <span style="
              font-weight: 600;
              color: ${companyColors[report.companyName]};
            ">${report.companyName}</span>
            <span style="
              color: #666;
              font-size: 0.9em;
            ">${getFormattedDate(report.createdAt)}</span>
          </div>
          
          <div style="margin-bottom: 8px;
            color: #333;
            font-size: 0.95em;
          ">
            <div style="color: #666;">${report.address}</div>
          </div>
          
          <div style="
            display: flex;
            justify-content: space-between;
            align-items: center;
          ">
            <div style="
              display: inline-block;
              padding: 4px 8px;
              border-radius: 4px;
              background-color: ${
                report.adminStatus === 'REPORT_RECEIVED'
                  ? '#FEE2E2'
                  : report.adminStatus === 'COLLECT_PROGRESS'
                    ? '#E0F2FE'
                    : '#DCFCE7'
              };
              color: ${
                report.adminStatus === 'REPORT_RECEIVED'
                  ? '#DC2626'
                  : report.adminStatus === 'COLLECT_PROGRESS'
                    ? '#0284C7'
                    : '#16A34A'
              };
              font-size: 0.9em;
              font-weight: 500;
            ">${getStatusLabel(report.adminStatus)}</div>
            
  
          </div>
        </div>
      </div>
    `;

    const closeBtn = content.querySelector('.close-btn');

    if (closeBtn) {
      closeBtn.addEventListener('click', () => {
        overlays.forEach((overlay) => overlay.setMap(null));
      });
    }

    return content;
  };
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'REPORT_RECEIVED': // 신고접수
        return `
          <circle cx="12" cy="12" r="8" fill="white" stroke="white" stroke-width="2"/>
          <path fill="black" d="M11 6h2v6h-2zM11 14h2v2h-2z"/>
        `;
      case 'COLLECT_RECEIVED': // 수거접수
      case 'COLLECT_PROGRESS': // 수거중
      case 'COLLECT_COMPLETED': // 수거완료
        return `
          <circle cx="12" cy="12" r="8" fill="white" stroke="white" stroke-width="2"/>
          <path fill="black"  d="M12 6a6 6 0 1 0 0 12 6 6 0 0 0 0-12zm0 11a5 5 0 1 1 0-10 5 5 0 0 1 0 10zm2.5-5.5l-3.5 2V8h1v4.3l2.5-1.7.5.9z"/>
        `;
      case 'REPORT_COMPLETED': // 신고처리완료
        return `
        <circle cx="12" cy="12" r="8" fill="white" stroke="white" stroke-width="2"/>
        <path fill="none" stroke="black" stroke-width="2" d="M8 12l2 2 4-4"/>
        `;
      default:
        return '';
    }
  };

  const createMarkerImage = (color: string, status: string) => {
    const markerSize = new window.kakao.maps.Size(24, 35);
    const markerShape = {
      coords: [12, 34, 1, 21, 1, 12, 6, 4, 18, 4, 23, 12, 23, 21, 12, 34],
      type: 'poly',
    };

    return {
      src: `data:image/svg+xml;charset=utf-8,${encodeURIComponent(`
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 35">
            <path fill="${color}" d="M12 0C5.4 0 0 5.4 0 12c0 7.5 12 23 12 23s12-15.5 12-23c0-6.6-5.4-12-12-12z"/>
            ${getStatusIcon(status)}
          </svg>
        `)}`,
      size: markerSize,
      shape: markerShape,
    };
  };

  const handleStatusToggle = (status: string) => {
    setSelectedStatuses((prev) => {
      if (status === '전체') {
        return ['전체'];
      }

      const newStatuses = prev.filter((s) => s !== '전체');
      if (prev.includes(status)) {
        const filteredStatuses = newStatuses.filter((s) => s !== status);
        return filteredStatuses.length === 0 ? ['전체'] : filteredStatuses;
      } else {
        return [...newStatuses, status];
      }
    });
  };

  const getFilteredReports = () => {
    if (selectedStatuses.includes('전체')) {
      return reports;
    }
    return reports.filter((report) =>
      selectedStatuses.includes(report.adminStatus)
    );
  };

  const updateCenterAddress = (map: any) => {
    const geocoder = new window.kakao.maps.services.Geocoder();
    const center = map.getCenter();

    geocoder.coord2Address(
      center.getLng(),
      center.getLat(),
      (result: any, status: any) => {
        if (status === window.kakao.maps.services.Status.OK) {
          const addr = result[0].address;
          setCenterAddress(addr.address_name);
        }
      }
    );
  };

  useEffect(() => {
    if (!KAKAO_MAP_KEY) {
      console.error('Kakao Map API key is not defined');
      return;
    }

    const script = document.createElement('script');
    script.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=${KAKAO_MAP_KEY}&libraries=services&autoload=false`;
    script.async = true;

    const onScriptError = () =>
      console.error('Failed to load Kakao Maps script');
    script.addEventListener('error', onScriptError);
    document.head.appendChild(script);

    script.onload = () => {
      window.kakao.maps.load(() => {
        if (!mapRef.current) return;

        const options = {
          center: new window.kakao.maps.LatLng(35.1595, 126.8526),
          level: 3,
        };

        const newMap = new window.kakao.maps.Map(mapRef.current, options);

        const filterControl = document.createElement('div');
        filterControl.className =
          'absolute bottom-0 left-0 right-0 bg-white/95 backdrop-blur-sm p-3 border-t border-gray-200 z-10';
        filterControl.innerHTML = `
            <div class="max-w-3xl mx-auto">
              <div class="flex flex-col space-y-3">
                <div class="flex flex-wrap gap-2 justify-center">
                
                </div>
              
              </div>
            </div>
          `;

        // 필터 버튼 이벤트 리스너 추가
        filterControl.addEventListener('click', (e) => {
          const target = e.target as HTMLElement;
          if (target.classList.contains('filter-btn')) {
            const status = target.getAttribute('data-status');
            if (status) {
              handleStatusToggle(status);

              // 버튼 스타일 업데이트
              const allButtons = filterControl.querySelectorAll('.filter-btn');
              allButtons.forEach((btn) => {
                const btnStatus = btn.getAttribute('data-status');
                if (btnStatus === '전체' && status === '전체') {
                  btn.classList.remove('bg-gray-200', 'text-gray-700');
                  btn.classList.add('bg-blue-500', 'text-white');
                } else if (status === '전체') {
                  btn.classList.remove('bg-blue-500', 'text-white');
                  btn.classList.add('bg-gray-200', 'text-gray-700');
                } else if (btnStatus === status) {
                  btn.classList.toggle('bg-blue-500');
                  btn.classList.toggle('text-white');
                  btn.classList.toggle('bg-gray-200');
                  btn.classList.toggle('text-gray-700');
                } else if (btnStatus === '전체') {
                  btn.classList.remove('bg-blue-500', 'text-white');
                  btn.classList.add('bg-gray-200', 'text-gray-700');
                }
              });
            }
          }
        });

        mapRef.current.appendChild(filterControl);

        window.kakao.maps.event.addListener(newMap, 'idle', () => {
          updateCenterAddress(newMap);
        });

        setMap(newMap);
      });
    };

    return () => {
      script.removeEventListener('error', onScriptError);
      if (document.head.contains(script)) {
        document.head.removeChild(script);
      }
    };
  }, [KAKAO_MAP_KEY]);

  useEffect(() => {
    if (!map) return;

    markers.forEach((marker) => marker.setMap(null));
    infowindows.forEach((infowindow) => infowindow.close());
    overlays.forEach((overlay) => overlay.setMap(null)); // 오버레이 제거

    const filteredReports = getFilteredReports();
    const newMarkers: any[] = [];
    const newInfowindows: any[] = [];
    const newOverlays: any[] = []; // 새로운 오버레이 배열 추가

    filteredReports.forEach((report) => {
      const position = new window.kakao.maps.LatLng(
        report.latitude,
        report.longitude
      );

      const markerImage = new window.kakao.maps.MarkerImage(
        createMarkerImage(
          companyColors[report.companyName] || '#FF0000',
          report.adminStatus
        ).src,
        new window.kakao.maps.Size(24, 35)
      );

      const marker = new window.kakao.maps.Marker({
        position,
        map,
        image: markerImage,
      });

      const infowindow = new window.kakao.maps.InfoWindow({
        content: `
            <div class="p-2">
              <p class="font-bold">${report.address}</p>
              <p>${report.companyName}</p>
            </div>
          `,
      });

      window.kakao.maps.event.addListener(marker, 'click', () => {
        newInfowindows.forEach((w) => w.close());
        infowindow.open(map, marker);
        onSelectReport(report);
      });

      newMarkers.push(marker);
      newInfowindows.push(infowindow);

      // 오버레이 생성 및 추가
      const overlay = new window.kakao.maps.CustomOverlay({
        content: createCustomOverlayContent(report),
        position: position,
        xAnchor: 0.5,
        yAnchor: 1,
      });
      newOverlays.push(overlay); // 새로운 오버레이 추가
    });

    setMarkers(newMarkers);
    setInfowindows(newInfowindows);
    setOverlays(newOverlays); // 오버레이 상태 업데이트
  }, [map, reports, selectedStatuses, onSelectReport]);

  return (
    <div className="w-full space-y-4">
      <div ref={mapRef} className="relative h-[400px] w-full rounded-lg" />

      {/* 회사 범례 */}
      <div className="rounded-lg bg-white p-4 shadow-sm">
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-5">
          {Object.entries(companyColors).map(([company, color]) => (
            <div
              key={company}
              className="flex items-center justify-center gap-2"
            >
              <div
                className="h-4 w-4 rounded-full"
                style={{ backgroundColor: color }}
              />
              <span className="text-xs">{company}</span>
            </div>
          ))}
        </div>
      </div>

      {/* 현재 주소 표시 */}
      <div className="flex items-center justify-center">
        <div className="rounded-lg bg-white px-4 py-2 text-center shadow-sm">
          <p className="font-medium text-gray-900">{centerAddress}</p>
        </div>
      </div>
    </div>
  );
};

export default KakaoMap;
