package kb.company.repository;

import jakarta.validation.constraints.NotNull;
import kb.company.domain.Company;
import kb.company.domain.Kickboard;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface KickboardRepository extends JpaRepository<Kickboard, Long> {
    Optional<Kickboard> findByCompanyAndSerialNumber(Company company, String serialNumber);
}
