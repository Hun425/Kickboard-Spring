package kb.report.api.response;

import kb.report.internal.domain.Report;
import lombok.Data;

import java.util.List;

@Data
public class ReportDetailResponse {

    private Long reportId;
    private Long companyId;
    private String serialNumber;
    private String address;
    private Double latitude;
    private Double longitude;
    private String category;
    private String status;
    private List<String> images;
    private String descriptions;
    private String createdAt;

    public static ReportDetailResponse from(Report report, List<String> images) {
        ReportDetailResponse response = new ReportDetailResponse();

        response.setReportId(report.getReportId());
        response.setCompanyId(report.getKickboard().getCompany().getCompanyId());
        response.setSerialNumber(report.getKickboard().getSerialNumber());
        response.setAddress(report.getAddress());
        response.setLatitude(report.getLatitude());
        response.setLongitude(report.getLongitude());
        response.setCategory(report.getCategory().getName());
        response.setStatus(report.getStatus().name());
        response.setImages(images); // 이미지 리스트 설정
        response.setDescriptions(report.getContent());
        response.setCreatedAt(report.getCreatedAt().toString());
        return response;
    }
}
