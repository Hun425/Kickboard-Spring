// 킥보드 브레이커
// kakao맵 오류없이 하기위해 window type 확장하기 (카카오도 인식 가능하게)
declare global {
  interface Window {
    kakao: any;
  }
}

interface Request {
  requestId: string;
  reportId: string;
  latitude: number;
  longitude: number;
  category: string; // 신고 유형
  photoUrl: string; // 신고 접수된 사진
  status: 'COLLECT_RECEIVED' | 'COLLECT_PROGRESS' | 'COLLECT_COMPLETED';
  createdAt: string;
}

import { useEffect, useRef, useState } from 'react';
import { fetchCollectLists, updateReportStatus } from '../../services/Api';
import { ClipboardDocumentListIcon } from '@heroicons/react/24/solid';
import { useCollectorAuthStore } from '../../store/CollectorAuthStore';
import CollectCompleteModal from '../../components/CollectCompleteModal';

const CollectList = () => {
  const KakaoMapApiKey = import.meta.env.VITE_KAKAOMAP_API_KEY;

  // useState 모음
  // =========================================================================================

  const [map, setMap] = useState<any>(null);
  const [markers, setMarkers] = useState<any[]>([]); // 마커 관리할 usestate
  const mapRef = useRef<any>(null);
  const [collectList, setCollectList] = useState<Request[]>([]);
  const [addressList, setAddressList] = useState<
    {
      requestId: string;
      reportId: string;
      category: string;
      address: string;
      lat: number;
      lng: number;
    }[]
  >([]);
  const [kakaoLoaded, setKakaoLoaded] = useState(false); // 카카오맵이 로딩됐는지 여부 확인
  const [buttonStatus, setButtonStatus] = useState<{ [key: string]: string }>(
    {}
  ); // 버튼 text랑 color state에 따라 바뀌게 하기

  // 모달관리
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentReportId, setCurrentReportId] = useState<string>('');
  const [currentRequestId, setCurrentRequestId] = useState<string>('');
  const [currentAdress, setCurrentAdress] = useState<string>('');
  const [currentCategory, setCurrentCategory] = useState<string>('');

  // =========================================================================================

  const area = useCollectorAuthStore((state) => state.area);

  useEffect(() => {
    console.log('collectList 바뀔때마다 프린트: ', collectList);
  }, [collectList]);

  // 영어로 온 area 데이터를 한국어로 바꿔
  const getKoreanArea = (areaCode: string) => {
    const areaMap: { [key: string]: string } = {
      DONGGU: '동구',
      SEOGU: '서구',
      NAMGU: '남구',
      BUKGU: '북구',
      GWANSANGU: '광산구',
    };
    return areaMap[areaCode || ''] || areaCode;
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'COLLECT_RECEIVED':
        return '수거 시작';
      case 'COLLECT_PROGRESS':
        return '길찾기';
      case 'COLLECT_COMPLETED':
        return '처리 완료';
      default:
        return '수거 시작';
    }
  };

  // 수거목록 업데이트
  const refreshCollectList = async () => {
    try {
      const response = await fetchCollectLists();
      let filteredList = response.data.data;
      filteredList = filteredList.sort((a: Request, b: Request) => {
        if (
          a.status === 'COLLECT_COMPLETED' &&
          b.status !== 'COLLECT_COMPLETED'
        ) {
          return 1; // move 'COLLECT_COMPLETED' to the bottom
        } else if (
          a.status !== 'COLLECT_COMPLETED' &&
          b.status === 'COLLECT_COMPLETED'
        ) {
          return -1; // keep other statuses at the top
        } else {
          return 0; // keep the same order for items with the same status
        }
      });

      console.log('업데이트된 filteredList: ', filteredList);

      setCollectList(filteredList);

      const updatedButtonStatus: { [key: string]: string } = {};
      filteredList.forEach((item: Request) => {
        updatedButtonStatus[item.requestId] = getStatusText(item.status);
      });

      setButtonStatus(updatedButtonStatus);
    } catch (error) {
      console.error('Error refreshing collect list:', error);
    }
  };

  // 페이지 로드될때 collect list 요청보내서 가져오기
  useEffect(() => {
    console.log(map);
    const fetchCollectListData = async () => {
      try {
        const response = await fetchCollectLists();
        // 수거해야할 리스트랑 수거중인 리스트들만 필터링 (필터링없앰)
        let filteredList = response.data.data;

        filteredList = filteredList.sort((a: Request, b: Request) => {
          if (
            a.status === 'COLLECT_COMPLETED' &&
            b.status !== 'COLLECT_COMPLETED'
          ) {
            return 1;
          } else if (
            a.status !== 'COLLECT_COMPLETED' &&
            b.status === 'COLLECT_COMPLETED'
          ) {
            return -1;
          } else {
            return 0;
          }
        });

        setCollectList(filteredList);

        const initialButtonStatus: { [key: string]: string } = {};
        filteredList.forEach((item: Request) => {
          initialButtonStatus[item.requestId] = getStatusText(item.status);
        });

        setButtonStatus(initialButtonStatus);
      } catch (error) {
        console.error('Error fetching collect list:', error);
      }
    };

    fetchCollectListData();
  }, []);

  useEffect(() => {
    console.log(map);
  }, []);

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
          level: 3,
        };
        const initializedMap = new window.kakao.maps.Map(container, options);
        setMap(initializedMap);
        mapRef.current = initializedMap;
        setKakaoLoaded(true); // 로딩 끝났으면 로딩상태 true로 바꿔
      });
    };
  }, []);

  // 지도에 마커 띄우는 useEffect (collectList의 업데이트에 따라 바뀜)
  useEffect(() => {
    if (!mapRef.current || collectList.length === 0) return;

    // 기존의 markers 리스트 초기화
    markers.forEach((marker) => marker.setMap(null));
    setMarkers([]);

    // 새로운 마커들 추가
    const newMarkers = collectList.map((item) => {
      const position = new window.kakao.maps.LatLng(
        item.latitude,
        item.longitude
      );
      const marker = new window.kakao.maps.Marker({
        position,
        map: mapRef.current,
      });

      // 마커 클릭하면 뭐 띄워줄지
      const infoWindowContent = `
      <div class="bg-white shadow-lg rounded-lg p-3 text-center max-w-[150px] overflow-hidden">
        <p class="font-semibold text-sm mb-1 truncate">${item.category}</p>
        <img src="${item.photoUrl}" alt="${item.category}" class="w-full h-auto rounded-md"/>
      </div>
    `;

      const customOverlay = new window.kakao.maps.CustomOverlay({
        content: infoWindowContent,
        position,
        yAnchor: 1.2,
        xAnchor: 0.5,
        map: mapRef.current,
      });

      customOverlay.setMap(null); // 처음에는 안 보여줌 (마커 클릭해야만 보임)

      window.kakao.maps.event.addListener(marker, 'click', () => {
        if (customOverlay.getMap()) {
          customOverlay.setMap(null);
        } else {
          customOverlay.setMap(mapRef.current);
        }
      });

      return marker;
    });

    setMarkers(newMarkers);

    if (newMarkers.length > 0) {
      mapRef.current.setCenter(newMarkers[0].getPosition());
    }
  }, [collectList, mapRef.current]);

  // 수거 버튼 클릭 이벤트
  const handleButtonClick = async (
    index: number,
    requestId: string,
    reportId: string,
    lat: number,
    lng: number,
    address: string,
    category: string
  ) => {
    const currentStatus = buttonStatus[requestId] || '수거 시작';
    setCurrentRequestId(requestId);
    setCurrentReportId(reportId);
    index = addressList.findIndex((item) => item.requestId === requestId);

    if (currentStatus === '수거 시작') {
      try {
        await updateReportStatus(requestId, 'COLLECT_PROGRESS', ''); // 수거 시작한다고 status update 요청 보내기
        console.log('Status Update (COLLECT_PROGRESS) 성공!');
        await refreshCollectList();
        console.log(collectList);
      } catch (error) {
        console.error('수거 리스트 가져오기 실패: ', error);
      }
    } else if (currentStatus === '길찾기') {
      // 사용자 현재 위치
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const userLat = position.coords.latitude;
          const userLng = position.coords.longitude;

          // Initialize Kakao Geocoder
          const geocoder = new window.kakao.maps.services.Geocoder();

          // Reverse geocode to get the user's current address
          geocoder.coord2Address(
            userLng,
            userLat,
            (result: any, status: any) => {
              if (status === window.kakao.maps.services.Status.OK) {
                const userAddress = result[0].address.address_name;

                const kakaoMapUrl = `https://map.kakao.com/?sName=${encodeURIComponent(userAddress)}&eName=${encodeURIComponent(
                  addressList[index].address
                )}&posX=${lng}&posY=${lat}`;

                window.open(kakaoMapUrl, '_blank');
                setButtonStatus((prevStatus) => ({
                  ...prevStatus,
                  [requestId]: '처리하기',
                }));
              } else {
                alert('현재 위치의 주소를 찾을 수 없습니다.');
              }
            }
          );
        },
        (error) => {
          console.error('Could not retrieve location:', error);
          alert('위치를 가져올 수 없습니다. 위치 서비스를 허용해주세요.');
        }
      );
    } else if (currentStatus === '처리하기') {
      await refreshCollectList();
      setCurrentRequestId(requestId);
      setCurrentReportId(reportId);
      setCurrentAdress(address);
      setCurrentCategory(category);
      setIsModalOpen(true);
    }
  };

  // 모달 열려서 확인 버튼 누를때 쓸 함수
  const handleModalSubmit = async (processType: string) => {
    if (currentReportId) {
      try {
        console.log('Status Final Update (COLLECT_COMPLETE) 성공!');
        await updateReportStatus(
          currentRequestId,
          'COLLECT_COMPLETED',
          processType
        );
        await refreshCollectList();
        // setButtonStatus((prevStatus) => ({
        //   ...prevStatus,
        //   [currentRequestId]: '처리 완료',
        // }));
        setIsModalOpen(false); // Close the modal after submission
        setCurrentRequestId('');
        setCurrentReportId('');
      } catch (error) {
        console.error('Failed to submit completion data:', error);
      }
    }
  };

  // 위도경도 실제 주소로 바꿔
  const convertToAddress = async () => {
    if (!window.kakao?.maps?.services) {
      console.error('카카오지도 아직 로딩이 안됨');
      return;
    }

    const geocoder = new window.kakao.maps.services.Geocoder();
    const updatedAddressList: {
      requestId: string;
      reportId: string;
      category: string;
      address: string;
      lat: number;
      lng: number;
    }[] = [];

    // !!주의!!여기 나중에 실제로는 collectList로 바꿔야돼 이름!!
    for (const {
      requestId,
      reportId,
      category,
      latitude,
      longitude,
    } of collectList) {
      const coords = new window.kakao.maps.LatLng(latitude, longitude);

      await new Promise<void>((resolve) => {
        geocoder.coord2Address(
          coords.getLng(),
          coords.getLat(),
          (result: any, status: any) => {
            if (status === window.kakao.maps.services.Status.OK) {
              const address = result[0].address.address_name;
              updatedAddressList.push({
                requestId,
                reportId,
                category,
                address,
                lat: latitude,
                lng: longitude,
              });
            } else {
              updatedAddressList.push({
                requestId,
                reportId,
                category,
                address: '주소를 찾을 수 없음',
                lat: latitude,
                lng: longitude,
              });
            }
            resolve();
          }
        );
      });
    }

    setAddressList(updatedAddressList);
  };

  // 카카오 렌더링 됐으면 실제 주소로 바꿔
  useEffect(() => {
    if (kakaoLoaded && collectList.length > 0) {
      convertToAddress();
    }
  }, [kakaoLoaded, collectList]);

  // 각 리스트 클릭할때마다 해당 마커가 센터로 변경됨
  const handleListClick = (requestId: string) => {
    const index = addressList.findIndex((item) => item.requestId === requestId);
    const selectedMarker = markers[index];
    if (selectedMarker && mapRef.current) {
      mapRef.current.setCenter(selectedMarker.getPosition());
    }
  };

  return (
    <div>
      {/* 헤더 */}
      <div className="mb-5 mt-5 flex h-12 flex-col items-center justify-center bg-[#DCDCDC]">
        <p className="text-center">수거 목록</p>
      </div>

      {/* 구역 띄워줘 */}
      <div className="mb-5 ml-5">
        <p className="font-bold">{getKoreanArea(area || '')}</p>
      </div>

      {/* 지도 */}
      <div id="map" className="mb-5 h-[250px] w-full"></div>

      {/* 수거 건수 */}
      <div className="ml-5">
        <p>
          총{' '}
          <span className="text-xl font-bold text-red-500">
            {addressList.length}
          </span>
          건
        </p>
      </div>

      {/* 수거 리스트 */}
      <div className="m-5 mb-5 max-h-[300px] overflow-y-auto">
        {addressList.map((item) => (
          <div
            className="mb-5 flex cursor-pointer items-center justify-between rounded-lg border border-black bg-[rgba(220,220,220,0.38)] p-2 text-xs"
            key={item.reportId}
            onClick={() => handleListClick(item.requestId)}
          >
            <div>
              <div className="flex items-center">
                <p className="flex items-center">
                  <span className="mr-1">{item.address}</span>
                  <span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation(); // 리스트 클릭 트리거 방지
                        navigator.clipboard.writeText(item.address);
                      }}
                    >
                      <ClipboardDocumentListIcon className="h-4 w-4 text-gray-400" />
                    </button>
                  </span>
                </p>
              </div>
              <p className="font-bold text-red-500">{item.category}</p>
            </div>
            <button
              className={`rounded-md border p-2 ${
                buttonStatus[item.requestId] === '길찾기'
                  ? 'bg-blue-500 text-white'
                  : buttonStatus[item.requestId] === '처리하기'
                    ? 'bg-green-500 text-white'
                    : buttonStatus[item.requestId] === '처리 완료'
                      ? 'cursor-not-allowed bg-gray-400 text-gray-700'
                      : 'border-black bg-white'
              }`}
              onClick={() =>
                buttonStatus[item.requestId] !== '처리 완료' &&
                handleButtonClick(
                  parseInt(item.requestId),
                  item.requestId,
                  item.reportId,
                  item.lat,
                  item.lng,
                  item.address,
                  item.category
                )
              }
            >
              {buttonStatus[item.requestId] || '수거 시작'}
            </button>
          </div>
        ))}
      </div>

      {isModalOpen && (
        <CollectCompleteModal
          onClose={() => setIsModalOpen(false)}
          onSubmit={(processType) => handleModalSubmit(processType)}
          address={currentAdress}
          category={currentCategory}
        />
      )}
    </div>
  );
};

export default CollectList;
