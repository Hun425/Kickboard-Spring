package kb.collection.internal.repository;

import kb.collection.internal.domain.CollectionRequest;
import kb.collection.internal.domain.CollectionStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import jakarta.persistence.LockModeType;
import java.util.List;
import java.util.Optional;

/**
 * 수거 요청 Repository
 * @since JDK21
 * @author 채기훈
 */
public interface CollectionRequestRepository extends JpaRepository<CollectionRequest, Long> {
    List<CollectionRequest> findByStatus(CollectionStatus status);

    @Lock(LockModeType.OPTIMISTIC)
    @Query("select c from CollectionRequest c where c.requestId = :requestId")
    Optional<CollectionRequest> findByIdWithOptimisticLock(@Param("requestId") Long requestId);

    @Query("SELECT cr FROM CollectionRequest cr " +
            "JOIN FETCH cr.report r " +
            "WHERE r.location.locationId = :locationId " +
            "ORDER BY cr.requestedCreatedAt DESC")
    List<CollectionRequest> findAllByLocationId(@Param("locationId") Long locationId);





    List<CollectionRequest> findByReportReportId(Long reportId);
}