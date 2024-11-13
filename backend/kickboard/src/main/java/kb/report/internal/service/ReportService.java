package kb.report.internal.service;

import jakarta.persistence.EntityNotFoundException;
import kb.company.domain.Company;
import kb.company.domain.Kickboard;
import kb.company.repository.CompanyRepository;
import kb.company.repository.KickboardRepository;
import kb.core.service.FileService;
import kb.report.api.request.ReportCreateRequest;
import kb.report.api.response.ReportDetailResponse;
import kb.report.api.response.ReportResponse;
import kb.report.internal.domain.Report;
import kb.report.internal.domain.ReportCategory;
import kb.report.internal.domain.ReportStatus;
import kb.report.internal.repository.ReportCategoryRepository;
import kb.report.internal.repository.ReportRepository;
import kb.user.internal.domain.Location;
import kb.user.internal.repository.LocationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.util.Arrays;
import java.util.List;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import java.util.stream.Collectors;

/**
 * 신고 서비스
 * @since JDK21
 * @author 지예찬
 */
@Service
@Transactional(readOnly = true)
@RequiredArgsConstructor
public class ReportService {

    private final ReportRepository reportRepository;
    private final KickboardRepository kickboardRepository;
    private final ReportCategoryRepository reportCategoryRepository;
    private final FileService fileService;
    private final LocationRepository locationRepository;
    private final CompanyRepository companyRepository;

    @Transactional
    public ReportResponse createReport(ReportCreateRequest reportRequest, MultipartFile[] images) {
        Company company = companyRepository.findById(reportRequest.getCompanyId())
                .orElseThrow(() -> new EntityNotFoundException("해당하는 회사가 존재하지 않습니다."));

        // 킥보드 정보를 가져오거나 없을 경우 예외 처리
        Kickboard kickboard = kickboardRepository.findByCompanyAndSerialNumber(company, reportRequest.getSerialNumber())
                .orElseThrow(() -> new EntityNotFoundException("해당하는 킥보드가 존재하지 않습니다."));

        // 신고 카테고리를 ID로 조회하여 없을 경우 예외 처리
        ReportCategory category = reportCategoryRepository.findById(reportRequest.getCategoryId())
                .orElseThrow(() -> new EntityNotFoundException("해당하는 신고 카테고리가 존재하지 않습니다."));

        // 주소에서 '구' 정보를 추출하여 location에 설정
        String district = extractDistrict(reportRequest.getAddress());
        Location location = locationRepository.findByName(district)
                .orElseThrow(() -> new EntityNotFoundException("해당하는 구역이 존재하지 않습니다."));

        // 이미지 URL 처리
        String photoUrl = processImages(images);

        // 신고 생성 및 저장
        Report report = Report.builder()
                .kickboard(kickboard)
                .category(category)
                .location(location)
                .address(reportRequest.getAddress())
                .longitude(reportRequest.getLongitude())
                .latitude(reportRequest.getLatitude())
                .photoUrl(photoUrl)
                .content(reportRequest.getDescription())
                .status(ReportStatus.REPORT_RECEIVED)  // 기본 상태 설정
                .build();

        Report savedReport = reportRepository.save(report);

        // 응답 생성
        return ReportResponse.from(savedReport);
    }

    private String extractDistrict(String address) {
        Pattern pattern = Pattern.compile("([가-힣]+구)"); // '구'를 포함하는 패턴 정의
        Matcher matcher = pattern.matcher(address);
        return matcher.find() ? matcher.group(1) : "알수없음"; // '구' 정보가 없으면 기본값 반환
    }

    private String processImages(MultipartFile[] images) {
        if (images == null || images.length == 0) {
            return null; // 이미지가 없을 경우 null 반환
        }

        StringBuilder photoUrlBuilder = new StringBuilder();

        for (int i = 0; i < Math.min(images.length, 2); i++) {
            String imageUrl = fileService.uploadFile(images[i]);
            photoUrlBuilder.append(imageUrl);
            if (i == 0 && images.length > 1) {
                photoUrlBuilder.append(","); // 두 번째 URL과 구분하기 위해 쉼표 추가
            }
        }

        return photoUrlBuilder.toString(); // URL이 하나 또는 두 개 합쳐진 결과 반환
    }

    public List<ReportResponse> getReportsByArea(String area) {
        List<Report> reports;

        // area가 null 또는 비어 있는 경우 전체 데이터를 조회
        if (area == null || area.trim().isEmpty()) {
            reports = reportRepository.findAll(); // 모든 Report를 조회
        } else {
            // area로 Location 조회
            Location location = locationRepository.findByName(area)
                    .orElseThrow(() -> new EntityNotFoundException("해당 구역을 찾을 수 없습니다."));

            // locationId로 해당 구역의 Report 조회
            reports = reportRepository.findByLocation(location);
        }

        // Report 리스트를 ReportResponse 리스트로 변환하여 반환
        return reports.stream()
                .map(ReportResponse::from)
                .collect(Collectors.toList());
    }


    public ReportDetailResponse getReportDetail(Long reportId) {
        // reportId로 해당 Report를 조회, 없을 경우 예외 처리
        Report report = reportRepository.findById(reportId)
                .orElseThrow(() -> new EntityNotFoundException("해당 신고를 찾을 수 없습니다."));

        // 신고 상태가 "처리완료"일 경우, 처리완료 사진만 반환
        // 로직 추가해야함. 아직 미완
        List<String> images = Arrays.asList(report.getPhotoUrl().split(","));
        if (report.getStatus() == ReportStatus.REPORT_COMPLETED) {
            images = List.of("처리완료 사진 URL"); // 처리완료 사진으로 변경 => 로직 추가해야함
        }

        return ReportDetailResponse.from(report, images);
    }
}
