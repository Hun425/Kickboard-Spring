package kb.report.internal.repository;

import kb.report.internal.domain.Notice;
import org.springframework.data.jpa.repository.JpaRepository;

/**
 * 공지사항 Repository
 * @since JDK21
 * @author 정소영
 */
public interface NoticeRepository extends JpaRepository<Notice, Long> {
}
