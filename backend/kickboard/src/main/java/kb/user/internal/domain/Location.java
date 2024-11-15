// kb/user/internal/domain/Location.java
package kb.user.internal.domain;

import jakarta.persistence.*;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.AccessLevel;
/**
 * 지역(구) Entity
 * @since JDK21
 * @author 채기훈
 */
@Entity
@Table(name = "locate")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class Location {
    @Id
    @Column(name = "locationId")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long locationId;

    @Column(name = "locationName")
    private String name;  // 구역 정보

    @Builder
    public Location(Long locationId, String name) {
        this.locationId = locationId;
        this.name = name;
    }
}

