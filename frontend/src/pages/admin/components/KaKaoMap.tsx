import React, { useEffect, useRef, useState } from 'react';
import { Report } from '../../../types/index';

interface Props {
  selectedReport: Report | null;
  reports: Report[];
  onSelectReport: (report: Report) => void;
}

const KakaoMap: React.FC<Props> = ({ selectedReport, reports, onSelectReport }) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<any>(null);
  const [markers, setMarkers] = useState<any[]>([]);
  const [infowindows, setInfowindows] = useState<any[]>([]);
  const [centerAddress, setCenterAddress] = useState<string>('');
  const [selectedStatuses, setSelectedStatuses] = useState<string[]>(['전체']);

  const KAKAO_MAP_KEY = import.meta.env.VITE_KAKAOMAP_API_KEY;

  const statusOptions = ['전체', '신고접수', '수거중', '수거완료'];

  const companyColors: { [key: string]: string } = {
    'BEAM': '#FF6B6B',    
    'DEER': '#4ECDC4',    
    'SWING': '#45B7D1',   
    'KICK GOING': '#96CEB4', 
    'LIME': '#26A69A'     
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case '신고접수':
        return `
          <circle cx="12" cy="12" r="8" fill="white"/>
          <path fill="black" d="M11 6h2v6h-2zM11 14h2v2h-2z"/>
        `;
      case '수거중':
        return `
          <circle cx="12" cy="12" r="8" fill="white"/>
          <path fill="black" d="M12 6a6 6 0 1 0 0 12 6 6 0 0 0 0-12zm0 11a5 5 0 1 1 0-10 5 5 0 0 1 0 10zm2.5-5.5l-3.5 2V8h1v4.3l2.5-1.7.5.9z"/>
        `;
      case '수거완료':
        return `
          <circle cx="12" cy="12" r="8" fill="white"/>
          <path fill="black" d="M9.5 15.5l-4-4 1.4-1.4 2.6 2.6 5.6-5.6 1.4 1.4z"/>
        `;
      default:
        return '';
    }
  };

  const createMarkerImage = (color: string, status: string) => {
    const markerSize = new window.kakao.maps.Size(24, 35);
    const markerShape = {
      coords: [12, 34, 1, 21, 1, 12, 6, 4, 18, 4, 23, 12, 23, 21, 12, 34],
      type: 'poly'
    };

    return {
      src: `data:image/svg+xml;charset=utf-8,${encodeURIComponent(`
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 35">
          <path fill="${color}" d="M12 0C5.4 0 0 5.4 0 12c0 7.5 12 23 12 23s12-15.5 12-23c0-6.6-5.4-12-12-12z"/>
          ${getStatusIcon(status)}
        </svg>
      `)}`,
      size: markerSize,
      shape: markerShape
    };
  };

  const handleStatusToggle = (status: string) => {
    setSelectedStatuses(prev => {
      if (status === '전체') {
        return ['전체'];
      }
      
      const newStatuses = prev.filter(s => s !== '전체');
      if (prev.includes(status)) {
        const filteredStatuses = newStatuses.filter(s => s !== status);
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
    return reports.filter(report => selectedStatuses.includes(report.adminStatus));
  };

  const updateCenterAddress = (map: any) => {
    const geocoder = new window.kakao.maps.services.Geocoder();
    const center = map.getCenter();
    
    geocoder.coord2Address(center.getLng(), center.getLat(), (result: any, status: any) => {
      if (status === window.kakao.maps.services.Status.OK) {
        const addr = result[0].address;
        setCenterAddress(addr.address_name);
      }
    });
  };

  useEffect(() => {
    if (!KAKAO_MAP_KEY) {
      console.error('Kakao Map API key is not defined');
      return;
    }

    const script = document.createElement('script');
    script.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=${KAKAO_MAP_KEY}&libraries=services&autoload=false`;
    script.async = true;

    const onScriptError = () => console.error('Failed to load Kakao Maps script');
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
        filterControl.className = 'absolute bottom-0 left-0 right-0 bg-white/95 backdrop-blur-sm p-3 border-t border-gray-200 z-10';
        filterControl.innerHTML = `
          <div class="max-w-3xl mx-auto">
            <div class="flex flex-col space-y-3">
              <div class="flex flex-wrap gap-2 justify-center">
                ${statusOptions.map(status => `
                  <button
                    class="filter-btn px-4 py-1.5 rounded-full text-sm transition-colors ${
                      selectedStatuses.includes(status)
                        ? 'bg-blue-500 text-white hover:bg-blue-600'
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }"
                    data-status="${status}"
                  >
                    ${status}
                  </button>
                `).join('')}
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
              allButtons.forEach(btn => {
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

    markers.forEach(marker => marker.setMap(null));
    infowindows.forEach(infowindow => infowindow.close());

    const filteredReports = getFilteredReports();
    const newMarkers: any[] = [];
    const newInfowindows: any[] = [];

    filteredReports.forEach(report => {
      const position = new window.kakao.maps.LatLng(
        report.latitude,
        report.longitude
      );

      const markerImage = new window.kakao.maps.MarkerImage(
        createMarkerImage(companyColors[report.companyName] || '#FF0000', report.adminStatus).src,
        new window.kakao.maps.Size(24, 35)
      );

      const marker = new window.kakao.maps.Marker({
        position,
        map,
        image: markerImage
      });

      const infowindow = new window.kakao.maps.InfoWindow({
        content: `
          <div class="p-2">
            <p class="font-bold">${report.address}</p>
            <p>${report.companyName}</p>
          </div>
        `
      });

      window.kakao.maps.event.addListener(marker, 'click', () => {
        newInfowindows.forEach(w => w.close());
        infowindow.open(map, marker);
        onSelectReport(report);
      });

      newMarkers.push(marker);
      newInfowindows.push(infowindow);
    });

    setMarkers(newMarkers);
    setInfowindows(newInfowindows);
  }, [map, reports, selectedStatuses, onSelectReport]);

  useEffect(() => {
    if (!map || !selectedReport) return;

    const position = new window.kakao.maps.LatLng(
      selectedReport.latitude,
      selectedReport.longitude
    );
    
    map.setCenter(position);

    markers.forEach((marker, index) => {
      const markerPosition = marker.getPosition();
      if (
        markerPosition.getLat() === selectedReport.latitude &&
        markerPosition.getLng() === selectedReport.longitude
      ) {
        marker.setZIndex(10);
        infowindows[index].open(map, marker);
      } else {
        marker.setZIndex(1);
        infowindows[index].close();
      }
    });
  }, [map, selectedReport, markers, infowindows]);
  return (
    <div className="w-full space-y-4">
      <div ref={mapRef} className="w-full h-[400px] rounded-lg relative" />
      
      {/* 회사 범례 */}
      <div className="bg-white p-4 rounded-lg shadow-sm">
       
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
          {Object.entries(companyColors).map(([company, color]) => (
            <div key={company} className="flex items-center gap-2 justify-center">
              <div 
                className="w-4 h-4 rounded-full" 
                style={{ backgroundColor: color }}
              />
              <span className="text-sm text-gray-600">{company}</span>
            </div>
          ))}
        </div>
      </div>

      {/* 현재 주소 표시 */}
      <div className="flex items-center justify-center">
        <div className="bg-white px-4 py-2 rounded-lg shadow-sm text-center">
          <p className="text-gray-900 font-medium">{centerAddress}</p>
        </div>
      </div>
    </div>
  );
};

export default KakaoMap;