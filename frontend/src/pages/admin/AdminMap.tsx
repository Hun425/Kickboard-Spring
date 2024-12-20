import { SetStateAction, useEffect, useRef, useState } from 'react';
import { Search } from 'lucide-react';
import NavBar from './components/AdminNavBar';
import IncidentDetails from './components/IncidentDetail';
import IncidentImage from './components/IncidentImage';
import { fetchReports } from './api/adminApi';
import { Report } from '../../types/index';

const AdminMap = () => {
  const mapRef = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<any>(null);
  const [clusterer, setClusterer] = useState<any>(null);
  const [markers, setMarkers] = useState<any[]>([]);
  const [overlays, setOverlays] = useState<any[]>([]);
  const [searchValue, setSearchValue] = useState<string>('');
  const [currentAddress, setCurrentAddress] = useState<string>('');
  const [selectedStatuses, setSelectedStatuses] = useState<string[]>(['전체']);
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const [geocoder, setGeocoder] = useState<any>(null);
  const [places, setPlaces] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [reports, setReports] = useState<Report[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const KAKAO_MAP_KEY = import.meta.env.VITE_KAKAOMAP_API_KEY;

  const statusOptions = [
    { value: '전체', label: '전체' },
    { value: 'REPORT_RECEIVED', label: '신고접수' },
    { value: 'COLLECT_RECEIVED', label: '수거접수' },
    { value: 'COLLECT_PROGRESS', label: '수거중' },
    { value: 'COLLECT_COMPLETED', label: '수거완료' },
    { value: 'REPORT_COMPLETED', label: '신고처리완료' },
  ];

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
  const getFormattedDate = (dateString: string) => {
    const date = new Date(dateString);
    const month = String(date.getMonth() + 1).padStart(2, '0'); // 월은 0부터 시작하므로 +1
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');

    return `${month}월 ${day}일 ${hours}:${minutes}:${seconds}`;
  };

  const createCustomOverlayContent = (
    report: Report,
    openModal: (report: Report) => void
  ) => {
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
        pointer-events: auto;
      ">
        <div class="close-btn" style="
          position: absolute;
          top: 10px;
          right: 10px;
          cursor: pointer;
          font-size: 18px;
          color: #666;
        ">&times;</div>
        
        <img src="${Array.isArray(report.images) ? report.images[0] : report.images}" alt="Report Image" style="
          width: 100%;
          height: 150px;
          object-fit: cover;
          border-radius: 6px;
          margin-bottom: 12px;
        "/>
        
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
          
          <div style="margin-bottom: 8px; color: #333; font-size: 0.95em;">
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
            
            <button class="details-btn" style="
              padding: 4px 12px;
              background-color: #3B82F6;
              color: white;
              border-radius: 4px;
              font-size: 0.9em;
              cursor: pointer;
              border: none;
              transition: background-color 0.2s;
            ">상세보기</button>
          </div>
        </div>
      </div>
    `;

    const detailsBtn = content.querySelector('.details-btn');
    if (detailsBtn) {
      detailsBtn.addEventListener('click', (e) => {
        e.stopPropagation(); // 이벤트 전파 중단
        openModal(report); // 모달 열기
      });
    }

    const closeBtn = content.querySelector('.close-btn');

    if (closeBtn) {
      closeBtn.addEventListener('click', (e) => {
        e.stopPropagation(); // 이벤트 전파 중단
      });
    }

    return content;
  };

  const Modal = ({
    report,
    onClose,
  }: {
    report: Report;
    onClose: () => void;
  }) => {
    if (!report) return null;
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
        <div className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-lg bg-white">
          <div className="border-b p-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">신고 상세 정보</h2>
              <button
                onClick={onClose}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>
          </div>

          <div className="p-4">
            <div className="grid grid-cols-1 gap-4">
              {Array.isArray(report.images) ? (
                report.images.map((image, index) => (
                  <IncidentImage
                    key={index}
                    imageUrl={image}
                    isLoading={isLoading}
                  />
                ))
              ) : (
                <IncidentImage imageUrl={report.images} isLoading={isLoading} />
              )}
            </div>

            <div className="mt-4">
              <IncidentDetails
                report={report}
                isLoading={isLoading}
                onStatusChange={handleStatusChange}
              />
            </div>
          </div>
        </div>
      </div>
    );
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

  useEffect(() => {
    const loadReports = async () => {
      setIsLoading(true);
      try {
        const response = await fetchReports();
        if (response.success && response.data) {
          setReports(response.data.reports);
        } else {
        }
      } catch (error) {
      } finally {
        setIsLoading(false);
      }
    };

    loadReports();
  }, []);

  useEffect(() => {
    if (!KAKAO_MAP_KEY) {
      console.error('Kakao Map API key is not defined');
      return;
    }

    const script = document.createElement('script');
    script.src = `https://dapi.kakao.com/v2/maps/sdk.js?appkey=${KAKAO_MAP_KEY}&libraries=services,clusterer&autoload=false`;
    script.async = true;

    script.onload = () => {
      window.kakao.maps.load(() => {
        if (!mapRef.current) return;

        const area = localStorage.getItem('area') || '';
        const geocoder = new window.kakao.maps.services.Geocoder();

        geocoder.addressSearch(
          `광주광역시 ${area}`,
          (result: any, status: any) => {
            if (status === window.kakao.maps.services.Status.OK) {
              const coords = new window.kakao.maps.LatLng(
                result[0].y,
                result[0].x
              );

              const options = {
                center: coords,
                level: 3,
              };

              const newMap = new window.kakao.maps.Map(mapRef.current, options);
              const places = new window.kakao.maps.services.Places();

              // Initialize MarkerClusterer
              const newClusterer = new window.kakao.maps.MarkerClusterer({
                map: newMap,
                averageCenter: true,
                minLevel: 4,
                disableClickZoom: true,
                styles: [
                  {
                    width: '50px',
                    height: '50px',
                    background: 'rgba(255, 255, 255, .8)',
                    borderRadius: '25px',
                    color: '#000',
                    textAlign: 'center',
                    fontWeight: 'bold',
                    lineHeight: '50px',
                  },
                ],
              });

              setGeocoder(geocoder);
              setPlaces(places);
              setMap(newMap);
              setClusterer(newClusterer);

              newMap.addListener('idle', () => {
                const center = newMap.getCenter();
                geocoder.coord2Address(
                  center.getLng(),
                  center.getLat(),
                  (
                    result: {
                      address: { address_name: SetStateAction<string> };
                    }[],
                    status: any
                  ) => {
                    if (status === window.kakao.maps.services.Status.OK) {
                      setCurrentAddress(result[0].address.address_name);
                    }
                  }
                );
              });
            } else {
              // Default to Gwangju center if area search fails
              const defaultOptions = {
                center: new window.kakao.maps.LatLng(35.1595, 126.8526),
                level: 3,
              };

              const newMap = new window.kakao.maps.Map(
                mapRef.current,
                defaultOptions
              );
              const places = new window.kakao.maps.services.Places();

              const newClusterer = new window.kakao.maps.MarkerClusterer({
                map: newMap,
                averageCenter: true,
                minLevel: 4,
                disableClickZoom: true,
                styles: [
                  {
                    width: '50px',
                    height: '50px',
                    background: 'rgba(255, 255, 255, .8)',
                    borderRadius: '25px',
                    color: '#000',
                    textAlign: 'center',
                    fontWeight: 'bold',
                    lineHeight: '50px',
                  },
                ],
              });

              setGeocoder(geocoder);
              setPlaces(places);
              setMap(newMap);
              setClusterer(newClusterer);
            }
          }
        );
      });
    };

    document.head.appendChild(script);
    return () => {
      document.head.removeChild(script);
    };
  }, [KAKAO_MAP_KEY]);

  useEffect(() => {
    if (!map || !clusterer) return;

    clusterer.clear();
    markers.forEach((marker) => marker.setMap(null));
    overlays.forEach((overlay) => overlay.setMap(null));

    const filteredReports = getFilteredReports();
    const newMarkers: any[] = [];
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
        image: markerImage,
      });

      const overlay = new window.kakao.maps.CustomOverlay({
        content: createCustomOverlayContent(report, () => {
          setSelectedReport(report);
          setIsModalOpen(true);
        }),
        position: position,
        xAnchor: 0.5,
        yAnchor: 0.8,
        zIndex: 3,
      });

      window.kakao.maps.event.addListener(marker, 'click', () => {
        newOverlays.forEach((o) => o.setMap(null)); // 기존 오버레이 닫기
        overlay.setMap(map); // 선택한 오버레이 표시
        map.panTo(position); // 마커 위치로 이동
      });

      const addOverlayEventListeners = () => {
        const overlayElement = overlay.getContent();
        const closeBtn = overlayElement.querySelector('.close-btn');
        const detailsBtn = overlayElement.querySelector('.details-btn');

        if (closeBtn) {
          closeBtn.addEventListener('click', () => {
            overlay.setMap(null);
          });
        }

        if (detailsBtn) {
          detailsBtn.addEventListener('click', () => {
            setSelectedReport(report);
            setIsModalOpen(true);
            overlay.setMap(null);
          });
        }
      };

      window.kakao.maps.event.addListener(
        overlay,
        'added',
        addOverlayEventListeners
      );

      // // 지도 클릭 시 오버레이 닫기
      // window.kakao.maps.event.addListener(map, 'click', () => {
      //   overlay.setMap(null);
      // });

      newMarkers.push(marker);
      newOverlays.push(overlay);
    });

    // 클러스터러 스타일 설정
    const clustererStyles = [
      {
        width: '40px',
        height: '40px',
        background: 'white',
        color: 'black',
        borderRadius: '20px',
        textAlign: 'center',
        fontWeight: 'bold',
        lineHeight: '41px',
        fontSize: '20px',
        border: '3px solid black',
        boxShadow: '0 2px 5px rgba(0,0,0,0.2)',
      },
      {
        width: '50px',
        height: '50px',
        background: 'white',
        color: 'black',
        borderRadius: '25px',
        textAlign: 'center',
        fontWeight: 'bold',
        lineHeight: '51px',
        fontSize: '16px',
        border: '2px solid #fff',
        boxShadow: '0 2px 5px rgba(0,0,0,0.2)',
      },
      {
        width: '60px',
        height: '60px',
        background: '#1E40AF',
        color: '#fff',
        borderRadius: '30px',
        textAlign: 'center',
        fontWeight: 'bold',
        lineHeight: '61px',
        fontSize: '18px',
        border: '2px solid #fff',
        boxShadow: '0 2px 5px rgba(0,0,0,0.2)',
      },
    ];

    clusterer.setStyles(clustererStyles);
    clusterer.addMarkers(newMarkers);

    // 클러스터 클릭 이벤트
    window.kakao.maps.event.addListener(
      clusterer,
      'clusterclick',
      function (cluster: any) {
        const level = map.getLevel() - 1;
        map.setLevel(level, { anchor: cluster.getCenter() });
      }
    );

    setMarkers(newMarkers);
    setOverlays(newOverlays);
  }, [map, clusterer, reports, selectedStatuses]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchValue.trim() || !geocoder || !places || !map) return;

    const gwangjuBounds = new window.kakao.maps.LatLngBounds(
      new window.kakao.maps.LatLng(35.0292, 126.6876),
      new window.kakao.maps.LatLng(35.2834, 127.0122)
    );

    geocoder.addressSearch(
      searchValue,
      (addressResults: any[], addressStatus: any) => {
        if (addressStatus === window.kakao.maps.services.Status.OK) {
          const coords = new window.kakao.maps.LatLng(
            addressResults[0].y,
            addressResults[0].x
          );

          if (gwangjuBounds.contain(coords)) {
            map.setCenter(coords);
            map.setLevel(3);
          } else {
            alert('광주광역시 내의 위치만 검색 가능합니다.');
          }
        } else {
          const searchOptions = {
            bounds: gwangjuBounds,
            size: 1,
          };

          places.keywordSearch(
            searchValue,
            (data: any[], status: any) => {
              if (
                status === window.kakao.maps.services.Status.OK &&
                data.length > 0
              ) {
                const coords = new window.kakao.maps.LatLng(
                  data[0].y,
                  data[0].x
                );

                if (gwangjuBounds.contain(coords)) {
                  map.setCenter(coords);
                  map.setLevel(3);
                } else {
                  alert('광주광역시 내의 위치만 검색 가능합니다.');
                }
              } else {
                alert('검색 결과가 없습니다.');
              }
            },
            searchOptions
          );
        }
      }
    );
  };

  const handleStatusChange = async (newStatus: Report['adminStatus']) => {
    if (selectedReport) {
      const updatedReports = reports.map((report) =>
        report.reportId === selectedReport.reportId
          ? { ...report, adminStatus: newStatus }
          : report
      );
      setReports(updatedReports);
      setSelectedReport({ ...selectedReport, adminStatus: newStatus });
    }
  };

  return (
    <div className="flex min-h-screen flex-col font-KoPubMedium">
      <NavBar />

      {/* Map Container */}
      <div className="relative flex-1">
        <div ref={mapRef} className="absolute inset-0 h-full w-full" />
        <div className="absolute z-10 p-4">
          <div className="mx-auto flex max-w-7xl items-center justify-between gap-11 space-y-4">
            {/* Search Bar */}
            <form onSubmit={handleSearch} className="relative">
              <input
                type="text"
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                placeholder={currentAddress || '주소나 키워드를 입력하세요'}
                className="w-full rounded-lg border px-4 py-2 pl-10 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                type="submit"
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <Search size={20} />
              </button>
            </form>

            {/* Company Legend */}
            <div className="flex-2 rounded-md bg-white p-4">
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-5">
                {Object.entries(companyColors).map(([company, color]) => (
                  <div key={company} className="flex items-center gap-2">
                    <div
                      className="h-4 w-4 rounded-full"
                      style={{ backgroundColor: color }}
                    />
                    <span className="text-sm font-medium text-gray-700">
                      {company}
                    </span>
                  </div>
                ))}
              </div>
            </div>
            <div className="flex flex-wrap items-start gap-8">
              {/* Status Filter */}
              <div className="flex-1">
                <div className="flex flex-wrap gap-2">
                  {statusOptions.map((status) => (
                    <button
                      key={status.value}
                      onClick={() => handleStatusToggle(status.value)}
                      className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                        selectedStatuses.includes(status.value)
                          ? 'bg-blue-500 text-white'
                          : 'bg-white text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      {status.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && selectedReport && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-lg bg-white">
            <div className="border-b p-4">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold">신고 상세 정보</h2>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ✕
                </button>
              </div>
            </div>

            <div className="p-4">
              {selectedReport?.images.map((image, index) => (
                <IncidentImage
                  key={index}
                  imageUrl={image}
                  isLoading={isLoading}
                />
              ))}

              <div className="mt-4">
                <IncidentDetails
                  report={selectedReport}
                  isLoading={false}
                  onStatusChange={handleStatusChange}
                />
              </div>
            </div>
          </div>
        </div>
      )}
      {isModalOpen && selectedReport && (
        <Modal report={selectedReport} onClose={() => setIsModalOpen(false)} />
      )}
    </div>
  );
};

export default AdminMap;
