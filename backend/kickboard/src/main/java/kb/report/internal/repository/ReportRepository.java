package kb.report.internal.repository;

import kb.report.internal.domain.Report;
import kb.user.internal.domain.Location;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

/**
 * 신고 레포지토리
 * @since JDK21
 * @author 채기훈
 */
public interface ReportRepository extends JpaRepository<Report, Long> {
    List<Report> findByLocation(Location location);

    @Query("SELECT r FROM Report r WHERE r.kickboard.serialNumber = :serialNumber ORDER BY r.createdAt DESC")
    List<Report> findByKickboardSerialNumberOrderByCreatedAtDesc(@Param("serialNumber") String serialNumber);

    List<Report> findByLocationOrderByCreatedAtDesc(Location location);

    @Query("SELECT r FROM Report r ORDER BY r.createdAt DESC")
    List<Report> findAllOrderByCreatedAtDesc();
}
