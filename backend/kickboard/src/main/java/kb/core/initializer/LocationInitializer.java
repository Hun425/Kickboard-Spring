package kb.core.initializer;



import kb.user.internal.domain.Location;
import kb.user.internal.repository.LocationRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.event.EventListener;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

/**
 * 지역 더미 데이터 생성
 * @since JDK21
 * @author 채기훈
 */
@Slf4j
@Component
@RequiredArgsConstructor
public class LocationInitializer {
    private final LocationRepository locationRepository;

    @EventListener(ApplicationReadyEvent.class)
    @Transactional
    @Order(1)  // 실행 순서 보장
    public void initializeLocations() {
        // 이미 데이터가 있는지 확인
        if (locationRepository.count() > 0) {
            log.info("지역 데이터 존재");
            return;
        }

        log.info("초기 데이터 로딩");

        // 광주광역시 5개 구 초기 데이터 생성
        locationRepository.save(Location.builder().locationId((long)1).name("동구").build());
        locationRepository.save(Location.builder().locationId((long)2).name("서구").build());
        locationRepository.save(Location.builder().locationId((long)3).name("남구").build());
        locationRepository.save(Location.builder().locationId((long)4).name("북구").build());
        locationRepository.save(Location.builder().locationId((long)5).name("광산구").build());

        log.info("초기 데이터 생성 완료");
    }
}

