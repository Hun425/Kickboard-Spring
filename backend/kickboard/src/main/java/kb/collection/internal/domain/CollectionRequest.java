package kb.collection.internal.domain;

import jakarta.persistence.*;
import kb.core.domain.BaseEntity;
import kb.report.internal.domain.Report;
import lombok.*;

import java.time.LocalDateTime;

/**
 * 수거 요청 Entity
 * @since JDK21
 * @author 채기훈
 */
@Entity
@Table(name = "Collection_request")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@ToString(exclude = "report")
public class CollectionRequest extends BaseEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long requestId;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "reportId")
    private Report report;

    @Enumerated(EnumType.STRING)
    private CollectionStatus status;

    private String photoUrl;

    @Enumerated(EnumType.STRING)
    @Column(name = "processType")
    private CollectionProcessStatus processType;

    @Column(name = "requestedCreatedAt")
    private LocalDateTime requestedCreatedAt;

    @Column(name = "completedUpdatedAt")
    private LocalDateTime completedUpdatedAt;

    @Version  // 낙관적 락을 위한 버전 필드
    private Long version;

    @Builder
    public CollectionRequest(Report report, String photoUrl) {
        this.report = report;
        this.status = CollectionStatus.COLLECT_RECEIVED;
        this.photoUrl = photoUrl;
        this.requestedCreatedAt = LocalDateTime.now();
    }

    public void updateCollectionStatus(CollectionStatus newStatus) {
        this.status = newStatus;
        if (newStatus == CollectionStatus.COLLECT_COMPLETED) {
            this.completedUpdatedAt = LocalDateTime.now();
        }
    }

    public void updateCollectionProcessStatus(CollectionProcessStatus newStatus) {
        this.processType = newStatus;
        this.completedUpdatedAt = LocalDateTime.now();
    }


    public void updatePhotoUrl(String photoUrl) {
        this.photoUrl = photoUrl;
    }
}