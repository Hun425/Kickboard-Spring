package kb.admin.internal.service;

import jakarta.persistence.EntityNotFoundException;
import kb.admin.api.response.AdminReportResponse;
import kb.report.internal.domain.Report;
import kb.report.internal.repository.ReportRepository;
import kb.user.internal.domain.Location;
import kb.user.internal.repository.LocationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@Transactional(readOnly = true)
@RequiredArgsConstructor
public class AdminService {
    private final ReportRepository reportRepository;
    private final LocationRepository locationRepository;

    public Map<String, List<AdminReportResponse>> getReportsByArea(String area) {
        // area에 해당하는 Location을 조회
        Location location = locationRepository.findByName(area)
                .orElseThrow(() -> new EntityNotFoundException("해당 구역을 찾을 수 없습니다."));

        // 해당 locationId에 해당하는 Report 목록 조회
        List<Report> reports = reportRepository.findByLocation(location);

        // Report 목록을 AdminReportResponse 목록으로 변환하여 반환
        List<AdminReportResponse> responseList = reports.stream()
                .map(AdminReportResponse::from)
                .collect(Collectors.toList());

        // "reports" 키로 감싸기 위해 Map으로 반환
        return Map.of("reports", responseList);
    }

    public List<AdminReportResponse> getReportsBySerialNumber(String serialNumber) {
        List<Report> reports = reportRepository.findByKickboardSerialNumberOrderByCreatedAtDesc(serialNumber);

        // 각 Report를 AdminReportResponse로 변환하여 리스트로 반환
        return reports.stream()
                .map(AdminReportResponse::from)
                .collect(Collectors.toList());
    }
}
